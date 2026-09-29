-- ============================================================================
-- AI-POWERED CAREER READINESS & EMPLOYABILITY PLATFORM
-- Initial Database Schema Migration
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Enumerated Domain Types
DO $$ BEGIN
    CREATE TYPE proficiency_level AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_source AS ENUM ('SELF_REPORTED', 'ASSESSMENT', 'PROJECT', 'CERTIFICATION', 'AI_INFERRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE importance_level AS ENUM ('CRITICAL', 'IMPORTANT', 'NICE_TO_HAVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('SAVED', 'APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interview_type AS ENUM ('TECHNICAL', 'HR', 'BEHAVIORAL', 'ROLE_SPECIFIC', 'MIXED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recommendation_type AS ENUM ('CAREER', 'COURSE', 'JOB', 'INTERNSHIP', 'PROJECT', 'SKILL', 'CERTIFICATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_role AS ENUM ('SYSTEM', 'USER', 'ASSISTANT', 'TOOL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_mode AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'RECRUITER', 'MENTOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Identity & Student Profile
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'STUDENT',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(25),
    date_of_birth DATE,
    gender VARCHAR(30),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150) NOT NULL,
    start_year INT NOT NULL,
    end_year INT,
    grade_point_avg NUMERIC(4,2),
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Academics
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    credits INT DEFAULT 3,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    subject_name VARCHAR(200) NOT NULL,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    marks NUMERIC(5,2),
    grade VARCHAR(5),
    credits INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Skills & Skill Hierarchy
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    parent_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency proficiency_level NOT NULL DEFAULT 'BEGINNER',
    source skill_source NOT NULL DEFAULT 'SELF_REPORTED',
    years_experience NUMERIC(3,1) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, skill_id)
);

-- 6. Projects & Project Skills
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    github_url TEXT,
    live_url TEXT,
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(project_id, skill_id)
);

-- 7. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(200) NOT NULL,
    credential_id VARCHAR(150),
    credential_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certification_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(certification_id, skill_id)
);

-- 8. Careers & Career Skills
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    average_salary_min INT,
    average_salary_max INT,
    demand_level VARCHAR(50) DEFAULT 'High',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS career_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    importance importance_level NOT NULL DEFAULT 'IMPORTANT',
    required_proficiency proficiency_level NOT NULL DEFAULT 'INTERMEDIATE',
    weight NUMERIC(3,2) DEFAULT 1.0,
    UNIQUE(career_id, skill_id)
);

CREATE TABLE IF NOT EXISTS career_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    goal_title VARCHAR(200),
    priority INT NOT NULL DEFAULT 1,
    target_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, career_id)
);

-- 9. Courses & Learning Progress
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    difficulty proficiency_level DEFAULT 'BEGINNER',
    duration_hours INT DEFAULT 10,
    is_free BOOLEAN DEFAULT true,
    price NUMERIC(10,2) DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 4.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(course_id, skill_id)
);

CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, course_id)
);

-- 10. Companies, Jobs, and Internships
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL UNIQUE,
    website TEXT,
    logo_url TEXT,
    location VARCHAR(150),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    work_mode work_mode NOT NULL DEFAULT 'HYBRID',
    employment_type employment_type NOT NULL DEFAULT 'FULL_TIME',
    experience_min INT DEFAULT 0,
    experience_max INT DEFAULT 2,
    salary_min INT,
    salary_max INT,
    source_url TEXT,
    embedding vector(768),
    posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    UNIQUE(job_id, skill_id)
);

CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    work_mode work_mode NOT NULL DEFAULT 'REMOTE',
    duration VARCHAR(50) DEFAULT '3 months',
    stipend VARCHAR(100),
    source_url TEXT,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Applications Tracker (Enforcing mutually exclusive job_id OR internship_id)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    status application_status NOT NULL DEFAULT 'SAVED',
    notes TEXT,
    applied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT app_target_check CHECK (
        (job_id IS NOT NULL AND internship_id IS NULL) OR
        (job_id IS NULL AND internship_id IS NOT NULL)
    )
);

-- 12. Resumes and Analyses
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    is_current BOOLEAN NOT NULL DEFAULT true,
    parsed_text TEXT,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    target_career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
    overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    ats_score INT NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
    extracted_skills JSONB NOT NULL DEFAULT '[]',
    missing_skills JSONB NOT NULL DEFAULT '[]',
    strengths JSONB NOT NULL DEFAULT '[]',
    improvements JSONB NOT NULL DEFAULT '[]',
    critique_markdown TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Mock Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
    interview_type interview_type NOT NULL DEFAULT 'MIXED',
    title VARCHAR(200) NOT NULL,
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
    technical_score INT CHECK (technical_score >= 0 AND technical_score <= 100),
    communication_score INT CHECK (communication_score >= 0 AND communication_score <= 100),
    problem_solving_score INT CHECK (problem_solving_score >= 0 AND problem_solving_score <= 100),
    feedback TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    expected_topics JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    student_answer TEXT NOT NULL,
    score INT CHECK (score >= 0 AND score <= 100),
    strengths TEXT,
    weaknesses TEXT,
    ideal_answer_hint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Skill Gap Analysis
CREATE TABLE IF NOT EXISTS skill_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    overall_readiness_score INT NOT NULL CHECK (overall_readiness_score >= 0 AND overall_readiness_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, career_id)
);

CREATE TABLE IF NOT EXISTS skill_gap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES skill_gap_analysis(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    current_proficiency proficiency_level,
    required_proficiency proficiency_level NOT NULL,
    gap_score INT NOT NULL,
    priority VARCHAR(50) DEFAULT 'HIGH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. Explainable Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    type recommendation_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 0.85,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    metadata JSONB NOT NULL DEFAULT '{}',
    is_dismissed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- 16. AI Career Copilot Conversations & Messages
CREATE TABLE IF NOT EXISTS agent_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL DEFAULT 'New Career Discussion',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES agent_conversations(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    structured_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper: enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

-- Catalog tables have public read access
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for careers" ON careers FOR SELECT USING (true);
CREATE POLICY "Public read for skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read for career_skills" ON career_skills FOR SELECT USING (true);
CREATE POLICY "Public read for courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read for course_skills" ON course_skills FOR SELECT USING (true);
CREATE POLICY "Public read for companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read for jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public read for job_skills" ON job_skills FOR SELECT USING (true);
CREATE POLICY "Public read for internships" ON internships FOR SELECT USING (true);
CREATE POLICY "Public read for subjects" ON subjects FOR SELECT USING (true);

-- Student-specific RLS policies
CREATE POLICY "Students manage own profile" ON students
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Students manage own education" ON student_education
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own academic records" ON academic_records
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own skills" ON student_skills
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own projects" ON projects
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own certifications" ON certifications
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own career goals" ON career_goals
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own learning progress" ON learning_progress
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own applications" ON applications
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own resumes" ON resumes
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students view own resume analyses" ON resume_analyses
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own interviews" ON interviews
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own interview questions" ON interview_questions
    FOR ALL USING (interview_id IN (
        SELECT id FROM interviews WHERE student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    ));

CREATE POLICY "Students manage own interview answers" ON interview_answers
    FOR ALL USING (question_id IN (
        SELECT q.id FROM interview_questions q
        JOIN interviews i ON q.interview_id = i.id
        WHERE i.student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    ));

CREATE POLICY "Students view own skill gap" ON skill_gap_analysis
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students view own recommendations" ON recommendations
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own conversations" ON agent_conversations
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Students manage own messages" ON agent_messages
    FOR ALL USING (conversation_id IN (
        SELECT id FROM agent_conversations WHERE student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    ));
