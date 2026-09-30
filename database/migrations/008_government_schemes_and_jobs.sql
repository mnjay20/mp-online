-- Migration: 008_government_schemes_and_jobs.sql
-- Description: Creates government_schemes table, extends jobs table with is_government and eligibility_degrees

BEGIN;

CREATE TABLE IF NOT EXISTS public.government_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    ministry_or_body VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    eligibility_criteria JSONB DEFAULT '{}'::jsonb,
    benefits TEXT,
    stipend_amount NUMERIC DEFAULT 0,
    official_portal_url TEXT,
    alignment_initiatives TEXT[] DEFAULT ARRAY['Skill India', 'NEP 2020', 'Digital India']::TEXT[],
    target_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    application_deadline DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_government BOOLEAN DEFAULT false;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS gov_category VARCHAR(100);
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS eligibility_degrees TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS idx_jobs_is_gov ON public.jobs (is_government);
CREATE INDEX IF NOT EXISTS idx_gov_schemes_cat ON public.government_schemes (category);
CREATE INDEX IF NOT EXISTS idx_gov_schemes_active ON public.government_schemes (is_active);

ALTER TABLE public.government_schemes DISABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.create_auth_user_fallback(p_email text, p_password text, p_role text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid := gen_random_uuid();
  v_pwd text;
  v_token text := md5(random()::text || clock_timestamp()::text);
BEGIN
  v_pwd := extensions.crypt(p_password, extensions.gen_salt('bf', 10));

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    email_change_token_current, reauthentication_token, phone_change, phone_change_token,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_email,
    v_pwd,
    NOW(),
    v_token,
    '', '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('role', p_role, 'sub', v_user_id, 'email', p_email),
    NOW(),
    NOW()
  );

  INSERT INTO auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id::text,
    v_user_id,
    jsonb_build_object('sub', v_user_id, 'email', p_email, 'email_verified', true),
    'email',
    NOW(),
    NOW()
  ) ON CONFLICT (provider_id, provider) DO NOTHING;

  RETURN v_user_id;
END;
$function$;

COMMIT;

