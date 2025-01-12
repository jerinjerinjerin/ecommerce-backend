import { Request, Response } from "express";
import { LoginInput } from "../../data";
import { loginValidationSchema } from "../../utils/validation/login";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";
import { LoginService } from "../../service/login";

const loginResolver = {
  Query: {},
  Mutation: {
    login: async (
      _: unknown,
      args: { input: LoginInput },
      context: { req: Request; res: Response },
    ) => {
      const { input } = args;
      const { res } = context;

      try {
        const { error } = loginValidationSchema.validate(input);
        if (error) {
          const messages = error.details.map((detail) => detail.message);
          logger.warn(`Input validation failed ${messages.join(", ")}`);
          throw new AppError(
            "Validation failed. Please check your input.",
            400,
          );
        }

        const loginUser = await LoginService(input, res);
        if (!loginUser) {
          throw new AppError("Invalid credentials", 401);
        }

        return loginUser;
      } catch (error: unknown) {
        logger.error("Error in loginResolver: ", error);
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError("Internal server error in loginResolver", 500);
      }
    },
  },
};

export { loginResolver };
