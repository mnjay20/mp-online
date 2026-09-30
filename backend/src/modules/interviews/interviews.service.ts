import { supabaseAdmin } from '../../config/supabase.js';
import { AIService } from '../../services/ai.service.js';
import { InterviewPdfService } from '../../services/interview-pdf.service.js';
import { SupabaseStorageService } from '../../services/storage.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { logger } from '../../lib/logger.js';

export class InterviewsService {
  static async getStudentInterviews(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('interviews')
      .select('*, career:careers(title), questions:interview_questions(*, answers:interview_answers(*))')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async generateInterview(
    studentId: string,
    payload: { career_id?: string; interview_type: string; title?: string; question_count?: number }
  ) {
    const interviewTitle = payload.title || `${payload.interview_type} Interview Simulation`;

    // Create interview record
    const { data: interview, error: interviewError } = await (supabaseAdmin as any)
      .from('interviews')
      .insert({
        student_id: studentId,
        career_id: payload.career_id || null,
        interview_type: payload.interview_type,
        title: interviewTitle,
        status: 'IN_PROGRESS',
      })
      .select()
      .single();

    if (interviewError) throw interviewError;

    // Call AI intelligence service to generate tailored questions
    const aiQuestionsResponse = (await AIService.generateInterviewQuestions({
      student_id: studentId,
      career_id: payload.career_id,
      interview_type: payload.interview_type,
      count: payload.question_count || 5,
    })) as any;

    const questionsList: Array<{ question: string; expected_topics?: string[] }> =
      aiQuestionsResponse.questions || [
        { question: 'Tell me about yourself and your primary technical projects.' },
        { question: 'Describe a challenging technical problem you solved recently.' },
      ];

    // Persist questions in database
    const rowsToInsert = questionsList.map((item, idx) => ({
      interview_id: interview.id,
      question_order: idx + 1,
      question_text: typeof item === 'string' ? item : item.question,
      expected_topics: item.expected_topics || [],
    }));

    const { data: insertedQuestions, error: questionsError } = await (supabaseAdmin as any)
      .from('interview_questions')
      .insert(rowsToInsert)
      .select();

    if (questionsError) throw questionsError;

    return {
      ...interview,
      questions: insertedQuestions,
    };
  }

  static async submitAnswer(studentId: string, interviewId: string, questionId: string, studentAnswer: string) {
    // Verify question ownership
    const { data: question, error: questionError } = await supabaseAdmin
      .from('interview_questions')
      .select('*, interview:interviews(*)')
      .eq('id', questionId)
      .single();

    if (questionError || !question || (question.interview as any)?.student_id !== studentId) {
      throw new NotFoundError('Interview question not found or unauthorized');
    }

    // Call AI to evaluate answer
    const evaluation = (await AIService.evaluateInterviewAnswer({
      question_text: question.question_text,
      student_answer: studentAnswer,
    })) as any;

    // Insert answer record
    const { data: savedAnswer, error: answerError } = await (supabaseAdmin as any)
      .from('interview_answers')
      .insert({
        question_id: questionId,
        student_answer: studentAnswer,
        score: evaluation.score || 75,
        strengths: evaluation.strengths || '',
        weaknesses: evaluation.weaknesses || '',
        ideal_answer_hint: evaluation.ideal_answer_hint || '',
      })
      .select()
      .single();

    if (answerError) throw answerError;
    return savedAnswer;
  }

  static async processTurn(
    studentId: string,
    interviewId: string,
    payload: {
      turn_number: number;
      total_turns: number;
      target_role: string;
      interview_type: string;
      current_question: string;
      student_answer: string;
    }
  ) {
    return await AIService.processInterviewTurn({
      interview_id: interviewId,
      student_id: studentId,
      turn_number: payload.turn_number,
      total_turns: payload.total_turns,
      target_role: payload.target_role,
      interview_type: payload.interview_type,
      current_question: payload.current_question,
      student_answer: payload.student_answer,
    });
  }

  /**
   * Generates comprehensive performance evaluation, saves results & report_data,
   * compiles the official PDF assessment report, and provides persistent signed & stream download links.
   */
  static async generateReport(studentId: string, interviewId: string, careerTitle: string) {
    const { data: interview, error } = await supabaseAdmin
      .from('interviews')
      .select('*, career:careers(title), questions:interview_questions(*, answers:interview_answers(*))')
      .eq('id', interviewId)
      .eq('student_id', studentId)
      .single();

    if (error || !interview) {
      throw new NotFoundError('Interview session not found or unauthorized');
    }

    const turns = (interview.questions || []).map((q: any, idx: number) => {
      const ans = q.answers?.[0] || {};
      return {
        turn_number: idx + 1,
        question: q.question_text,
        answer: ans.student_answer || '',
        score: ans.score || 70,
        strengths: ans.strengths || '',
        weaknesses: ans.weaknesses || '',
        ideal_answer_hint: ans.ideal_answer_hint || '',
      };
    });

    const report = (await AIService.generateInterviewReport({
      student_id: studentId,
      interview_id: interviewId,
      career_title: careerTitle,
      turns,
    })) as any;

    // Fetch candidate metadata for the PDF document
    const { data: studentRecord } = await (supabaseAdmin as any)
      .from('students')
      .select('*, education:student_education(*)')
      .eq('id', studentId)
      .maybeSingle();

    let studentEmail = 'student@example.com';
    if (studentRecord?.user_id) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(studentRecord.user_id);
      if (authUser?.user?.email) {
        studentEmail = authUser.user.email;
      }
    }

    const candidateName = studentRecord
      ? `${studentRecord.first_name || ''} ${studentRecord.last_name || ''}`.trim() || 'Student Candidate'
      : 'Student Candidate';

    const latestEducation = studentRecord?.education?.[0];
    const candidateDegree = latestEducation
      ? `${latestEducation.degree || ''} in ${latestEducation.field_of_study || ''}`.trim()
      : undefined;

    // Generate Vector PDF Report Buffer
    let signedDownloadUrl = '';
    try {
      const pdfBuffer = await InterviewPdfService.generateReportPdf({
        interview_id: interviewId,
        student: {
          name: candidateName,
          email: studentEmail,
          degree: candidateDegree,
        },
        career_title: careerTitle || interview.career?.title || interview.title || 'Software Engineering Professional',
        interview_type: interview.interview_type || 'TECHNICAL',
        completed_at: new Date(),
        overall_score: report.overall_score,
        readiness_level: report.readiness_level || 'INTERVIEW_READY',
        summary_evaluation: report.summary_evaluation,
        radar_metrics: report.radar_metrics,
        top_strengths: report.top_strengths,
        critical_weaknesses: report.critical_weaknesses,
        identified_gap_skills: report.identified_gap_skills,
        turns,
      });

      // Upload PDF to Supabase Storage
      const storageKey = await SupabaseStorageService.uploadReportPdf(studentId, interviewId, pdfBuffer);
      if (storageKey) {
        signedDownloadUrl = await SupabaseStorageService.createReportSignedUrl(storageKey);
      }
    } catch (pdfErr: any) {
      logger.error('Failed to pre-upload interview report PDF:', { error: pdfErr?.message });
    }

    const completedAt = new Date().toISOString();

    // Persist full report_data and metrics in PostgreSQL
    await (supabaseAdmin as any)
      .from('interviews')
      .update({
        status: 'COMPLETED',
        overall_score: report.overall_score,
        technical_score: report.radar_metrics?.['Technical Depth'] || report.overall_score,
        communication_score: report.radar_metrics?.['Communication & Clarity'] || report.overall_score,
        problem_solving_score: report.radar_metrics?.['Problem Solving & Structure'] || report.overall_score,
        feedback: report.summary_evaluation,
        report_data: report,
        pdf_url: signedDownloadUrl || null,
        completed_at: completedAt,
      })
      .eq('id', interviewId);

    return {
      ...report,
      pdf_download_url: `/api/interviews/${interviewId}/report/pdf`,
      storage_pdf_url: signedDownloadUrl || null,
      completed_at: completedAt,
    };
  }

  /**
   * Retrieves the completed interview report and download links.
   */
  static async getReport(studentId: string, interviewId: string) {
    const { data: interview, error } = await supabaseAdmin
      .from('interviews')
      .select('*, career:careers(title)')
      .eq('id', interviewId)
      .eq('student_id', studentId)
      .single();

    if (error || !interview) {
      throw new NotFoundError('Interview session not found or unauthorized');
    }

    if (interview.status !== 'COMPLETED' || !interview.report_data || Object.keys(interview.report_data).length === 0) {
      throw new BadRequestError('Interview report has not been generated yet. Please generate it first.');
    }

    return {
      ...interview.report_data,
      overall_score: interview.overall_score,
      feedback: interview.feedback,
      completed_at: interview.completed_at,
      pdf_download_url: `/api/interviews/${interviewId}/report/pdf`,
      storage_pdf_url: interview.pdf_url || null,
    };
  }

  /**
   * Streams a binary PDF download of the mock interview performance report.
   */
  static async downloadReportPdf(
    studentId: string,
    interviewId: string,
    options?: { view?: string }
  ): Promise<{ buffer: Buffer; filename: string; mimeType: string; isInline: boolean }> {
    const { data: interview, error } = await supabaseAdmin
      .from('interviews')
      .select('*, career:careers(title), questions:interview_questions(*, answers:interview_answers(*))')
      .eq('id', interviewId)
      .eq('student_id', studentId)
      .single();

    if (error || !interview) {
      throw new NotFoundError('Interview session not found or unauthorized');
    }

    // Fetch candidate info
    const { data: studentRecord } = await (supabaseAdmin as any)
      .from('students')
      .select('*, education:student_education(*)')
      .eq('id', studentId)
      .maybeSingle();

    let studentEmail = 'student@example.com';
    if (studentRecord?.user_id) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(studentRecord.user_id);
      if (authUser?.user?.email) {
        studentEmail = authUser.user.email;
      }
    }

    const candidateName = studentRecord
      ? `${studentRecord.first_name || ''} ${studentRecord.last_name || ''}`.trim() || 'Student Candidate'
      : 'Student Candidate';

    const latestEducation = studentRecord?.education?.[0];
    const candidateDegree = latestEducation
      ? `${latestEducation.degree || ''} in ${latestEducation.field_of_study || ''}`.trim()
      : undefined;

    const turns = (interview.questions || []).map((q: any, idx: number) => {
      const ans = q.answers?.[0] || {};
      return {
        turn_number: idx + 1,
        question: q.question_text,
        answer: ans.student_answer || '',
        score: ans.score || 70,
        strengths: ans.strengths || '',
        weaknesses: ans.weaknesses || '',
        ideal_answer_hint: ans.ideal_answer_hint || '',
      };
    });

    const reportData = interview.report_data && Object.keys(interview.report_data).length > 0
      ? interview.report_data
      : {
          overall_score: interview.overall_score || 75,
          readiness_level: (interview.overall_score || 75) >= 75 ? 'INTERVIEW_READY' : 'PROGRESSING',
          summary_evaluation: interview.feedback || 'Candidate completed mock interview assessment.',
          radar_metrics: {
            'Technical Depth': interview.technical_score || 75,
            'Communication & Clarity': interview.communication_score || 80,
            'Problem Solving & Structure': interview.problem_solving_score || 70,
          },
          top_strengths: ['Clear and logical responses', 'Applied fundamental concepts well'],
          critical_weaknesses: ['Add concrete engineering examples to strengthen answers'],
          identified_gap_skills: [],
        };

    const pdfBuffer = await InterviewPdfService.generateReportPdf({
      interview_id: interviewId,
      student: {
        name: candidateName,
        email: studentEmail,
        degree: candidateDegree,
      },
      career_title: interview.career?.title || interview.title || 'Software Engineering Professional',
      interview_type: interview.interview_type || 'TECHNICAL',
      completed_at: interview.completed_at || interview.created_at,
      overall_score: reportData.overall_score || interview.overall_score || 75,
      readiness_level: reportData.readiness_level || 'INTERVIEW_READY',
      summary_evaluation: reportData.summary_evaluation || interview.feedback || '',
      radar_metrics: reportData.radar_metrics,
      top_strengths: reportData.top_strengths,
      critical_weaknesses: reportData.critical_weaknesses,
      identified_gap_skills: reportData.identified_gap_skills,
      turns,
    });

    const sanitizedTitle = (interview.title || 'interview-report')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `${sanitizedTitle}-${interviewId.substring(0, 8)}.pdf`;

    return {
      buffer: pdfBuffer,
      filename,
      mimeType: 'application/pdf',
      isInline: options?.view === 'inline',
    };
  }
}
