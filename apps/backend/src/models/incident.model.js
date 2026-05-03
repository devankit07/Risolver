import mongoose from 'mongoose'

const timelineEntrySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['update', 'escalation', 'note', 'ai', 'resolved'],
      default: 'update',
    },
    content: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isAI: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
)

const incidentSchema = new mongoose.Schema(
  {
    incidentId: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    status: {
      type: String,
      default: 'open',
      enum: ['open', 'assigned', 'investigating', 'in_progress', 'resolved', 'closed'],
    },
    service: { type: String, default: null },
    affectedService: { type: String, default: null },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    timeline: { type: [timelineEntrySchema], default: [] },
    aiTriage: {
      summary: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      generatedAt: { type: Date, default: null },
    },
    resolution: {
      method: {
        type: String,
        enum: ['ai_solution', 'ai_suggestion', 'manual', null],
        default: null,
      },
      content: { type: String, default: null },
      githubUrl: { type: String, default: null },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      resolvedAt: { type: Date, default: null },
    },
    /** Base64 data URLs (jpeg/png/webp/gif) uploaded with the report — text description can be omitted if images explain the issue */
    reportImages: { type: [String], default: [] },
  },
  { timestamps: true },
)

incidentSchema.index({ organizationId: 1, createdAt: -1 })
incidentSchema.index({ organizationId: 1, status: 1 })

const incidentModel = mongoose.model('Incident', incidentSchema)
export default incidentModel
