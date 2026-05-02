import { body, param, validationResult } from "express-validator";
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

export const createIncidentValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3-100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be 10-2000 characters"),

  body("severity")
    .notEmpty()
    .withMessage("Severity is required")
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Severity must be one of: low, medium, high, critical"),

  body("affectedService")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Affected service too long"),

  validation,
];

export const assignIncidentValidation = [
  param("incidentId")
    .notEmpty()
    .withMessage("Incident id is required")
    .isMongoId()
    .withMessage("Invalid incident id"),

  body("userId")
    .notEmpty()
    .withMessage("Assignee user id is required")
    .isMongoId()
    .withMessage("Invalid user id"),

  validation,
];

export const incidentUpdateValidation = [
  param('incidentId')
    .notEmpty()
    .withMessage('Incident id is required')
    .isMongoId()
    .withMessage('Invalid incident id'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['open', 'in_progress', 'assigned', 'resolved'])
    .withMessage('Status must be one of: open, assigned, in_progress , resolved,'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be 1-2000 characters'),

  validation,
];

export const getIncidentByIdValidation = [
  param("incidentId")
    .notEmpty()
    .withMessage("Incident id is required")
    .isMongoId()
    .withMessage("Invalid incident id"),

  validation,
];
