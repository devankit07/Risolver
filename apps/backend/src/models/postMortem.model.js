import mongoose from 'mongoose'

const postMortemSchema = new mongoose.Schema(
  {
    // Support both new (incident) and old (incidentId) field names
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      default: null,
    },
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      default: null,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    generatedBy: {
      type: String,
      default: 'ai',
      enum: ['ai', 'AI', 'manual'],
    },
    title: { type: String, default: '' },
    whatHappened: { type: String, default: '' },
    timeline: [
      {
        time: { type: String, default: '' },
        event: { type: String, default: '' },
        author: { type: String, default: '' },
      },
    ],
    rootCause: { type: String, default: '' },
    solutionApplied: { type: String, default: '' },
    preventionSteps: { type: [String], default: [] },
    resolutionMethod: { type: String, default: '' },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    duration: { type: String, default: null },
    severity: { type: String, default: null },
    service: { type: String, default: null },
    status: {
      type: String,
      default: 'draft',
      enum: ['draft', 'pending_approval', 'published'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: { type: Date, default: null },
    // Legacy fields kept for backward compatibility
    summary: { type: String, default: null },
    whatWorked: { type: String, default: null },
    recommendations: { type: String, default: null },
  },
  { timestamps: true },
)

postMortemSchema.index({ organization: 1, createdAt: -1 })
postMortemSchema.index({ organizationId: 1, createdAt: -1 })
postMortemSchema.index({ status: 1 })

const postMortemModel = mongoose.model('PostMortem', postMortemSchema)
export default postMortemModel
