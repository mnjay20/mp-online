import { supabaseAdmin } from '../../config/supabase.js';
import { AIService } from '../../services/ai.service.js';
import { NotFoundError } from '../../utils/errors.js';

export class ResumeService {
  static async getStudentResumes(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*, resume_analyses(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async registerResume(studentId: string, payload: Record<string, unknown>) {
    // If setting as current, unset existing current resumes
    if (payload.is_current) {
      await supabaseAdmin
        .from('resumes')
        .update({ is_current: false })
        .eq('student_id', studentId);
    }

    const { data, error } = await supabaseAdmin
      .from('resumes')
      .insert({ student_id: studentId, ...payload })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async analyzeResume(studentId: string, resumeId: string, targetCareerId?: string, targetRole?: string) {
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('student_id', studentId)
      .single();

    if (resumeError || !resume) {
      throw new NotFoundError(`Resume with ID ${resumeId} not found`);
    }

    // Call AI intelligence service
    const analysisResponse = await AIService.analyzeResume({
      resume_text: resume.parsed_text || '',
      target_career_id: targetCareerId,
      target_role: targetRole,
    }) as any;

    // Persist analysis in database
    const { data: savedAnalysis, error: saveError } = await supabaseAdmin
      .from('resume_analyses')
      .insert({
        resume_id: resumeId,
        student_id: studentId,
        target_career_id: targetCareerId || null,
        overall_score: analysisResponse.overall_score || 75,
        ats_score: analysisResponse.ats_score || 70,
        extracted_skills: analysisResponse.extracted_skills || [],
        missing_skills: analysisResponse.missing_skills || [],
        strengths: analysisResponse.strengths || [],
        improvements: analysisResponse.improvements || [],
        critique_markdown: analysisResponse.critique_markdown || analysisResponse.message || '',
      })
      .select()
      .single();

    if (saveError) throw saveError;
    return savedAnalysis;
  }
}
