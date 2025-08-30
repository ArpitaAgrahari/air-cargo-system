import { Router } from 'express';
import { authenticate, authorize } from '../../auth/auth.middleware';
import { USER_ROLES } from '../../constants';
import { getBookings, getRoutes, createBooking } from '../../controllers/customer.controller';
import { getBookingHistory } from '../../controllers/booking.controller';

const router = Router();

// Public endpoint for tracking a booking
router.get('/bookings/track/:awb_no', getBookingHistory);

// Protected routes for customers
router.use(authenticate, authorize([USER_ROLES.CUSTOMER]));
router.get('/bookings', getBookings);
router.get('/routes', getRoutes);
router.post('/bookings/create', createBooking);

export default router;