import { Dialect } from "sequelize";
import { config } from "../connections/index.js";
const configr = {
  development: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: "postgres" as Dialect,
    logging: false,
  },
  test: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: "postgres" as Dialect,
    logging: false,
  },
  production: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: "postgres" as Dialect,
    logging: false,
  },
};

export { configr };
