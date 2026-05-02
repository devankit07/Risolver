import { z } from 'zod'

export const incidentSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.enum(['open', 'acknowledged', 'resolved']),
  orgId: z.string().optional(),
  updatedAt: z.string(),
})

export const incidentUpdateSchema = z.object({
  incidentId: z.string(),
  message: z.string().min(1),
  by: z.string().optional(),
})
