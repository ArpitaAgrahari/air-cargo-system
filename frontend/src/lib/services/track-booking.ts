import { getRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { BookingHistory } from "@/types/booking";
import { ApiResponse } from "@/types/api";

export async function trackBooking(
  awbNo: string
): Promise<ApiResponse<BookingHistory>> {
  return getRequest<BookingHistory>(`${ENDPOINTS.TRACK_BOOKING}/${awbNo}`);
}
