import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export class AuthService {
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
