import userModel from "../models/user.model.js";
import inviteModel from "../models/invite.model.js";
import organizationModel from "../models/organization.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { generateToken } from "../utils/generateTokens.js";
import { sendResponse } from "../utils/response.js";

export const adminRegister = async (req, res) => {
  const { name, email, password, organizationName } = req.body;

  const alreadyExists = await userModel.findOne({ email });

  if (alreadyExists) {
    sendResponse(res, 409, false, "Email already exists");
    return;
  }

  const organization = await organizationModel.create({
    name: organizationName,
  });
  const organizationId = organization._id;

  const user = await userModel.create({
    name,
    email,
    password,
    organizationId: organizationId,
    role: "admin",
  });

  generateToken(user, res, "User registered successfully");
};

export const registerWithInvite = async (req, res) => {
  const { name, email, password, token } = req.body;

  const alreadyExists = await userModel.findOne({ email });

  if (alreadyExists) {
    sendResponse(res, 409, false, "Email already exists");
    return;
  }

  try {
    jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    sendResponse(res, 400, false, "Invalid invite token");
    return;
  }

  const invite = await inviteModel.findOne({ token });

  if (!invite) {
    sendResponse(res, 404, false, "Invite not found");
    return;
  }

  const user = await userModel.create({
    name,
    email,
    password,
    role: invite.role,
    organizationId: invite.organizationId,
    specialization: invite.specialization ?? null,
  });

  invite.isused = true;
  await invite.save();

  sendResponse(res, 201, true, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      organizationId: user.organizationId,
      specialization: user.specialization,
      role: user.role,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    sendResponse(res, 401, false, "Invalid credentials");
    return;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    sendResponse(res, 401, false, "Invalid credentials");
    return;
  }

  generateToken(user, res, "User logged in successfully");
};

export const getMe = async (req, res) => {
  const user = req.user;

  sendResponse(res, 200, true, "User details fetched successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    },
  });
};

export const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    // increment tokenVersion to invalidate existing tokens
    await userModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });

    // clear cookie
    res.clearCookie("token");

    sendResponse(res, 200, true, "User logged out successfully");
  } catch (err) {
    sendResponse(res, 500, false, "Failed to logout");
  }
};
