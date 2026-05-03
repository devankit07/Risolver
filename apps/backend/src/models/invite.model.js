import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  token: {
    type: String,
    default: null
  },
  inviteId: {
    type: String,
    default: null,
    index: true
  },
  name: {
    type: String,
    default: null
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'manager', 'creator', 'responder']
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  specialization: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'used'],
    default: 'pending'
  },
  isused: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null
  },
  shareLink: {
    type: String,
    default: null
  }
}, { timestamps: true });

const inviteModel = mongoose.model('Invite', inviteSchema);

export default inviteModel;
