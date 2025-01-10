import { Request, Response } from "express";
import { SignUpInput } from "../../data";
import { registerValidationSchema } from "../../utils/validation/register";
import { AppError } from "../../utils/AppError";
import { signUpService } from "../../service/signup";

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
        // Validate input
        const { error } = registerValidationSchema.validate(input);
        if (error) {
          const messages = error.details.map((detail) => detail.message);
          throw new AppError(messages.join(", "), 400);
        }

        // Handle profile image upload
        let profileUrl = "";
        if (req.file) {
          profileUrl = req.file.path.replace(/\\/g, "/"); // Store the file path as `profileUrl`
        } else {
          throw new AppError("Profile image is required", 400);
        }

        const newUser = await signUpService(input, profileUrl);

        if (!newUser) {
          throw new AppError("User not created, please try again later", 400);
        }

        // Return standardized response
        return {
          success: true,
          message: "User registered successfully",
          user: newUser,
        };
      } catch (error: unknown) {
        if (error instanceof AppError) {
          throw error;
        } else {
          throw new AppError("An unexpected error occurred", 500); // Handle unexpected errors
        }
      }
    },
  },
};

export { registerResolver };
