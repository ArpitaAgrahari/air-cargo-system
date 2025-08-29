// src/controllers/staff.controller.ts

import { Request, Response } from 'express';
import { ApiResponse, PaginatedApiResponse } from '../types/api.types';
import * as bookingService from '../services/booking.service';
import { validateUpdateBookingRequest } from '../validators/booking.validator';
import { BookingStatus } from '@prisma/client';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const awb = req.query.awb as string | undefined;

    const { bookings, total } = await bookingService.getAllBookingsPaginated(page, limit, awb);
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedApiResponse<any> = {
      success: true,
      message: 'Bookings fetched successfully.',
      data: bookings,
      errors: null,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', errors: { details: { message: error.message } } });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    validateUpdateBookingRequest(req.body);
    const { awb_no, new_status, location, flight_id } = req.body;

    const updatedBooking = await bookingService.updateBookingAndAddEvent(
      awb_no,
      new_status as BookingStatus,
      location,
      flight_id
    );

    const response: ApiResponse<any> = {
      success: true,
      message: 'Booking status updated successfully.',
      data: { awb_no: updatedBooking.refId, status: updatedBooking.status },
      errors: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: 'Booking not found.', errors: { details: { message: error.message } } });
    }
    res.status(422).json({ success: false, message: 'Failed to update booking status', errors: { details: { message: error.message } } });
  }
};