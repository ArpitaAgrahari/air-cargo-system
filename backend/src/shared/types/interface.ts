// shared/types/types.ts

// ----------------------------------
// 1. Base API Response Types
// ----------------------------------

export type Nullable<T> = T | null;

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  errors: null;
}

export interface FailedResponse {
  success: false;
  message: string;
  data: null;
  errors: {
    details: {
      message: string;
      [key: string]: any; // For detailed validation errors
    };
  };
}

export type ApiResponse<T = null> = SuccessResponse<T> | FailedResponse;

export interface PaginatedApiResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// ----------------------------------
// 2. Core Data Models
// ----------------------------------

export type BookingStatus = 'BOOKED' | 'DEPARTED' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED';
export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface Booking {
  id: number;
  awb_no: string;
  origin_airport_code: string;
  destination_airport_code: string;
  pieces: number;
  weight_kg: number;
  status: BookingStatus;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  customer_id: number;
}

export interface Flight {
  id: number;
  flight_number: string;
  airline_name: string;
  awb_prefix: string;
  origin_airport_code: string;
  destination_airport_code: string;
  departure_datetime: string; // ISO 8601 format
  arrival_datetime: string;   // ISO 8601 format
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface BookingEvent {
  id: string;
  bookingId: string;
  eventType: BookingStatus;
  location: string;
  timestamp: string; // ISO 8601 format
  details: Record<string, string | number | null>;
}

export interface BookingHistory extends Booking {
  timeline: BookingEvent[];
}

// ----------------------------------
// 3. API Request Types
// ----------------------------------

export interface CreateBookingRequest {
  origin_airport_code: string;
  destination_airport_code: string;
  pieces: number;
  weight_kg: number;
  flight_id: number;
}

export interface UpdateBookingStatusRequest {
  awb_no: string;
  new_status: BookingStatus;
  location: string;
  flight_id?: number;
}

export interface RouteQueryParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
}

// ----------------------------------
// 4. Pagination
// ----------------------------------

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
