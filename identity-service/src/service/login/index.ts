import bcrypt from "bcrypt";
import { Response } from "express";
import { LoginInput } from "../../data";
import { logger } from "../../utils/logger";
import { AppError } from "../../utils/AppError";
import { redis } from "../../config/redis";
import { User } from "../../model";
import { sendCookie } from "../../utils/sendCookie";
import { generateOtp } from "../../helper";
import { sendEmailOtp } from "../../utils/sendEmail/otpSend/mail";

const RATE_LIMIT_TTL = 60;

export const LoginService = async (user: LoginInput, res: Response) => {
  const { email, password } = user;

  try {
    logger.info(`Starting login process for email: ${email}`);

    const cachedEmail = await redis.get(`login:email:${email}`);
    const userEmail = cachedEmail || email;

    const existingUser = await User.findOne({ where: { email: userEmail } });

    if (!existingUser) {
      logger.warn(`User email ${email} not found.`);
      throw new AppError("User email not found", 404);
    }

    if (!cachedEmail) {
      await redis.set(`login:email:${email}`, email, "EX", RATE_LIMIT_TTL);
    }

    const cachedPassword = await redis.get(`login:password:${email}`);
    const hashedPassword = cachedPassword || existingUser.password;

    if (!cachedPassword) {
      await redis.set(
        `login:password:${email}`,
        existingUser.password,
        "EX",
        RATE_LIMIT_TTL,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      logger.warn(`Invalid password for email: ${email}`);
      throw new AppError("Invalid Password", 401);
    }

    if (!existingUser.isAuthenticated) {
      const otp = generateOtp();
      await User.update(
        {
          otp,
          otpExpiredAt: new Date(Date.now() + 3 * 60 * 1000),
        },
        { where: { email } },
      );
      await sendEmailOtp(otp, existingUser.email);
      logger.info(`OTP generated for email: ${email}`);
    } else {
      logger.info(`User with email: ${email} is already authenticated.`);
    }

    const token = await sendCookie(existingUser.id.toString(), res);

    logger.info(`token: ${token}`);

    return {
      success: true,
      message: "User logged in successfully",
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        otp: existingUser.otp,
        isAuthenticated: existingUser.isAuthenticated,
      },
      token: token,
    };
  } catch (error: unknown) {
    logger.error("Error in LoginService:", error);

    await redis.del(`login:email:${email}`);
    await redis.del(`login:password:${email}`);

    throw new AppError("Internal server error in LoginService", 500);
  }
};
