import express from 'express'
import { getBroadcasts, createBroadcast, markBroadcastRead } from '../controllers/broadcast.controller.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js'

const broadcastRouter = express.Router()

broadcastRouter.get('/', authenticateUser, getBroadcasts)
broadcastRouter.post('/', authenticateUser, authorizeRoles('admin', 'manager'), createBroadcast)
broadcastRouter.patch('/:id/read', authenticateUser, markBroadcastRead)

export default broadcastRouter
