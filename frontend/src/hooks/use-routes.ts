import { useQuery } from "@tanstack/react-query";
import { findRoutes, FindRoutesParams } from "@/lib/services";
import { RoutesResponse } from "@/lib/services/routes";
import { ApiResponse } from "@/types/api";

export const ROUTES_QUERY_KEY = "routes";

export function useRoutes(params: FindRoutesParams | null) {
  return useQuery<ApiResponse<RoutesResponse>>({
    queryKey: [ROUTES_QUERY_KEY, params?.origin, params?.destination, params?.date],
    queryFn: () => findRoutes(params as FindRoutesParams),
    enabled: Boolean(params?.origin && params?.destination && params?.date),
  });
}
