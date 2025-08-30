import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listBookings, ListBookingsParams } from "@/lib/services";
import { Booking } from "@/types/booking";
import { PaginatedApiResponse } from "@/types/api";

export const BOOKINGS_QUERY_KEY = "bookings";

export function useBookings(params: ListBookingsParams) {
  return useQuery<PaginatedApiResponse<Booking>>({
    queryKey: [BOOKINGS_QUERY_KEY, params.page ?? 1, params.limit ?? 20, params.awb ?? ""],
    queryFn: () => listBookings(params),
    placeholderData: keepPreviousData,
  });
}
