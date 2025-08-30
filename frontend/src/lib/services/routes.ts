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
export async function findRoutes(params: FindRoutesParams): Promise<ApiResponse<RoutesResponse>> {
  await new Promise((r) => setTimeout(r, 400));

  const baseFlight = (id: number, o: string, d: string, dep: string, arr: string): Flight => ({
    id,
    flight_number: `AI-${100 + (id % 900)}`,
    airline_name: "Air India",
    awb_prefix: String(100 + (id % 900)),
    origin_airport_code: o,
    destination_airport_code: d,
    departure_datetime: `${params.date}T${dep}:00Z`,
    arrival_datetime: `${params.date}T${arr}:00Z`,
  });

  const directFlights: Flight[] = [
    baseFlight(1, params.origin, params.destination, "08:30", "10:45"),
    baseFlight(2, params.origin, params.destination, "15:10", "17:20"),
  ];

  const transitRoutes = [
    { leg1: baseFlight(3, params.origin, "BOM", "06:00", "07:15"), leg2: baseFlight(4, "BOM", params.destination, "08:20", "09:30") },
    { leg1: baseFlight(5, params.origin, "HYD", "12:40", "13:50"), leg2: baseFlight(6, "HYD", params.destination, "14:40", "16:00") },
  ];

  return {
    success: true,
    message: "Routes fetched",
    data: { directFlights, transitRoutes },
    errors: null,
  };

  // Real API call when backend ready
  // return getRequest<RoutesResponse>(ENDPOINTS.ROUTES, { params });
}
