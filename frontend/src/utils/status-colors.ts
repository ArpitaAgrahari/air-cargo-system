import { BookingStatus } from "@/types/booking";

export function getStatusColor(status: BookingStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
} {
  switch (status) {
    case "BOOKED":
      return { variant: "default" };
    case "DEPARTED":
    case "ARRIVED":
      return { variant: "secondary" };
    case "DELIVERED":
      return {
        variant: "default",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    case "CANCELLED":
      return { variant: "destructive" };
    default:
      return { variant: "outline" };
  }
}
