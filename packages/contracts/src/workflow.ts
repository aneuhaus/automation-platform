import { z } from 'zod'
import { UuidSchema, TimestampSchema } from './common.js'

export const WorkflowSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  definition: z.record(z.unknown()), // Placeholder for workflow definition
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
})

export const CreateWorkflowInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  definition: z.record(z.unknown()),
})

export type Workflow = z.infer<typeof WorkflowSchema>
export type CreateWorkflowInput = z.infer<typeof CreateWorkflowInputSchema>
