import { useMutation } from "@tanstack/react-query";
import { createBooking, CreateBookingBody, CreateBookingResponse } from "@/lib/services";
import { ApiResponse } from "@/types/api";

export function useCreateBooking() {
  return useMutation<ApiResponse<CreateBookingResponse>, unknown, CreateBookingBody>({
    mutationFn: (body) => createBooking(body),
  });
}
