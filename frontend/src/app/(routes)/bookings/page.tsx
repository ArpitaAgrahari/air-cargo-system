import React from "react";
import { BookingsTable } from "@/modules/bookings";

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">All bookings created by your account.</p>
      </div>
      <BookingsTable />
    </div>
  );
}
