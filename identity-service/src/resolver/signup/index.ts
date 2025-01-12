import { Request, Response } from "express";
import { SignUpInput } from "../../data";
import { registerValidationSchema } from "../../utils/validation/register";
import { AppError } from "../../utils/AppError";
import { signUpService } from "../../service/signup";
import { logger } from "../../utils/logger";

const registerResolver = {
  Query: {},
  Mutation: {
    registerUser: async (
      _: unknown,
      args: { input: SignUpInput },
      context: { req: Request; res: Response },
    ) => {
      const { input } = args;
      const { req } = context;

      try {
        logger.info("Validating user input...");
        const { error } = registerValidationSchema.validate(input);
        if (error) {
          const messages = error.details.map((detail) => detail.message);
          logger.warn(`Input validation failed: ${messages.join(", ")}`);
          throw new AppError(messages.join(", "), 400);
        }

        logger.info("Attempting to create a new user...");
        const newUser = await signUpService(input);

        const userWithoutPassword = { ...newUser.user };
        delete userWithoutPassword.password;

        logger.info("User created successfully: ", newUser);
        console.log("new usr response", newUser, newUser.user, newUser.user.id);
        return userWithoutPassword;
      } catch (error: unknown) {
        logger.error("Error in registerUser resolver: ", error);
        if (error instanceof AppError) {
          throw error;
        } else {
          throw new AppError("An unexpected error occurred", 500);
        }
      }
    },
  },
};

export { registerResolver };
