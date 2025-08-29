import express from 'express';
import * as bookingController from '../controllers/bookingController';


const router=express.Router();

router.post("/", bookingController.createBooking);


export default router;