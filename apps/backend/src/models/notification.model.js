import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  type: {
    type: String,
    default: 'info'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    default: ''
  },
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    default: null
  },
  postmortemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostMortem',
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const notificationModel = mongoose.model('Notification', notificationSchema)

export default notificationModel
