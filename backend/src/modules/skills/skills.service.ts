import { supabaseAdmin } from '../../config/supabase.js';

export class SkillsService {
  /**
   * Retrieves master catalog of skills with categories
   */
  static async getCatalog(category?: string) {
    let query = supabaseAdmin.from('skills').select('*').order('name');
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Retrieves student's current skills
   */
  static async getStudentSkills(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('student_skills')
      .select('id, proficiency, source, years_experience, created_at, skill:skills(id, name, category, description)')
      .eq('student_id', studentId);

    if (error) throw error;
    return data;
  }

  /**
   * Adds or upserts a skill to student's profile
   */
  static async addStudentSkill(studentId: string, payload: { skill_id: string; proficiency: string; source?: string; years_experience?: number }) {
    const { data, error } = await supabaseAdmin
      .from('student_skills')
      .upsert(
        {
          student_id: studentId,
          ...payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,skill_id' }
      )
      .select('*, skill:skills(id, name, category)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Updates student skill proficiency
   */
  static async updateStudentSkill(studentId: string, recordId: string, payload: { proficiency?: string; years_experience?: number }) {
    const { data, error } = await supabaseAdmin
      .from('student_skills')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', recordId)
      .eq('student_id', studentId)
      .select('*, skill:skills(id, name, category)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Removes a skill from student profile
   */
  static async removeStudentSkill(studentId: string, recordId: string) {
    const { error } = await supabaseAdmin
      .from('student_skills')
      .delete()
      .eq('id', recordId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: recordId, deleted: true };
  }
}
