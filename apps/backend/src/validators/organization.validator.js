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

export const addSpecializationValidation = [
  body("specialization")
    .trim()
    .notEmpty()
    .withMessage("Specialization is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Specialization must be 2-50 characters")
    .matches(/^[a-zA-Z0-9\s\-_+]+$/)
    .withMessage("Specialization can only contain letters, numbers, spaces, hyphens, underscores, and plus signs"),

  validation,
];
