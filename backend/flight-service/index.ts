import express from "express";
import flightRoutes from "./routes/flightRoutes";
import { errorHandler } from "../shared/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(errorHandler);


//routes
app.use("/flights", flightRoutes);


app.listen(PORT, () => {
  console.log(`Flight Service running on port ${PORT}`);
});
