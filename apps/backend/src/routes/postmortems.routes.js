import express from 'express'
import {
  listPostmortems,
  listPublicPostmortems,
  getPendingApprovals,
  getPostmortemById,
  getPublicPostmortemById,
  approvePostmortem,
} from '../controllers/postmortems.controller.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js'

const postmortemsRouter = express.Router()

postmortemsRouter.get('/public', listPublicPostmortems)
postmortemsRouter.get('/pending', authenticateUser, authorizeRoles('admin', 'manager'), getPendingApprovals)
postmortemsRouter.get('/', authenticateUser, listPostmortems)
postmortemsRouter.get('/:id/public', getPublicPostmortemById)
postmortemsRouter.get('/:id', authenticateUser, getPostmortemById)
postmortemsRouter.patch('/:id/approve', authenticateUser, authorizeRoles('admin', 'manager'), approvePostmortem)

export default postmortemsRouter
