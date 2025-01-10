import { Sequelize } from "sequelize";
import { config } from "../connections/index";

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  dialect: "postgres",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export { connectDB, sequelize };
