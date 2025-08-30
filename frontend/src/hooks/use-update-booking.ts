import { useMutation } from "@tanstack/react-query";
import { updateBooking, UpdateBookingRequest, UpdateBookingResponse } from "@/lib/services";
import { ApiResponse } from "@/types/api";

export function useUpdateBooking() {
  return useMutation<ApiResponse<UpdateBookingResponse>, unknown, UpdateBookingRequest>({
    mutationFn: (payload) => updateBooking(payload),
  });
}


