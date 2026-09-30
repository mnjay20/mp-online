export type UserRole = 'STUDENT' | 'RECRUITER' | 'ADMIN';

export type ProficiencyLevel = 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'REVIEWING'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER'
  | 'SELECTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  readiness_score: number;
}

export interface EducationRecord {
  id: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year: number;
  grade_point_avg: number;
  is_current: boolean;
}

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  github_url?: string;
  live_url?: string;
  is_featured: boolean;
  skills?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface StudentSkill {
  id: string;
  skill_id: string;
  skill_name: string;
  category: string;
  proficiency: ProficiencyLevel;
  source: 'SELF_REPORTED' | 'ASSESSMENT' | 'RESUME_PARSED';
  years_experience: number;
  is_verified: boolean;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  average_salary_min: number;
  average_salary_max: number;
  demand_level: 'High' | 'Very High' | 'Moderate';
  skills: {
    skill_name: string;
    importance: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
    required_proficiency: ProficiencyLevel;
    weight: number;
  }[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  description: string;
  difficulty: ProficiencyLevel;
  duration_hours: number;
  is_free: boolean;
  price?: string | number;
  rating?: number;
  skills: string[];
}

export interface WebCourse {
  title: string;
  provider: string;
  url: string;
  is_free: boolean;
  price: string;
}

export interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  work_mode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  employment_type: 'FULL_TIME' | 'INTERNSHIP';
  salary_min: number;
  salary_max: number;
  experience_min: number;
  experience_max: number;
  description: string;
  posted_at: string;
  skills: {
    skill_name: string;
    weight: number;
    required_proficiency: ProficiencyLevel;
    is_required: boolean;
  }[];
}

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: ApplicationStatus;
  applied_at: string;
  match_score: number;
  notes?: string;
  match_breakdown?: {
    score: number;
    matched_count: number;
    total_skills: number;
    matched_skills: {
      skill_name: string;
      required_proficiency: ProficiencyLevel;
      student_proficiency: ProficiencyLevel;
      is_verified: boolean;
    }[];
    missing_skills: {
      skill_name: string;
      is_required: boolean;
    }[];
  };
  status_history?: {
    from_status: ApplicationStatus | null;
    to_status: ApplicationStatus;
    changed_by: string;
    role: UserRole;
    notes: string;
    timestamp: string;
  }[];
}

export interface ResumeAnalysis {
  overall_score: number;
  ats_score: number;
  extracted_skills: string[];
  missing_skills: string[];
  strengths: string[];
  improvements: string[];
  file_name: string;
  uploaded_at: string;
}

export interface InterviewSession {
  id: string;
  career_id: string;
  career_title: string;
  interview_type: 'TECHNICAL' | 'BEHAVIORAL' | 'MIXED';
  question_count: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  current_turn: number;
  current_question: string;
  history: {
    turn: number;
    question: string;
    answer: string;
    evaluation?: {
      turn_score: number;
      feedback: string;
      clarity_score: number;
      depth_score: number;
    };
  }[];
}

export interface InterviewReport {
  session_id: string;
  overall_score: number;
  verdict: 'STRONG_HIRE' | 'HIRE' | 'LEANING_NO' | 'NO_HIRE';
  metrics: {
    technical_depth: number;
    communication_clarity: number;
    problem_solving: number;
  };
  key_strengths: string[];
  key_areas_for_growth: string[];
}
