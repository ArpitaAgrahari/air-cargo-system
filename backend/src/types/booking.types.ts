import { Booking, BookingEvent } from '@prisma/client';

export interface BookingHistory extends Booking {
  timeline: BookingEvent[];
}