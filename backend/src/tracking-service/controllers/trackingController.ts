import { Request, Response } from "express";
import * as trackingService from '../services/trackingService';

//getHistory Controller
export const getBookingHistory = async (req: Request, res: Response) => {
  try {
    const { ref_id } = req.params;
    const history = await trackingService.getBookingHistory(ref_id);
    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
