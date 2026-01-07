import { z } from 'zod'

export const UuidSchema = z.string().uuid()

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const TimestampSchema = z.string().datetime()
