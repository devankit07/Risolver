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

export const generateInviteValidation = [
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["manager", "creator", "responder"])
    .withMessage("Role must be one of: manager, creator, responder"),

  body("specialization").custom((value, { req }) => {
    if (req.body.role !== "responder") {
      return true;
    }

    if (!value || !String(value).trim()) {
      throw new Error("Specialization is required for responder role");
    }

    return true;
  }),

  validation,
];