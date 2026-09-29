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
    const { data: interview, error: interviewError } = await supabaseAdmin
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

    const { data: insertedQuestions, error: questionsError } = await supabaseAdmin
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

    if (questionError || !question || question.interview?.student_id !== studentId) {
      throw new NotFoundError('Interview question not found or unauthorized');
    }

    // Call AI to evaluate answer
    const evaluation = await AIService.evaluateInterviewAnswer({
      question_text: question.question_text,
      student_answer: studentAnswer,
    }) as any;

    // Insert answer record
    const { data: savedAnswer, error: answerError } = await supabaseAdmin
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
}
