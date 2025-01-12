import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import helmat from "helmet";
import { connectDB } from "./config/db/index";
import { logger } from "./utils/logger/index";
import { config } from "./config/connections/index";
import { graphqlUploadExpress } from "graphql-upload-ts";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/globalerror/index";
import { rateLimitMiddleware } from "./middleware/rateLimit/index";
import { typeDefs } from "./graphql/schema/index";
import { resolvers } from "./graphql/resolver/index";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmat());
app.use(
  cors({
    origin: config.corsOrgin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(graphqlUploadExpress());
app.use(rateLimitMiddleware);

// Create ApolloServer
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req, res }) => ({ req, res }),
});

connectDB();

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  console.error("unhandledRejection at:", promise, "reson:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error.stack);
  console.error("uncaughtException at:", error);
});

process.on("uncaughtExceptionMonitor", (error) => {
  logger.error("Uncaught Exception Monitor:", error.stack);
  console.warn("Uncaught Exception Monitor:", error);
});

(async () => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(
      `Server running at http://localhost:${port}${server.graphqlPath}`,
    );
    console.log(logger.info("Server running successfully"));
  });
})();
