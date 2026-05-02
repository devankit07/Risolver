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

export const suggestIncidentValidation = [
  body("userInput")
    .trim()
    .notEmpty()
    .withMessage("User input is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("User input must be between 10-2000 characters"),

  validation,
];

export const suggestSeverityValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3-100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10-2000 characters"),

  validation,
];
