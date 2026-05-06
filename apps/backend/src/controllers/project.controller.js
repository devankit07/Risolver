import projectModel from '../models/project.model.js';

const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, deadline } = req.body;
    const organizationId = req.user.organizationId;

    if (!name) return sendResponse(res, 400, false, 'Project name is required');

    const project = await projectModel.create({
      name,
      description,
      startDate,
      deadline,
      organizationId,
      createdBy: req.user._id
    });

    sendResponse(res, 201, true, 'Project created successfully', project);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

export const getProjects = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const projects = await projectModel.find({ organizationId }).sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Projects fetched successfully', projects);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) return sendResponse(res, 404, false, 'Project not found');
    sendResponse(res, 200, true, 'Project updated successfully', project);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.findByIdAndDelete(id);
    if (!project) return sendResponse(res, 404, false, 'Project not found');
    sendResponse(res, 200, true, 'Project deleted successfully');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
