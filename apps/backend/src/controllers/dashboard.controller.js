import incidentModel from '../models/incident.model.js'
import userModel from '../models/user.model.js'
import notificationModel from '../models/notification.model.js'
import { sendResponse } from '../utils/response.js'
import { config } from '../config/config.js'
import Groq from 'groq-sdk'

// ── helpers ─────────────────────────────────────────────────────────────────

let groqClient = null
function getGroq() {
  if (!config.GROQ_API_KEY?.trim()) return null
  if (!groqClient) groqClient = new Groq({ apiKey: config.GROQ_API_KEY })
  return groqClient
}

function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ── GET /api/dashboard/stats ─────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
  const orgId = req.user.organizationId

  const [activeIncidents, resolvedTodayList, teamOnline, last30Resolved] = await Promise.all([
    incidentModel.countDocuments({
      organizationId: orgId,
      status: { $in: ['open', 'assigned', 'in_progress'] },
    }),
    incidentModel.find({
      organizationId: orgId,
      status: 'resolved',
      resolvedAt: { $gte: todayStart() },
    }).select('createdAt resolvedAt'),
    userModel.countDocuments({ organizationId: orgId, status: 'online' }),
    incidentModel.find({
      organizationId: orgId,
      status: 'resolved',
      createdAt: { $gte: daysAgo(30) },
    }).select('createdAt resolvedAt'),
  ])

  let avgMTTR = null
  if (last30Resolved.length > 0) {
    const totalMinutes = last30Resolved.reduce((sum, inc) => {
      if (!inc.resolvedAt) return sum
      return sum + (inc.resolvedAt - inc.createdAt) / 60000
    }, 0)
    avgMTTR = Math.round(totalMinutes / last30Resolved.length)
  }

  sendResponse(res, 200, true, 'Dashboard stats fetched', {
    activeIncidents,
    resolvedToday: resolvedTodayList.length,
    avgMTTR,
    teamOnline,
  })
}

// ── GET /api/dashboard/chart ─────────────────────────────────────────────────

export const getDashboardChart = async (req, res) => {
  const orgId = req.user.organizationId
  const since = daysAgo(7)

  const incidents = await incidentModel.find({
    organizationId: orgId,
    createdAt: { $gte: since },
  }).select('status createdAt resolvedAt')

  const buckets = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    buckets[key] = { date: DAY_LABELS[d.getDay()], open: 0, resolved: 0 }
  }

  incidents.forEach((inc) => {
    const createdKey = inc.createdAt.toISOString().slice(0, 10)
    if (buckets[createdKey]) {
      if (inc.status === 'resolved') {
        buckets[createdKey].resolved++
      } else {
        buckets[createdKey].open++
      }
    }
  })

  sendResponse(res, 200, true, 'Chart data fetched', {
    chart: Object.values(buckets),
  })
}

// ── POST /api/dashboard/insights ─────────────────────────────────────────────

const FALLBACK_INSIGHTS = [
  { type: 'info', text: 'Connect more data to see AI insights.' },
]

export const getDashboardInsights = async (req, res) => {
  const orgId = req.user.organizationId

  const incidents = await incidentModel.find({
    organizationId: orgId,
    createdAt: { $gte: daysAgo(30) },
  }).select('title severity affectedService status').limit(50)

  if (incidents.length === 0) {
    return sendResponse(res, 200, true, 'Insights generated', {
      insights: FALLBACK_INSIGHTS,
    })
  }

  const groq = getGroq()
  if (!groq) {
    return sendResponse(res, 200, true, 'Insights generated', {
      insights: FALLBACK_INSIGHTS,
    })
  }

  try {
    const summary = incidents.map((i) => ({
      title: i.title,
      severity: i.severity,
      service: i.affectedService,
      status: i.status,
    }))

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are an incident management analyst. Return pure JSON only. No markdown, no backticks, no extra text.',
        },
        {
          role: 'user',
          content: `Analyze these recent incidents and return 3 operational insights.
Data: ${JSON.stringify(summary)}
Return ONLY JSON: { "insights": [{"type":"warning"|"info"|"tip", "text":"..."}] }`,
        },
      ],
      temperature: 0,
      max_tokens: 600,
    })

    const parsed = JSON.parse(response.choices[0].message.content)
    const insights = Array.isArray(parsed?.insights) ? parsed.insights : FALLBACK_INSIGHTS

    return sendResponse(res, 200, true, 'Insights generated', { insights })
  } catch {
    return sendResponse(res, 200, true, 'Insights generated', {
      insights: FALLBACK_INSIGHTS,
    })
  }
}

// ── GET /api/dashboard/recent-activity ───────────────────────────────────────

export const getRecentActivity = async (req, res) => {
  const orgId = req.user.organizationId

  const orgUsers = await userModel.find({ organizationId: orgId }).select('_id')
  const userIds = orgUsers.map((u) => u._id)

  const activities = await notificationModel
    .find({ userId: { $in: userIds }, organizationId: orgId })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('userId', 'name role')

  sendResponse(res, 200, true, 'Recent activity fetched', { activities })
}

// ── GET /api/dashboard/message-previews ──────────────────────────────────────

export const getMessagePreviews = async (req, res) => {
  sendResponse(res, 200, true, 'Message previews fetched', { previews: [] })
}
