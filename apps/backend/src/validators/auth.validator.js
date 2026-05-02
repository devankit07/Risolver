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
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be 3-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name should only contain letters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be 8-30 characters")
    .matches(/[a-z]/)
    .withMessage("Must contain lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Must contain uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain a number")
    .matches(/[@$!%*?&]/)
    .withMessage("Must contain a special character"),

  body("organizationName")
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Organization name must be 3-50 characters")
    .matches(/^[a-zA-Z0-9\s&.,'-]+$/)
    .withMessage("Organization name contains invalid characters"),

  validation,
];

export const inviteRegisterValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be 3-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name should only contain letters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be 8-30 characters")
    .matches(/[a-z]/)
    .withMessage("Must contain lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Must contain uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain a number")
    .matches(/[@$!%*?&]/)
    .withMessage("Must contain a special character"),

    validation
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

    validation
];



