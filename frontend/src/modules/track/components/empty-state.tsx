import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="border-dashed border-gray-300 bg-gray-50">
      <CardContent className="py-12">
        <div className="text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Ready to Track
          </h3>
          <p className="text-gray-500">
            Enter an AWB number above to start tracking your shipment
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
