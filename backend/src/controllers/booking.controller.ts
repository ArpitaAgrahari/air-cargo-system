
import { Request, Response } from 'express';
import { ApiResponse } from '../types/api.types';
import * as bookingService from '../services/booking.service';

/**
 * Public endpoint to track a booking by its AWB number.
 * No authentication needed.
 */
export const getBookingHistory = async (req: Request, res: Response) => {
  try {
    const { awb_no } = req.params;
    if (!awb_no) {
      return res.status(422).json({ success: false, message: 'Missing AWB number.', errors: { details: { message: 'AWB number is required.' } } });
    }

    const bookingHistory = await bookingService.getBookingHistory(awb_no);

    if (!bookingHistory) {
      return res.status(404).json({ success: false, message: 'Booking not found.', errors: { details: { message: `Booking with AWB ${awb_no} not found.` } } });
    }

    const response: ApiResponse<any> = {
      success: true,
      message: 'Booking history fetched successfully.',
      data: bookingHistory,
      errors: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking history', errors: { details: { message: error.message } } });
  }
};
