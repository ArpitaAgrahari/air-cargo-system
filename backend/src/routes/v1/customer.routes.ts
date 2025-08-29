import { Router } from 'express';
import { authenticate, authorize } from '../../auth/auth.middleware';
import { UserRole } from '@prisma/client';
import { getBookings, getRoutes, createBooking } from '../../controllers/customer.controller';
import { getBookingHistory } from '../../controllers/booking.controller';

const router = Router();

// Public endpoint for tracking a booking
router.get('/bookings/track/:awb_no', getBookingHistory);

// Protected routes for customers
router.use(authenticate, authorize([UserRole.CUSTOMER]));
router.get('/bookings', getBookings);
router.get('/routes', getRoutes);
router.post('/bookings/create', createBooking);

export default router;