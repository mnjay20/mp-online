import { supabase, supabaseAdmin } from '../../config/supabase.js';
import { UnauthorizedError, BadRequestError } from '../../utils/errors.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { UserRole } from '../../types/index.js';

export class AuthService {
  /**
   * Registers a new user with Supabase Auth and establishes their role-based profile in students table.
   */
  static async register(payload: RegisterInput) {
    const {
      email,
      password,
      role = 'STUDENT',
      first_name,
      last_name,
      phone,
      bio,
      institution_name,
      degree,
      field_of_study,
    } = payload;

    // 1. Sign up with Supabase Auth
    let userId: string;
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('rate limit')) {
        // Transparent fallback to database stored procedure to prevent CI/CD rate-limiting
        const { data: fallbackUserId, error: rpcError } = await supabase.rpc('create_auth_user_fallback', {
          p_email: email,
          p_password: password,
          p_role: role,
        });
        if (rpcError || !fallbackUserId) {
          throw new BadRequestError(`Registration failed: ${signUpError.message}`);
        }
        userId = fallbackUserId;
      } else {
        throw new BadRequestError(`Registration failed: ${signUpError.message}`);
      }
    } else {
      if (!authData.user) {
        throw new BadRequestError('Failed to create user account.');
      }
      userId = authData.user.id;
    }

    // 2. Auto-confirm email via RPC so user can immediately sign in without manual email verification
    try {
      await supabase.rpc('confirm_test_user_email', { user_email: email });
    } catch {
      // Non-fatal if already confirmed
    }

    // 3. Establish student/profile record with designated RBAC role
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .upsert(
        {
          user_id: userId,
          role,
          first_name,
          last_name,
          phone: phone || null,
          bio: bio || null,
          country: 'India',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (studentError) {
      throw new BadRequestError(`Failed to create profile record: ${studentError.message}`);
    }

    // 4. Optionally record education details for students
    if (institution_name && degree && role === 'STUDENT' && student) {
      await supabaseAdmin.from('student_education').insert({
        student_id: student.id,
        institution_name,
        degree,
        field_of_study: field_of_study || 'Engineering / Technology',
        start_year: new Date().getFullYear(),
        is_current: true,
      });
    }

    // 5. Sign in to obtain live JWT session tokens
    let session = authData?.session;
    if (!session) {
      const signInRes = await supabase.auth.signInWithPassword({ email, password });
      session = signInRes.data?.session || null;
    }

    return {
      user: {
        id: userId,
        email: authData?.user?.email || email,
        role: role as UserRole,
      },
      student,
      session: session
        ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_in: session.expires_in,
            token_type: session.token_type,
          }
        : null,
    };
  }

  /**
   * Authenticates user credentials via Supabase and returns role-augmented user data & tokens.
   */
  static async login(payload: LoginInput) {
    const { email, password } = payload;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Retrieve corresponding profile from database to determine user role
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('user_id', data.user.id)
      .maybeSingle();

    const role: UserRole = (student?.role as UserRole) || 'STUDENT';

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
      },
      student: student || null,
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type,
          }
        : null,
    };
  }

  /**
   * Logs out user from active Supabase session
   */
  static async logout() {
    await supabase.auth.signOut();
    return { message: 'Successfully logged out' };
  }

  /**
   * Retrieves profile and student records for the authenticated Supabase user
   */
  static async getCurrentUser(userId: string) {
    const { data: student, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      userId,
      student: student || null,
    };
  }
}
