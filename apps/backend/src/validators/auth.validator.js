import { body, validationResult } from "express-validator";
import { sendResponse } from "../utils/response.js";

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors
      .array()
      .map((err) =>
        extractedErrors.push({ field: err.path, message: err.msg }),
      );
    return sendResponse(
      res,
      422,
      false,
      "Validation failed",
      null,
      extractedErrors,
    );
  }

  next();
};

export const adminRegisterValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be 2-60 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 120 })
    .withMessage("Email too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be at least 8 characters"),

  body("organizationName")
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Organization name must be 2-80 characters"),

  validation,
];

export const inviteRegisterValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be 2-60 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be at least 8 characters"),

  validation,
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validation,
];



