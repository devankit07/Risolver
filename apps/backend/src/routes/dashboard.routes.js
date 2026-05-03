import express from 'express'
import {
  getDashboardStats,
  getDashboardChart,
  getDashboardInsights,
  getRecentActivity,
  getMessagePreviews,
} from '../controllers/dashboard.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'

const dashboardRouter = express.Router()

dashboardRouter.get('/stats', authenticateUser, getDashboardStats)
dashboardRouter.get('/chart', authenticateUser, getDashboardChart)
dashboardRouter.post('/insights', authenticateUser, getDashboardInsights)
dashboardRouter.get('/recent-activity', authenticateUser, getRecentActivity)
dashboardRouter.get('/message-previews', authenticateUser, getMessagePreviews)

export default dashboardRouter
