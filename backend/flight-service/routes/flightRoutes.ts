import { Router } from "express";
import * as flightController from '../controllers/flightController';

const router = Router();

router.post("/", flightController.createFlight);
router.get("/", flightController.getAllFlights);
router.get("/:flightNo", flightController.getFlightByNo);
router.post("/:flightNo/depart", flightController.departFlight);
router.post("/:flightNo/arrive", flightController.arriveFlight);
router.post("/:flightNo/cancel", flightController.cancelFlight);

export default router;
