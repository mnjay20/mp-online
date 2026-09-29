import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export class CoursesService {
  /**
   * Retrieves courses with course_skills
   */
  static async getAll(skillId?: string, difficulty?: string) {
    let query = supabaseAdmin
      .from('courses')
      .select('*, course_skills(skill:skills(id, name))')
      .order('rating', { ascending: false });

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (skillId) {
      return (data || []).filter((course: any) =>
        course.course_skills?.some((cs: any) => cs.skill?.id === skillId)
      );
    }

    return data;
  }

  static async getById(courseId: string) {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*, course_skills(skill:skills(id, name, category))')
      .eq('id', courseId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Course with ID ${courseId} not found`);
    }

    return data;
  }

  /**
   * Retrieves student's enrolled courses and progress
   */
  static async getStudentProgress(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('learning_progress')
      .select('*, course:courses(*)')
      .eq('student_id', studentId);

    if (error) throw error;
    return data;
  }

  /**
   * Updates student's progress in a course
   */
  static async updateProgress(studentId: string, courseId: string, progressPercent: number, status: string) {
    const completedAt = progressPercent === 100 ? new Date().toISOString() : null;

    const { data, error } = await supabaseAdmin
      .from('learning_progress')
      .upsert(
        {
          student_id: studentId,
          course_id: courseId,
          progress_percent: progressPercent,
          status,
          completed_at: completedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,course_id' }
      )
      .select('*, course:courses(id, title)')
      .single();

    if (error) throw error;
    return data;
  }
}
