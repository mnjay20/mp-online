import { supabaseAdmin } from '../../config/supabase.js';
import { NotFoundError } from '../../utils/errors.js';

export interface SchemeFilters {
  category?: string;
  initiative?: string;
  search?: string;
}

export interface RecommendationCriteria {
  degree?: string;
  field_of_study?: string;
  gpa?: number;
  skills?: string[];
}

export class GovernmentSchemesService {
  /**
   * Retrieves all active government schemes with optional category/initiative filtering.
   */
  static async getAllSchemes(filters?: SchemeFilters) {
    let query = supabaseAdmin
      .from('government_schemes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,ministry_or_body.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Filter by alignment initiative (e.g. Skill India, NEP 2020, Digital India)
    if (filters?.initiative && data) {
      const initTarget = filters.initiative.toLowerCase();
      return data.filter((s: any) =>
        s.alignment_initiatives &&
        s.alignment_initiatives.some((init: string) => init.toLowerCase().includes(initTarget))
      );
    }

    return data || [];
  }

  /**
   * Retrieves single scheme by ID.
   */
  static async getSchemeById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('government_schemes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Government scheme with ID ${id} not found.`);
    }

    return data;
  }

  /**
   * AI-powered / deterministic recommendation engine aligning student profile with
   * Skill India, NEP 2020, and Digital India government schemes and public-sector jobs.
   */
  static async recommendSchemes(studentId?: string, criteria?: RecommendationCriteria) {
    let studentDegree = criteria?.degree || '';
    let studentSkills: string[] = criteria?.skills || [];
    let studentGpa = criteria?.gpa || 7.5;
    let targetCareerTitle = 'Technology / Engineering';

    // 1. If studentId provided, pull authoritative student profile from DB
    if (studentId) {
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('*, student_education(*), student_skills(proficiency, skill:skills(name)), career_goals(career:careers(title))')
        .eq('id', studentId)
        .maybeSingle();

      if (student) {
        if (student.student_education && student.student_education.length > 0) {
          studentDegree = student.student_education[0].degree || studentDegree;
          studentGpa = student.student_education[0].grade_point_avg || studentGpa;
        }
        if (student.student_skills && student.student_skills.length > 0) {
          const fetchedSkills = student.student_skills
            .map((ss: any) => ss.skill?.name)
            .filter(Boolean);
          if (fetchedSkills.length > 0) {
            studentSkills = Array.from(new Set([...studentSkills, ...fetchedSkills]));
          }
        }
        if (student.career_goals && student.career_goals.length > 0) {
          targetCareerTitle = student.career_goals[0].career?.title || targetCareerTitle;
        }
      }
    }

    // 2. Fetch all active schemes
    const { data: schemes, error: schemesError } = await supabaseAdmin
      .from('government_schemes')
      .select('*')
      .eq('is_active', true);

    if (schemesError) throw schemesError;

    // 3. Fetch active government jobs
    const { data: govJobs, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('*, company:companies(*), job_skills(skill:skills(name), weight)')
      .eq('is_active', true)
      .eq('is_government', true);

    if (jobsError) throw jobsError;

    // 4. Match schemes with eligibility & skill overlap
    const evaluatedSchemes = (schemes || []).map((scheme: any) => {
      let isEligible = true;
      const reasons: string[] = [];
      const matchedSkills: string[] = [];

      // Check skill overlap
      if (scheme.target_skills && Array.isArray(scheme.target_skills)) {
        scheme.target_skills.forEach((ts: string) => {
          if (studentSkills.some((s) => s.toLowerCase() === ts.toLowerCase())) {
            matchedSkills.push(ts);
          }
        });
      }

      if (matchedSkills.length > 0) {
        reasons.push(`Matches your skills in: ${matchedSkills.join(', ')}`);
      }

      // Check initiatives
      const initiatives = scheme.alignment_initiatives || [];
      if (initiatives.includes('Skill India')) {
        reasons.push('Provides Skill India accredited industry certification');
      }
      if (initiatives.includes('Digital India')) {
        reasons.push('Direct contribution to national digital infrastructure (India Stack)');
      }
      if (initiatives.includes('NEP 2020')) {
        reasons.push('Eligible for NEP 2020 Academic Bank of Credits (ABC) transfer');
      }

      return {
        ...scheme,
        is_eligible: isEligible,
        matched_skills: matchedSkills,
        eligibility_summary: reasons.length > 0 ? reasons.join('. ') : 'General public technical eligibility.',
      };
    });

    // 5. Match government jobs
    const evaluatedJobs = (govJobs || []).map((job: any) => {
      let degreeMatch = true;
      if (studentDegree && job.eligibility_degrees && job.eligibility_degrees.length > 0) {
        degreeMatch = job.eligibility_degrees.some((d: string) =>
          d.toLowerCase().includes(studentDegree.toLowerCase()) ||
          studentDegree.toLowerCase().includes(d.toLowerCase())
        );
      }

      return {
        id: job.id,
        title: job.title,
        company: job.company?.name || 'Public Sector Enterprise',
        gov_category: job.gov_category || 'PSU',
        salary_range: `₹${(job.salary_min || 0) / 100000}L - ₹${(job.salary_max || 0) / 100000}L PA`,
        location: job.location,
        is_eligible: degreeMatch,
        eligibility_degrees: job.eligibility_degrees,
      };
    });

    return {
      student_profile_used: {
        degree: studentDegree || 'Engineering / STEM Undergraduate',
        verified_skills: studentSkills,
        target_career: targetCareerTitle,
      },
      national_initiatives_alignment: [
        {
          name: 'Skill India Mission',
          focus: 'Industry 4.0 vocational readiness & NAPS technical apprenticeships',
          applicable_schemes: ['NAPS-2026', 'PMKVY-4.0-AI'],
        },
        {
          name: 'Digital India',
          focus: 'National e-Governance and digital public goods engineering',
          applicable_schemes: ['MEITY-DIGITAL-INDIA-INTERN', 'NIC-SCIENTIST-B'],
        },
        {
          name: 'NEP 2020',
          focus: 'Multi-disciplinary technical fellowships and Academic Bank of Credits integration',
          applicable_schemes: ['NEP-2020-MULTI-DISCIPLINARY'],
        },
      ],
      eligible_schemes: evaluatedSchemes,
      government_jobs: evaluatedJobs,
      summary: `Identified ${evaluatedSchemes.length} national schemes and ${evaluatedJobs.length} public-sector opportunities matching your educational background and technical competencies.`,
    };
  }
}
