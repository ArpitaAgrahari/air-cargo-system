import { Router } from 'express';
import v1Routes from './v1/index';
import authRoutes from './auth.route';

const router = Router();

router.use('/v1', v1Routes);
router.use('/auth', authRoutes);

export default router;