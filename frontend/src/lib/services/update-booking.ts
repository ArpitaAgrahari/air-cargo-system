import { putRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { ApiResponse } from "@/types/api";
import { BookingStatus } from "@/types/booking";

export type UpdateBookingRequest = {
  awb_no: string;
  new_status: BookingStatus;
  location: string;
  flight_id?: number;
};

export type UpdateBookingResponse = {
  awb_no: string;
  status: BookingStatus;
};

export async function updateBooking(
  body: UpdateBookingRequest
): Promise<ApiResponse<UpdateBookingResponse>> {
  return putRequest<UpdateBookingResponse, UpdateBookingRequest>(
    ENDPOINTS.UPDATE_BOOKING,
    body
  );
}


