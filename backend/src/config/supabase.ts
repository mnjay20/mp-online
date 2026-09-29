import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Public/Anon client for general operations and user-level token validation
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Privileged Admin client using the Service Role Key for server-side management
 * NEVER expose this to clients or client responses.
 */
const adminKey =
  env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
    ? env.SUPABASE_SERVICE_ROLE_KEY
    : env.SUPABASE_ANON_KEY;

export const supabaseAdmin = createClient(env.SUPABASE_URL, adminKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Factory creating an authenticated client scoped to the student's JWT token,
 * allowing PostgreSQL Row Level Security (RLS) policies to apply directly.
 */
export const createScopedClient = (token: string) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
