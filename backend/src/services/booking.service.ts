import {
  createBooking,
  findBookingByRefId,
  updateBookingStatus,
  addBookingEvent,
  findBookings,
  findBookingsByCustomerId,
} from '../repositories/booking.repository';
import { findFlightById } from '../repositories/flight.repository';
import { generateAwbNumber } from '../utils/awb';
import { Booking, BookingStatus, Prisma } from '@prisma/client';

export const createNewBooking = async (
  customerId: number,
  origin: string,
  destination: string,
  pieces: number,
  weight: number,
  flightId: number
): Promise<Booking> => {
  const flight = await findFlightById(flightId);
  if (!flight) {
    throw new Error('Flight not found.');
  }

  const awb_no = generateAwbNumber(flight.awbPrefix || '000');

  const newBooking = await createBooking({
    refId: awb_no,
    originAirportCode: origin,
    destinationAirportCode: destination,
    pieces,
    weightKg: weight,
    status: 'BOOKED',
    customer: { connect: { id: customerId.toString() } },
    flight: { connect: { id: flightId } },
  });

  // Record the initial BOOKED event
  await addBookingEvent(newBooking.id, 'BOOKED', origin, {});

  return newBooking;
};

export const getBookingHistory = async (awb_no: string) => {
  return findBookingByRefId(awb_no);
};

export const updateBookingAndAddEvent = async (
  awb_no: string,
  newStatus: BookingStatus,
  location?: string,
  flightId?: number
) => {
  const booking = await findBookingByRefId(awb_no);
  if (!booking) {
    throw new Error('Booking not found.');
  }

  // Check for valid status transition
  if (booking.status === 'ARRIVED' && newStatus === 'CANCELLED') {
    throw new Error('Cannot cancel an arrived booking.');
  }

  // Update the booking status
  const updatedBooking = await updateBookingStatus(awb_no, newStatus);

  // Add a new event to the timeline
  const eventDetails: Record<string, any> = {};
  if (flightId) eventDetails.flightId = flightId;

  await addBookingEvent(booking.id, newStatus, location || booking.originAirportCode, eventDetails);

  return updatedBooking;
};

export const getBookingsForCustomer = async (customerId: number): Promise<Booking[]> => {
  return findBookingsByCustomerId(customerId);
};

export const getAllBookingsPaginated = async (page: number, limit: number, awb?: string) => {
    return findBookings(page, limit, awb);
};