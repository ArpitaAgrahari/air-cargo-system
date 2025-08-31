import { Request, Response } from 'express';
import { ApiResponse, PaginatedApiResponse } from '../types/api.types';
import * as bookingService from '../services/booking.service';
import { validateUpdateBookingRequest } from '../validators/booking.validator';
import { BookingStatus } from '@prisma/client';

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
      data: { awb_no: updatedBooking.awbNo, status: updatedBooking.status },
      errors: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    if (error.message.includes('Booking is currently being updated')) {
      //409 Conflict if the lock could not be acquired
      return res.status(409).json({ success: false, message: error.message, errors: { details: { message: error.message } } });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: 'Booking not found.', errors: { details: { message: error.message } } });
    }
    res.status(422).json({ success: false, message: 'Failed to update booking status', errors: { details: { message: error.message } } });
  }
};