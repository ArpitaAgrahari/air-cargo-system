import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';


dotenv.config();

const app = express();
const PORT=process.env.PORT || 5001;


app.use(express.json());


//error handling
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Booking-service running on port: ${PORT}`);
});
