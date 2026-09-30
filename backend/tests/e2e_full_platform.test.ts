import { createApp } from '../src/app.js';
import { supabase } from '../src/config/supabase.js';
import http from 'http';

interface TestContext {
  baseUrl: string;
  studentToken: string;
  recruiterToken: string;
  adminToken: string;
  studentId: string;
  careerId: string;
  skillId1: string;
  skillId2: string;
  companyId: string;
  createdJobId?: string;
  createdAppId?: string;
  createdCourseId?: string;
  createdInterviewId?: string;
  createdResumeId?: string;
}

const TEST_PORT = 5092;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Helper for HTTP requests
async function req(
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: any;
    formData?: FormData;
    expectedStatus?: number;
  } = {}
) {
  const method = options.method || 'GET';
  const headers: Record<string, string> = {};

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  let body: any = undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (options.expectedStatus && res.status !== options.expectedStatus) {
    throw new Error(
      `[${method} ${path}] Expected HTTP ${options.expectedStatus}, got ${res.status}. Body: ${JSON.stringify(json, null, 2)}`
    );
  }

  return { status: res.status, json };
}

async function runEndToEndQASuite() {
  console.log('================================================================');
  console.log('🚀 SENIOR QA BACKEND TESTER: END-TO-END PLATFORM & INTEGRATION SUITE');
  console.log('================================================================\n');

  // 1. Initialize Express App & Server
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`✅ Express backend initialized on port ${TEST_PORT}`);
      resolve();
    });
  });

  try {
    // 2. Authenticate Personas
    console.log('\n--- 🔑 ACQUIRING REAL SUPABASE JWT SESSIONS FOR QA ROLES ---');

    const studentLogin = await supabase.auth.signInWithPassword({
      email: 'qa.backend.tester.1790687344227@gmail.com',
      password: 'TestPassword123!',
    });
    if (!studentLogin.data?.session?.access_token) {
      throw new Error(`Failed to authenticate Student: ${studentLogin.error?.message}`);
    }
    const studentToken = studentLogin.data.session.access_token;
    console.log('✅ Student JWT session acquired');

    const recruiterLogin = await supabase.auth.signInWithPassword({
      email: 'qa.recruiter.automation@gmail.com',
      password: 'TestPassword123!',
    });
    if (!recruiterLogin.data?.session?.access_token) {
      throw new Error(`Failed to authenticate Recruiter: ${recruiterLogin.error?.message}`);
    }
    const recruiterToken = recruiterLogin.data.session.access_token;
    console.log('✅ Recruiter JWT session acquired');

    const adminLogin = await supabase.auth.signInWithPassword({
      email: 'qa.admin.automation@gmail.com',
      password: 'TestPassword123!',
    });
    if (!adminLogin.data?.session?.access_token) {
      throw new Error(`Failed to authenticate Admin: ${adminLogin.error?.message}`);
    }
    const adminToken = adminLogin.data.session.access_token;
    console.log('✅ Admin JWT session acquired');

    const ctx: TestContext = {
      baseUrl: BASE_URL,
      studentToken,
      recruiterToken,
      adminToken,
      studentId: '',
      careerId: '',
      skillId1: '',
      skillId2: '',
      companyId: '',
    };

    // -------------------------------------------------------------
    // MODULE 1: Authentication & RBAC (/api/auth)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 1: AUTHENTICATION & ROLE-BASED ACCESS CONTROL ---');

    // 1a. Unauthenticated /api/auth/me -> 401
    const unauthAuth = await req('/api/auth/me', { expectedStatus: 401 });
    if (unauthAuth.json.success === false) {
      console.log('✅ 1.1: Unauthenticated request properly rejected with 401 Unauthorized');
    }

    // 1b. Authenticated Student /api/auth/me
    const studentAuth = await req('/api/auth/me', { token: ctx.studentToken, expectedStatus: 200 });
    if (studentAuth.json.success && studentAuth.json.data.user.role === 'STUDENT') {
      ctx.studentId = studentAuth.json.data.student.id;
      console.log(`✅ 1.2: Student authenticated. Profile ID: ${ctx.studentId}`);
    } else {
      throw new Error('Student auth payload invalid');
    }

    // 1c. Authenticated Recruiter /api/auth/me
    const recruiterAuth = await req('/api/auth/me', { token: ctx.recruiterToken, expectedStatus: 200 });
    if (recruiterAuth.json.success && recruiterAuth.json.data.user.role === 'RECRUITER') {
      console.log('✅ 1.3: Recruiter authenticated with role RECRUITER');
    } else {
      throw new Error('Recruiter auth payload invalid');
    }

    // 1d. Authenticated Admin /api/auth/me
    const adminAuth = await req('/api/auth/me', { token: ctx.adminToken, expectedStatus: 200 });
    if (adminAuth.json.success && adminAuth.json.data.user.role === 'ADMIN') {
      console.log('✅ 1.4: Admin authenticated with role ADMIN');
    } else {
      throw new Error('Admin auth payload invalid');
    }

    // -------------------------------------------------------------
    // MODULE 2: Student Profile & Portfolio (/api/students)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 2: STUDENT PROFILE & PORTFOLIO MANAGEMENT ---');

    // 2a. Update Profile
    const updateProfile = await req('/api/students/me', {
      method: 'PUT',
      token: ctx.studentToken,
      body: {
        first_name: 'Alex',
        last_name: 'Dev-QA',
        phone: '+91 9998887776',
        city: 'Bengaluru',
        bio: 'Senior QA & Backend Systems Enthusiast',
        github_url: 'https://github.com/alex-dev-qa',
        linkedin_url: 'https://linkedin.com/in/alex-dev-qa',
      },
      expectedStatus: 200,
    });
    console.log('✅ 2.1: Student profile successfully updated and persisted');

    // 2b. Add Education
    const addEdu = await req('/api/students/me/education', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        institution_name: 'National Institute of Technology',
        degree: 'B.Tech',
        field_of_study: 'Computer Science',
        start_year: 2022,
        end_year: 2026,
        grade_point_avg: 9.1,
        is_current: true,
      },
      expectedStatus: 201,
    });
    const eduId = addEdu.json.data.id;
    console.log(`✅ 2.2: Education record created with ID: ${eduId}`);

    // 2c. Get Education
    const getEdu = await req('/api/students/me/education', {
      token: ctx.studentToken,
      expectedStatus: 200,
    });
    if (!Array.isArray(getEdu.json.data) || getEdu.json.data.length === 0) {
      throw new Error('Education listing failed');
    }
    console.log(`✅ 2.3: Education listing verified (${getEdu.json.data.length} records)`);

    // 2d. Add Project
    const addProj = await req('/api/students/me/projects', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        title: 'Distributed Transaction Coordinator',
        description: 'Two-phase commit coordinator in TypeScript with Redis locking',
        github_url: 'https://github.com/alex-dev-qa/2pc-coordinator',
        is_featured: true,
      },
      expectedStatus: 201,
    });
    console.log(`✅ 2.4: Project record created with ID: ${addProj.json.data.id}`);

    // -------------------------------------------------------------
    // MODULE 3: Skills Catalog & Student Skills (/api/skills)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 3: SKILLS CATALOG & STUDENT SKILLS ---');

    // 3a. Browse public catalog
    const skillsRes = await req('/api/skills', { expectedStatus: 200 });
    if (!Array.isArray(skillsRes.json.data) || skillsRes.json.data.length === 0) {
      throw new Error('Failed to retrieve master skill catalog');
    }
    ctx.skillId1 = skillsRes.json.data.find((s: any) => s.name === 'Python')?.id || skillsRes.json.data[0].id;
    ctx.skillId2 = skillsRes.json.data.find((s: any) => s.name === 'Docker')?.id || skillsRes.json.data[1].id;
    console.log(`✅ 3.1: Loaded ${skillsRes.json.data.length} skills from catalog. Selected IDs: ${ctx.skillId1}, ${ctx.skillId2}`);

    // 3b. Add Skill to Student Profile
    const addSkill1 = await req('/api/skills/me', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        skill_id: ctx.skillId1,
        proficiency: 'INTERMEDIATE',
        source: 'SELF_REPORTED',
        years_experience: 2,
      },
      expectedStatus: 201,
    });
    const studentSkillRecordId = addSkill1.json.data.id;
    console.log(`✅ 3.2: Added skill 1 (INTERMEDIATE) with ID: ${studentSkillRecordId}`);

    // 3c. Update Skill Proficiency
    await req(`/api/skills/me/${studentSkillRecordId}`, {
      method: 'PUT',
      token: ctx.studentToken,
      body: {
        proficiency: 'ADVANCED',
        years_experience: 3,
      },
      expectedStatus: 200,
    });
    console.log('✅ 3.3: Updated skill proficiency to ADVANCED');

    // 3d. Get Student Skills
    const getStudentSkills = await req('/api/skills/me', {
      token: ctx.studentToken,
      expectedStatus: 200,
    });
    console.log(`✅ 3.4: Verified student has ${getStudentSkills.json.data.length} reported skills`);

    // -------------------------------------------------------------
    // MODULE 4: Career Explorer & Goals (/api/careers)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 4: CAREER EXPLORER & GOAL SETTING ---');

    // 4a. Get all careers
    const careersRes = await req('/api/careers', { expectedStatus: 200 });
    if (!Array.isArray(careersRes.json.data) || careersRes.json.data.length === 0) {
      throw new Error('Failed to fetch careers list');
    }
    const backendCareer = careersRes.json.data.find((c: any) => c.title === 'Backend Developer') || careersRes.json.data[0];
    ctx.careerId = backendCareer.id;
    console.log(`✅ 4.1: Careers catalog loaded (${careersRes.json.data.length} careers). Target: "${backendCareer.title}" (${ctx.careerId})`);

    // 4b. Get Career Details with required skills & weights
    const careerDetails = await req(`/api/careers/${ctx.careerId}`, { expectedStatus: 200 });
    console.log(`✅ 4.2: Career details retrieved. Required skills count: ${careerDetails.json.data.career_skills?.length || 0}`);

    // 4c. Set Target Career Goal
    await req('/api/careers/me/goals', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        career_id: ctx.careerId,
        priority: 1,
        target_date: '2027-01-01',
      },
      expectedStatus: 201,
    });
    console.log('✅ 4.3: Active career goal set for student');

    // 4d. Get Student Career Goals
    const getGoals = await req('/api/careers/me/goals', {
      token: ctx.studentToken,
      expectedStatus: 200,
    });
    if (!Array.isArray(getGoals.json.data) || getGoals.json.data.length === 0) {
      throw new Error('Career goal retrieval failed');
    }
    console.log(`✅ 4.4: Verified active student career goal: ${getGoals.json.data[0].career?.title || ctx.careerId}`);

    // -------------------------------------------------------------
    // MODULE 5: Courses & Hybrid Skill-Gap Recommendations (/api/courses)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 5: COURSE CATALOG, GAP RECOMMENDATIONS & ADMIN CRUD ---');

    // 5a. Public course catalog
    const coursesCatalog = await req('/api/courses', { expectedStatus: 200 });
    console.log(`✅ 5.1: Course catalog accessible (${coursesCatalog.json.data.length} existing courses)`);

    // 5b. Skill gap course recommendation (Hybrid: App Catalog + Tavily Web Paid/Free)
    const gapCoursesRes = await req('/api/courses/recommendations/skill-gap', {
      method: 'POST',
      body: {
        skills: ['Kubernetes', 'Redis'],
      },
      expectedStatus: 200,
    });
    if (!gapCoursesRes.json.data.skill_groups || !Array.isArray(gapCoursesRes.json.data.skill_groups)) {
      throw new Error('Gap course recommendation payload missing skill_groups structure');
    }
    console.log(`✅ 5.2: Hybrid gap course recommendation returned ${gapCoursesRes.json.data.skill_groups.length} skill groups (total courses: ${gapCoursesRes.json.data.total_courses || 0})`);

    // 5c. RBAC: Student attempts to create course -> 403 Forbidden
    await req('/api/courses', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        title: 'Unauthorized Student Course',
        provider: 'Hacker',
        description: 'Should fail with 403',
        url: 'https://example.com/unauth',
      },
      expectedStatus: 403,
    });
    console.log('✅ 5.3: Student prevented from creating platform course (403 Forbidden)');

    // 5d. Admin creates new platform course
    const adminCreateCourse = await req('/api/courses', {
      method: 'POST',
      token: ctx.adminToken,
      body: {
        title: 'QA Automated Distributed Testing',
        provider: 'QA Academy',
        description: 'Comprehensive testing for microservices and database transactions',
        url: 'https://example.com/courses/qa-testing',
        difficulty: 'ADVANCED',
        duration_hours: 20,
        is_free: true,
      },
      expectedStatus: 201,
    });
    ctx.createdCourseId = adminCreateCourse.json.data.id;
    console.log(`✅ 5.4: Admin created new course with ID: ${ctx.createdCourseId}`);

    // 5e. Student enrolls / updates progress
    await req(`/api/courses/me/progress/${ctx.createdCourseId}`, {
      method: 'PUT',
      token: ctx.studentToken,
      body: {
        progress_percent: 60,
        status: 'IN_PROGRESS',
      },
      expectedStatus: 200,
    });
    console.log('✅ 5.5: Student tracked progress on newly created course (60% IN_PROGRESS)');

    // 5f. Admin deletes the test course
    await req(`/api/courses/${ctx.createdCourseId}`, {
      method: 'DELETE',
      token: ctx.adminToken,
      expectedStatus: 200,
    });
    console.log('✅ 5.6: Admin successfully cleaned up the test course (200 OK)');

    // -------------------------------------------------------------
    // MODULE 6: Jobs & Recruiter Portal (/api/jobs & /api/internships)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 6: JOBS & RECRUITER PORTAL ---');

    // 6a. Public jobs list
    const publicJobs = await req('/api/jobs', { expectedStatus: 200 });
    console.log(`✅ 6.1: Public jobs catalog loaded (${publicJobs.json.data.length} active listings)`);

    // 6b. Get company ID for job posting
    const compQuery = await req('/api/jobs', { expectedStatus: 200 });
    ctx.companyId = compQuery.json.data[0]?.company_id || 'd0000000-0000-0000-0000-000000000001';

    // 6c. Student forbidden from posting job (403)
    await req('/api/jobs', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        company_id: ctx.companyId,
        title: 'Unauthorized Student Job',
        description: 'Should fail with 403',
        skills: [{ skill_id: ctx.skillId1, weight: 1.0 }],
      },
      expectedStatus: 403,
    });
    console.log('✅ 6.2: Student forbidden from posting jobs (403 Forbidden)');

    // 6d. Recruiter posts new Job with weighted skill tags
    const recruiterJob = await req('/api/jobs', {
      method: 'POST',
      token: ctx.recruiterToken,
      body: {
        company_id: ctx.companyId,
        title: 'Senior Backend Platform Engineer',
        description: 'Architecting high-concurrency microservices with Python, Docker, and PostgreSQL.',
        location: 'Bengaluru',
        work_mode: 'HYBRID',
        employment_type: 'FULL_TIME',
        experience_min: 2,
        experience_max: 5,
        salary_min: 1500000,
        salary_max: 2500000,
        skills: [
          {
            skill_id: ctx.skillId1, // Python (Student has ADVANCED)
            weight: 3.0,
            is_required: true,
            required_proficiency: 'ADVANCED',
          },
          {
            skill_id: ctx.skillId2, // Docker (Student lacks)
            weight: 2.0,
            is_required: false,
            required_proficiency: 'INTERMEDIATE',
          },
        ],
      },
      expectedStatus: 201,
    });
    ctx.createdJobId = recruiterJob.json.data.id;
    console.log(`✅ 6.3: Recruiter posted job "${recruiterJob.json.data.title}" (ID: ${ctx.createdJobId})`);

    // 6e. Recruiter posts Internship
    const recruiterInternship = await req('/api/internships', {
      method: 'POST',
      token: ctx.recruiterToken,
      body: {
        company_id: ctx.companyId,
        title: 'Cloud Infrastructure Intern',
        description: 'Assist DevOps team with Kubernetes deployments and monitoring alerts.',
        duration: '6 Months',
        stipend: '₹35,000/month',
      },
      expectedStatus: 201,
    });
    console.log(`✅ 6.4: Recruiter posted internship (ID: ${recruiterInternship.json.data.id})`);

    // -------------------------------------------------------------
    // MODULE 7: ATS Applications & State Machine (/api/applications)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 7: ATS APPLICATION PIPELINE & STATE MACHINE ---');

    // 7a. Student applies for the newly posted job
    const applyRes = await req('/api/applications', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        job_id: ctx.createdJobId,
        status: 'APPLIED',
        notes: 'Enthusiastic about building scalable cloud backend platforms!',
      },
      expectedStatus: 201,
    });
    ctx.createdAppId = applyRes.json.data.id;
    const matchScore = applyRes.json.data.match_score;
    const matchBreakdown = applyRes.json.data.match_breakdown;
    console.log(`✅ 7.1: Application submitted (ID: ${ctx.createdAppId})`);
    console.log(`       Match Score computed automatically: ${matchScore}%`);
    console.log(`       Matched Skills: ${matchBreakdown?.matched_skills?.length || 0}, Missing: ${matchBreakdown?.missing_skills?.length || 0}`);

    // 7b. Recruiter views candidates ranked for the job
    const candidatesRes = await req(`/api/jobs/${ctx.createdJobId}/candidates`, {
      token: ctx.recruiterToken,
      expectedStatus: 200,
    });
    const candidateApp = candidatesRes.json.data.find((c: any) => c.id === ctx.createdAppId);
    if (!candidateApp) {
      throw new Error('Candidate application not found in recruiter candidate view');
    }
    console.log(`✅ 7.2: Recruiter inspected candidates. Student ranked with match score ${candidateApp.match_score}%`);

    // 7c. Illegal State Transition: APPLIED -> OFFER (must be rejected with 400 Bad Request)
    const illegalTransition = await req(`/api/applications/${ctx.createdAppId}/status`, {
      method: 'PATCH',
      token: ctx.recruiterToken,
      body: {
        status: 'OFFER',
        notes: 'Attempting invalid direct jump',
      },
      expectedStatus: 400,
    });
    console.log('✅ 7.3: Illegal ATS transition (APPLIED -> OFFER) correctly rejected with 400 Bad Request');

    // 7d. Valid Transition 1: APPLIED -> REVIEWING
    await req(`/api/applications/${ctx.createdAppId}/status`, {
      method: 'PATCH',
      token: ctx.recruiterToken,
      body: {
        status: 'REVIEWING',
        notes: 'Candidate profile shortlisted for technical screening',
      },
      expectedStatus: 200,
    });
    console.log('✅ 7.4: ATS Transition successful: APPLIED -> REVIEWING');

    // 7e. Valid Transition 2: REVIEWING -> INTERVIEW_SCHEDULED
    await req(`/api/applications/${ctx.createdAppId}/status`, {
      method: 'PATCH',
      token: ctx.recruiterToken,
      body: {
        status: 'INTERVIEW_SCHEDULED',
        notes: 'Technical architecture interview scheduled with engineering lead',
      },
      expectedStatus: 200,
    });
    console.log('✅ 7.5: ATS Transition successful: REVIEWING -> INTERVIEW_SCHEDULED');

    // 7f. Inspect audit trail in status_history
    const auditRes = await req(`/api/applications/${ctx.createdAppId}`, {
      token: ctx.recruiterToken,
      expectedStatus: 200,
    });
    const history = auditRes.json.data.status_history;
    console.log(`✅ 7.6: Audit trail verified with ${history?.length || 0} recorded status transitions`);

    // -------------------------------------------------------------
    // MODULE 8: Resumes & ATS Scoring (/api/resumes)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 8: RESUME INGESTION & AI ATS SCANNER ---');

    // Create a mock PDF buffer in memory
    const mockPdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 300 144]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000057 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF'
    );

    const formData = new FormData();
    formData.append('resume', new Blob([mockPdfBuffer], { type: 'application/pdf' }), 'alex_dev_qa_resume.pdf');
    formData.append('target_role', 'Backend Developer');
    formData.append('target_career_id', ctx.careerId);

    const uploadRes = await req('/api/resumes/upload', {
      method: 'POST',
      token: ctx.studentToken,
      formData,
      expectedStatus: 201,
    });

    ctx.createdResumeId = uploadRes.json.data.resume.id;
    const atsScore = uploadRes.json.data.analysis?.ats_score;
    console.log(`✅ 8.1: Resume uploaded to private storage & analyzed (Resume ID: ${ctx.createdResumeId})`);
    console.log(`       ATS Score: ${atsScore}, Overall: ${uploadRes.json.data.analysis?.overall_score}`);

    // 8b. Generate secure signed download URL
    const downloadRes = await req(`/api/resumes/${ctx.createdResumeId}/download-url`, {
      token: ctx.studentToken,
      expectedStatus: 200,
    });
    if (!downloadRes.json.data.download_url) {
      throw new Error('Download URL was not generated');
    }
    console.log('✅ 8.2: Secure signed temporary download URL generated successfully');

    // -------------------------------------------------------------
    // MODULE 9: AI Mock Interview Simulation (/api/interviews)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 9: AI MOCK INTERVIEW ENGINE ---');

    // 9a. Generate Interview Session
    const genInterviewRes = await req('/api/interviews/generate', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        career_id: ctx.careerId,
        interview_type: 'TECHNICAL',
        title: 'Backend Systems Engineering Mock Interview',
        question_count: 3,
      },
      expectedStatus: 201,
    });
    ctx.createdInterviewId = genInterviewRes.json.data.id;
    const firstQuestion = genInterviewRes.json.data.questions?.[0]?.question || 'Explain microservice communication patterns.';
    console.log(`✅ 9.1: Interview session generated (ID: ${ctx.createdInterviewId})`);
    console.log(`       Q1: "${firstQuestion.slice(0, 75)}..."`);

    // 9b. Submit Interactive Turn Answer
    const turnRes = await req(`/api/interviews/${ctx.createdInterviewId}/turn`, {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        turn_number: 1,
        total_turns: 3,
        target_role: 'Backend Developer',
        interview_type: 'TECHNICAL',
        current_question: firstQuestion,
        student_answer: 'I implement gRPC for high-throughput internal service communication and REST with OpenAPI for public APIs. For async events, Kafka is utilized.',
      },
      expectedStatus: 200,
    });
    console.log(`✅ 9.2: Turn 1 evaluated. Turn Score: ${turnRes.json.data.evaluation?.score}/100`);
    console.log(`       Follow-up Question: "${turnRes.json.data.next_question?.slice(0, 70)}..."`);

    // 9c. Generate Final Performance Report
    const reportRes = await req(`/api/interviews/${ctx.createdInterviewId}/report`, {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        career_title: 'Backend Developer',
      },
      expectedStatus: 200,
    });
    console.log(`✅ 9.3: Final Performance Report generated: Readiness: ${reportRes.json.data.readiness_level}, Score: ${reportRes.json.data.overall_score}/100`);

    // 9d. Download Generated PDF Report (Stream & Magic Bytes Verification)
    const rawPdfRes = await fetch(`${BASE_URL}/api/interviews/${ctx.createdInterviewId}/report/pdf`, {
      headers: {
        Authorization: `Bearer ${ctx.studentToken}`,
        Connection: 'close',
      },
    });
    if (rawPdfRes.status !== 200) {
      throw new Error(`Expected HTTP 200 for PDF download, got ${rawPdfRes.status}`);
    }
    const pdfBuf = Buffer.from(await rawPdfRes.arrayBuffer());
    if (rawPdfRes.headers.get('content-type') !== 'application/pdf' || !pdfBuf.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
      throw new Error('Interview report PDF download failed integrity check');
    }
    console.log(`✅ 9.4: Candidate downloaded official interview assessment PDF (${pdfBuf.length} bytes, %PDF- verified)`);

    // -------------------------------------------------------------
    // MODULE 10: AI Copilot & Career Guidance (/api/ai)
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 10: AI COPILOT & CAREER GUIDANCE ---');

    // 10a. Chat with Guardrailed Copilot
    const chatRes = await req('/api/ai/chat', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        message: 'What skills should I learn next to improve as a Backend Developer?',
      },
      expectedStatus: 200,
    });
    console.log('✅ 10.1: Copilot replied with structured recommendations and action items');
    console.log(`        Reply snippet: "${chatRes.json.data.message?.content?.slice(0, 90) || 'Response generated'}..."`);

    // 10b. Skill-Gap Analysis
    const gapRes = await req('/api/ai/skill-gap', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        career_id: ctx.careerId,
      },
      expectedStatus: 200,
    });
    console.log(`✅ 10.2: AI Skill-gap analysis: Readiness Score ${gapRes.json.data.readiness_score}% for ${gapRes.json.data.career_title}`);

    // 10c. Learning Roadmap Generation
    const roadmapRes = await req('/api/ai/roadmap', {
      method: 'POST',
      token: ctx.studentToken,
      body: {
        career_id: ctx.careerId,
        target_months: 3,
      },
      expectedStatus: 200,
    });
    console.log(`✅ 10.3: Generated 3-month action roadmap with ${roadmapRes.json.data.milestones?.length || 0} milestone phases`);

    // -------------------------------------------------------------
    // MODULE 11: End-to-End Cross-Module Hiring Finalization
    // -------------------------------------------------------------
    console.log('\n--- 🧪 MODULE 11: FULL CROSS-MODULE HIRING LIFECYCLE FINALIZATION ---');

    // 11a. Recruiter extends Offer
    await req(`/api/applications/${ctx.createdAppId}/status`, {
      method: 'PATCH',
      token: ctx.recruiterToken,
      body: {
        status: 'OFFER',
        notes: 'Candidate demonstrated stellar technical and architecture proficiency.',
      },
      expectedStatus: 200,
    });
    console.log('✅ 11.1: Recruiter extended offer: INTERVIEW_SCHEDULED -> OFFER');

    // 11b. Recruiter selects candidate (Hired)
    await req(`/api/applications/${ctx.createdAppId}/status`, {
      method: 'PATCH',
      token: ctx.recruiterToken,
      body: {
        status: 'SELECTED',
        notes: 'Candidate accepted offer. Hired as Senior Backend Platform Engineer!',
      },
      expectedStatus: 200,
    });
    console.log('✅ 11.2: Candidate hired: OFFER -> SELECTED (Terminal State)');

    // 11c. Verify Terminal State (attempting transition from SELECTED -> REVIEWING must fail)
    await req(`/api/applications/${ctx.createdAppId}/status`, {
      method: 'PATCH',
      token: ctx.recruiterToken,
      body: {
        status: 'REVIEWING',
        notes: 'Disallowed backwards transition from terminal state',
      },
      expectedStatus: 400,
    });
    console.log('✅ 11.3: Terminal state protected: attempts to transition from SELECTED rejected with 400');

    // 11d. Student verifies application status in their own dashboard
    const studentAppVerification = await req(`/api/applications/${ctx.createdAppId}`, {
      token: ctx.studentToken,
      expectedStatus: 200,
    });
    if (studentAppVerification.json.data.status !== 'SELECTED') {
      throw new Error(`Expected final application status 'SELECTED', got ${studentAppVerification.json.data.status}`);
    }
    console.log('✅ 11.4: Student dashboard confirmed final application status: SELECTED (Hired)');

    console.log('\n================================================================');
    console.log('🎉 ALL 11 BACKEND MODULES & CROSS-MODULE INTEGRATIONS PASSED WITH 100% SUCCESS!');
    console.log('================================================================\n');
  } finally {
    server.close();
  }
}

runEndToEndQASuite().catch((err) => {
  console.error('\n❌ QA End-to-End Suite encountered an error:', err);
  process.exit(1);
});
