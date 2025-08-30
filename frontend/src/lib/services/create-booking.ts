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

export async function createBooking(body: CreateBookingBody): Promise<ApiResponse<CreateBookingResponse>> {
  await new Promise((r) => setTimeout(r, 500));
  const awbPrefix = String(100 + (body.flight_id % 900));
  const awbSuffix = String(1_000_000 + Math.floor(Math.random() * 9_000_000)).slice(0, 8);

  return {
    success: true,
    message: "Booking created",
    data: {
      awb_no: `${awbPrefix}-${awbSuffix}`,
      status: "BOOKED",
    },
    errors: null,
  };

  // Real API call when backend is ready
  // return postRequest<CreateBookingResponse, CreateBookingBody>(ENDPOINTS.CREATE_BOOKING, body);
}
