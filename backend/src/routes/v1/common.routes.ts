import { Router } from "express";
import { authenticate, authorize } from "../../auth/auth.middleware";
import { USER_ROLES } from "../../constants";
import { getAllBookings } from "../../controllers/common.controller";

const router = Router();

router.use(
  authenticate,
  authorize([USER_ROLES.CUSTOMER, USER_ROLES.STAFF, USER_ROLES.ADMIN])
);
router.get("/bookings", getAllBookings);

export default router;
