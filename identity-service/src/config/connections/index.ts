import dotenv from "dotenv";

dotenv.config();

const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  jwt_serect: process.env.JWT_SCRECT || 12345,
  corsOrgin: process.env.CORS_ORIGIN || "http://localhost:5173",
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  node_env: process.env.NODE_ENV,
};

export { config };
