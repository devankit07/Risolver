import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendResponse } from '../utils/response.js';
import { submitContact } from '../controllers/contact.controller.js';

const contactRouter = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 422, false, 'Validation failed', null, errors.array());
  }
  next();
};

contactRouter.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email required'),
    body('message').trim().notEmpty().isLength({ min: 10 }).withMessage('Message too short'),
    validate,
  ],
  submitContact,
);

export default contactRouter;
