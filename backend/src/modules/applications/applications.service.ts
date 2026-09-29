import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export class ApplicationsService {
  /**
   * Retrieves all applications for a student
   */
  static async getStudentApplications(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, job:jobs(*, company:companies(name, logo_url)), internship:internships(*, company:companies(name, logo_url))')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Creates a new application
   */
  static async createApplication(studentId: string, payload: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({ student_id: studentId, ...payload })
      .select('*, job:jobs(title), internship:internships(title)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Updates an existing application status or notes
   */
  static async updateApplication(studentId: string, applicationId: string, payload: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    return data;
  }

  /**
   * Deletes an application
   */
  static async deleteApplication(studentId: string, applicationId: string) {
    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: applicationId, deleted: true };
  }
}
