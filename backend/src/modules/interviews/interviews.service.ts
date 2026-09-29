import { supabaseAdmin } from '../../config/supabase.js';
import { AIService } from '../../services/ai.service.js';
import { NotFoundError } from '../../utils/errors.js';

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

  static async generateInterview(studentId: string, payload: { career_id?: string; interview_type: string; title?: string; question_count?: number }) {
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
    const aiQuestionsResponse = await AIService.generateInterviewQuestions({
      student_id: studentId,
      career_id: payload.career_id,
      interview_type: payload.interview_type,
      count: payload.question_count || 5,
    }) as any;

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
    const evaluation = await AIService.evaluateInterviewAnswer({
      question_text: question.question_text,
      student_answer: studentAnswer,
    }) as any;

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

  static async generateReport(studentId: string, interviewId: string, careerTitle: string) {
    const { data: interview, error } = await supabaseAdmin
      .from('interviews')
      .select('*, questions:interview_questions(*, answers:interview_answers(*))')
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
      };
    });

    const report = await AIService.generateInterviewReport({
      student_id: studentId,
      interview_id: interviewId,
      career_title: careerTitle,
      turns,
    }) as any;

    await (supabaseAdmin as any)
      .from('interviews')
      .update({
        status: 'COMPLETED',
        overall_score: report.overall_score,
        technical_score: report.radar_metrics?.['Technical Depth'] || report.overall_score,
        communication_score: report.radar_metrics?.['Communication & Clarity'] || report.overall_score,
        problem_solving_score: report.radar_metrics?.['Problem Solving & Structure'] || report.overall_score,
        feedback: report.summary_evaluation,
      })
      .eq('id', interviewId);

    return report;
  }
}
