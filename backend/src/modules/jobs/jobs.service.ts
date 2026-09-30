import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';
import { CreateJobInput, CreateInternshipInput } from './jobs.schema.js';
import { ApplicationsService } from '../applications/applications.service.js';

export class JobsService {
  static async getAllJobs(filters?: { work_mode?: string; location?: string }) {
    let query = supabaseAdmin
      .from('jobs')
      .select('*, company:companies(*), job_skills(skill:skills(id, name, category), weight, is_required, required_proficiency)')
      .eq('is_active', true)
      .order('posted_at', { ascending: false });

    if (filters?.work_mode) {
      query = query.eq('work_mode', filters.work_mode);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Retrieves public sector and government employment opportunities with degree eligibility filtering
   */
  static async getGovernmentJobs(filters?: {
    degree?: string;
    gov_category?: string;
    work_mode?: string;
    location?: string;
  }) {
    let query = supabaseAdmin
      .from('jobs')
      .select('*, company:companies(*), job_skills(skill:skills(id, name, category), weight, is_required, required_proficiency)')
      .eq('is_active', true)
      .eq('is_government', true)
      .order('posted_at', { ascending: false });

    if (filters?.gov_category) {
      query = query.eq('gov_category', filters.gov_category);
    }
    if (filters?.work_mode) {
      query = query.eq('work_mode', filters.work_mode);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Filter by student degree eligibility if provided
    if (filters?.degree && data) {
      const targetDegree = filters.degree.toLowerCase().trim();
      return data.filter((job: any) => {
        if (!job.eligibility_degrees || job.eligibility_degrees.length === 0) return true;
        return job.eligibility_degrees.some((deg: string) => {
          const d = deg.toLowerCase();
          return d.includes(targetDegree) || targetDegree.includes(d);
        });
      });
    }

    return data;
  }

  static async getJobById(jobId: string) {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*, company:companies(*), job_skills(skill:skills(id, name, category), weight, is_required, required_proficiency)')
      .eq('id', jobId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    return data;
  }

  /**
   * Recruiter / Admin: Creates a new job with weighted skill requirements
   */
  static async createJob(payload: CreateJobInput) {
    const { skills, ...jobFields } = payload;

    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .insert({
        ...jobFields,
        is_active: true,
      })
      .select('*, company:companies(*)')
      .single();

    if (jobError) throw jobError;

    if (skills && skills.length > 0) {
      const skillRows = skills.map((s) => ({
        job_id: job.id,
        skill_id: s.skill_id,
        weight: s.weight ?? 1.0,
        is_required: s.is_required ?? true,
        required_proficiency: s.required_proficiency ?? 'BEGINNER',
      }));

      const { error: skillsError } = await supabaseAdmin
        .from('job_skills')
        .insert(skillRows);

      if (skillsError) throw skillsError;
    }

    // Return the full job with skills
    return this.getJobById(job.id);
  }

  /**
   * Recruiter / Admin: View candidate applications for a job ranked by match score
   */
  static async getJobCandidates(jobId: string) {
    // 1. Verify job exists
    await this.getJobById(jobId);

    // 2. Fetch all applications for this job
    const { data: applications, error: appError } = await supabaseAdmin
      .from('applications')
      .select(`
        id,
        status,
        notes,
        match_score,
        match_breakdown,
        status_history,
        applied_at,
        created_at,
        updated_at,
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
          student_skills(
            id,
            skill_id,
            proficiency,
            verified,
            skill:skills(id, name, category)
          ),
          resumes(
            id,
            file_name,
            storage_path,
            is_current,
            resume_analyses(*)
          )
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (appError) throw appError;

    // 3. For any application with 0 or missing match_score, calculate dynamically
    const enrichedCandidates = await Promise.all(
      (applications || []).map(async (app: any) => {
        let currentScore = Number(app.match_score) || 0;
        let breakdown = app.match_breakdown;

        if (currentScore === 0 && app.student?.id) {
          const computed = await ApplicationsService.calculateCandidateMatchScore(app.student.id, jobId);
          currentScore = computed.score;
          breakdown = computed;

          // Update asynchronously in background
          supabaseAdmin
            .from('applications')
            .update({ match_score: currentScore, match_breakdown: breakdown })
            .eq('id', app.id)
            .then();
        }

        return {
          ...app,
          match_score: currentScore,
          match_breakdown: breakdown,
        };
      })
    );

    // 4. Sort candidates by match_score descending
    enrichedCandidates.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    return enrichedCandidates;
  }

  static async getAllInternships(filters?: { work_mode?: string; location?: string }) {
    let query = supabaseAdmin
      .from('internships')
      .select('*, company:companies(*)')
      .eq('is_active', true)
      .order('posted_at', { ascending: false });

    if (filters?.work_mode) {
      query = query.eq('work_mode', filters.work_mode);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getInternshipById(internshipId: string) {
    const { data, error } = await supabaseAdmin
      .from('internships')
      .select('*, company:companies(*)')
      .eq('id', internshipId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Internship with ID ${internshipId} not found`);
    }

    return data;
  }

  /**
   * Recruiter / Admin: Creates a new internship
   */
  static async createInternship(payload: CreateInternshipInput) {
    const { data, error } = await supabaseAdmin
      .from('internships')
      .insert({
        ...payload,
        is_active: true,
      })
      .select('*, company:companies(*)')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Recruiter / Admin: View candidate applications for an internship
   */
  static async getInternshipCandidates(internshipId: string) {
    await this.getInternshipById(internshipId);

    const { data: applications, error: appError } = await supabaseAdmin
      .from('applications')
      .select(`
        id,
        status,
        notes,
        status_history,
        applied_at,
        created_at,
        updated_at,
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
          student_skills(
            id,
            skill_id,
            proficiency,
            verified,
            skill:skills(id, name, category)
          ),
          resumes(
            id,
            file_name,
            storage_path,
            is_current,
            resume_analyses(*)
          )
        )
      `)
      .eq('internship_id', internshipId)
      .order('created_at', { ascending: false });

    if (appError) throw appError;
    return applications;
  }
}

