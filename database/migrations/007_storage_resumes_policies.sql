-- Migration: 007_storage_resumes_policies.sql
-- Description: Adds RLS policies to storage.objects for private resumes bucket operations

BEGIN;

CREATE POLICY "Allow backend and authenticated upload to resumes" ON storage.objects
FOR ALL
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

COMMIT;
