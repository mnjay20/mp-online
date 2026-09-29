import { z } from 'zod';

export const proficiencyEnum = z.enum(['BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);
export const skillSourceEnum = z.enum(['SELF_REPORTED', 'ASSESSMENT', 'PROJECT', 'CERTIFICATION', 'AI_INFERRED']);

export const addStudentSkillSchema = z.object({
  skill_id: z.string().uuid('Valid skill UUID required'),
  proficiency: proficiencyEnum.default('BEGINNER'),
  source: skillSourceEnum.default('SELF_REPORTED'),
  years_experience: z.number().min(0).max(50).default(0),
});

export const updateStudentSkillSchema = z.object({
  proficiency: proficiencyEnum.optional(),
  years_experience: z.number().min(0).max(50).optional(),
});
