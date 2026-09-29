import { z } from 'zod';

export const interviewTypeEnum = z.enum(['TECHNICAL', 'HR', 'BEHAVIORAL', 'ROLE_SPECIFIC', 'MIXED']);

export const generateInterviewSchema = z.object({
  career_id: z.string().uuid().optional(),
  interview_type: interviewTypeEnum.default('MIXED'),
  title: z.string().max(200).optional(),
  question_count: z.number().int().min(1).max(10).default(5),
});

export const submitAnswerSchema = z.object({
  question_id: z.string().uuid('Valid question UUID required'),
  student_answer: z.string().min(1, 'Answer cannot be empty'),
});
