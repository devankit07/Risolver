import inviteModel from "../models/invite.model.js";
import { generateInviteToken } from "../utils/generateInviteToken.js";
import { sendResponse } from "../utils/response.js";

export const generateInvite = async (req, res) => {
    const { role, specialization } = req.body;

    const organizationId = req.user.organizationId;

    if (role === 'responder' && !specialization) {
        sendResponse(res, 400, false, 'Specialization is required for responder role');
        return;
    }

    const token = generateInviteToken(role, organizationId, specialization);

    const invite = {
        token,
        role,
        organizationId,
    }

    if (role === 'responder') {
        invite.specialization = specialization;
    }

    await inviteModel.create(invite);
    

    sendResponse(res, 201, true, 'Invite generated successfully', { token });

};

export const getInvite = async (req, res) => {
    const { token } = req.params;
    const invite  = await inviteModel.findOne({ token }).populate('organizationId', 'name');
    if (!invite) {
        sendResponse(res, 404, false, 'Invite not found');
        return;
    }

    if (invite.isused) {
        sendResponse(res, 400, false, 'Invite already used');
        return;
    }
    const inviteData = {
        role: invite.role,
        organization: invite.organizationId.name,
        valid: !invite.isused
    };
    if (invite.role === 'responder') {
        inviteData.specialization = invite.specialization;
    }

    sendResponse(res, 200, true, 'Invite retrieved successfully', { invite: inviteData });
}