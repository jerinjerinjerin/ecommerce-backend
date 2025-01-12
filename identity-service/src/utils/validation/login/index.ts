import Joi from "joi";

const loginValidationSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string:email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
});

export { loginValidationSchema };
