import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

dotenv.config();

const app=express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

//log requests
app.use(requestLogger);

//Routes
app.use("/api",routes);


//error-handling
app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`API running on port ${PORT}`);
});