import { z } from "zod";
import { UuidSchema, TimestampSchema } from "./common.js";

export const RequestStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const RequestSchema = z.object({
  id: UuidSchema,
  workflowId: UuidSchema,
  requesterId: UuidSchema,
  status: RequestStatusSchema,
  input: z.record(z.unknown()), // Dynamic input based on workflow definition
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateRequestInputSchema = z.object({
  workflowId: UuidSchema,
  input: z.record(z.unknown()),
});

export type RequestStatus = z.infer<typeof RequestStatusSchema>;
export type Request = z.infer<typeof RequestSchema>;
export type CreateRequestInput = z.infer<typeof CreateRequestInputSchema>;
