import { useQuery } from "@tanstack/react-query";
import { trackBooking } from "@/lib/services";

export function useTrackBooking(awbNo: string | null) {
  return useQuery({
    queryKey: ["track-booking", awbNo],
    queryFn: () => trackBooking(awbNo!),
    enabled: !!awbNo && awbNo.trim().length > 0,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
