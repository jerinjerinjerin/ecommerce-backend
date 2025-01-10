import { Request, Response, NextFunction } from "express";
import { apiRateLimiter } from "../../config/ratelimit/index";

const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  apiRateLimiter(req, res, next);
};

export { rateLimitMiddleware };
