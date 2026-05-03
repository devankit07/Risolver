import userModel from '../models/user.model.js'
import incidentModel from '../models/incident.model.js'
import notificationModel from '../models/notification.model.js'
import inviteModel from '../models/invite.model.js'
import { sendResponse } from '../utils/response.js'

const SAFE_FIELDS = '_id name email inviteId role status department lastActive createdAt'

// ── GET /api/users ────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
  const orgId = req.user.organizationId
  const { role, status, search, page = 1, limit = 20 } = req.query
  const pageSize = Math.max(1, Math.min(150, Number(limit) || 20))

  const filter = { organizationId: orgId }
  if (role && role !== 'All') filter.role = role
  if (status) filter.status = status
  if (search) filter.name = { $regex: search, $options: 'i' }

  const skip = (Number(page) - 1) * pageSize

  const [users, total] = await Promise.all([
    userModel
      .find(filter)
      .select(SAFE_FIELDS)
      .sort({ name: 1 })
      .skip(skip)
      .limit(pageSize),
    userModel.countDocuments(filter),
  ])

  const pages = Math.ceil(total / pageSize)

  sendResponse(res, 200, true, 'Users fetched', {
    users,
    total,
    page: Number(page),
    pages,
  })
}

// ── GET /api/users/:id ────────────────────────────────────────────────────────

export const getUserById = async (req, res) => {
  const { id } = req.params
  const orgId = req.user.organizationId
  const requester = req.user

  const user = await userModel
    .findOne({ _id: id, organizationId: orgId })
    .select(SAFE_FIELDS)

  if (!user) return sendResponse(res, 404, false, 'User not found')

  const isLimitedRole =
    requester.role === 'creator' || requester.role === 'responder'
  const isSelf = String(requester._id) === String(user._id)

  if (isLimitedRole && !isSelf) {
    return sendResponse(res, 200, true, 'User profile', {
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        department: user.department,
      },
    })
  }

  sendResponse(res, 200, true, 'User profile', { user })
}

// ── PATCH /api/users/:id ──────────────────────────────────────────────────────

export const updateUser = async (req, res) => {
  const { id } = req.params
  const orgId = req.user.organizationId
  const requester = req.user

  const user = await userModel.findOne({ _id: id, organizationId: orgId })
  if (!user) return sendResponse(res, 404, false, 'User not found')

  const isSelf = String(requester._id) === String(user._id)
  const isAdmin = requester.role === 'admin'

  if (!isSelf && !isAdmin) {
    return sendResponse(res, 403, false, 'Forbidden')
  }

  const allowed = ['name', 'department']
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field]
  })

  await user.save()
  await user.populate('organizationId', 'name')

  const safe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    department: user.department,
    lastActive: user.lastActive,
    createdAt: user.createdAt,
  }

  sendResponse(res, 200, true, 'User updated', { user: safe })
}

// ── PATCH /api/users/:id/status ───────────────────────────────────────────────

export const updateUserStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const orgId = req.user.organizationId

  const allowed = ['online', 'away', 'offline']
  if (!allowed.includes(status)) {
    return sendResponse(res, 400, false, 'Invalid status')
  }

  const user = await userModel.findOne({ _id: id, organizationId: orgId })
  if (!user) return sendResponse(res, 404, false, 'User not found')

  const isSelf = String(req.user._id) === String(user._id)
  const isAdmin = req.user.role === 'admin'
  if (!isSelf && !isAdmin) return sendResponse(res, 403, false, 'Forbidden')

  if (user.status !== status) {
    user.status = status
    user.lastActive = new Date()
    await user.save()

    const io = req.app.get('io')
    if (io) {
      io.to(String(orgId)).emit('user:status', {
        userId: String(user._id),
        status,
      })
    }
  }

  sendResponse(res, 200, true, 'Status updated', { status })
}

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────

export const deleteUser = async (req, res) => {
  const { id } = req.params
  const orgId = req.user.organizationId

  if (String(req.user._id) === id) {
    return sendResponse(res, 400, false, 'Cannot delete yourself')
  }

  const user = await userModel.findOne({ _id: id, organizationId: orgId })
  if (!user) return sendResponse(res, 404, false, 'User not found')

  if (user.role === 'admin') {
    return sendResponse(res, 400, false, 'Cannot delete admin')
  }

  user.status = 'offline'
  await user.save()

  if (user.inviteId) {
    await inviteModel.findOneAndUpdate(
      { inviteId: user.inviteId, organizationId: orgId },
      { status: 'used', isused: true },
    )
  }

  sendResponse(res, 200, true, 'User removed')
}

// ── GET /api/users/:id/incidents ─────────────────────────────────────────────

export const getUserIncidents = async (req, res) => {
  const { id } = req.params
  const orgId = req.user.organizationId
  const { status, page = 1, limit = 10 } = req.query

  const filter = { assignedTo: id, organizationId: orgId }
  if (status) filter.status = status

  const skip = (Number(page) - 1) * Number(limit)

  const [incidents, total] = await Promise.all([
    incidentModel
      .find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    incidentModel.countDocuments(filter),
  ])

  sendResponse(res, 200, true, 'User incidents fetched', {
    incidents,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  })
}

// ── GET /api/users/:id/notifications ─────────────────────────────────────────

export const getUserNotifications = async (req, res) => {
  const { id } = req.params
  const orgId = req.user.organizationId
  const requester = req.user

  const isSelf = String(requester._id) === id
  const isPrivileged = requester.role === 'admin' || requester.role === 'manager'

  if (!isSelf && !isPrivileged) {
    return sendResponse(res, 403, false, 'Forbidden')
  }

  const notifications = await notificationModel
    .find({ userId: id, organizationId: orgId })
    .sort({ isRead: 1, createdAt: -1 })
    .limit(50)

  sendResponse(res, 200, true, 'Notifications fetched', { notifications })
}

// ── PATCH /api/users/:id/skills ──────────────────────────────────────────────

export const updateUserSkills = async (req, res) => {
  const { id } = req.params
  const { skills } = req.body
  const orgId = req.user.organizationId

  const isSelf = String(req.user._id) === id
  const isAdmin = req.user.role === 'admin'
  if (!isSelf && !isAdmin) return sendResponse(res, 403, false, 'Forbidden')

  if (!Array.isArray(skills)) return sendResponse(res, 400, false, 'skills must be an array')
  if (skills.length > 10) return sendResponse(res, 400, false, 'Max 10 skills allowed')
  if (skills.some((s) => !s || s.length > 20)) {
    return sendResponse(res, 400, false, 'Each skill must be max 20 characters')
  }

  const user = await userModel.findOne({ _id: id, organizationId: orgId })
  if (!user) return sendResponse(res, 404, false, 'User not found')

  user.skills = skills
  await user.save()

  sendResponse(res, 200, true, 'Skills updated', { skills: user.skills })
}

// ── PATCH /api/users/:id/notifications/read-all ───────────────────────────────

export const markAllNotificationsRead = async (req, res) => {
  const { id } = req.params
  const orgId = req.user.organizationId

  const isSelf = String(req.user._id) === id
  if (!isSelf) return sendResponse(res, 403, false, 'Forbidden')

  await notificationModel.updateMany(
    { userId: id, organizationId: orgId, isRead: false },
    { isRead: true },
  )

  sendResponse(res, 200, true, 'All notifications marked as read')
}
