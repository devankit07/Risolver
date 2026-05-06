import inviteModel from '../models/invite.model.js'
import userModel from '../models/user.model.js'
import organizationModel from '../models/organization.model.js'
import { sendResponse } from '../utils/response.js'
import { generateToken } from '../utils/generateTokens.js'

const DEFAULT_ROLES = ['manager', 'creator', 'responder']
const INVITE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const PASS_POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

function genInviteId() {
  return (
    'RES-' +
    Array(4)
      .fill(0)
      .map(() => INVITE_CHARS[Math.floor(Math.random() * INVITE_CHARS.length)])
      .join('')
  )
}

function genTempPassword() {
  return Array(8)
    .fill(0)
    .map(() => PASS_POOL[Math.floor(Math.random() * PASS_POOL.length)])
    .join('')
}

// ── POST /api/invites/generate ───────────────────────────────────────────────

export const generateCredentials = async (req, res) => {
  const { name, role, specialization, organizationId, email: providedEmail, password: providedPassword } = req.body
  const orgId = organizationId || String(req.user.organizationId)

  if (!name?.trim()) return sendResponse(res, 400, false, 'Name is required')
  if (!role) return sendResponse(res, 400, false, 'Access tag (role) is required')
  if (role === 'admin') return sendResponse(res, 400, false, 'Cannot invite another admin')

  const org = await organizationModel.findById(orgId).select('name')
  if (!org) return sendResponse(res, 404, false, 'Organization not found')

  // If email and password are provided, we create the user directly
  if (providedEmail && providedPassword) {
    if (providedPassword.length < 6) return sendResponse(res, 400, false, 'Password must be at least 6 characters')
    
    const existing = await userModel.findOne({ email: providedEmail.trim().toLowerCase() })
    if (existing) return sendResponse(res, 400, false, 'Email is already in use')

    const newUser = await userModel.create({
      name: name.trim(),
      email: providedEmail.trim().toLowerCase(),
      password: providedPassword, // will be hashed in pre-save
      role,
      specialization: specialization?.trim() || null,
      organizationId: orgId,
      status: 'offline',
    })

    return sendResponse(res, 201, true, 'Member created successfully', {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      specialization: newUser.specialization,
      organizationName: org.name,
      password: providedPassword, // Return the plain password once for the popup
      liveUrl: 'https://risolver-resolver-manage-system.vercel.app/login',
    })
  }

  // Fallback to the legacy invite system if no email/pass provided
  let inviteId = null
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = genInviteId()
    const exists = await inviteModel.findOne({ inviteId: candidate })
    if (!exists) { inviteId = candidate; break }
  }
  if (!inviteId) return sendResponse(res, 500, false, 'Could not generate unique invite ID')

  const tempPassword = genTempPassword()
  const email = `${inviteId.toLowerCase()}@invite.resolver.local`

  await userModel.create({
    name: name.trim(),
    email,
    password: tempPassword,
    role,
    specialization: specialization?.trim() || null,
    inviteId,
    organizationId: orgId,
    isInviteUser: true,
    status: 'offline',
  })

  const websiteUrl = process.env.VITE_WEBSITE_URL || 'http://localhost:3000'
  const shareLink = `${websiteUrl}/join?id=${inviteId}`

  await inviteModel.create({
    inviteId,
    token: inviteId,
    role,
    specialization: specialization?.trim() || null,
    name: name.trim(),
    organizationId: orgId,
    createdBy: req.user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    shareLink,
    status: 'pending',
  })

  sendResponse(res, 201, true, 'Credentials generated', {
    inviteId,
    tempPassword,
    role,
    specialization: specialization?.trim() || null,
    name: name.trim(),
    organizationName: org.name,
    shareLink,
    liveUrl: 'https://risolver-resolver-manage-system.vercel.app/login',
    message: 'Share these credentials once. Password cannot be recovered.',
  })
}

// ── GET /api/invites ──────────────────────────────────────────────────────────

export const getInvites = async (req, res) => {
  const orgId = req.user.organizationId

  const invites = await inviteModel
    .find({ organizationId: orgId, inviteId: { $ne: null } })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })

  sendResponse(res, 200, true, 'Invites fetched', { invites })
}

// ── GET /api/invites/roles ────────────────────────────────────────────────────

export const getRoles = async (req, res) => {
  const orgId = req.user.organizationId
  const org = await organizationModel.findById(orgId).select('customRoles')
  const customRoles = org?.customRoles ?? []

  sendResponse(res, 200, true, 'Roles fetched', {
    defaultRoles: DEFAULT_ROLES,
    customRoles,
  })
}

// ── POST /api/invites/roles/add ───────────────────────────────────────────────

export const addCustomRole = async (req, res) => {
  const { roleName } = req.body
  const orgId = req.user.organizationId

  if (!roleName || roleName.trim().length < 2) {
    return sendResponse(res, 400, false, 'Role name must be at least 2 characters')
  }
  if (roleName.trim().length > 20) {
    return sendResponse(res, 400, false, 'Role name must be at most 20 characters')
  }
  if (/\s/.test(roleName.trim())) {
    return sendResponse(res, 400, false, 'Role name cannot contain spaces')
  }
  if (DEFAULT_ROLES.includes(roleName.trim().toLowerCase())) {
    return sendResponse(res, 400, false, 'Role already exists as a default role')
  }

  const org = await organizationModel.findByIdAndUpdate(
    orgId,
    { $addToSet: { customRoles: roleName.trim() } },
    { new: true },
  )

  sendResponse(res, 200, true, 'Custom role added', {
    defaultRoles: DEFAULT_ROLES,
    customRoles: org?.customRoles ?? [],
  })
}

// ── GET /api/invites/validate?id=RES-XXXX ────────────────────────────────────

export const validateInvite = async (req, res) => {
  const { id } = req.query
  if (!id) return sendResponse(res, 400, false, 'id query param is required')

  const invite = await inviteModel
    .findOne({ inviteId: id })
    .populate('organizationId', 'name')

  if (!invite) {
    return sendResponse(res, 200, true, 'Validation result', {
      valid: false,
      reason: 'not_found',
    })
  }

  if (invite.status === 'used' || invite.isused) {
    return sendResponse(res, 200, true, 'Validation result', {
      valid: false,
      reason: 'used',
    })
  }

  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return sendResponse(res, 200, true, 'Validation result', {
      valid: false,
      reason: 'expired',
    })
  }

  sendResponse(res, 200, true, 'Validation result', {
    valid: true,
    orgName: invite.organizationId?.name ?? '',
    role: invite.role,
    name: invite.name,
    specialization: invite.specialization,
  })
}

// ── POST /api/invites/setup ───────────────────────────────────────────────────

export const setupInviteAccount = async (req, res) => {
  const { inviteId, name, email, password } = req.body

  if (!inviteId?.trim()) return sendResponse(res, 400, false, 'inviteId is required')
  if (!name?.trim())     return sendResponse(res, 400, false, 'name is required')
  if (!email?.trim())    return sendResponse(res, 400, false, 'email is required')
  if (!password || password.length < 6) {
    return sendResponse(res, 400, false, 'password must be at least 6 characters')
  }

  const existingUser = await userModel.findOne({ email: email.trim() })
  if (existingUser && existingUser.inviteId !== inviteId.trim().toUpperCase()) {
    return sendResponse(res, 400, false, 'Email is already in use by another account')
  }

  const invite = await inviteModel
    .findOne({ inviteId: inviteId.trim().toUpperCase() })
    .populate('organizationId', 'name')

  if (!invite) return sendResponse(res, 404, false, 'Invite not found')
  if (invite.status === 'used' || invite.isused) {
    return sendResponse(res, 400, false, 'This invite has already been used')
  }
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return sendResponse(res, 400, false, 'This invite has expired')
  }

  const user = await userModel.findOne({
    inviteId: invite.inviteId,
    organizationId: invite.organizationId._id ?? invite.organizationId,
  })
  if (!user) return sendResponse(res, 404, false, 'User account not found for this invite')

  user.name = name.trim()
  user.email = email.trim()
  user.password = password
  await user.save()

  invite.status = 'used'
  invite.isused = true
  await invite.save()

  generateToken(user, res, 'Account setup complete', invite.organizationId?.name ?? null)
}
