import Joi from "joi";

const registerValidationSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 30 characters",
    "string.required": "Username is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),

  isAuthenticated: Joi.boolean().default(false),

  otp: Joi.string().optional(),

  otpExpiredAt: Joi.date().optional(),

  profileUrl: Joi.string()
    .uri()
    .optional()
    .default(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJr-fGkiy1DE5A0JNOkcmCNGcXuQXdzENZA&s",
    ),
});

export { registerValidationSchema };
