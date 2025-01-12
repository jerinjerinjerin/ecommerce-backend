import bcrypt from "bcrypt";
import { SignUpInput } from "../../data";
import { User } from "../../model";
import { redis } from "../../config/redis/index";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";
import { config } from "../../config/connections";

const RATE_LIMIT_TTL = 60;

const signUpService = async (user: SignUpInput) => {
  try {
    const { username, email, password } = user;

    logger.info(`Checking if username ${username} is used...`);
    const isUsernameUsedCache = await redis.get(`signup:username:${username}`);
    if (isUsernameUsedCache) {
      logger.warn(`Username ${username} is already used (cached validation).`);
      throw new AppError("Username is already used", 400);
    }

    logger.info(`Checking if email ${email} is used...`);
    const isEmailUsedCache = await redis.get(`signup:email:${email}`);
    if (isEmailUsedCache) {
      logger.warn(`Email ${email} is already used (cached validation).`);
      throw new AppError("Email is already used", 400);
    }

    let userRole = "user";
    if (!config.email_user) {
      throw new AppError("Admin email configuration is missing", 500);
    }
    const adminRole = config.email_user;
    logger.info(`Admin role check for ${config.email_user}:${adminRole}`);
    if (adminRole) {
      userRole = "admin";
      logger.info(`Admin role set for ${config.email_user}`);
    } else {
      logger.info(`User role set for ${email}`);
    }

    logger.info(`Checking if username ${username} exists in DB...`);
    const isUsernameTaken = await User.findOne({ where: { username } });
    if (isUsernameTaken) {
      await redis.set(
        `signup:username:${username}`,
        "true",
        "EX",
        RATE_LIMIT_TTL,
      );
      logger.warn(`Username ${username} already exists.`);
      throw new AppError("Username already exists", 400);
    }

    logger.info(`Checking if email ${email} exists in DB...`);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await redis.set(`signup:email:${email}`, "true", "EX", RATE_LIMIT_TTL);
      logger.warn(`Email ${email} already exists.`);
      throw new AppError("Email already exists", 400);
    }

    let hashedPassword = await redis.get(`signup:password:hash:${email}`);
    if (!hashedPassword) {
      logger.info(`Hashing password for email ${email}...`);
      hashedPassword = await bcrypt.hash(password, 10);
      await redis.set(
        `signup:password:hash:${email}`,
        hashedPassword,
        "EX",
        RATE_LIMIT_TTL,
      );
    }

    logger.info(`Creating user with username ${username}...`);
    logger.info(`userRole ${userRole}`);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,
    });

    logger.info(`User created successfully: ${newUser.username}`);

    return {
      success: true,
      message: "User registered successfully",
      user: {
        ...newUser.get(),
      },
    };
  } catch (error: unknown) {
    logger.error("Error in signUpService: ", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Internal server error signinservice", 500);
  }
};

export { signUpService };
