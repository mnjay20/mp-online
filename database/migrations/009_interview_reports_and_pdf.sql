-- Migration: 009_interview_reports_and_pdf.sql
-- Description: Adds report_data, pdf_url, completed_at to interviews table and ensures storage bucket for reports exists

BEGIN;

ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS report_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Ensure reports bucket exists in storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('reports', 'reports', false, 10485760, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf']::text[];

COMMIT;
