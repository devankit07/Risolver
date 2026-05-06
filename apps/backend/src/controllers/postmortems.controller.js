import postMortemModel from '../models/postMortem.model.js'
import incidentModel from '../models/incident.model.js'
import notificationModel from '../models/notification.model.js'
import { sendResponse } from '../utils/response.js'
import { generatePostmortem } from '../services/groq.service.js'
import userModel from '../models/user.model.js'

const MEMBER_ROLES = ['creator', 'responder', 'engineer', 'devops', 'tester']
const ADMIN_ROLES = ['admin', 'manager']

function isMemberRole(role) {
  return MEMBER_ROLES.includes(role)
}

// GET /api/postmortems
export const listPostmortems = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const userId = req.user._id
    const role = req.user.role
    const { status, service, search, page = 1, limit = 10 } = req.query

    const filter = {
      $or: [{ organization: orgId }, { organizationId: orgId }],
    }

    if (status) filter.status = status
    if (service) filter.service = { $regex: service, $options: 'i' }
    if (search) filter.title = { $regex: search, $options: 'i' }

    if (isMemberRole(role)) {
      filter.$and = [
        { $or: filter.$or },
        {
          $or: [
            { resolvedBy: userId },
            { assignedTo: userId },
            { status: 'published' },
          ],
        },
      ]
      delete filter.$or
    }

    const pageNum = Math.max(1, parseInt(page, 10))
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)))
    const skip = (pageNum - 1) * pageSize

    const [postmortems, total] = await Promise.all([
      postMortemModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('incident', 'incidentId title service affectedService severity')
        .populate('incidentId', 'incidentId title service affectedService severity')
        .populate('assignedTo', 'name')
        .populate('resolvedBy', 'name')
        .populate('approvedBy', 'name'),
      postMortemModel.countDocuments(filter),
    ])

    const baseFilter = { $or: [{ organization: orgId }, { organizationId: orgId }] }
    const [publishedCount, pendingCount, allResolved] = await Promise.all([
      postMortemModel.countDocuments({ ...baseFilter, status: 'published' }),
      postMortemModel.countDocuments({ ...baseFilter, status: 'pending_approval' }),
      postMortemModel
        .find({ ...baseFilter, status: 'published' })
        .populate('incident', 'createdAt resolvedAt')
        .populate('incidentId', 'createdAt resolvedAt')
        .select('duration')
        .limit(200),
    ])

    let avgResolutionTime = '—'
    const withDuration = allResolved.filter((p) => {
      const inc = p.incident || p.incidentId
      return inc?.resolvedAt && inc?.createdAt
    })
    if (withDuration.length > 0) {
      const avgMin =
        withDuration.reduce((sum, p) => {
          const inc = p.incident || p.incidentId
          return sum + (new Date(inc.resolvedAt) - new Date(inc.createdAt)) / 60000
        }, 0) / withDuration.length
      avgResolutionTime =
        avgMin < 60 ? `${Math.round(avgMin)}m` : `${Math.round(avgMin / 60)}h ${Math.round(avgMin % 60)}m`
    }

    sendResponse(res, 200, true, 'Postmortems fetched', {
      postmortems: postmortems.map(normalizePostmortem),
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      stats: {
        total: await postMortemModel.countDocuments(baseFilter),
        published: publishedCount,
        pendingApproval: pendingCount,
        avgResolutionTime,
      },
    })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// GET /api/postmortems/public  (no auth)
export const listPublicPostmortems = async (req, res) => {
  try {
    const [postmortems, total] = await Promise.all([
      postMortemModel
        .find({ status: 'published' })
        .sort({ approvedAt: -1 })
        .populate('incident', 'incidentId title service affectedService severity')
        .populate('incidentId', 'incidentId title service affectedService severity')
        .populate('resolvedBy', 'name')
        .populate('approvedBy', 'name'),
      postMortemModel.countDocuments({ status: 'published' }),
    ])

    sendResponse(res, 200, true, 'Public postmortems fetched', {
      postmortems: postmortems.map(normalizePostmortem),
      total,
    })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// GET /api/postmortems/pending
export const getPendingApprovals = async (req, res) => {
  try {
    const orgId = req.user.organizationId

    const postmortems = await postMortemModel
      .find({
        $or: [{ organization: orgId }, { organizationId: orgId }],
        status: 'pending_approval',
      })
      .sort({ createdAt: -1 })
      .populate('incident', 'incidentId title service affectedService severity')
      .populate('incidentId', 'incidentId title service affectedService severity')
      .populate('resolvedBy', 'name')

    sendResponse(res, 200, true, 'Pending approvals fetched', {
      postmortems: postmortems.map(normalizePostmortem),
    })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// GET /api/postmortems/:id
export const getPostmortemById = async (req, res) => {
  try {
    const orgId = req.user.organizationId

    const postmortem = await postMortemModel
      .findOne({
        _id: req.params.id,
        $or: [{ organization: orgId }, { organizationId: orgId }],
      })
      .populate('incident', 'incidentId title service affectedService severity createdAt resolvedAt timeline')
      .populate('incidentId', 'incidentId title service affectedService severity createdAt resolvedAt timeline')

      .populate('assignedTo', 'name')
      .populate('resolvedBy', 'name')
      .populate('approvedBy', 'name')

    if (!postmortem) return sendResponse(res, 404, false, 'Postmortem not found')
    sendResponse(res, 200, true, 'Postmortem fetched', { postmortem: normalizePostmortem(postmortem) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// GET /api/postmortems/:id/public  (no auth)
export const getPublicPostmortemById = async (req, res) => {
  try {
    const postmortem = await postMortemModel
      .findOne({ _id: req.params.id, status: 'published' })
      .populate('incident', 'incidentId title service affectedService severity createdAt resolvedAt')
      .populate('incidentId', 'incidentId title service affectedService severity createdAt resolvedAt')
      .populate('resolvedBy', 'name')
      .populate('approvedBy', 'name')

    if (!postmortem) return sendResponse(res, 404, false, 'Report not found or not published')
    sendResponse(res, 200, true, 'Public postmortem fetched', { postmortem: normalizePostmortem(postmortem) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}


export const createPostmortem = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const { incidentId, approach, isAiGenerated } = req.body

    const incident = await incidentModel.findOne({ _id: incidentId, organizationId: orgId }).populate('timeline.author', 'name')
    if (!incident) return sendResponse(res, 404, false, 'Incident not found')

    let postmortemData = {}

    if (isAiGenerated) {
      // Generate using GROQ
      postmortemData = await generatePostmortem(incident, incident.timeline, req.user)
    } else {
      // Manual submission
      postmortemData = {
        summary: incident.description,
        rootCause: 'Under investigation',
        whatWorked: approach || 'No approach provided',
        whatDidntWork: 'N/A',
        recommendations: 'N/A',
        impact: `Service: ${incident.service}`,
      }
    }

    const postmortem = await postMortemModel.create({
      ...postmortemData,
      incident: incidentId,
      incidentId: incidentId,
      organization: orgId,
      organizationId: orgId,
      title: `Postmortem: ${incident.title}`,
      status: 'pending_approval',
      resolvedBy: req.user._id,
      generatedBy: isAiGenerated ? 'ai' : 'manual',
    })

    // Notify Admins/Managers
    const managers = await userModel.find({ organizationId: orgId, role: { $in: ['admin', 'manager'] } })
    const notificationPromises = managers.map(m => notificationModel.create({
      userId: m._id,
      organizationId: orgId,
      type: 'report_pending',
      title: 'New report pending approval',
      body: `${req.user.name} submitted a report for: ${incident.title}`,
      incidentId: incidentId,
    }))
    const notifications = await Promise.all(notificationPromises)

    const io = req.app.get('io')
    if (io) {
      notifications.forEach(n => {
        io.to(`user:${String(n.userId)}`).emit('notification:new', n)
      })
    }

    // Mark incident as resolved if not already
    if (incident.status !== 'resolved') {
      incident.status = 'resolved'
      incident.resolvedAt = new Date()
      incident.resolvedBy = req.user._id
      await incident.save()
    }

    sendResponse(res, 201, true, 'Postmortem created and pending approval', { postmortem })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}


export const approvePostmortem = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const { action, feedback } = req.body

    if (!['approve', 'request_changes'].includes(action)) {
      return sendResponse(res, 400, false, 'action must be approve or request_changes')
    }

    const postmortem = await postMortemModel
      .findOne({
        _id: req.params.id,
        $or: [{ organization: orgId }, { organizationId: orgId }],
      })
      .populate('incident', 'incidentId title')
      .populate('incidentId', 'incidentId title')

    if (!postmortem) return sendResponse(res, 404, false, 'Postmortem not found')

    if (action === 'approve') {
      postmortem.status = 'published'
      postmortem.approvedBy = req.user._id
      postmortem.approvedAt = new Date()
      await postmortem.save()

      const incRef = postmortem.incident || postmortem.incidentId
      if (postmortem.resolvedBy) {
        const notification = await notificationModel.create({
          userId: postmortem.resolvedBy,
          organizationId: orgId,
          type: 'report_approved',
          title: 'Your report has been published',
          body: `Report for ${incRef?.title || 'incident'} is now public`,
          incidentId: incRef?._id || null,
        })
        const io = req.app.get('io')
        if (io) {
          io.to(`user:${String(postmortem.resolvedBy)}`).emit('notification:new', notification)
          io.to(String(orgId)).emit('postmortem:published', normalizePostmortem(postmortem))
        }
      }
    } else {
      postmortem.status = 'draft'
      await postmortem.save()

      const incRef = postmortem.incident || postmortem.incidentId
      if (postmortem.resolvedBy) {
        const notification = await notificationModel.create({
          userId: postmortem.resolvedBy,
          organizationId: orgId,
          type: 'report_changes_requested',
          title: 'Report needs changes',
          body: feedback || 'Manager requested changes to your report',
          incidentId: incRef?._id || null,
        })
        const io = req.app.get('io')
        if (io) io.to(`user:${String(postmortem.resolvedBy)}`).emit('notification:new', notification)
      }
    }

    const updated = await postMortemModel
      .findById(postmortem._id)
      .populate('incident', 'incidentId title service affectedService severity')
      .populate('incidentId', 'incidentId title service affectedService severity')
      .populate('resolvedBy', 'name')
      .populate('approvedBy', 'name')

    sendResponse(res, 200, true, 'Postmortem updated', { postmortem: normalizePostmortem(updated) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

function normalizePostmortem(pm) {
  const obj = pm.toObject ? pm.toObject() : pm
  const incidentRef = obj.incident || obj.incidentId || null
  
  // Combine timelines if needed or fallback
  let timeline = obj.timeline || []
  if (timeline.length === 0 && incidentRef?.timeline) {
    timeline = incidentRef.timeline.map(t => ({
      time: t.time || new Date(t.timestamp || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: t.event || t.message || t.action || 'Event recorded',
      author: t.author?.name || t.author || 'System'
    }))
  }

  return {
    ...obj,
    incidentRef,
    timeline,
    generatedBy: (obj.generatedBy || 'ai').toLowerCase(),
    service: obj.service || incidentRef?.service || incidentRef?.affectedService || null,
    severity: obj.severity || incidentRef?.severity || null,
  }
}


