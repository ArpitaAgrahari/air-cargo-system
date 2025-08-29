import express from 'express';
import * as bookingController from '../controllers/bookingController';


const router=express.Router();

router.post("/", bookingController.createBooking);
router.post("/:refId/depart", bookingController.departBooking);
router.post("/:refId/arrive", bookingController.arriveBooking);
router.get("/:refId", bookingController.getBookingHistory);


export default router;