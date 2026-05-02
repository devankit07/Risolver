import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import { sendResponse } from "../utils/response.js";

function extractBearerToken(req) {
  const header = req.headers?.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  return req.cookies?.token;
}

export const authenticateUser = async (req, res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    return sendResponse(res, 401, false, "Unauthorized. token missing");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return sendResponse(res, 401, false, "Unauthorized. user not found");
    }

    // tokenVersion check: if token's version doesn't match user's current version,
    // the token has been invalidated (e.g., user logged out)
    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return sendResponse(res, 401, false, "Unauthorized. Token revoked");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, "Unauthorized. Invalid token");
  }
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, "Unauthorized. No user info");
    }
    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403, false, "Forbidden. Insufficient permissions");
    }
    next();
  };
};
