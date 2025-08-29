import { Router } from 'express';
import { authenticate, authorize } from '../../auth/auth.middleware';
import { UserRole } from '@prisma/client';
import { getAllBookings, updateBookingStatus } from '../../controllers/staff.controller';

const router = Router();

router.use(authenticate, authorize([UserRole.STAFF, UserRole.ADMIN]));
router.get('/bookings', getAllBookings);
router.put('/bookings/update', updateBookingStatus);

export default router;