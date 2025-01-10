import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError/index";
import { logger } from "../../utils/logger/index";
import { config } from "../../config/connections/index";

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { statusCode, message } = err;

  logger.error(
    `Status: ${statusCode}, Message: ${message}, Stack: ${err.stack}`,
  );

  res.status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: message || "Something went wrong",
    ...(config.node_env === "development" && { stack: err.stack }),
  });
};

const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new AppError(
    `Route not found: ${req.originalUrl}`,
    StatusCodes.NOT_FOUND,
  );
  next(error);
};

export { globalErrorHandler, notFoundHandler };
