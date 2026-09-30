import { z } from 'zod';

export const userRoleEnum = z.enum(['STUDENT', 'RECRUITER', 'ADMIN']);

export const registerSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: userRoleEnum.default('STUDENT'),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(25).optional(),
  bio: z.string().max(1000).optional(),
  institution_name: z.string().max(255).optional(),
  degree: z.string().max(150).optional(),
  field_of_study: z.string().max(150).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
