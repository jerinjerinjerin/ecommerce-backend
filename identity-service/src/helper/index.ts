import { randomBytes } from "crypto";

function generateOtp() {
  const otp = randomBytes(3).toString("hex");
  return parseInt(otp, 16).toString().slice(0, 6);
}

export { generateOtp };
