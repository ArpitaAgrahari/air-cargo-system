import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils";
import { Plane, Package, MapPin } from "lucide-react";
import { formatDate } from "../utils";

interface TrackingTimelineProps {
  timeline: any[]; // You can type this more specifically based on your API response
}

export const TrackingTimeline = ({ timeline }: TrackingTimelineProps) => {

  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Tracking Timeline
          </CardTitle>
          <CardDescription>
            Complete history of your shipment&apos;s journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tracking events available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Tracking Timeline
        </CardTitle>
        <CardDescription>
          Complete history of your shipment&apos;s journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    index === 0 ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={getStatusColor(event.eventType).variant}
                    className={getStatusColor(event.eventType).className}
                  >
                    {event.eventType}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(event.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{event.location}</span>
                </div>

                {event.details && Object.keys(event.details).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Additional Details:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(event.details).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-gray-500 capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="ml-2 font-medium">
                            {value || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
