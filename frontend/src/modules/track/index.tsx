"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTrackBooking } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SearchSection,
  LoadingState,
  ErrorState,
  BookingSummary,
  TrackingTimeline,
  EmptyState,
} from "./components";

export const TrackBooking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [awbNo, setAwbNo] = useState("");
  const [searchAwbNo, setSearchAwbNo] = useState<string | null>(null);

  // Keep local state in sync with URL query param `awb`
  useEffect(() => {
    const awbFromQuery = searchParams.get("awb");
    if (awbFromQuery && awbFromQuery !== searchAwbNo) {
      setAwbNo(awbFromQuery);
      setSearchAwbNo(awbFromQuery);
    }
  }, [searchParams, searchAwbNo]);

  // Normalize AWB (remove non-digits) for lookup while preserving display value
  const normalizedAwb = useMemo(() => {
    return searchAwbNo ? searchAwbNo.replace(/\D/g, "") : null;
  }, [searchAwbNo]);

  const { data, isLoading, error } = useTrackBooking(normalizedAwb);

  const handleSearch = () => {
    if (awbNo.trim()) {
      const value = awbNo.trim();
      setSearchAwbNo(value);

      // Update the URL so it can be shared/bookmarked
      const next = new URLSearchParams(searchParams.toString());
      next.set("awb", value);
      router.push(`/track?${next.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Track Your Booking
        </h1>
        <p className="text-gray-600">
          Enter your Air Waybill (AWB) number to track your shipment
        </p>
      </div>

      <SearchSection
        awbNo={awbNo}
        setAwbNo={setAwbNo}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Error State */}
      {error && <ErrorState searchAwbNo={searchAwbNo} />}

      {/* Results Section */}
      {data?.success && data.data && (
        <div className="space-y-6">
          <BookingSummary data={data.data} />
          <TrackingTimeline timeline={data.data.events} />
        </div>
      )}

      {/* No Search Yet */}
      {!searchAwbNo && !isLoading && !error && !data && <EmptyState />}
    </div>
  );
};
