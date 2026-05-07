import express from 'express'
import {
  generateCredentials,
  getInvites,
  getRoles,
  addCustomRole,
  validateInvite,
  setupInviteAccount,
} from '../controllers/inviteCredential.controller.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js'

const inviteCredRouter = express.Router()

inviteCredRouter.post('/generate', authenticateUser, authorizeRoles('admin', 'manager'), generateCredentials)
inviteCredRouter.get('/', authenticateUser, authorizeRoles('admin', 'manager'), getInvites)
inviteCredRouter.get('/roles', authenticateUser, getRoles)
inviteCredRouter.post('/roles/add', authenticateUser, authorizeRoles('admin', 'manager'), addCustomRole)
inviteCredRouter.get('/validate', validateInvite)
inviteCredRouter.post('/setup', setupInviteAccount)

export default inviteCredRouter
