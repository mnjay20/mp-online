import { z } from 'zod';

export const applicationStatusEnum = z.enum([
  'SAVED',
  'APPLIED',
  'SCREENING',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
  'WITHDRAWN',
]);

export const createApplicationSchema = z
  .object({
    job_id: z.string().uuid().optional(),
    internship_id: z.string().uuid().optional(),
    status: applicationStatusEnum.default('SAVED'),
    notes: z.string().max(1000).optional(),
    applied_at: z.string().optional(),
  })
  .refine(
    (data) => (data.job_id && !data.internship_id) || (!data.job_id && data.internship_id),
    {
      message: 'Application must reference either a job_id OR an internship_id, but not both.',
      path: ['job_id'],
    }
  );

export const updateApplicationSchema = z.object({
  status: applicationStatusEnum.optional(),
  notes: z.string().max(1000).optional(),
  applied_at: z.string().optional(),
});
