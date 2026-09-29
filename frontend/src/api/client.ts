import { useAuthStore } from '../store/authStore';

const BASE_URL = '/api';

/**
 * Universal API Request Wrapper with token injection and graceful fallback
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.error?.message || `Request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err: any) {
    if (fallbackData !== undefined) {
      console.warn(`[API] Endpoint ${endpoint} fell back to offline demo data:`, err.message);
      return fallbackData;
    }
    throw err;
  }
}

// =============================================================================
// 1. Authentication
// =============================================================================
export const authApi = {
  getMe: () =>
    apiRequest('/auth/me', {}, {
      user: { id: 'u1', email: 'alex.dev@university.edu', role: 'STUDENT' },
      student: { id: 's1', first_name: 'Alex', last_name: 'Dev', role: 'STUDENT' },
    }),
};

// =============================================================================
// 2. Student Profile
// =============================================================================
export const studentApi = {
  getProfile: () =>
    apiRequest('/students/me', {}, {
      id: 's1',
      first_name: 'Alex',
      last_name: 'Dev',
      phone: '+91 9876543210',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      bio: 'CS Junior with strong enthusiasm for distributed backend systems, event streaming, and cloud infrastructure.',
      linkedin_url: 'https://linkedin.com/in/alexdev',
      github_url: 'https://github.com/alexdev',
      portfolio_url: 'https://alexdev.me',
      student_education: [
        {
          id: 'edu-1',
          institution_name: 'National Institute of Technology',
          degree: 'B.Tech',
          field_of_study: 'Computer Science & Engineering',
          start_year: 2023,
          end_year: 2027,
          grade_point_avg: 8.8,
          is_current: true,
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Distributed Key-Value Store',
          description: 'Raft consensus implementation in Go with gRPC streaming replication.',
          github_url: 'https://github.com/alexdev/raft-kv',
          is_featured: true,
        },
        {
          id: 'proj-2',
          title: 'ATS Resume Parser Engine',
          description: 'High performance PDF extraction and semantic skill extractor using LangChain.',
          github_url: 'https://github.com/alexdev/ats-scanner',
          is_featured: true,
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect - Associate',
          issuing_organization: 'Amazon Web Services',
          issue_date: '2024-05-15',
        },
      ],
    }),

  updateProfile: (data: any) => apiRequest('/students/me', { method: 'PUT', body: JSON.stringify(data) }, data),
};

// =============================================================================
// 3. Skills
// =============================================================================
export const skillsApi = {
  getCatalog: () =>
    apiRequest('/skills', {}, [
      { id: 'sk-1', name: 'Python', category: 'Programming Languages' },
      { id: 'sk-2', name: 'TypeScript', category: 'Programming Languages' },
      { id: 'sk-3', name: 'Docker', category: 'Cloud & DevOps' },
      { id: 'sk-4', name: 'Kubernetes', category: 'Cloud & DevOps' },
      { id: 'sk-5', name: 'PostgreSQL', category: 'Databases' },
      { id: 'sk-6', name: 'Redis', category: 'Databases' },
      { id: 'sk-7', name: 'Kafka', category: 'Distributed Systems' },
      { id: 'sk-8', name: 'React', category: 'Frontend' },
    ]),

  getMySkills: () =>
    apiRequest('/skills/me', {}, [
      { id: 'ms-1', skill_id: 'sk-1', proficiency: 'ADVANCED', verified: true, skill: { name: 'Python', category: 'Languages' } },
      { id: 'ms-2', skill_id: 'sk-2', proficiency: 'INTERMEDIATE', verified: true, skill: { name: 'TypeScript', category: 'Languages' } },
      { id: 'ms-3', skill_id: 'sk-5', proficiency: 'ADVANCED', verified: true, skill: { name: 'PostgreSQL', category: 'Databases' } },
      { id: 'ms-4', skill_id: 'sk-8', proficiency: 'INTERMEDIATE', verified: false, skill: { name: 'React', category: 'Frontend' } },
    ]),

  addSkill: (data: any) => apiRequest('/skills/me', { method: 'POST', body: JSON.stringify(data) }),
  removeSkill: (id: string) => apiRequest(`/skills/me/${id}`, { method: 'DELETE' }),
};

// =============================================================================
// 4. Careers & Goals
// =============================================================================
export const careersApi = {
  getAll: () =>
    apiRequest('/careers', {}, [
      {
        id: 'c-1',
        title: 'Backend Engineer',
        slug: 'backend-engineer',
        description: 'Designs and builds server-side microservices, distributed data pipelines, and scalable APIs.',
        demand_level: 'Very High',
        average_salary_min: 900000,
        average_salary_max: 2600000,
        career_skills: [
          { skill: { name: 'Python' }, importance: 'CRITICAL', required_proficiency: 'ADVANCED', weight: 3.0 },
          { skill: { name: 'PostgreSQL' }, importance: 'CRITICAL', required_proficiency: 'ADVANCED', weight: 2.5 },
          { skill: { name: 'Docker' }, importance: 'IMPORTANT', required_proficiency: 'INTERMEDIATE', weight: 2.0 },
          { skill: { name: 'Redis' }, importance: 'IMPORTANT', required_proficiency: 'INTERMEDIATE', weight: 1.5 },
          { skill: { name: 'Kafka' }, importance: 'NICE_TO_HAVE', required_proficiency: 'BEGINNER', weight: 1.0 },
        ],
      },
      {
        id: 'c-2',
        title: 'DevOps & Cloud Engineer',
        slug: 'devops-cloud-engineer',
        description: 'Automates CI/CD deployment pipelines, manages Kubernetes clusters, and implements zero-downtime infrastructure.',
        demand_level: 'High',
        average_salary_min: 1000000,
        average_salary_max: 3000000,
        career_skills: [
          { skill: { name: 'Docker' }, importance: 'CRITICAL', required_proficiency: 'ADVANCED', weight: 3.0 },
          { skill: { name: 'Kubernetes' }, importance: 'CRITICAL', required_proficiency: 'ADVANCED', weight: 3.0 },
          { skill: { name: 'Terraform' }, importance: 'IMPORTANT', required_proficiency: 'INTERMEDIATE', weight: 2.0 },
        ],
      },
      {
        id: 'c-3',
        title: 'Full Stack Developer',
        slug: 'full-stack-developer',
        description: 'Bridges dynamic React/Next.js client experiences with high-performance Node/Express APIs.',
        demand_level: 'High',
        average_salary_min: 800000,
        average_salary_max: 2400000,
        career_skills: [
          { skill: { name: 'React' }, importance: 'CRITICAL', required_proficiency: 'ADVANCED', weight: 3.0 },
          { skill: { name: 'TypeScript' }, importance: 'CRITICAL', required_proficiency: 'ADVANCED', weight: 3.0 },
          { skill: { name: 'PostgreSQL' }, importance: 'IMPORTANT', required_proficiency: 'INTERMEDIATE', weight: 2.0 },
        ],
      },
    ]),

  getGoals: () =>
    apiRequest('/careers/me/goals', {}, [
      {
        id: 'cg-1',
        career_id: 'c-1',
        goal_title: 'Backend Engineer at Tier-1 Tech Firm',
        priority: 1,
        target_date: '2026-12-01',
        career: { title: 'Backend Engineer' },
      },
    ]),

  setGoal: (data: any) => apiRequest('/careers/me/goals', { method: 'POST', body: JSON.stringify(data) }),
};

// =============================================================================
// 5. Courses & Gap Search
// =============================================================================
export const coursesApi = {
  recommendGapCourses: (skillNames: string[]) =>
    apiRequest(
      '/courses/recommendations/skill-gap',
      { method: 'POST', body: JSON.stringify({ skill_names: skillNames }) },
      {
        app_catalog_courses: [
          {
            id: 'crs-1',
            title: 'Mastering Docker & Container Orchestration',
            provider: 'Platform Academy',
            url: 'https://academy.internal/courses/docker',
            difficulty: 'INTERMEDIATE',
            is_free: true,
            rating: 4.9,
            duration_hours: 12,
          },
          {
            id: 'crs-2',
            title: 'Redis Caching & Distributed Systems',
            provider: 'Platform Academy',
            url: 'https://academy.internal/courses/redis',
            difficulty: 'ADVANCED',
            is_free: true,
            rating: 4.8,
            duration_hours: 10,
          },
        ],
        web_courses: {
          unpaid: [
            {
              title: 'Kubernetes Crash Course for Absolute Beginners',
              provider: 'YouTube / TechWorld with Nana',
              url: 'https://youtube.com',
              is_free: true,
              price: 'Free',
            },
            {
              title: 'Learn Kafka Architecture & Event Streaming',
              provider: 'Confluent Developer',
              url: 'https://developer.confluent.io',
              is_free: true,
              price: 'Free',
            },
          ],
          paid: [
            {
              title: 'Docker & Kubernetes: The Practical Guide [2026 Edition]',
              provider: 'Udemy',
              url: 'https://udemy.com',
              is_free: false,
              price: '₹599',
            },
            {
              title: 'System Design Interview – An Insider’s Guide',
              provider: 'ByteByteGo',
              url: 'https://bytebytego.com',
              is_free: false,
              price: '₹2,499',
            },
          ],
        },
      }
    ),

  getAll: () =>
    apiRequest('/courses', {}, [
      {
        id: 'crs-1',
        title: 'Mastering Docker & Container Orchestration',
        provider: 'Platform Academy',
        url: 'https://academy.internal/courses/docker',
        difficulty: 'INTERMEDIATE',
        is_free: true,
        price: 0,
        rating: 4.9,
        duration_hours: 12,
      },
      {
        id: 'crs-2',
        title: 'Redis Caching & Distributed Systems',
        provider: 'Platform Academy',
        url: 'https://academy.internal/courses/redis',
        difficulty: 'ADVANCED',
        is_free: true,
        price: 0,
        rating: 4.8,
        duration_hours: 10,
      },
    ]),

  create: (data: any) => apiRequest('/courses', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/courses/${id}`, { method: 'DELETE' }),
};

// =============================================================================
// 6. Jobs & Recruiter Portal
// =============================================================================
export const jobsApi = {
  getAll: (filters?: { work_mode?: string; location?: string }) =>
    apiRequest('/jobs', {}, [
      {
        id: 'job-1',
        title: 'Senior Backend Engineer',
        location: 'Bengaluru, India',
        work_mode: 'HYBRID',
        employment_type: 'FULL_TIME',
        experience_min: 2,
        experience_max: 4,
        salary_min: 1600000,
        salary_max: 2800000,
        description: 'Lead the architecture of our core distributed microservices handling 50k+ req/sec.',
        company: { name: 'Razorpay', logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100' },
        job_skills: [
          { skill: { name: 'Python' }, weight: 3.0, required_proficiency: 'ADVANCED' },
          { skill: { name: 'PostgreSQL' }, weight: 2.5, required_proficiency: 'ADVANCED' },
          { skill: { name: 'Docker' }, weight: 2.0, required_proficiency: 'INTERMEDIATE' },
        ],
        posted_at: new Date().toISOString(),
      },
      {
        id: 'job-2',
        title: 'Cloud Systems Engineer',
        location: 'Remote, India',
        work_mode: 'REMOTE',
        employment_type: 'FULL_TIME',
        experience_min: 1,
        experience_max: 3,
        salary_min: 1400000,
        salary_max: 2200000,
        description: 'Maintain high availability multi-region infrastructure and automated CI/CD.',
        company: { name: 'Postman', logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100' },
        job_skills: [
          { skill: { name: 'Docker' }, weight: 3.0, required_proficiency: 'ADVANCED' },
          { skill: { name: 'Kubernetes' }, weight: 2.5, required_proficiency: 'INTERMEDIATE' },
        ],
        posted_at: new Date().toISOString(),
      },
    ]),

  createJob: (data: any) => apiRequest('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  getCandidates: (jobId: string) =>
    apiRequest(`/jobs/${jobId}/candidates`, {}, [
      {
        id: 'app-101',
        status: 'REVIEWING',
        match_score: 91.5,
        applied_at: new Date().toISOString(),
        match_breakdown: {
          score: 91.5,
          total_skills: 3,
          matched_count: 2,
          matched_skills: [
            { skill_name: 'Python', weight: 3.0, student_proficiency: 'ADVANCED', is_verified: true, match_ratio: 1.0 },
            { skill_name: 'PostgreSQL', weight: 2.5, student_proficiency: 'ADVANCED', is_verified: true, match_ratio: 1.0 },
          ],
          missing_skills: [{ skill_name: 'Docker', weight: 2.0, required_proficiency: 'INTERMEDIATE' }],
        },
        student: {
          id: 's1',
          first_name: 'Alex',
          last_name: 'Dev',
          phone: '+91 9876543210',
          bio: 'Top 5% student with active open source contributions.',
          student_education: [{ degree: 'B.Tech CSE', institution_name: 'NIT', grade_point_avg: 8.8 }],
        },
        status_history: [
          { from_status: null, to_status: 'APPLIED', role: 'STUDENT', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { from_status: 'APPLIED', to_status: 'REVIEWING', role: 'RECRUITER', notes: 'Top match score', timestamp: new Date().toISOString() },
        ],
      },
      {
        id: 'app-102',
        status: 'APPLIED',
        match_score: 72.0,
        applied_at: new Date(Date.now() - 40000000).toISOString(),
        match_breakdown: {
          score: 72.0,
          total_skills: 3,
          matched_count: 2,
          matched_skills: [
            { skill_name: 'Python', weight: 3.0, student_proficiency: 'INTERMEDIATE', is_verified: false, match_ratio: 0.7 },
            { skill_name: 'PostgreSQL', weight: 2.5, student_proficiency: 'BEGINNER', is_verified: false, match_ratio: 0.4 },
          ],
          missing_skills: [{ skill_name: 'Docker', weight: 2.0 }],
        },
        student: {
          id: 's2',
          first_name: 'Priya',
          last_name: 'Sharma',
          phone: '+91 9811223344',
          bio: 'Backend enthusiast with 1 year internship experience.',
          student_education: [{ degree: 'B.E Information Science', institution_name: 'PES University', grade_point_avg: 8.4 }],
        },
        status_history: [
          { from_status: null, to_status: 'APPLIED', role: 'STUDENT', timestamp: new Date(Date.now() - 40000000).toISOString() },
        ],
      },
    ]),
};

// =============================================================================
// 7. Applications & ATS
// =============================================================================
export const applicationsApi = {
  getMyApplications: () =>
    apiRequest('/applications', {}, [
      {
        id: 'app-101',
        job_id: 'job-1',
        status: 'REVIEWING',
        match_score: 91.5,
        applied_at: new Date().toISOString(),
        job: { title: 'Senior Backend Engineer', company: { name: 'Razorpay' } },
        status_history: [
          { from_status: null, to_status: 'APPLIED', role: 'STUDENT', notes: 'Application submitted', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { from_status: 'APPLIED', to_status: 'REVIEWING', role: 'RECRUITER', notes: 'Profile selected for technical screening', timestamp: new Date().toISOString() },
        ],
      },
      {
        id: 'app-103',
        job_id: 'job-2',
        status: 'APPLIED',
        match_score: 65.0,
        applied_at: new Date(Date.now() - 172800000).toISOString(),
        job: { title: 'Cloud Systems Engineer', company: { name: 'Postman' } },
        status_history: [
          { from_status: null, to_status: 'APPLIED', role: 'STUDENT', notes: 'Submitted', timestamp: new Date(Date.now() - 172800000).toISOString() },
        ],
      },
    ]),

  apply: (jobId: string, notes?: string) =>
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, status: 'APPLIED', notes }),
    }),

  transitionStatus: (applicationId: string, newStatus: string, notes?: string) =>
    apiRequest(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, notes }),
    }),
};

// =============================================================================
// 8. Resumes & ATS Scanner
// =============================================================================
export const resumeApi = {
  getMyResumes: () =>
    apiRequest('/resumes', {}, [
      {
        id: 'res-1',
        file_name: 'Alex_Dev_Resume_2026.pdf',
        is_current: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        resume_analyses: [
          {
            overall_score: 87,
            ats_score: 92,
            extracted_skills: ['Python', 'PostgreSQL', 'FastAPI', 'Docker', 'Git'],
            missing_skills: ['Kubernetes', 'Redis', 'CI/CD'],
            strengths: [
              'Action-oriented bullet points with quantified business metrics (e.g. reduced latency by 35%)',
              'Clean, parseable single-column layout conforming to ATS standards',
            ],
            improvements: [
              'Add explicit mentions of automated testing (pytest, unit tests)',
              'Include link to live production demo of Raft Key-Value Store',
            ],
          },
        ],
      },
    ]),

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return apiRequest('/resumes/upload', { method: 'POST', body: formData }, {
      resume: { id: `res-${Date.now()}`, file_name: file.name, is_current: true },
      analysis: {
        overall_score: 89,
        ats_score: 94,
        extracted_skills: ['Python', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs'],
        missing_skills: ['Kubernetes', 'Redis'],
        strengths: [
          'High keyword correlation with backend engineering roles',
          'Quantified impact indicators present in all recent projects',
        ],
        improvements: [
          'Highlight distributed database clustering or sharding experience',
        ],
      },
    });
  },
};

// =============================================================================
// 9. AI Mock Interviews
// =============================================================================
export const interviewApi = {
  processTurn: (payload: {
    turn_number: number;
    total_turns: number;
    target_role: string;
    interview_type: string;
    current_question: string;
    student_answer: string;
  }) =>
    apiRequest(
      '/interviews/turn',
      { method: 'POST', body: JSON.stringify(payload) },
      {
        evaluation: {
          turn_score: 92,
          clarity_score: 95,
          depth_score: 88,
          feedback:
            'Strong response! You clearly distinguished between optimistic and pessimistic concurrency control, and correctly mentioned version timestamps as the standard mechanism.',
        },
        next_question:
          payload.turn_number < 4
            ? 'In a microservices architecture, how do you maintain transactional consistency across distributed services without two-phase locking?'
            : 'How do you monitor and debug silent memory leaks in a production Node.js or Python service?',
        is_completed: payload.turn_number >= payload.total_turns,
      }
    ),

  generateReport: (careerTitle: string) =>
    apiRequest(
      '/interviews/report',
      { method: 'POST', body: JSON.stringify({ career_title: careerTitle }) },
      {
        overall_score: 90,
        verdict: 'STRONG_HIRE',
        metrics: {
          technical_depth: 92,
          communication_clarity: 94,
          problem_solving: 85,
        },
        key_strengths: [
          'Articulate explanation of ACID isolation levels and locking mechanisms',
          'Good architectural intuition regarding event-driven consistency (Saga pattern)',
        ],
        key_areas_for_growth: [
          'Deepen knowledge of distributed tracing tools like OpenTelemetry',
        ],
      }
    ),
};

// =============================================================================
// 10. AI Career Copilot
// =============================================================================
export const copilotApi = {
  chat: (message: string, conversationId?: string) =>
    apiRequest(
      '/ai/chat',
      { method: 'POST', body: JSON.stringify({ message, conversation_id: conversationId }) },
      {
        conversation_id: conversationId || 'conv-1',
        message: `Analyzing your profile for "${message}": You have strong backend fundamentals in Python and PostgreSQL. Your fastest path to 90%+ readiness is adding Docker container orchestration and Redis caching to your current portfolio projects.`,
        confidence: 0.96,
        recommendations: [
          {
            type: 'COURSE',
            title: 'Mastering Docker & Container Orchestration',
            reason: 'Closes your highest-weighted skill gap (Weight: 2.0)',
            priority: 'HIGH',
          },
          {
            type: 'PROJECT',
            title: 'Containerize Raft Key-Value Store',
            reason: 'Demonstrates end-to-end containerized distributed systems to recruiters',
            priority: 'MEDIUM',
          },
        ],
        next_actions: [
          'Complete the Docker Fundamentals module on the courses tab',
          'Practice a 5-question AI Mock Interview on Distributed Systems',
        ],
      }
    ),
};
