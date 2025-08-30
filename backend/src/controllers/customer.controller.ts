import { Request, Response } from "express";
import { ApiResponse, PaginatedApiResponse } from "../types/api.types";
import * as bookingService from "../services/booking.service";
import * as routeService from "../services/route.service";
import { validateCreateBookingRequest } from "../validators/booking.validator";

export const getBookings = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const bookings = await bookingService.getBookingsForCustomer(customerId);
    const response: ApiResponse<any> = {
      success: true,
      message: "Bookings fetched successfully.",
      data: bookings,
      errors: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch bookings",
        errors: { details: { message: error.message } },
      });
  }
};

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const { origin, destination, date } = req.query;
    if (
      !origin ||
      !destination ||
      !date ||
      typeof origin !== "string" ||
      typeof destination !== "string" ||
      typeof date !== "string"
    ) {
      return res
        .status(422)
        .json({
          success: false,
          message: "Missing or invalid query parameters.",
          errors: {
            details: { message: "origin, destination, and date are required." },
          },
        });
    }

    const routes = await routeService.getAvailableRoutes(
      origin,
      destination,
      date
    );
    const response: ApiResponse<any> = {
      success: true,
      message: "Routes fetched successfully.",
      data: routes,
      errors: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch routes",
        errors: { details: { message: error.message } },
      });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    validateCreateBookingRequest(req.body);
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const {
      origin_airport_code,
      destination_airport_code,
      pieces,
      weight_kg,
      flight_id,
    } = req.body;

    const newBooking = await bookingService.createNewBooking(
      customerId,
      origin_airport_code,
      destination_airport_code,
      pieces,
      weight_kg,
      flight_id
    );

    const response: ApiResponse<any> = {
      success: true,
      message: "Booking created successfully.",
      data: { awb_no: newBooking.refId, status: newBooking.status },
      errors: null,
    };
    res.status(201).json(response);
  } catch (error: any) {
    res
      .status(422)
      .json({
        success: false,
        message: "Failed to create booking",
        errors: { details: { message: error.message } },
      });
  }
};
