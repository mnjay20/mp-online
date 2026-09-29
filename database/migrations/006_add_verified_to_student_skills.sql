-- Migration: 006_add_verified_to_student_skills.sql
-- Description: Adds verified boolean column to student_skills for ATS matching bonuses

BEGIN;

ALTER TABLE student_skills ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

COMMIT;
