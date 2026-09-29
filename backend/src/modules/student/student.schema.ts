import { z } from 'zod';

export const upsertStudentProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(25).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().max(30).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('India'),
  bio: z.string().max(1000).optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
});

export const createEducationSchema = z.object({
  institution_name: z.string().min(1).max(255),
  degree: z.string().min(1).max(150),
  field_of_study: z.string().min(1).max(150),
  start_year: z.number().int().min(1980).max(2100),
  end_year: z.number().int().min(1980).max(2100).optional(),
  grade_point_avg: z.number().min(0).max(10).optional(),
  is_current: z.boolean().default(false),
});

export const createAcademicRecordSchema = z.object({
  subject_id: z.string().uuid().optional(),
  subject_name: z.string().min(1).max(200),
  semester: z.number().int().min(1).max(12),
  academic_year: z.string().min(4).max(20),
  marks: z.number().min(0).max(100).optional(),
  grade: z.string().max(5).optional(),
  credits: z.number().int().min(1).max(10).default(3),
});

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  github_url: z.string().url().optional().or(z.literal('')),
  live_url: z.string().url().optional().or(z.literal('')),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_featured: z.boolean().default(false),
  skill_ids: z.array(z.string().uuid()).optional(),
});

export const createCertificationSchema = z.object({
  name: z.string().min(1).max(255),
  issuing_organization: z.string().min(1).max(200),
  credential_id: z.string().max(150).optional(),
  credential_url: z.string().url().optional().or(z.literal('')),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  skill_ids: z.array(z.string().uuid()).optional(),
});
