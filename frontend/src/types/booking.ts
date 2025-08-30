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
  id: string;
  awb_no: string;
  origin_airport_code: string;
  destination_airport_code: string;
  pieces: number;
  weight_kg: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  customer_id: string;
  sender: Customer;
  receiver: Customer;
}

export interface BookingEvent {
  id: string;
  bookingId: string;
  eventType: BookingStatus;
  location: string;
  timestamp: string;
  details: Record<string, string | number | null>;
}

export interface BookingHistory extends Booking {
  timeline: BookingEvent[];
}
