import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';
import { CreateCourseInput } from './courses.schema.js';

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
   * Creates a new course and links associated skills (Admin functionality)
   */
  static async create(payload: CreateCourseInput) {
    const { skill_ids, ...courseData } = payload;

    const { data: newCourse, error: insertError } = await (supabaseAdmin as any)
      .from('courses')
      .insert({
        title: courseData.title,
        provider: courseData.provider,
        description: courseData.description,
        url: courseData.url,
        difficulty: courseData.difficulty,
        duration_hours: courseData.duration_hours,
        is_free: courseData.is_free,
        price: courseData.price,
        rating: courseData.rating,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Associate skills if provided
    if (skill_ids && skill_ids.length > 0) {
      const skillRows = skill_ids.map((skillId: string) => ({
        course_id: newCourse.id,
        skill_id: skillId,
      }));

      const { error: skillsError } = await (supabaseAdmin as any)
        .from('course_skills')
        .insert(skillRows);

      if (skillsError) {
        // Rollback course insertion on failure
        await supabaseAdmin.from('courses').delete().eq('id', newCourse.id);
        throw skillsError;
      }
    }

    return await this.getById(newCourse.id);
  }

  /**
   * Deletes a course (Admin functionality)
   * Associated course_skills and learning_progress records are automatically deleted via ON DELETE CASCADE.
   */
  static async delete(courseId: string) {
    await this.getById(courseId); // Throws NotFoundError if course does not exist

    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) throw error;

    return {
      id: courseId,
      message: `Course ${courseId} successfully removed`,
      deleted: true,
    };
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
