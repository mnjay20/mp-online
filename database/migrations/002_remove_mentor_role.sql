-- Migration: 002_remove_mentor_role.sql
-- Description: Removes MENTOR role from user_role enum and cleans up mentor-related references

BEGIN;

-- 1. Rename existing enum
ALTER TYPE user_role RENAME TO user_role_old;

-- 2. Create new enum without 'MENTOR'
CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'RECRUITER');

-- 3. Update table columns using this enum
ALTER TABLE students ALTER COLUMN role DROP DEFAULT;
ALTER TABLE students ALTER COLUMN role TYPE user_role USING role::text::user_role;
ALTER TABLE students ALTER COLUMN role SET DEFAULT 'STUDENT'::user_role;

-- 4. Drop the old enum type
DROP TYPE user_role_old;

COMMIT;
