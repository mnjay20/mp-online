import { supabaseAdmin } from '../../config/supabase.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

const PROFICIENCY_RANK: Record<string, number> = {
  BEGINNER: 1,
  ELEMENTARY: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5,
};

/**
 * ATS State Machine Transitions
 * Follows required progression: APPLIED -> REVIEWING -> INTERVIEW_SCHEDULED -> OFFER / REJECTED
 */
export const VALID_ATS_TRANSITIONS: Record<string, string[]> = {
  SAVED: ['APPLIED', 'WITHDRAWN'],
  APPLIED: ['REVIEWING', 'REJECTED', 'WITHDRAWN'],
  REVIEWING: ['INTERVIEW_SCHEDULED', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW_SCHEDULED: ['OFFER', 'REJECTED', 'WITHDRAWN'],
  OFFER: ['SELECTED', 'REJECTED', 'WITHDRAWN'],
  // Legacy / fallback stage support
  SCREENING: ['REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'WITHDRAWN'],
  SHORTLISTED: ['INTERVIEW_SCHEDULED', 'INTERVIEW', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW: ['OFFER', 'SELECTED', 'REJECTED', 'WITHDRAWN'],
  SELECTED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export class ApplicationsService {
  /**
   * Computes a candidate match score comparing student skills against job skill requirements
   */
  static async calculateCandidateMatchScore(studentId: string, jobId: string) {
    // 1. Fetch job required skills with weights
    const { data: jobSkills, error: jsError } = await supabaseAdmin
      .from('job_skills')
      .select('skill_id, weight, is_required, required_proficiency, skill:skills(id, name, category)')
      .eq('job_id', jobId);

    if (jsError) throw jsError;

    if (!jobSkills || jobSkills.length === 0) {
      return {
        score: 100,
        total_weight: 0,
        earned_weight: 0,
        total_skills: 0,
        matched_count: 0,
        matched_skills: [],
        missing_skills: [],
      };
    }

    // 2. Fetch student skills
    const { data: studentSkills, error: ssError } = await supabaseAdmin
      .from('student_skills')
      .select('skill_id, proficiency, verified, skill:skills(id, name, category)')
      .eq('student_id', studentId);

    if (ssError) throw ssError;

    const studentSkillMap = new Map<string, { proficiency: string; verified: boolean; name: string }>();
    (studentSkills || []).forEach((ss: any) => {
      studentSkillMap.set(ss.skill_id, {
        proficiency: ss.proficiency || 'BEGINNER',
        verified: !!ss.verified,
        name: ss.skill?.name || 'Unknown',
      });
    });

    let totalWeight = 0;
    let earnedWeight = 0;
    const matchedSkills: any[] = [];
    const missingSkills: any[] = [];

    for (const js of jobSkills) {
      const weight = Number(js.weight) || 1.0;
      totalWeight += weight;
      const skillName = (js.skill as any)?.name || 'Unknown';
      const requiredProf = js.required_proficiency || 'BEGINNER';
      const reqRank = PROFICIENCY_RANK[requiredProf] || 1;

      const studentSkill = studentSkillMap.get(js.skill_id);

      if (studentSkill) {
        const studentRank = PROFICIENCY_RANK[studentSkill.proficiency] || 1;
        // Ratio of student proficiency level to required proficiency level (capped at 1.0)
        let ratio = Math.min(1.0, studentRank / reqRank);
        // Bonus for verified skills
        if (studentSkill.verified) {
          ratio = Math.min(1.0, ratio * 1.05);
        }

        const skillEarned = weight * ratio;
        earnedWeight += skillEarned;

        matchedSkills.push({
          skill_id: js.skill_id,
          skill_name: skillName,
          weight,
          required_proficiency: requiredProf,
          student_proficiency: studentSkill.proficiency,
          is_verified: studentSkill.verified,
          match_ratio: Math.round(ratio * 100) / 100,
        });
      } else {
        missingSkills.push({
          skill_id: js.skill_id,
          skill_name: skillName,
          weight,
          required_proficiency: requiredProf,
          is_required: js.is_required,
        });
      }
    }

    const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 1000) / 10 : 100;

    return {
      score,
      total_weight: Math.round(totalWeight * 10) / 10,
      earned_weight: Math.round(earnedWeight * 10) / 10,
      total_skills: jobSkills.length,
      matched_count: matchedSkills.length,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
    };
  }

  /**
   * Retrieves all applications for a student
   */
  static async getStudentApplications(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, job:jobs(*, company:companies(name, logo_url)), internship:internships(*, company:companies(name, logo_url))')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Retrieves a single application by ID
   */
  static async getApplicationById(applicationId: string) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        job:jobs(*, company:companies(*), job_skills(weight, is_required, required_proficiency, skill:skills(id, name, category))),
        internship:internships(*, company:companies(*)),
        student:students(
          id,
          first_name,
          last_name,
          phone,
          city,
          state,
          bio,
          linkedin_url,
          github_url,
          portfolio_url,
          student_education(*),
          student_skills(id, skill_id, proficiency, verified, skill:skills(id, name, category))
        )
      `)
      .eq('id', applicationId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    return data;
  }

  /**
   * Creates a new application and computes initial match score & status history
   */
  static async createApplication(studentId: string, payload: Record<string, any>) {
    let matchScore = 0;
    let matchBreakdown = {};

    if (payload.job_id) {
      const matchResult = await this.calculateCandidateMatchScore(studentId, payload.job_id);
      matchScore = matchResult.score;
      matchBreakdown = matchResult;
    }

    const currentStatus = payload.status || 'SAVED';
    const now = new Date().toISOString();
    const appliedAt = currentStatus === 'APPLIED' ? payload.applied_at || now : payload.applied_at || null;

    const initialHistory = [
      {
        from_status: null,
        to_status: currentStatus,
        changed_by: studentId,
        role: 'STUDENT',
        notes: payload.notes || 'Application initialized',
        timestamp: now,
      },
    ];

    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({
        student_id: studentId,
        ...payload,
        status: currentStatus,
        applied_at: appliedAt,
        match_score: matchScore,
        match_breakdown: matchBreakdown,
        status_history: initialHistory,
      })
      .select('*, job:jobs(id, title), internship:internships(id, title)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Recruiter / Admin transitions ATS status with state machine enforcement and audit trail
   */
  static async transitionStatus(
    applicationId: string,
    actorId: string,
    actorRole: string,
    newStatus: string,
    notes?: string
  ) {
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    const currentStatus = application.status;

    if (currentStatus === newStatus) {
      return application;
    }

    const allowedTransitions = VALID_ATS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestError(
        `Invalid ATS status transition from '${currentStatus}' to '${newStatus}'. Allowed stages from '${currentStatus}' are: [${allowedTransitions.join(
          ', '
        ) || 'None (terminal stage)'}]`
      );
    }

    const now = new Date().toISOString();
    const historyEntry = {
      from_status: currentStatus,
      to_status: newStatus,
      changed_by: actorId,
      role: actorRole,
      notes: notes || `Application moved from ${currentStatus} to ${newStatus}`,
      timestamp: now,
    };

    const currentHistory = Array.isArray(application.status_history) ? application.status_history : [];
    const updatedHistory = [...currentHistory, historyEntry];

    const updatePayload: Record<string, any> = {
      status: newStatus,
      status_history: updatedHistory,
      updated_at: now,
    };

    if (notes) {
      updatePayload.notes = notes;
    }

    if (newStatus === 'APPLIED' && !application.applied_at) {
      updatePayload.applied_at = now;
    }

    const { data: updatedApp, error: updateError } = await supabaseAdmin
      .from('applications')
      .update(updatePayload)
      .eq('id', applicationId)
      .select(`
        *,
        job:jobs(id, title, company:companies(name)),
        internship:internships(id, title, company:companies(name)),
        student:students(id, first_name, last_name, phone)
      `)
      .single();

    if (updateError) throw updateError;
    return updatedApp;
  }

  /**
   * Updates an existing application status or notes (student scope)
   */
  static async updateApplication(studentId: string, applicationId: string, payload: Record<string, unknown>) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', applicationId)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    return data;
  }

  /**
   * Deletes an application
   */
  static async deleteApplication(studentId: string, applicationId: string) {
    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { id: applicationId, deleted: true };
  }
}

