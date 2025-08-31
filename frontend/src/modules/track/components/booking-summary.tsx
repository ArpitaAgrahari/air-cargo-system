import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils";
import { Package, MapPin, Calendar, Weight, Hash } from "lucide-react";
import { formatDate } from "../utils";
import { Booking } from "@/types/booking";

interface BookingSummaryProps {
  data: Booking; // You can type this more specifically based on your API response
}

export const BookingSummary = ({ data }: BookingSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">AWB Number</p>
              <p className="font-semibold">{data.awbNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Route</p>
              <p className="font-semibold">
                {data.originAirportCode} → {data.destinationAirportCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Weight & Pieces</p>
              <p className="font-semibold">
                {data.weightKg}kg ({data.pieces} pcs)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-semibold">{formatDate(data.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-semibold">{formatDate(data.updatedAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={getStatusColor(data.status).variant}
              className={getStatusColor(data.status).className}
            >
              {data.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
