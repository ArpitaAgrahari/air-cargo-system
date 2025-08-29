import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware'; 

const router = express.Router();


//booking-service proxy
router.use(
    "/bookings",
    createProxyMiddleware({
        target : process.env.BOOKING_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {"^/api/bookings":""}
    })
);

//flight-service proxy
router.use(
    "/flights",
    createProxyMiddleware({
        target: process.env.FLIGHT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite : {"^/api/flights":""}
    })
);

//tracking-service proxy
router.use(
    "/trackings",
    createProxyMiddleware({
        target: process.env.TRACKING_SERVICE_URL,
        changeOrigin: true,
        pathRewrite : {"^/api/tracking":""}
    })
);


export default router;