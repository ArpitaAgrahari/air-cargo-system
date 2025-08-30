import { getRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { BookingHistory, BookingStatus } from "@/types/booking";
import { ApiResponse } from "@/types/api";

// 🧪 MOCK DATA FOR TESTING - Replace with actual API call when ready
// This simulates the real API response for development and testing purposes
// Remove this mock data and uncomment the getRequest call below when connecting to real API

// Mock data for testing
const mockBookings: Record<string, BookingHistory> = {
  "12345678901": {
    id: "booking-001",
    awb_no: "123-45678901",
    origin_airport_code: "LAX",
    destination_airport_code: "JFK",
    pieces: 2,
    weight_kg: 45.5,
    status: "DELIVERED",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-18T14:20:00Z",
    customer_id: "cust-001",
    timeline: [
      {
        id: "event-001",
        bookingId: "booking-001",
        eventType: "BOOKED",
        location: "Los Angeles, CA",
        timestamp: "2024-01-15T10:30:00Z",
        details: {
          agent: "John Smith",
          office: "LAX-001",
          notes: "Package picked up from customer"
        }
      },
      {
        id: "event-002",
        bookingId: "booking-001",
        eventType: "DEPARTED",
        location: "Los Angeles International Airport",
        timestamp: "2024-01-16T08:15:00Z",
        details: {
          flight: "AA-1234",
          departure_time: "08:15",
          terminal: "Terminal 4"
        }
      },
      {
        id: "event-003",
        bookingId: "booking-001",
        eventType: "ARRIVED",
        location: "John F. Kennedy International Airport",
        timestamp: "2024-01-16T16:45:00Z",
        details: {
          flight: "AA-1234",
          arrival_time: "16:45",
          terminal: "Terminal 8",
          gate: "Gate 12"
        }
      },
      {
        id: "event-004",
        bookingId: "booking-001",
        eventType: "DELIVERED",
        location: "New York, NY",
        timestamp: "2024-01-18T14:20:00Z",
        details: {
          recipient: "Jane Doe",
          signature: "JDoe",
          delivery_time: "14:20",
          driver: "Mike Johnson"
        }
      }
    ]
  },
  "98765432109": {
    id: "booking-002",
    awb_no: "987-65432109",
    origin_airport_code: "ORD",
    destination_airport_code: "MIA",
    pieces: 1,
    weight_kg: 23.8,
    status: "DEPARTED",
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-21T11:30:00Z",
    customer_id: "cust-002",
    timeline: [
      {
        id: "event-005",
        bookingId: "booking-002",
        eventType: "BOOKED",
        location: "Chicago, IL",
        timestamp: "2024-01-20T09:00:00Z",
        details: {
          agent: "Sarah Wilson",
          office: "ORD-002",
          notes: "Express delivery requested"
        }
      },
      {
        id: "event-006",
        bookingId: "booking-002",
        eventType: "DEPARTED",
        location: "O'Hare International Airport",
        timestamp: "2024-01-21T11:30:00Z",
        details: {
          flight: "UA-5678",
          departure_time: "11:30",
          terminal: "Terminal 1"
        }
      }
    ]
  },
  "55566677788": {
    id: "booking-003",
    awb_no: "555-66677788",
    origin_airport_code: "SFO",
    destination_airport_code: "SEA",
    pieces: 3,
    weight_kg: 67.2,
    status: "ARRIVED",
    created_at: "2024-01-22T14:15:00Z",
    updated_at: "2024-01-23T10:45:00Z",
    customer_id: "cust-003",
    timeline: [
      {
        id: "event-007",
        bookingId: "booking-003",
        eventType: "BOOKED",
        location: "San Francisco, CA",
        timestamp: "2024-01-22T14:15:00Z",
        details: {
          agent: "David Brown",
          office: "SFO-003",
          notes: "Fragile items - handle with care"
        }
      },
      {
        id: "event-008",
        bookingId: "booking-003",
        eventType: "DEPARTED",
        location: "San Francisco International Airport",
        timestamp: "2024-01-23T07:20:00Z",
        details: {
          flight: "AS-9012",
          departure_time: "07:20",
          terminal: "Terminal 2"
        }
      },
      {
        id: "event-009",
        bookingId: "booking-003",
        eventType: "ARRIVED",
        location: "Seattle-Tacoma International Airport",
        timestamp: "2024-01-23T10:45:00Z",
        details: {
          flight: "AS-9012",
          arrival_time: "10:45",
          terminal: "Terminal N",
          gate: "Gate A8"
        }
      }
    ]
  },
  "11122233344": {
    id: "booking-004",
    awb_no: "111-22233344",
    origin_airport_code: "DFW",
    destination_airport_code: "ATL",
    pieces: 1,
    weight_kg: 12.5,
    status: "CANCELLED",
    created_at: "2024-01-24T16:00:00Z",
    updated_at: "2024-01-24T17:30:00Z",
    customer_id: "cust-004",
    timeline: [
      {
        id: "event-010",
        bookingId: "booking-004",
        eventType: "BOOKED",
        location: "Dallas, TX",
        timestamp: "2024-01-24T16:00:00Z",
        details: {
          agent: "Lisa Garcia",
          office: "DFW-004",
          notes: "Standard delivery"
        }
      },
      {
        id: "event-011",
        bookingId: "booking-004",
        eventType: "CANCELLED",
        location: "Dallas, TX",
        timestamp: "2024-01-24T17:30:00Z",
        details: {
          reason: "Customer requested cancellation",
          cancelled_by: "Lisa Garcia",
          refund_processed: "Yes"
        }
      }
    ]
  }
};

export async function trackBooking(awbNo: string): Promise<ApiResponse<BookingHistory>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Check if we have mock data for this AWB
  const mockData = mockBookings[awbNo];
  
  if (mockData) {
    return {
      success: true,
      message: "Booking found successfully",
      data: mockData,
      errors: null
    };
  }
  
  // Return 404 error for non-existent bookings
  return {
    success: false,
    message: "Booking not found",
    data: null,
    errors: {
      details: {
        message: `No booking found with AWB number: ${awbNo}`
      }
    }
  };
  
  // 🚀 REAL API CALL - Uncomment when ready to connect to actual API
  // return getRequest<BookingHistory>(`${ENDPOINTS.TRACK_BOOKING}/${awbNo}`);
}
