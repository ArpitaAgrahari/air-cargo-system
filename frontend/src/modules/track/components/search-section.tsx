"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchSectionProps {
  awbNo: string;
  setAwbNo: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchSection = ({
  awbNo,
  setAwbNo,
  onSearch,
  isLoading,
}: SearchSectionProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Track by AWB Number
        </CardTitle>
        <CardDescription>
          Enter your 12-digit Air Waybill number to get real-time tracking
          information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            placeholder="Enter AWB number (e.g., 12345678901)"
            value={awbNo}
            onChange={(e) => setAwbNo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={onSearch} disabled={!awbNo.trim() || isLoading}>
            {isLoading ? "Searching..." : "Track"}
          </Button>
        </div>

        {/* Test Data Hint */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            🧪 Test with these AWB numbers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                12345678901
              </span>
              <span className="text-blue-700">→ DELIVERED (LAX→JFK)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                98765432109
              </span>
              <span className="text-blue-700">→ DEPARTED (ORD→MIA)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                55566677788
              </span>
              <span className="text-blue-700">→ ARRIVED (SFO→SEA)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                11122233344
              </span>
              <span className="text-blue-700">→ CANCELLED (DFW→ATL)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
