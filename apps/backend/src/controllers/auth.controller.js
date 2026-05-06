import userModel from "../models/user.model.js";
import inviteModel from "../models/invite.model.js";
import organizationModel from "../models/organization.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { generateToken } from "../utils/generateTokens.js";
import { sendResponse } from "../utils/response.js";

export const adminRegister = async (req, res) => {
  const { name, email, password, organizationName, jobTitle } = req.body;

  const alreadyExists = await userModel.findOne({ email });
  if (alreadyExists) {
    sendResponse(res, 409, false, "An account with this email already exists");
    return;
  }

  const organization = await organizationModel.create({ name: organizationName });

  const user = await userModel.create({
    name,
    email,
    password,
    organizationId: organization._id,
    role: "admin",
    jobTitle: jobTitle || null,
  });

  /* pass org name so the frontend gets it in the first response */
  generateToken(user, res, "Account created successfully", organization.name);
};

export const registerWithInvite = async (req, res) => {
  const { name, email, password, token } = req.body;

  const alreadyExists = await userModel.findOne({ email });
  if (alreadyExists) {
    sendResponse(res, 409, false, "An account with this email already exists");
    return;
  }

  try {
    jwt.verify(token, config.JWT_SECRET);
  } catch {
    sendResponse(res, 400, false, "Invalid or expired invite link");
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

  const org = await organizationModel.findById(invite.organizationId).lean();

  invite.isused = true;
  await invite.save();

  generateToken(user, res, "Account created successfully", org?.name ?? null);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).populate("organizationId");
  if (!user) {
    sendResponse(res, 401, false, "Invalid email or password");
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    sendResponse(res, 401, false, "Invalid email or password");
    return;
  }

  generateToken(user, res, "Logged in successfully", user.organizationId?.name ?? null);
};

export const getMe = async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("organizationId");
  if (!user) {
    return sendResponse(res, 404, false, "User not found");
  }

  sendResponse(res, 200, true, "User fetched successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      organizationId: user.organizationId?._id,
      organizationName: user.organizationId?.name ?? null,
      role: user.role,
      jobTitle: user.jobTitle ?? null,
    },
  });
};


export const logout = async (req, res) => {
  await userModel.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
  res.clearCookie("token");
  sendResponse(res, 200, true, "Logged out successfully");
};
