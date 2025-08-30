import { Router } from 'express';
import { authenticate, authorize } from '../../auth/auth.middleware';
import { USER_ROLES } from '../../constants';
import { getAllBookings, updateBookingStatus } from '../../controllers/staff.controller';

const router = Router();

router.use(authenticate, authorize([USER_ROLES.STAFF, USER_ROLES.ADMIN]));
router.get('/bookings', getAllBookings);
router.put('/bookings/update', updateBookingStatus);

export default router;