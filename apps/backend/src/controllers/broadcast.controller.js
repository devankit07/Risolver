import broadcastModel from '../models/broadcast.model.js'
import { sendResponse } from '../utils/response.js'

// ── GET /api/broadcasts ───────────────────────────────────────────────────────

export const getBroadcasts = async (req, res) => {
  const orgId = req.user.organizationId
  const myRole = req.user.role
  const myId = req.user._id

  const broadcasts = await broadcastModel
    .find({
      organization: orgId,
      $or: [{ targetRoles: 'all' }, { targetRoles: myRole }],
    })
    .populate('sender', 'name role')
    .sort({ createdAt: -1 })

  const result = broadcasts.map((b) => ({
    _id: b._id,
    title: b.title,
    content: b.content,
    targetRoles: b.targetRoles,
    sender: b.sender,
    createdAt: b.createdAt,
    isRead: b.readBy.some((uid) => String(uid) === String(myId)),
  }))

  sendResponse(res, 200, true, 'Broadcasts fetched', { broadcasts: result })
}

// ── POST /api/broadcasts ──────────────────────────────────────────────────────

export const createBroadcast = async (req, res) => {
  const { title, content, targetRoles } = req.body
  const orgId = req.user.organizationId
  const myId = req.user._id

  if (!title?.trim()) return sendResponse(res, 400, false, 'Title is required')
  if (!content?.trim()) return sendResponse(res, 400, false, 'Content is required')
  if (!Array.isArray(targetRoles) || targetRoles.length === 0) {
    return sendResponse(res, 400, false, 'targetRoles must be a non-empty array')
  }

  const broadcast = await broadcastModel.create({
    sender: myId,
    organization: orgId,
    title: title.trim(),
    content: content.trim(),
    targetRoles,
    readBy: [myId],
  })

  const populated = await broadcast.populate('sender', 'name role')

  const io = req.app.get('io')
  if (io) {
    const payload = {
      _id: populated._id,
      title: populated.title,
      content: populated.content,
      targetRoles: populated.targetRoles,
      sender: populated.sender,
      createdAt: populated.createdAt,
      isRead: false,
    }
    if (targetRoles.includes('all')) {
      io.to(String(orgId)).emit('broadcast:new', payload)
    } else {
      targetRoles.forEach((role) => {
        io.to(`role:${role}`).emit('broadcast:new', payload)
      })
    }
  }

  sendResponse(res, 201, true, 'Broadcast sent', { broadcast: populated })
}

// ── PATCH /api/broadcasts/:id/read ────────────────────────────────────────────

export const markBroadcastRead = async (req, res) => {
  const { id } = req.params
  const myId = req.user._id

  await broadcastModel.updateOne(
    { _id: id },
    { $addToSet: { readBy: myId } },
  )

  sendResponse(res, 200, true, 'Marked as read', { ok: true })
}
