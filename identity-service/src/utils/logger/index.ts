import { createLogger, format, transports, addColors } from "winston";

const { combine, timestamp, printf, errors, colorize } = format;

addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  success: "green",
});

const customFormatter = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 3,
  },
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    customFormatter,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

export { logger };
