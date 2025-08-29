import { PrismaClient, Booking, BookingStatus, Prisma } from '@prisma/client';
import * as bookingRepository from '../repositories/booking.repository';
import * as flightRepository from '../repositories/flight.repository';
import { generateAwbNumber } from '../utils/awb';

const prisma = new PrismaClient(); 

export const createNewBooking = async (
  customerId: string,
  origin: string,
  destination: string,
  pieces: number,
  weight: number,
  flightId: number
): Promise<Booking> => {
  const flight = await flightRepository.getFlightWithCapacity(flightId);
  if (!flight) {
    throw new Error('Flight not found.');
  }

  //Capacity Check Logic 
  const allowedCapacityWeight = flight.maxCapacityWeightKg * (1 + flight.overbookingPercentage);
  const allowedCapacityPieces = flight.maxCapacityPieces * (1 + flight.overbookingPercentage);

  if (
    flight.currentBookedWeightKg + weight > allowedCapacityWeight ||
    flight.currentBookedPieces + pieces > allowedCapacityPieces
  ) {
    throw new Error('Requested cargo exceeds flight capacity (including overbooking limit).');
  }

  const awb_no = generateAwbNumber(flight.awbPrefix || '000');


  const newBooking = await prisma.$transaction(async (tx) => {
    const booking = await bookingRepository.createBooking(
      {
        refId: awb_no,
        originAirportCode: origin,
        destinationAirportCode: destination,
        pieces,
        weightKg: weight,
        status: 'BOOKED',
        customer: { connect: { id: customerId } }, 
        flight: { connect: { id: flightId } },
      }
    );

    await flightRepository.updateFlightBookedCapacity(
      flightId,
      weight,
      pieces,
      tx 
    );

    await bookingRepository.addBookingEvent(
      booking.id,
      'BOOKED',
      origin,
      {}
    );

    return booking;
  });

  return newBooking;
};

export const getBookingHistory = async (awb_no: string) => {
  // This can use the standalone client as it's a read-only operation
  return bookingRepository.findBookingByRefId(awb_no);
};

export const updateBookingAndAddEvent = async (
  awb_no: string,
  newStatus: BookingStatus,
  location?: string,
  flightId?: number
) => {
  // Fetch booking outside transaction first to decide logic
  const booking = await bookingRepository.findBookingByRefId(awb_no);
  if (!booking) {
    throw new Error('Booking not found.');
  }

  if (booking.status === 'ARRIVED' && newStatus === 'CANCELLED') {
    throw new Error('Cannot cancel an arrived booking.');
  }

  // Capacity Release/Cancellation Logic (if cancelling)
  if (newStatus === 'CANCELLED' && booking.status !== 'CANCELLED') {
    // Only decrease capacity if  -> booking was not already cancelled
    const cancelledBooking = await prisma.$transaction(async (tx) => {
      // Update booking status
      await bookingRepository.updateBookingStatus(awb_no, newStatus);

      if (booking.flightId) {
        // Update flight capacity
        await flightRepository.updateFlightBookedCapacity(
          booking.flightId,
          -booking.weightKg, // Decrement weight
          -booking.pieces,    // Decrement pieces
          tx 
        );
      }

      // Add cancellation eventt
      await bookingRepository.addBookingEvent(
        booking.id,
        newStatus,
        location || booking.originAirportCode,
        { previousStatus: booking.status }
      );
      
      return { ...booking, status: newStatus }; // Return updated booking
    });
    return cancelledBooking;
  }


  const updatedBooking = await bookingRepository.updateBookingStatus(awb_no, newStatus);

  const eventDetails: Record<string, any> = {};
  if (flightId) eventDetails.flightId = flightId;
  await bookingRepository.addBookingEvent(booking.id, newStatus, location || booking.originAirportCode, eventDetails);

  return updatedBooking;
};

export const getBookingsForCustomer = async (customerId: number): Promise<Booking[]> => {
  return bookingRepository.findBookingsByCustomerId(customerId);
};

export const getAllBookingsPaginated = async (page: number, limit: number, awb?: string) => {
  return bookingRepository.findBookings(page, limit, awb);
};
