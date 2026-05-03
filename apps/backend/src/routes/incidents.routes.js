import express from 'express'
import {
  listIncidents,
  getIncidentStats,
  getIncidentById,
  createNewIncident,
  updateIncidentFull,
  changeIncidentStatus,
  closeIncident,
} from '../controllers/incidents.controller.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js'

const incidentsRouter = express.Router()

incidentsRouter.get('/stats', authenticateUser, getIncidentStats)
incidentsRouter.get('/', authenticateUser, listIncidents)
incidentsRouter.get('/:id', authenticateUser, getIncidentById)
incidentsRouter.post('/', authenticateUser, authorizeRoles('admin', 'manager', 'creator'), createNewIncident)
incidentsRouter.patch('/:id', authenticateUser, authorizeRoles('admin', 'manager'), updateIncidentFull)
incidentsRouter.patch('/:id/status', authenticateUser, authorizeRoles('admin', 'manager'), changeIncidentStatus)
incidentsRouter.delete('/:id', authenticateUser, authorizeRoles('admin'), closeIncident)

export default incidentsRouter
