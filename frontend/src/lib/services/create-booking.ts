import { postRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { ApiResponse } from "@/types/api";
import { BookingStatus } from "@/types/booking";

export interface CreateBookingBody {
  origin_airport_code: string;
  destination_airport_code: string;
  pieces: number;
  weight_kg: number;
  flight_id: number;
}

export interface CreateBookingResponse {
  awb_no: string;
  status: BookingStatus;
}

export async function createBooking(
  body: CreateBookingBody
): Promise<ApiResponse<CreateBookingResponse>> {
  return postRequest<CreateBookingResponse, CreateBookingBody>(
    ENDPOINTS.CREATE_BOOKING,
    body
  );
}
