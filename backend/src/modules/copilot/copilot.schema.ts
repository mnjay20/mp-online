import { z } from 'zod';

export const chatMessageSchema = z.object({
  conversation_id: z.string().uuid().optional(),
  message: z.string().min(1, 'Message cannot be empty'),
});

export const skillGapRequestSchema = z.object({
  career_id: z.string().uuid('Valid career UUID required'),
});

export const roadmapRequestSchema = z.object({
  career_id: z.string().uuid('Valid career UUID required'),
  target_months: z.number().int().min(1).max(24).default(3),
});
