import { z } from 'zod';

export const workModeEnum = z.enum(['REMOTE', 'HYBRID', 'ONSITE']);
export const employmentTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']);
export const proficiencyLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);

export const jobSkillInputSchema = z.object({
  skill_id: z.string().uuid('Valid skill UUID required'),
  weight: z.number().min(0.1).max(10.0).default(1.0),
  is_required: z.boolean().default(true),
  required_proficiency: proficiencyLevelEnum.default('BEGINNER'),
});

export const createJobSchema = z.object({
  company_id: z.string().uuid('Valid company UUID required'),
  title: z.string().min(2, 'Job title must be at least 2 characters').max(255),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  location: z.string().default('Remote'),
  work_mode: workModeEnum.default('REMOTE'),
  employment_type: employmentTypeEnum.default('FULL_TIME'),
  experience_min: z.number().int().min(0).default(0),
  experience_max: z.number().int().min(0).default(3),
  salary_min: z.number().positive().optional(),
  salary_max: z.number().positive().optional(),
  source_url: z.string().url().optional(),
  expires_at: z.string().datetime().optional(),
  skills: z.array(jobSkillInputSchema).min(1, 'Specify at least one skill requirement with weight'),
});

export const createInternshipSchema = z.object({
  company_id: z.string().uuid('Valid company UUID required'),
  title: z.string().min(2, 'Internship title must be at least 2 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().default('Remote'),
  work_mode: workModeEnum.default('REMOTE'),
  duration: z.string().default('3 Months'),
  stipend: z.string().default('Unpaid'),
  source_url: z.string().url().optional(),
  expires_at: z.string().datetime().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
