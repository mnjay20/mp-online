import { supabaseAdmin } from '../../config/supabase.js';
import { AIService } from '../../services/ai.service.js';
import { ResumeParserService } from '../../services/resume-parser.service.js';
import { SupabaseStorageService } from '../../services/storage.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

export class ResumeService {
  /**
   * Retrieves all resumes and their ATS analysis reports for a student.
   */
  static async getStudentResumes(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*, resume_analyses(*)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Complete End-to-End Pipeline:
   * 1. In-memory file text extraction (PDF / DOCX)
   * 2. Secure upload to private Supabase Storage bucket
   * 3. AI-driven ATS analysis via Gemini 3.5 Flash Lite
   * 4. Persisting resume record and detailed ATS findings in PostgreSQL
   * 5. Generating secure time-limited signed download link
   */
  static async uploadAndAnalyze(
    studentId: string,
    userId: string,
    file: Express.Multer.File,
    targetRole = 'Software Engineer',
    targetCareerId?: string
  ) {
    if (!file) {
      throw new BadRequestError('No resume file provided in request.');
    }

    // Step 1: In-memory text extraction
    const parsedText = await ResumeParserService.extractRawText(
      file.buffer,
      file.mimetype,
      file.originalname
    );

    // Step 2: Secure upload to Supabase Storage
    const storagePath = await SupabaseStorageService.uploadResume(
      userId,
      file.originalname,
      file.buffer,
      file.mimetype
    );

    // Step 3: Determine version and unset previous active current resume
    const { data: existingResumes } = await supabaseAdmin
      .from('resumes')
      .select('version')
      .eq('student_id', studentId)
      .order('version', { ascending: false })
      .limit(1);

    const nextVersion = (existingResumes?.[0]?.version || 0) + 1;

    await (supabaseAdmin as any)
      .from('resumes')
      .update({ is_current: false })
      .eq('student_id', studentId);

    // Step 4: Persist resume entity in PostgreSQL
    const { data: resumeRecord, error: resumeError } = await (supabaseAdmin as any)
      .from('resumes')
      .insert({
        student_id: studentId,
        file_name: file.originalname,
        storage_path: storagePath,
        version: nextVersion,
        is_current: true,
        parsed_text: parsedText,
        file_size_bytes: file.size,
        mime_type: file.mimetype,
      })
      .select()
      .single();

    if (resumeError) {
      // Rollback uploaded storage file on DB insertion failure
      await SupabaseStorageService.deleteResume(storagePath);
      throw resumeError;
    }

    // Step 5: AI-driven ATS Analysis
    const atsAnalysis = await AIService.analyzeResume({
      resume_text: parsedText,
      target_role: targetRole,
      target_career_id: targetCareerId,
    }) as any;

    // Step 6: Persist ATS analysis findings
    const { data: savedAnalysis, error: analysisError } = await (supabaseAdmin as any)
      .from('resume_analyses')
      .insert({
        resume_id: resumeRecord.id,
        student_id: studentId,
        target_career_id: targetCareerId || null,
        overall_score: atsAnalysis.overall_score || 75,
        ats_score: atsAnalysis.ats_score || 70,
        extracted_skills: atsAnalysis.extracted_skills || [],
        missing_skills: atsAnalysis.missing_skills || [],
        strengths: atsAnalysis.strengths || [],
        improvements: atsAnalysis.improvements || [],
        critique_markdown: atsAnalysis.critique_markdown || '',
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Step 7: Generate secure signed download link (1 hour expiry)
    const downloadUrl = await SupabaseStorageService.createSignedUrl(storagePath, 3600);

    return {
      resume: resumeRecord,
      analysis: savedAnalysis,
      download_url: downloadUrl,
    };
  }

  /**
   * Generates a secure, temporary signed download link for an existing resume.
   */
  static async getDownloadUrl(studentId: string, resumeId: string): Promise<string> {
    const { data: resume, error } = await supabaseAdmin
      .from('resumes')
      .select('storage_path')
      .eq('id', resumeId)
      .eq('student_id', studentId)
      .single();

    if (error || !resume) {
      throw new NotFoundError(`Resume with ID ${resumeId} not found or unauthorized.`);
    }

    return await SupabaseStorageService.createSignedUrl(resume.storage_path, 3600);
  }

  /**
   * Analyzes an already registered resume on demand.
   */
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

    const analysisResponse = await AIService.analyzeResume({
      resume_text: resume.parsed_text || '',
      target_career_id: targetCareerId,
      target_role: targetRole,
    }) as any;

    const { data: savedAnalysis, error: saveError } = await (supabaseAdmin as any)
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
