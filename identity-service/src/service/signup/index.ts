import bcrypt from "bcrypt";
import { SignUpInput } from "../../data";
import { User } from "../../model";
import { redis } from "../../config/redis/index";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";

const RATE_LIMIT_TTL = 60;

const signUpService = async (user: SignUpInput, profileUrl: string) => {
  try {
    const { username, email, password } = user;

    const isUsedNameCatched = await redis.get(`signup:username:${username}`);
    if (isUsedNameCatched) {
      throw new AppError("username is already used (cashed validation)", 400);
    }

    const isAlreadyUserCached = await redis.get(`signup:email:${email}`);
    if (isAlreadyUserCached) {
      throw new AppError("email is already used (cashed validation)", 400);
    }

    const isUseName = await User.findOne({
      where: {
        username: user.username,
      },
    });

    if (isUseName) {
      await redis.set(
        `signup:username:${user.username}`,
        "true",
        "EX",
        RATE_LIMIT_TTL,
      );
      logger.warn(`username is already exsited ${user.username}`);
      throw new AppError("username is already exsited", 400);
    }

    const alreadyUser = await User.findOne({
      where: { email: user.email },
    });

    if (alreadyUser) {
      await redis.set(`signup:email:${email}`, "true", "EX", RATE_LIMIT_TTL);
      logger.warn(`email is already exsited ${user.email}`);
      throw new AppError("email is already exsited", 400);
    }

    let hashPassword = await redis.get(`signup:password:hash:${email}`);
    if (!hashPassword) {
      // If not cached, hash the password and cache it
      hashPassword = await bcrypt.hash(password, 10);
      await redis.set(
        `signup:password:hash:${email}`,
        hashPassword,
        "EX",
        RATE_LIMIT_TTL,
      );
    }

    const newUser = await User.create({
      username: user.username,
      profileUrl: profileUrl,
      email: user.email,
      password: hashPassword,
    });
    const { password: _, ...safeUser } = newUser.toJSON();
    return safeUser;
  } catch (error: unknown) {
    throw new AppError(String(error), 500);
  }
};

export { signUpService };
