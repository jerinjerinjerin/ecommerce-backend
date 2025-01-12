import jwt from "jsonwebtoken";
import { Response } from "express";
import { config } from "../../config/connections/index";
import { logger } from "../logger";
import { AppError } from "../AppError";

if (!config.jwt_serect) {
  throw new Error("JWT secret (config.jwt_serect) is not defined.");
}

function sendToken(userId: string): string {
  try {
    const token = jwt.sign({ userId }, config.jwt_serect as string, {
      expiresIn: "1h",
    });
    return token;
  } catch (err: unknown) {
    throw new AppError(`Failed to generate JWT token: ${err}`, 500);
  }
}

const sendCookie = async (userId: string, res: Response): Promise<string> => {
  try {
    const signedToken = sendToken(userId);

    res.cookie("authToken", signedToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
      secure: config.node_env === "production",
      path: "/",
    });

    return signedToken;
  } catch (err: unknown) {
    logger.error(`send cookie error ${err}`);
    throw new AppError(`Failed to send authentication cookie: ${err}`, 500);
  }
};

export { sendCookie };
