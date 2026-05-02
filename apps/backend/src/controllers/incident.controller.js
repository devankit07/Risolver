import incidentModel from "../models/incident.model.js";
import incidentUpdateModel from "../models/incidentUpdate.model.js";
import userModel from "../models/user.model.js";
import { sendResponse } from "../utils/response.js";
import { generatePostmortem } from "../services/groq.service.js";
import postMortemModel from "../models/postMortem.model.js";

export const createIncident = async (req, res) => {
  const { title, description, severity, affectedService } = req.body;
  const organizationId = req.user.organizationId;
  const createdBy = req.user._id;

  const incident = await incidentModel.create({
    title,
    description,
    severity,
    affectedService,
    organizationId,
    createdBy,
  });

  await incidentUpdateModel.create({
    incidentId: incident._id,
    organizationId,
    status: "open",
    postedBy: req.user.role,
    message: "Incident created by " + req.user.name,
  });

  sendResponse(res, 201, true, "Incident created successfully", {
    incident: {
      id: incident._id,
      title: incident.title,
      organizationId: incident.organizationId,
      createdBy: incident.createdBy,
      createdAt: incident.createdAt,
      status: incident.status,
    },
  });
};

export const getAllIncidents = async (req, res) => {
  const organizationId = req.user.organizationId;

  const incidents = await incidentModel
    .find({ organizationId })
    .sort({ createdAt: -1 });

  sendResponse(res, 200, true, "Incidents retrieved successfully", {
    incidents,
  });
};

export const getMyIncidents = async (req, res) => {
  const userId = req.user._id;

  const incidents = await incidentModel
    .find({ createdBy: userId })
    .sort({ createdAt: -1 });

  sendResponse(res, 200, true, "Incidents retrieved successfully", {
    incidents,
  });
};

export const getIncidentById = async (req, res) => {
  const { incidentId } = req.params;
  const organizationId = req.user.organizationId;

  const incident = await incidentModel.findOne({
    _id: incidentId,
    organizationId,
  });

  if (!incident) {
    sendResponse(res, 404, false, "Incident not found");
    return;
  }

  sendResponse(res, 200, true, "Incident retrieved successfully", {
    incident,
  });
};

export const assignIncident = async (req, res) => {
  const { incidentId } = req.params;
  const { userId } = req.body;
  const organizationId = req.user.organizationId;

  const user = await userModel.findOne({ _id: userId, organizationId });

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  if (user.role !== "responder") {
    sendResponse(res, 400, false, "User is not a responder");
    return;
  }

  const incident = await incidentModel.findOne({
    _id: incidentId,
    organizationId,
  });

  if (!incident) {
    sendResponse(res, 404, false, "Incident not found");
    return;
  }

  if (incident.assignedTo) {
    sendResponse(res, 400, false, "Incident already assigned");
    return;
  }

  incident.status = "assigned";
  incident.assignedTo = userId;
  incident.assignedAt = new Date();
  await incident.save();

  await incidentUpdateModel.create({
    incidentId: incident._id,
    organizationId,
    postedBy: req.user.role,
    message: `Incident assigned to ${user.name}`,
    status: "assigned",
  });

  sendResponse(res, 200, true, "Incident assigned successfully");
};

export const updateIncident = async (req, res) => {
  const { incidentId } = req.params;
  const { status, message } = req.body;
  const organizationId = req.user.organizationId;

  const incident = await incidentModel.findOne({
    _id: incidentId,
    organizationId,
  });

  if (!incident) {
    sendResponse(res, 404, false, "Incident not found");
    return;
  }

  await incidentUpdateModel.create({
    incidentId: incident._id,
    organizationId,
    postedBy: req.user.role,
    message,
    status: status,
  });

  if (status === "resolved") {
    incident.resolvedAt = new Date();
    incident.resolvedBy = req.user._id;

    const postmortem = await generatePostmortem(incidentId);
    await postMortemModel.create({
      incidentId: incident._id,
      organizationId,
      summary: postmortem.summary,
      rootCause: postmortem.rootCause,
      whatWorked: postmortem.whatWorked,
      recommendations: postmortem.recommendations,
    });
  }

  incident.status = status;
  await incident.save();

  sendResponse(res, 200, true, "Incident status updated successfully");
};
