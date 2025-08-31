import { ENDPOINTS } from "@/lib/endpoints";
import { getRequest } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Flight } from "@/types/flights";

export interface FindRoutesParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
}

export interface RoutesResponse {
  directFlights: Flight[];
  transitRoutes: { leg1: Flight; leg2: Flight }[];
}

// For now, return mock data deterministically so UI can be built/tested
export async function findRoutes(
  params: FindRoutesParams
): Promise<ApiResponse<RoutesResponse>> {
  // Real API call when backend ready
  return getRequest<RoutesResponse>(ENDPOINTS.ROUTES, { params });
}
