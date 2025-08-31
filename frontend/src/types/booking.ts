export type BookingStatus =
  | "BOOKED"
  | "DEPARTED"
  | "ARRIVED"
  | "DELIVERED"
  | "CANCELLED";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Booking {
  id: number;
  awbNo: string;
  originAirportCode: string;
  destinationAirportCode: string;
  pieces: number;
  weightKg: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  flightId: number;
  sender: Customer;
  receiver: Customer;
}

export interface BookingEvent {
  id: string;
  bookingId: number;
  eventType: BookingStatus;
  location: string;
  timestamp: string;
  details: Record<string, string | number | null>;
}

export interface BookingHistory extends Booking {
  events: BookingEvent[];
}
