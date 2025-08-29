import express from 'express';
import dotenv from 'dotenv';
import routes from './api/index';
import { errorHandler } from '../src/shared/middlewares/errorHandler';
import { requestLogger } from './shared/middlewares/requestLogger';

dotenv.config();

const app=express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

//log reuqest
app.use(requestLogger);

//Routes
app.use("/api",routes);


//error-handling
app.use(errorHandler);



app.listen(PORT, ()=>{
    console.log(`API running on port ${PORT}`);
});