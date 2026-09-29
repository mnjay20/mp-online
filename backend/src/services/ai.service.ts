import { env } from '../config/env.js';
import { AIServiceError } from '../utils/errors.js';
import { logger } from '../lib/logger.js';

export class AIService {
  private static baseUrl = env.AI_SERVICE_URL;

  private static async post<TRequest, TResponse>(path: string, payload: TRequest): Promise<TResponse> {
    const url = `${this.baseUrl}${path}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error(`AI service responded with status ${response.status} on ${path}`, { errorData });
        throw new AIServiceError(
          `AI service request failed with status ${response.status}`,
          errorData
        );
      }

      return (await response.json()) as TResponse;
    } catch (err: unknown) {
      if (err instanceof AIServiceError) {
        throw err;
      }
      logger.error(`Failed to connect to AI service at ${url}`, { error: String(err) });
      throw new AIServiceError('Unable to reach the AI intelligence service');
    }
  }

  static async chat(payload: { conversation_id?: string; student_id: string; message: string }) {
    return this.post('/ai/chat', payload);
  }

  static async recommendCareer(payload: { student_id: string }) {
    return this.post('/ai/career/recommend', payload);
  }

  static async analyzeSkillGap(payload: { student_id: string; career_id: string }) {
    return this.post('/ai/career/skill-gap', payload);
  }

  static async generateRoadmap(payload: { student_id: string; career_id: string; target_months?: number }) {
    return this.post('/ai/roadmap/generate', payload);
  }

  static async analyzeResume(payload: { resume_text: string; target_career_id?: string; target_role?: string }) {
    return this.post('/ai/resume/analyze', payload);
  }

  static async improveResumeBullet(payload: { bullet_point: string; target_role: string }) {
    return this.post('/ai/resume/improve', payload);
  }

  static async generateInterviewQuestions(payload: { student_id: string; career_id?: string; interview_type: string; count?: number }) {
    return this.post('/ai/interview/generate', payload);
  }

  static async evaluateInterviewAnswer(payload: { question_text: string; student_answer: string; target_career?: string }) {
    return this.post('/ai/interview/evaluate', payload);
  }

  static async matchJobs(payload: { student_id: string; job_ids?: string[] }) {
    return this.post('/ai/match/jobs', payload);
  }

  static async matchInternships(payload: { student_id: string; internship_ids?: string[] }) {
    return this.post('/ai/match/internships', payload);
  }

  static async recommendGapCourses(payload: {
    skills: string[];
    student_id?: string;
    career_title?: string;
    max_web_results_per_skill?: number;
  }) {
    return this.post('/ai/courses/recommend-gap-courses', payload);
  }
}
