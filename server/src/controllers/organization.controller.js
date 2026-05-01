import organizationModel from "../models/organization.model.js";
import { sendResponse } from "../utils/response.js";

export const getOrganizationSpecializations = async (req, res) => {
  const organizationId = req.user.organizationId;

  const organization = await organizationModel.findById(organizationId);

  if (!organization) {
    sendResponse(res, 404, false, "Organization not found");
    return;
  }

  sendResponse(res, 200, true, "Specializations retrieved successfully", {
    specializations: organization.specializations || [],
  });
};

export const addSpecialization = async (req, res) => {
  const { specialization } = req.body;
  const organizationId = req.user.organizationId;

  const organization = await organizationModel.findById(organizationId);

  if (!organization) {
    sendResponse(res, 404, false, "Organization not found");
    return;
  }

  if (organization.specializations.includes(specialization)) {
    sendResponse(res, 400, false, "Specialization already exists");
    return;
  }

  organization.specializations.push(specialization);
  await organization.save();

  sendResponse(res, 201, true, "Specialization added successfully", {
    specializations: organization.specializations,
  });
};

export const deleteSpecialization = async (req, res) => {
  const { specialization } = req.body;
  const organizationId = req.user.organizationId;

  const organization = await organizationModel.findById(organizationId);

  if (!organization) {
    sendResponse(res, 404, false, "Organization not found");
    return;
  }

  if (!organization.specializations.includes(specialization)) {
    sendResponse(res, 404, false, "Specialization not found");
    return;
  }

  organization.specializations = organization.specializations.filter(spec => spec !== specialization);
  await organization.save();

  sendResponse(res, 200, true, "Specialization deleted successfully", {
    specializations: organization.specializations,
  });
};


