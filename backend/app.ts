import express, { Express, Request, Response, NextFunction } from 'express';
import { FailedResponse } from './src/types/api.types.ts';
import v1Routes from './src/routes/v1/index.ts';
import authRoutes from './src/routes/auth.route.ts';
import cors from 'cors';

const app: Express = express();

app.use(express.json()); 
app.use(cors());         

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', v1Routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const response: FailedResponse = {
    success: false,
    message: 'Internal Server Error',
    data: null,
    errors: { details: { message: err.message } },
  };
  console.error(err.stack);
  res.status(500).json(response);
});

export default app;