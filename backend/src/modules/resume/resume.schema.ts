import { z } from 'zod';

export const registerResumeSchema = z.object({
  file_name: z.string().min(1).max(255),
  storage_path: z.string().min(1),
  parsed_text: z.string().optional(),
  file_size_bytes: z.number().int().positive().optional(),
  mime_type: z.string().default('application/pdf'),
  is_current: z.boolean().default(true),
});

export const analyzeResumeSchema = z.object({
  target_career_id: z.string().uuid().optional(),
  target_role: z.string().optional(),
});
