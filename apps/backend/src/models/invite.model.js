import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['manager', 'creator', 'responder']
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  specialization: {
    type: String,
    default: null
  },
  isused: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const inviteModel = mongoose.model('Invite', inviteSchema);

export default inviteModel;
