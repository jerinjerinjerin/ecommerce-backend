import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "./config/db/index";
import { logger } from "./utils/logger/index";
import { config } from "./config/connections/index";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/globalerror/index";
import { rateLimitMiddleware } from "./middleware/rateLimit/index";
import { typeDefs } from "./graphql";
import { resolvers } from "./graphql/resolver";
const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: config.corsOrgin,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(rateLimitMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Api is running" });
});
app.use(notFoundHandler);
app.use(globalErrorHandler);

const port = process.env.PORT || 4001;

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  await server.start();

  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(
      `server running at http://localhost:${port}${server.graphqlPath}`,
    );
    console.log(logger.info("server running successful"));
  });
})();
