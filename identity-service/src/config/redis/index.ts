import { Redis } from "ioredis";

import dotenv from "dotenv";
import { logger } from "../../utils/logger";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASS || undefined,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
  logger.info("redis server connect");
});

redis.on("error", (err: Error) => {
  console.error("Error connecting to Redis:", err.message);
  logger.error("faild to connect redis server");
});

export { redis };
