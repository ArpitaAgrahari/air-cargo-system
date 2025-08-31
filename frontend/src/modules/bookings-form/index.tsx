"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRoutes, useCreateBooking } from "@/hooks";
import { Flight } from "@/types/flights";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Plane,
  Package,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Search as SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const iata = z
  .string()
  .trim()
  .transform((s) => s.toUpperCase())
  .refine((s) => /^[A-Z]{3}$/.test(s), "Must be 3-letter IATA code");

const searchSchema = z.object({
  origin: iata,
  destination: iata,
  date: z
    .string()
    .trim()
    .refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s), "Use YYYY-MM-DD"),
});

const detailsSchema = z.object({
  pieces: z.coerce.number().min(1).max(9999),
  weight_kg: z.coerce.number().min(1).max(999999),
});

const selectionSchema = z.object({
  flight_id: z.coerce.number().int().positive(),
});

const schema = searchSchema.and(detailsSchema).and(selectionSchema);

type FormValues = z.infer<typeof schema>;

function useWizard() {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));
  const goto = (s: number) => setStep(s);
  return { step, next, back, goto };
}

function FlightsSelect({
  flights,
  value,
  onChange,
}: {
  flights: Flight[];
  value?: number;
  onChange: (id: number) => void;
}) {
  return (
    <Select
      value={value ? String(value) : undefined}
      onValueChange={(v) => onChange(Number(v))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select flight" />
      </SelectTrigger>
      <SelectContent>
        {flights.map((f) => (
          <SelectItem key={f.id} value={String(f.id)}>
            {f.flightNumber} • {f.originAirportCode}→{f.destinationAirportCode}{" "}
            • {format(new Date(f.departureDatetime), "HH:mm")} -{" "}
            {format(new Date(f.arrivalDatetime), "HH:mm")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const BookingsForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { pieces: 1, weight_kg: 1 },
    mode: "onChange",
  });
  const { register, handleSubmit, formState, watch, setValue, trigger } =
    methods;
  const { step, next, back } = useWizard();

  const origin = watch("origin");
  const destination = watch("destination");
  const date = watch("date");
  const searchParams =
    origin && destination && date ? { origin, destination, date } : null;

  const { data: routesData, isFetching: routesLoading } =
    useRoutes(searchParams);
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  const directFlights = routesData?.success
    ? routesData.data.directFlights
    : [];
  const transitFlights: Flight[] = routesData?.success
    ? routesData.data.transitRoutes.flatMap((r) => [r.leg1, r.leg2])
    : [];
  const allFlights = [...directFlights, ...transitFlights];

  const onSubmit = handleSubmit(async (values) => {
    const ok = await trigger();
    if (!ok) return;
    const res = await createBooking({
      origin_airport_code: values.origin,
      destination_airport_code: values.destination,
      pieces: values.pieces,
      weight_kg: values.weight_kg,
      flight_id: values.flight_id,
    });
    if (res.success) {
      toast.success("Booking created", {
        description: `AWB: ${res.data.awb_no}`,
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      router.push("/bookings");
    } else {
      toast.error("Failed to create booking", { description: res.message });
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Create Booking</CardTitle>
                <CardDescription>
                  Search flights, enter shipment details, and confirm your
                  booking.
                </CardDescription>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                  step === 0
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Route</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                  step === 1
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <Package className="h-4 w-4" />
                <span className="text-sm">Details</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                  step === 2
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <Plane className="h-4 w-4" />
                <span className="text-sm">Flight</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Origin
                  </label>
                  <Input placeholder="DEL" {...register("origin")} />
                  {formState.errors.origin && (
                    <p className="text-xs text-red-600 mt-1">
                      {formState.errors.origin.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Destination
                  </label>
                  <Input placeholder="BLR" {...register("destination")} />
                  {formState.errors.destination && (
                    <p className="text-xs text-red-600 mt-1">
                      {formState.errors.destination.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch("date") && "text-muted-foreground"
                        )}
                      >
                        {watch("date") || "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 w-fit" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          watch("date") ? new Date(watch("date")) : undefined
                        }
                        onSelect={(d) => {
                          if (!d) return;
                          const yyyy = d.getFullYear();
                          const mm = String(d.getMonth() + 1).padStart(2, "0");
                          const dd = String(d.getDate()).padStart(2, "0");
                          setValue("date", `${yyyy}-${mm}-${dd}`, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {formState.errors.date && (
                    <p className="text-xs text-red-600 mt-1">
                      {formState.errors.date.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 flex gap-2">
                  <Button
                    type="button"
                    onClick={async () => {
                      const ok = await trigger([
                        "origin",
                        "destination",
                        "date",
                      ]);
                      if (ok) next();
                    }}
                    disabled={routesLoading}
                  >
                    {routesLoading ? (
                      "Searching..."
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <SearchIcon className="h-4 w-4" /> Find flights
                      </span>
                    )}
                  </Button>
                  {routesLoading && (
                    <span className="text-xs text-gray-500 self-center">
                      Fetching available routes…
                    </span>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Pieces
                    </label>
                    <Input
                      type="number"
                      min={1}
                      {...register("pieces", { valueAsNumber: true })}
                    />
                    {formState.errors.pieces && (
                      <p className="text-xs text-red-600 mt-1">
                        {formState.errors.pieces.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      step="0.1"
                      {...register("weight_kg", { valueAsNumber: true })}
                    />
                    {formState.errors.weight_kg && (
                      <p className="text-xs text-red-600 mt-1">
                        {formState.errors.weight_kg.message as string}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={back}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      const ok = await trigger(["pieces", "weight_kg"]);
                      if (ok) next();
                    }}
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Flight
                  </label>
                  <FlightsSelect
                    flights={allFlights}
                    value={watch("flight_id")}
                    onChange={(id) =>
                      setValue("flight_id", id, { shouldValidate: true })
                    }
                  />
                  {formState.errors.flight_id && (
                    <p className="text-xs text-red-600 mt-1">
                      {formState.errors.flight_id.message as string}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={back}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      !watch("flight_id") ||
                      allFlights.length === 0
                    }
                  >
                    {isPending ? "Creating..." : "Create Booking"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
