import express from 'express'
import { getThreads, getThread, sendMessage, getOrgUsers } from '../controllers/message.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'

const messageRouter = express.Router()

messageRouter.get('/threads', authenticateUser, getThreads)
messageRouter.get('/thread/:otherUserId', authenticateUser, getThread)
messageRouter.post('/send', authenticateUser, sendMessage)
messageRouter.get('/users', authenticateUser, getOrgUsers)

export default messageRouter
