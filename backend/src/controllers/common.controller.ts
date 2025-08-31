import { Request, Response } from "express";
import { PaginatedApiResponse } from "../types/api.types";
import * as bookingService from "../services/booking.service";

export const getAllBookings = async (req: Request, res: Response) => {
  const role = req.user?.role;
  const id = req.user?.id;

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const awb = req.query.awb as string | undefined;

    const { bookings, totalCount } =
      await bookingService.getAllBookingsPaginated(
        page,
        limit,
        awb,
        id || undefined,
        role || undefined
      );
    const totalPages = Math.ceil(totalCount / limit);

    const response: PaginatedApiResponse<any> = {
      success: true,
      message: "Bookings fetched successfully.",
      data: bookings,
      errors: null,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      errors: { details: { message: error.message } },
    });
  }
};
