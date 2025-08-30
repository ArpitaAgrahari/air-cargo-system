import { Booking, BookingStatus } from "@/types/booking";
import { PaginatedApiResponse } from "@/types/api";

export interface ListBookingsParams {
  page?: number;
  limit?: number;
  awb?: string;
}

const ORIGINS = ["LAX", "SFO", "ORD", "DFW", "SEA", "PHX", "BOS", "IAD", "DEN", "LAS"];
const DESTINATIONS = ["JFK", "SEA", "MIA", "ATL", "LAX", "SFO", "ORD", "BOS", "PHL", "IAH"];
const STATUSES: BookingStatus[] = ["BOOKED", "DEPARTED", "ARRIVED", "DELIVERED", "CANCELLED"];

function generateMockBookings(total: number): Booking[] {
  const bookings: Booking[] = [];
  const now = Date.now();
  for (let i = 1; i <= total; i++) {
    const origin = ORIGINS[i % ORIGINS.length];
    const destination = DESTINATIONS[(i * 3) % DESTINATIONS.length];
    const status = STATUSES[i % STATUSES.length];
    const created = new Date(now - i * 86_400_000).toISOString();
    const updated = new Date(now - i * 43_200_000).toISOString();
    const awbPrefix = String(100 + (i % 900));
    const awbSuffix = String(1_000_000 + i).padStart(8, "0");

    bookings.push({
      id: `booking-${i.toString().padStart(3, "0")}`,
      awb_no: `${awbPrefix}-${awbSuffix}`,
      origin_airport_code: origin,
      destination_airport_code: destination,
      pieces: (i % 5) + 1,
      weight_kg: Math.round(((i % 90) + 10 + (i % 3) * 0.5) * 10) / 10,
      status,
      created_at: created,
      updated_at: updated,
      customer_id: `cust-${(i % 7) + 1}`,
    });
  }
  return bookings;
}

const MOCK_BOOKINGS = generateMockBookings(60);

export async function listBookings(params: ListBookingsParams = {}): Promise<PaginatedApiResponse<Booking>> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 20);
  const awb = (params.awb ?? "").trim().toLowerCase();

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

  let filtered = MOCK_BOOKINGS;
  if (awb) {
    filtered = filtered.filter((b) => b.awb_no.toLowerCase().includes(awb));
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  return {
    success: true,
    message: "Bookings fetched successfully",
    data: pageData,
    errors: null,
    pagination: {
      totalItems,
      totalPages,
      currentPage,
      pageSize: limit,
    },
  };
}
