import { registerValidationSchema } from "../../utils/validation/register";
import { describe, it, expect } from "@jest/globals";

describe("registerValidationSchema", () => {
  it("should validate a valid user", () => {
    const validUser = {
      username: "validUser",
      email: "valid@example.com",
      password: "validPassword123",
    };

    const { error } = registerValidationSchema.validate(validUser);
    expect(error).toBeUndefined();
  });

  it("should return an error for a short username", () => {
    const invalidUser = {
      username: "ab",
      email: "valid@example.com",
      password: "validPassword123",
    };

    const { error } = registerValidationSchema.validate(invalidUser);
    expect(error?.details[0].message).toBe(
      "Username must be at least 3 characters long",
    );
  });

  it("should return an error for a long username", () => {
    const invalidUser = {
      username: "a".repeat(31),
      email: "valid@example.com",
      password: "validPassword123",
    };

    const { error } = registerValidationSchema.validate(invalidUser);
    expect(error?.details[0].message).toBe(
      "Username must not exceed 30 characters",
    );
  });

  it("should return an error for an invalid email", () => {
    const invalidUser = {
      username: "validUser",
      email: "invalidEmail",
      password: "validPassword123",
    };

    const { error } = registerValidationSchema.validate(invalidUser);
    expect(error?.details[0].message).toBe(
      "Email must be a valid email address",
    );
  });

  it("should return an error for a short password", () => {
    const invalidUser = {
      username: "validUser",
      email: "valid@example.com",
      password: "short",
    };

    const { error } = registerValidationSchema.validate(invalidUser);
    expect(error?.details[0].message).toBe(
      "Password must be at least 8 characters long",
    );
  });

  it("should set default values for optional fields", () => {
    const validUser = {
      username: "validUser",
      email: "valid@example.com",
      password: "validPassword123",
    };

    const { value } = registerValidationSchema.validate(validUser);
    expect(value.isAuthenticated).toBe(false);
    expect(value.profileUrl).toBe(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJr-fGkiy1DE5A0JNOkcmCNGcXuQXdzENZA&s",
    );
  });
});
