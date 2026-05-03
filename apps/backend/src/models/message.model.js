import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    incidentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

messageSchema.index({ threadId: 1, createdAt: 1 })

const messageModel = mongoose.model('Message', messageSchema)
export default messageModel
