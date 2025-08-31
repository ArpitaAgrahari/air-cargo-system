import express, { Express, Request, Response, NextFunction } from "express";
import { FailedResponse } from "./src/types/api.types.ts";
import v1Routes from "./src/routes/v1/index.ts";
import cors from "cors";
import { auth } from "./src/lib/auth";
import path from "path";
import { fileURLToPath } from "url";

import { toNodeHandler } from "better-auth/node";

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.all("/api/v1/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", v1Routes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "test-auth.html"));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const response: FailedResponse = {
    success: false,
    message: "Internal Server Error",
    data: null,
    errors: { details: { message: err.message } },
  };
  console.error(err.stack);
  res.status(500).json(response);
});

export default app;
