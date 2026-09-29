-- Migration: 004_recruiter_and_ats_workflows.sql
-- Description: Adds ATS status values to application_status enum, enhances job_skills with weights, and adds match_score to applications

BEGIN;

-- 1. Extend application_status enum with recruiter ATS stages
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'REVIEWING';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'INTERVIEW_SCHEDULED';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'OFFER';

-- 2. Enhance job_skills with skill weights and required proficiency
ALTER TABLE job_skills ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 1.0;
ALTER TABLE job_skills ADD COLUMN IF NOT EXISTS required_proficiency proficiency_level DEFAULT 'BEGINNER';

-- 3. Enhance applications table with candidate match score and status audit history
ALTER TABLE applications ADD COLUMN IF NOT EXISTS match_score NUMERIC DEFAULT 0;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS match_breakdown JSONB DEFAULT '{}'::jsonb;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

COMMIT;
