"use client";

import React, { useMemo, useState } from "react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateBooking } from "@/hooks";
import { BookingStatus } from "@/types/booking";
import { toast } from "sonner";

const statusOptions: BookingStatus[] = [
  "BOOKED",
  "DEPARTED",
  "ARRIVED",
  "DELIVERED",
  "CANCELLED",
];

export default function UpdateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const awbFromQuery = searchParams.get("awb") ?? "";

  const [awbNo, setAwbNo] = useState(awbFromQuery);
  const [newStatus, setNewStatus] = useState<BookingStatus>("BOOKED");
  const [location, setLocation] = useState("");
  const [flightId, setFlightId] = useState<string>("");

  const { mutateAsync, isPending } = useUpdateBooking();

  const normalizedAwb = useMemo(() => awbNo.replace(/\s+/g, ""), [awbNo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedAwb || !newStatus || !location) {
      toast.error("Please fill AWB, status and location");
      return;
    }
    try {
      const res = await mutateAsync({
        awb_no: normalizedAwb,
        new_status: newStatus,
        location,
        flight_id: flightId ? Number(flightId) : undefined,
      });
      if (res.success) {
        toast.success(`Updated ${res.data?.awb_no} to ${res.data?.status}`);
        router.push(`/track?awb=${normalizedAwb}`);
      } else {
        toast.error(res.message ?? "Update failed");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Update Booking Status</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-card rounded-md p-4 border">
        <div className="space-y-2">
          <Label htmlFor="awb">AWB Number</Label>
          <Input
            id="awb"
            value={awbNo}
            onChange={(e) => setAwbNo(e.target.value)}
            placeholder="160-81140743"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">New Status</Label>
          <Select value={newStatus} onValueChange={(v) => setNewStatus(v as BookingStatus)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="DEL" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flight">Flight ID (optional)</Label>
          <Input id="flight" value={flightId} onChange={(e) => setFlightId(e.target.value)} placeholder="456" />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Updating..." : "Update"}</Button>
        </div>
      </form>
    </div>
  );
}


