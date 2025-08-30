-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('BOOKED', 'DEPARTED', 'ARRIVED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'STAFF', 'ADMIN');

-- CreateTable
CREATE TABLE "flight" (
    "id" SERIAL NOT NULL,
    "flight_number" TEXT NOT NULL,
    "airline_name" TEXT NOT NULL,
    "awb_prefix" TEXT NOT NULL,
    "origin_airport_code" TEXT NOT NULL,
    "destination_airport_code" TEXT NOT NULL,
    "departure_datetime" TIMESTAMP(3) NOT NULL,
    "arrival_datetime" TIMESTAMP(3) NOT NULL,
    "max_capacity_weight_kg" INTEGER,
    "max_capacity_pieces" INTEGER,
    "overbooking_percentage" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "awb_no" TEXT NOT NULL,
    "origin_airport_code" TEXT NOT NULL,
    "destination_airport_code" TEXT NOT NULL,
    "pieces" INTEGER NOT NULL,
    "weight_kg" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customer_id" TEXT NOT NULL,
    "flight_id" INTEGER,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_event" (
    "id" TEXT NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "event_type" "BookingStatus" NOT NULL,
    "location" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "details" JSONB,

    CONSTRAINT "booking_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_event" ADD CONSTRAINT "booking_event_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
