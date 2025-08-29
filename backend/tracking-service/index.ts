import express from 'express';
import { trackingRouter } from './routes/trackingRoutes';
import { errorHandler } from '../shared/middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 4003;
app.use(express.json());


// routes
app.use("/tracking", trackingRouter);

// error handler
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 Tracking Service running on port ${PORT}`);
});
