import { Router } from 'express';
import { authenticate, authorize } from '../../auth/auth.middleware';
import { USER_ROLES } from '../../constants';
import {
  getUsers,
  createUser,
  updateUser,
  getFlights,
  addFlight,
  updateFlight,
} from '../../controllers/admin.controller';

const router = Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]));
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.get('/flights', getFlights);
router.post('/flights', addFlight);
router.put('/flights/:flightId', updateFlight);

export default router;