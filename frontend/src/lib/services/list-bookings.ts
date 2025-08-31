import { Booking } from "@/types/booking";
import { PaginatedApiResponse } from "@/types/api";
import { getPaginatedRequest } from "../api/get-request";
import { ENDPOINTS } from "../endpoints";

export interface ListBookingsParams {
  page?: number;
  limit?: number;
  awb?: string;
}

export async function listBookings(
  params: ListBookingsParams = {}
): Promise<PaginatedApiResponse<Booking>> {
  return getPaginatedRequest<Booking>(ENDPOINTS.BOOKINGS, { params });
}
