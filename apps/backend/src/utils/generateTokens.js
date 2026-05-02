import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { sendResponse } from "./response.js";

export const generateToken = (user, res, message) => {
  const payload = {
    id: user._id,
    tokenVersion: user.tokenVersion ?? 0,
  };

  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, 200, true, message, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      tokenVersion: user.tokenVersion ?? 0,
    },
  });
};
