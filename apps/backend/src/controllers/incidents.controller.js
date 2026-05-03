import incidentModel from '../models/incident.model.js'
import userModel from '../models/user.model.js'
import notificationModel from '../models/notification.model.js'
import { sendResponse } from '../utils/response.js'

const MEMBER_ROLES = ['creator', 'responder', 'engineer', 'devops', 'tester']
const ADMIN_ROLES = ['admin', 'manager']

function isMemberRole(role) {
  return MEMBER_ROLES.includes(role)
}

function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// GET /api/incidents
export const listIncidents = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const userId = req.user._id
    const role = req.user.role
    const { status, severity, service, assignedTo, search, page = 1, limit = 20 } = req.query

    const filter = { organizationId: orgId }

    if (status) filter.status = { $in: status.split(',') }
    if (severity) filter.severity = severity
    if (service) {
      filter.$or = [
        { service: { $regex: service, $options: 'i' } },
        { affectedService: { $regex: service, $options: 'i' } },
      ]
    }
    if (assignedTo) filter.assignedTo = assignedTo
    if (search) filter.title = { $regex: search, $options: 'i' }

    if (isMemberRole(role)) {
      filter.assignedTo = userId
    }

    const pageNum = Math.max(1, parseInt(page, 10))
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)))
    const skip = (pageNum - 1) * pageSize

    const [incidents, total] = await Promise.all([
      incidentModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('createdBy', 'name role')
        .populate('assignedTo', 'name role status'),
      incidentModel.countDocuments(filter),
    ])

    const baseFilter = { organizationId: orgId }
    if (isMemberRole(role)) baseFilter.assignedTo = userId

    const [openCount, investigatingCount, resolvedCount, criticalCount, resolvedTodayCount] =
      await Promise.all([
        incidentModel.countDocuments({ ...baseFilter, status: 'open' }),
        incidentModel.countDocuments({ ...baseFilter, status: { $in: ['investigating', 'in_progress', 'assigned'] } }),
        incidentModel.countDocuments({ ...baseFilter, status: 'resolved' }),
        incidentModel.countDocuments({ ...baseFilter, severity: 'critical', status: { $nin: ['resolved', 'closed'] } }),
        incidentModel.countDocuments({
          ...baseFilter,
          status: 'resolved',
          resolvedAt: { $gte: todayStart() },
        }),
      ])

    const normalized = incidents.map(normalizeIncident)

    sendResponse(res, 200, true, 'Incidents fetched', {
      incidents: normalized,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      stats: {
        open: openCount,
        investigating: investigatingCount,
        resolved: resolvedCount,
        critical: criticalCount,
        resolvedToday: resolvedTodayCount,
      },
    })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// GET /api/incidents/stats
export const getIncidentStats = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const userId = req.user._id
    const role = req.user.role

    const baseFilter = { organizationId: orgId }
    if (isMemberRole(role)) baseFilter.assignedTo = userId

    const [byStatusArr, bySevArr, resolvedTodayArr, resolvedWithTime] = await Promise.all([
      incidentModel.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      incidentModel.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
      incidentModel.countDocuments({
        ...baseFilter,
        status: 'resolved',
        resolvedAt: { $gte: todayStart() },
      }),
      incidentModel
        .find({ ...baseFilter, status: 'resolved', resolvedAt: { $ne: null } })
        .select('createdAt resolvedAt')
        .limit(200),
    ])

    const byStatus = { open: 0, investigating: 0, resolved: 0, closed: 0 }
    byStatusArr.forEach(({ _id, count }) => {
      if (_id === 'assigned' || _id === 'in_progress') {
        byStatus.investigating = (byStatus.investigating || 0) + count
      } else if (byStatus[_id] !== undefined) {
        byStatus[_id] = count
      }
    })

    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 }
    bySevArr.forEach(({ _id, count }) => {
      if (bySeverity[_id] !== undefined) bySeverity[_id] = count
    })

    let avgMTTR = 0
    if (resolvedWithTime.length > 0) {
      const total = resolvedWithTime.reduce((sum, inc) => {
        return sum + (inc.resolvedAt - inc.createdAt) / 60000
      }, 0)
      avgMTTR = Math.round(total / resolvedWithTime.length)
    }

    sendResponse(res, 200, true, 'Stats fetched', {
      byStatus,
      bySeverity,
      resolvedToday: resolvedTodayArr,
      avgMTTR,
    })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// GET /api/incidents/:id
export const getIncidentById = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const incident = await incidentModel
      .findOne({ _id: req.params.id, organizationId: orgId })
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name role status')
      .populate('timeline.author', 'name role')

    if (!incident) return sendResponse(res, 404, false, 'Incident not found')
    sendResponse(res, 200, true, 'Incident fetched', { incident: normalizeIncident(incident) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// POST /api/incidents
function sanitizeReportImages(raw) {
  if (!Array.isArray(raw)) return []
  const MAX_IMAGES = 4
  const MAX_LEN = 600_000
  const out = []
  for (const item of raw) {
    if (typeof item !== 'string' || out.length >= MAX_IMAGES) break
    if (!item.startsWith('data:image/')) continue
    if (item.length > MAX_LEN) continue
    out.push(item)
  }
  return out
}

export const createNewIncident = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const { title, description, severity, service, assignedToUserId } = req.body
    const reportImages = sanitizeReportImages(req.body.reportImages)

    if (!title || !severity || !service || !assignedToUserId) {
      return sendResponse(res, 400, false, 'title, severity, service, and assignedToUserId are required')
    }

    const hasText = String(description ?? '').trim().length > 0
    const hasImages = reportImages.length > 0
    if (!hasText && !hasImages) {
      return sendResponse(res, 400, false, 'Add a written description or at least one image that shows the problem')
    }

    const assignee = await userModel.findOne({ _id: assignedToUserId, organizationId: orgId })
    if (!assignee) return sendResponse(res, 404, false, 'Assignee not found in this org')

    const count = await incidentModel.countDocuments({ organizationId: orgId })
    const incidentId = `INC-${String(count + 1).padStart(3, '0')}`

    const incident = await incidentModel.create({
      incidentId,
      title,
      description: description || (hasImages ? '(See attached images)' : ''),
      severity,
      service,
      affectedService: service,
      organizationId: orgId,
      createdBy: req.user._id,
      assignedTo: assignedToUserId,
      assignedAt: new Date(),
      status: 'open',
      reportImages,
      timeline: [
        {
          type: 'update',
          content: hasImages ? 'Incident reported (includes images)' : 'Incident created',
          isAI: false,
          author: req.user._id,
          createdAt: new Date(),
        },
      ],
    })

    const populated = await incidentModel
      .findById(incident._id)
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name role status')

    const notification = await notificationModel.create({
      userId: assignedToUserId,
      organizationId: orgId,
      type: 'incident_assigned',
      title: `Incident assigned: ${title}`,
      body: `Severity: ${severity} · Service: ${service}`,
      incidentId: incident._id,
    })

    const io = req.app.get('io')
    if (io) {
      emitUserNotification(io, assignedToUserId, notification)
      io.to(String(orgId)).emit('incident:new', normalizeIncident(populated))
    }

    sendResponse(res, 201, true, 'Incident created', { incident: normalizeIncident(populated) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// PATCH /api/incidents/:id
export const updateIncidentFull = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const { title, description, severity, service, status, assignedTo } = req.body

    const incident = await incidentModel.findOne({ _id: req.params.id, organizationId: orgId })
    if (!incident) return sendResponse(res, 404, false, 'Incident not found')

    const changes = {}
    if (title !== undefined) { incident.title = title; changes.title = title }
    if (description !== undefined) { incident.description = description; changes.description = description }
    if (severity !== undefined) { incident.severity = severity; changes.severity = severity }
    if (service !== undefined) {
      incident.service = service
      incident.affectedService = service
      changes.service = service
    }
    if (status !== undefined) { incident.status = status; changes.status = status }

    const prevAssignee = String(incident.assignedTo ?? '')
    if (assignedTo !== undefined && assignedTo !== prevAssignee) {
      const newAssignee = await userModel.findOne({ _id: assignedTo, organizationId: orgId })
      if (!newAssignee) return sendResponse(res, 404, false, 'New assignee not found')

      incident.assignedTo = assignedTo
      incident.assignedAt = new Date()
      changes.assignedTo = assignedTo

      const notification = await notificationModel.create({
        userId: assignedTo,
        organizationId: orgId,
        type: 'incident_assigned',
        title: `Incident assigned: ${incident.title}`,
        body: `Severity: ${incident.severity} · Service: ${incident.service || incident.affectedService}`,
        incidentId: incident._id,
      })

      const ioForN = req.app.get('io')
      emitUserNotification(ioForN, assignedTo, notification)
    }

    await incident.save()
    const io = req.app.get('io')
    if (io) io.to(String(orgId)).emit('incident:updated', { incidentId: incident._id, changes })

    const populated = await incidentModel
      .findById(incident._id)
      .populate('createdBy', 'name role')
      .populate('assignedTo', 'name role status')

    sendResponse(res, 200, true, 'Incident updated', { incident: normalizeIncident(populated) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// PATCH /api/incidents/:id/status
export const changeIncidentStatus = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const { status } = req.body

    if (!status) return sendResponse(res, 400, false, 'status is required')

    const incident = await incidentModel.findOne({ _id: req.params.id, organizationId: orgId })
    if (!incident) return sendResponse(res, 404, false, 'Incident not found')

    incident.status = status
    if (status === 'resolved') {
      incident.resolvedAt = new Date()
      incident.resolvedBy = req.user._id
    }

    incident.timeline.push({
      type: status === 'resolved' ? 'resolved' : 'update',
      content: `Status changed to ${status}`,
      isAI: false,
      author: req.user._id,
      createdAt: new Date(),
    })

    await incident.save()

    const io = req.app.get('io')
    if (io) io.to(String(orgId)).emit('incident:statusChanged', { incidentId: incident._id, status })

    sendResponse(res, 200, true, 'Status updated', { incident: normalizeIncident(incident) })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

// DELETE /api/incidents/:id  (soft delete)
export const closeIncident = async (req, res) => {
  try {
    const orgId = req.user.organizationId
    const incident = await incidentModel.findOne({ _id: req.params.id, organizationId: orgId })
    if (!incident) return sendResponse(res, 404, false, 'Incident not found')

    incident.status = 'closed'
    await incident.save()
    sendResponse(res, 200, true, 'Incident closed', { ok: true })
  } catch (err) {
    sendResponse(res, 500, false, err.message)
  }
}

function emitUserNotification(io, userId, notification) {
  if (!io || !notification) return
  const nDoc = notification.toObject ? notification.toObject() : notification
  io.to(`user:${String(userId)}`).emit('notification:new', {
    ...nDoc,
    userId: String(nDoc.userId),
    incidentId: nDoc.incidentId ? String(nDoc.incidentId) : null,
    _id: String(nDoc._id),
  })
}

// Helper: normalize incident document for frontend
function normalizeIncident(inc) {
  const obj = inc.toObject ? inc.toObject() : inc
  return {
    ...obj,
    service: obj.service || obj.affectedService || null,
    incidentId: obj.incidentId || obj._id,
  }
}
