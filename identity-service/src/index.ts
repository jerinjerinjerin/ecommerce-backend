import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "./config/db/index";
import { logger } from "./utils/logger/index";
import { config } from "./config/connections/index";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/globalerror/index";
import { rateLimitMiddleware } from "./middleware/rateLimit/index";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: config.corsOrgin,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(rateLimitMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Api is running" });
});
app.use(notFoundHandler);
app.use(globalErrorHandler);

const port = process.env.PORT || 4001;

connectDB();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  logger.info(`listening on port ${port}`);
});
