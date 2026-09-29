import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export class JobsService {
  static async getAllJobs(filters?: { work_mode?: string; location?: string }) {
    let query = supabaseAdmin
      .from('jobs')
      .select('*, company:companies(*), job_skills(skill:skills(id, name, category))')
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

  static async getJobById(jobId: string) {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*, company:companies(*), job_skills(skill:skills(id, name, category))')
      .eq('id', jobId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    return data;
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
}
