import { supabaseAdmin } from '../../config/supabase.js';

export class RecommendationsService {
  static async getStudentRecommendations(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('recommendations')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async dismissRecommendation(studentId: string, recommendationId: string) {
    const { error } = await supabaseAdmin
      .from('recommendations')
      .update({ is_dismissed: true })
      .eq('id', recommendationId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: recommendationId, dismissed: true };
  }
}
