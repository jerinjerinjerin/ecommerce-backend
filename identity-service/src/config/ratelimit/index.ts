import rateLimit from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";
import { redis } from "../redis/index";

const apiRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (
      ...args: [string, ...Array<string | number | Buffer>]
    ): Promise<RedisReply> => {
      const command = args[0] as string;
      const redisArgs = args.slice(1);

      return redis.call(command, ...redisArgs) as Promise<RedisReply>;
    },
  }),

  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

export { apiRateLimiter };
