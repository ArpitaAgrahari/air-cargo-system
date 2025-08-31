"use client";

import React from "react";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/utils";
import { useBookings } from "@/hooks";
import { Booking } from "@/types/booking";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useUserContext } from "@/context/user-context";

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  } catch {
    return dateString;
  }
}

export const BookingsTable = () => {
  const { user } = useUserContext();
  const [page, setPage] = useState(1);
  const limit = 6;
  const [awb, setAwb] = useState("");
  const [search, setSearch] = useState("");

  const { data, isFetching, isLoading, error } = useBookings({
    page,
    limit,
    awb,
  });

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        header: "AWB",
        accessorKey: "awbNo",
        cell: ({ getValue }) => (
          <span className="font-medium">{String(getValue())}</span>
        ),
      },
      {
        header: "Route",
        cell: ({ row }) => (
          <span>
            {row.original.originAirportCode} →{" "}
            {row.original.destinationAirportCode}
          </span>
        ),
      },
      {
        header: "Pieces",
        accessorKey: "pieces",
      },
      {
        header: "Weight (kg)",
        accessorKey: "weightKg",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue() as Booking["status"];
          const color = getStatusColor(status);
          return (
            <Badge variant={color.variant} className={color.className}>
              {status}
            </Badge>
          );
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ getValue }) => formatDate(String(getValue())),
      },
      {
        header: "Updated",
        accessorKey: "updatedAt",
        cell: ({ getValue }) => formatDate(String(getValue())),
      },
      {
        header: "Actions",
        cell: ({ row }) =>
          user?.role === "STAFF" || user?.role === "ADMIN" ? (
            row.original.status === "DELIVERED" ||
            row.original.status === "CANCELLED" ? null : (
              <Link
                href={`/bookings/update?awb=${row.original.awbNo}`}
              >
                <Button variant="outline">Update</Button>
              </Link>
            )
          ) : (
            <Link href={`/track?awb=${row.original.awbNo}`}>
              <Button variant="outline">Track</Button>
            </Link>
          ),
      },
    ],
    [user?.role]
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = data?.pagination?.totalPages ?? 1;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const onSearch = () => {
    setPage(1);
    setAwb(search.trim());
  };

  return (
    <div className="space-y-4 bg-card rounded-md p-4 border shadow-sm">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by AWB"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          className="max-w-xs"
        />
        <Button onClick={onSearch} disabled={isLoading}>
          Search
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading || isFetching
                    ? "Loading..."
                    : error
                    ? "Failed to load"
                    : "No results"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Page {data?.pagination?.currentPage ?? page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setPage((p) => p - 1)}
            disabled={!canPrev || isFetching}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={!canNext || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
