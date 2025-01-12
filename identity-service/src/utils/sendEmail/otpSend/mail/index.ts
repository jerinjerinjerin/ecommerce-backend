import nodemailer from "nodemailer";
import { config } from "../../../../config/connections";
import { logger } from "../../../logger";
import { generateOtpTemplate } from "../template";
import { AppError } from "../../../AppError";

if (!config.email_user || !config.email_pass) {
  throw new AppError("Admin email configuration is missing");
}

const transporater = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
  connectionTimeout: 10000,
});

const sendEmailOtp = async (otp: string, recipentemail: string) => {
  try {
    logger.info(`Sending email: ${otp} to ${recipentemail}`);

    const emailOtpTemplate = generateOtpTemplate(otp);

    const info = await transporater.sendMail({
      from: `"Ecommerce Services"${config.email_user}`,
      to: recipentemail,
      subject: "Ecommerce OTP Verification",
      html: emailOtpTemplate,
    });
    logger.info(`Email sent to ${info.messageId}`);
  } catch (error: unknown) {
    logger.error(`Error sending OTP email: ${error}`);
    throw new AppError(`Failed to send OTP email: ${error}`, 500);
  }
};

export { sendEmailOtp };
