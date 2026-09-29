import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export class StudentService {
  /**
   * Helper to fetch student record for authenticated user_id
   */
  static async getStudentByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Helper to ensure student exists or throw NotFoundError
   */
  static async requireStudent(userId: string) {
    const student = await this.getStudentByUserId(userId);
    if (!student) {
      throw new NotFoundError('Student profile not found. Please create your profile first.');
    }
    return student;
  }

  // --- Profile ---
  static async upsertProfile(userId: string, profileData: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('students')
      .upsert(
        {
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- Education ---
  static async getEducation(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('student_education')
      .select('*')
      .eq('student_id', studentId)
      .order('start_year', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addEducation(studentId: string, payload: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('student_education')
      .insert({ student_id: studentId, ...payload })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteEducation(studentId: string, educationId: string) {
    const { error } = await supabaseAdmin
      .from('student_education')
      .delete()
      .eq('id', educationId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: educationId, deleted: true };
  }

  // --- Academics ---
  static async getAcademics(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('academic_records')
      .select('*')
      .eq('student_id', studentId)
      .order('semester', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async addAcademicRecord(studentId: string, payload: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('academic_records')
      .insert({ student_id: studentId, ...payload })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAcademicRecord(studentId: string, recordId: string) {
    const { error } = await supabaseAdmin
      .from('academic_records')
      .delete()
      .eq('id', recordId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: recordId, deleted: true };
  }

  // --- Projects ---
  static async getProjects(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*, project_skills(skill_id, skills(id, name, category))')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addProject(studentId: string, payload: { skill_ids?: string[]; [key: string]: unknown }) {
    const { skill_ids, ...projectFields } = payload;
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({ student_id: studentId, ...projectFields })
      .select()
      .single();

    if (error) throw error;

    if (skill_ids && skill_ids.length > 0) {
      const links = skill_ids.map((skillId) => ({
        project_id: project.id,
        skill_id: skillId,
      }));
      await supabaseAdmin.from('project_skills').insert(links);
    }

    return project;
  }

  static async deleteProject(studentId: string, projectId: string) {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: projectId, deleted: true };
  }

  // --- Certifications ---
  static async getCertifications(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('certifications')
      .select('*, certification_skills(skill_id, skills(id, name))')
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async addCertification(studentId: string, payload: { skill_ids?: string[]; [key: string]: unknown }) {
    const { skill_ids, ...certFields } = payload;
    const { data: cert, error } = await supabaseAdmin
      .from('certifications')
      .insert({ student_id: studentId, ...certFields })
      .select()
      .single();

    if (error) throw error;

    if (skill_ids && skill_ids.length > 0) {
      const links = skill_ids.map((skillId) => ({
        certification_id: cert.id,
        skill_id: skillId,
      }));
      await supabaseAdmin.from('certification_skills').insert(links);
    }

    return cert;
  }

  static async deleteCertification(studentId: string, certId: string) {
    const { error } = await supabaseAdmin
      .from('certifications')
      .delete()
      .eq('id', certId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: certId, deleted: true };
  }
}
