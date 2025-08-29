import { Router } from 'express';
import customerRoutes from './customer.routes';
import staffRoutes from './staff.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/customer', customerRoutes);
router.use('/staff', staffRoutes);
router.use('/admin', adminRoutes);

export default router;