import { Router } from "express";
import { getBookingHistory } from "../controllers/trackingController";

export const trackingRouter = Router();

trackingRouter.get("/:ref_id/history", getBookingHistory);
