

import { PrismaClient, Booking, BookingStatus, Prisma } from '@prisma/client';
import { generateAwbNumber } from '../utils/awb';
import { redlock } from '../utils/redis'; 

const prisma = new PrismaClient(); 

export const createNewBooking = async (
  customerId: string, 
  origin: string,
  destination: string,
  pieces: number,
  weight: number,
  flightId: number
): Promise<Booking> => {
  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
  });

  if (!flight) {
    throw new Error('Flight not found.');
  }

  // Capacity Check Logic 
  const allowedCapacityWeight = flight.maxCapacityWeightKg * (1 + flight.overbookingPercentage);
  const allowedCapacityPieces = flight.maxCapacityPieces * (1 + flight.overbookingPercentage);

  if (
    flight.currentBookedWeightKg + weight > allowedCapacityWeight ||
    flight.currentBookedPieces + pieces > allowedCapacityPieces
  ) {
    throw new Error('Requested cargo exceeds flight capacity (including overbooking limit).');
  }

  const awb_no = generateAwbNumber(flight.awbPrefix || '000');

  // ensure both booking creation and capacity update are atomic
  const newBooking = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        refId: awb_no,
        originAirportCode: origin,
        destinationAirportCode: destination,
        pieces,
        weightKg: weight,
        status: BookingStatus.BOOKED,
        customer: { connect: { id: customerId } },
        flight: { connect: { id: flightId } },
      }, 
    });

    // Update flight's booked capacity 
    await tx.flight.update({
      where: { id: flightId },
      data: {
        currentBookedWeightKg: { increment: weight },
        currentBookedPieces: { increment: pieces },
      },
    });

    await tx.bookingEvent.create({
      data: {
        eventType: BookingStatus.BOOKED,
        location: origin,
        details: {},
        booking: { connect: { id: booking.id } },
      },
    });

    return booking;
  });

  return newBooking;
};

export const getBookingHistory = async (awb_no: string) => {
  return prisma.booking.findUnique({
    where: { refId: awb_no },
    include: { events: { orderBy: { timestamp: 'asc' } } },
  });
};

export const updateBookingAndAddEvent = async (
  awb_no: string,
  newStatus: BookingStatus,
  location?: string,
  flightId?: number
) => {
  // redlock ->distributed lock on the AWB number
  const resource = `locks:booking:${awb_no}`;
  // lock duration
  const lockDuration = 5000; // milliseconds

  let lock;
  try {
    lock = await redlock.acquire([resource], lockDuration);

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { refId: awb_no },
      });
      if (!booking) {
        throw new Error('Booking not found.');
      }
      if (booking.status === newStatus) {
        return booking; 
      }

      // Check for valid status 
      if (booking.status === BookingStatus.ARRIVED && newStatus === BookingStatus.CANCELLED) {
        throw new Error('Cannot cancel an arrived booking.');
      }

      // Capacity Release/Cancellation Logic 
      if (newStatus === BookingStatus.CANCELLED) {
        if (booking.flightId) {
          await tx.flight.update({
            where: { id: booking.flightId },
            data: {
              currentBookedWeightKg: { decrement: booking.weightKg },
              currentBookedPieces: { decrement: booking.pieces },
            },
          });
        }
      }

      // Update the booking status
      const updatedBooking = await tx.booking.update({
        where: { refId: awb_no },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      });

      // Add a new booking event
      const eventDetails: Record<string, any> = {};
      if (flightId) eventDetails.flightId = flightId;
      await tx.bookingEvent.create({
        data: {
          eventType: newStatus,
          location: location || booking.originAirportCode,
          details: eventDetails,
          booking: { connect: { id: booking.id } },
        },
      });

      return updatedBooking;
    });

    return updatedBooking;

  } catch (error: any) {
    if (error.name === 'LockAcquisitionError') {
      throw new Error(`Booking ${awb_no} is currently being updated. Please try again later.`);
    }
    throw error;
  } finally {
    // Release the lock in the finally block to ensure it is always released.
    if (lock) {
      await lock.release();
    }
  }
};

export const getBookingsForCustomer = async (customerId: string): Promise<Booking[]> => { 
  return prisma.booking.findMany({ where: { customerId } });
};

export const getAllBookingsPaginated = async (page: number, limit: number, awb?: string) => {
  const skip = (page - 1) * limit;
  const where = awb ? { refId: { contains: awb, mode: 'insensitive' as const } } : {};
  const [bookings, totalCount] = await prisma.$transaction([
    prisma.booking.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: { events: true },
    }),
    prisma.booking.count({ where }),
  ]);
  return { bookings, totalCount };
};

