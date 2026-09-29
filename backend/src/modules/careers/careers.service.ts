import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export class CareersService {
  /**
   * Retrieves all careers with salary range and demand
   */
  static async getAll() {
    const { data, error } = await supabaseAdmin
      .from('careers')
      .select('*')
      .order('title');

    if (error) throw error;
    return data;
  }

  /**
   * Retrieves specific career along with mapped skill requirements
   */
  static async getById(careerId: string) {
    const { data: career, error: careerError } = await supabaseAdmin
      .from('careers')
      .select('*, career_skills(importance, required_proficiency, weight, skill:skills(id, name, category))')
      .eq('id', careerId)
      .single();

    if (careerError || !career) {
      throw new NotFoundError(`Career with ID ${careerId} not found`);
    }

    return career;
  }

  /**
   * Retrieves student's active career goals
   */
  static async getStudentGoals(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('career_goals')
      .select('*, career:careers(id, title, slug, description)')
      .eq('student_id', studentId)
      .order('priority');

    if (error) throw error;
    return data;
  }

  /**
   * Upserts a student career goal
   */
  static async setStudentGoal(studentId: string, payload: { career_id: string; goal_title?: string; priority?: number; target_date?: string; is_active?: boolean }) {
    const { data, error } = await supabaseAdmin
      .from('career_goals')
      .upsert(
        {
          student_id: studentId,
          ...payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,career_id' }
      )
      .select('*, career:careers(id, title, slug)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Deletes a student career goal
   */
  static async deleteStudentGoal(studentId: string, goalId: string) {
    const { error } = await supabaseAdmin
      .from('career_goals')
      .delete()
      .eq('id', goalId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: goalId, deleted: true };
  }
}
