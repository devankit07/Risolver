import express from 'express'
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserIncidents,
  getUserNotifications,
  markAllNotificationsRead,
  updateUserSkills,
} from '../controllers/user.controller.js'
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js'

const userRouter = express.Router()

userRouter.get('/', authenticateUser, getUsers)
userRouter.get('/:id', authenticateUser, getUserById)
userRouter.patch('/:id', authenticateUser, updateUser)
userRouter.patch('/:id/status', authenticateUser, updateUserStatus)
userRouter.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteUser)
userRouter.get('/:id/incidents', authenticateUser, getUserIncidents)
userRouter.get('/:id/notifications', authenticateUser, getUserNotifications)
userRouter.patch('/:id/notifications/read-all', authenticateUser, markAllNotificationsRead)
userRouter.patch('/:id/skills', authenticateUser, updateUserSkills)

export default userRouter
