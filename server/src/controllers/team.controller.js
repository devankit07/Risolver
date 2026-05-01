import userModel from "../models/user.model.js";
import { sendResponse } from "../utils/response.js";

export const getTeam = async (req, res) => {
  const { role, specialization } = req.query;

  const filter = {
    organizationId: req.user.organizationId,
  };
  if (role) {
    filter.role = role;
  }
  if (specialization) {
    filter.specialization = specialization;
  }

  const teams = await userModel
    .find(filter)
    .select("name email role specialization");

  const result = teams.map((member) => {
    const data = {
        name: member.name,
        email: member.email,
        role: member.role,
    }
    if (member.role === 'responder') {
        data.specialization = member.specialization;
    }
    return data;
  });

  sendResponse(res, 200, true, "Teams retrieved successfully", {
    teams: result,
  });
};

export const removeMember = async (req, res) => {
  const { userId } = req.params;

  const organizationId = req.user.organizationId;

  const user = await userModel.findOne({
    _id: userId,
    organizationId,
  });

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  if (user.role === "admin") {
    sendResponse(res, 400, false, "Cannot remove admin");
    return;
  }

  await user.deleteOne();

  sendResponse(res, 200, true, "User removed successfully");
};

export const changeRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const organizationId = req.user.organizationId;

  if (role === "admin") {
    sendResponse(res, 400, false, "Cannot change role to admin");
    return;
  }

  const user = await userModel.findOne({
    _id: userId,
    organizationId,
  });

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  if (user.role === role) {
    sendResponse(res, 400, false, `User already has ${role} role`);
    return;
  }

  if (user.role === "admin") {
    sendResponse(res, 400, false, "Cannot change role of admin");
    return;
  }

  user.role = role;
  await user.save();

  sendResponse(res, 200, true, "Role updated successfully");
};
