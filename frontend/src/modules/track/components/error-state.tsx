import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  searchAwbNo: string | null;
}

export const ErrorState = ({ searchAwbNo }: ErrorStateProps) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="py-8">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Booking Not Found
          </h3>
          <p className="text-red-600 mb-4">
            We couldn&apos;t find a booking with the AWB number:{" "}
            <strong>{searchAwbNo}</strong>
          </p>
          <p className="text-red-500 text-sm">
            Please check the AWB number and try again, or contact customer
            support if you believe this is an error.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
