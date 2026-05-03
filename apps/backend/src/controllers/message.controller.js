import messageModel from '../models/message.model.js'
import userModel from '../models/user.model.js'
import { sendResponse } from '../utils/response.js'

function buildThreadId(a, b) {
  return [String(a), String(b)].sort().join('_')
}

// ── GET /api/messages/threads ─────────────────────────────────────────────────

export const getThreads = async (req, res) => {
  const myId = String(req.user._id)

  const rawThreads = await messageModel.aggregate([
    {
      $match: {
        $or: [
          { sender: req.user._id },
          { receiver: req.user._id },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$threadId',
        latestMsg: { $first: '$$ROOT' },
      },
    },
    { $sort: { 'latestMsg.createdAt': -1 } },
  ])

  const threads = await Promise.all(
    rawThreads.map(async ({ _id: threadId, latestMsg }) => {
      const otherUserId =
        String(latestMsg.sender) === myId ? latestMsg.receiver : latestMsg.sender

      const otherUser = await userModel
        .findById(otherUserId)
        .select('_id name role status')

      const unreadCount = await messageModel.countDocuments({
        threadId,
        receiver: req.user._id,
        isRead: false,
      })

      return {
        threadId,
        otherUser: otherUser
          ? {
              _id: otherUser._id,
              name: otherUser.name,
              role: otherUser.role,
              status: otherUser.status,
              initials: otherUser.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
            }
          : null,
        lastMessage: {
          content: latestMsg.content,
          createdAt: latestMsg.createdAt,
          senderId: String(latestMsg.sender),
        },
        unreadCount,
      }
    }),
  )

  sendResponse(res, 200, true, 'Threads fetched', { threads })
}

// ── GET /api/messages/thread/:otherUserId ─────────────────────────────────────

export const getThread = async (req, res) => {
  const { otherUserId } = req.params
  const myId = req.user._id

  const threadId = buildThreadId(myId, otherUserId)

  const [messages, otherUser] = await Promise.all([
    messageModel
      .find({ threadId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 }),
    userModel.findById(otherUserId).select('_id name role status'),
  ])

  await messageModel.updateMany(
    { threadId, receiver: myId, isRead: false },
    { isRead: true },
  )

  const io = req.app.get('io')
  if (io) {
    io.to(`user:${String(otherUserId)}`).emit('messages:read', { threadId })
  }

  sendResponse(res, 200, true, 'Thread fetched', {
    messages,
    otherUser: otherUser
      ? {
          _id: otherUser._id,
          name: otherUser.name,
          role: otherUser.role,
          status: otherUser.status,
        }
      : null,
  })
}

// ── POST /api/messages/send ───────────────────────────────────────────────────

export const sendMessage = async (req, res) => {
  const { receiverId, content, incidentRef } = req.body
  const myId = req.user._id
  const orgId = req.user.organizationId

  if (!receiverId || !content?.trim()) {
    return sendResponse(res, 400, false, 'receiverId and content are required')
  }

  const receiver = await userModel.findOne({ _id: receiverId, organizationId: orgId })
  if (!receiver) return sendResponse(res, 403, false, 'Receiver not in same org')

  const threadId = buildThreadId(myId, receiverId)

  const msg = await messageModel.create({
    threadId,
    sender: myId,
    receiver: receiverId,
    content: content.trim(),
    incidentRef: incidentRef || null,
  })

  const populated = await msg.populate('sender', 'name role')

  const io = req.app.get('io')
  if (io) {
    io.to(`user:${String(receiverId)}`).emit('message:new', {
      message: populated,
      threadId,
    })
    io.to(`user:${String(myId)}`).emit('message:sent', {
      message: populated,
      threadId,
    })
  }

  sendResponse(res, 201, true, 'Message sent', { message: populated })
}

// ── GET /api/messages/users ───────────────────────────────────────────────────

export const getOrgUsers = async (req, res) => {
  const { search } = req.query
  const orgId = req.user.organizationId
  const myId = req.user._id

  const filter = { organizationId: orgId, _id: { $ne: myId } }
  if (search) filter.name = { $regex: search, $options: 'i' }

  const users = await userModel
    .find(filter)
    .select('_id name role status')
    .limit(20)

  const result = users.map((u) => ({
    _id: u._id,
    name: u.name,
    role: u.role,
    status: u.status,
    initials: u.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  }))

  sendResponse(res, 200, true, 'Users fetched', { users: result })
}
