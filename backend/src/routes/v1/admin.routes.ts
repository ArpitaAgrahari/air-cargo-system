import { Router } from 'express';
import { authenticate, authorize } from '../../auth/auth.middleware';
import { UserRole } from '@prisma/client';
import {
  getUsers,
  createUser,
  updateUser,
  getFlights,
  addFlight,
  updateFlight,
} from '../../controllers/admin.controller';

const router = Router();

router.use(authenticate, authorize([UserRole.ADMIN]));
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.get('/flights', getFlights);
router.post('/flights', addFlight);
router.put('/flights/:flightId', updateFlight);

export default router;