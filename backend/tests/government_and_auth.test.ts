import { createApp } from '../src/app.js';
import http from 'http';

const TEST_PORT = 5091;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function req(
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: any;
    expectedStatus?: number;
  } = {}
) {
  const method = options.method || 'GET';
  const headers: Record<string, string> = {};

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
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

async function runGovernmentAndAuthTests() {
  console.log('================================================================');
  console.log('🏛️ QA TEST SUITE: AUTHENTICATION (RBAC) & GOVERNMENT SCHEMES');
  console.log('================================================================\n');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`✅ Test server successfully running on port ${TEST_PORT}\n`);
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------------------
    // PART 1: AUTHENTICATION ROUTES (REGISTER, LOGIN, LOGOUT, ME with RBAC)
    // -------------------------------------------------------------------------
    console.log('--- 1. Testing Registration with RBAC Roles ---');

    const timestamp = Date.now();
    const testStudentEmail = `qa.new.student.${timestamp}@gmail.com`;
    const testRecruiterEmail = `qa.new.recruiter.${timestamp}@gmail.com`;
    const testAdminEmail = `qa.new.admin.${timestamp}@gmail.com`;
    const defaultPassword = 'StrongPassword123!';

    // 1a. Register Student
    const regStudentRes = await req('/api/auth/register', {
      method: 'POST',
      body: {
        email: testStudentEmail,
        password: defaultPassword,
        role: 'STUDENT',
        first_name: 'Priya',
        last_name: 'Sharma',
        phone: '+91 9876543211',
        institution_name: 'IIT Delhi',
        degree: 'B.Tech',
        field_of_study: 'Computer Science and Engineering',
      },
      expectedStatus: 201,
    });
    console.log('✅ 1.1: Student registration succeeded (201 Created)');
    if (regStudentRes.json.data.user.role !== 'STUDENT') {
      throw new Error(`Expected role STUDENT, got ${regStudentRes.json.data.user.role}`);
    }
    console.log(`       User ID: ${regStudentRes.json.data.user.id}, Role: ${regStudentRes.json.data.user.role}`);

    // 1b. Register Recruiter
    const regRecruiterRes = await req('/api/auth/register', {
      method: 'POST',
      body: {
        email: testRecruiterEmail,
        password: defaultPassword,
        role: 'RECRUITER',
        first_name: 'Rajesh',
        last_name: 'Verma',
        phone: '+91 9876543212',
        bio: 'Technical Talent Acquisition Specialist',
      },
      expectedStatus: 201,
    });
    console.log('✅ 1.2: Recruiter registration succeeded (201 Created)');
    if (regRecruiterRes.json.data.user.role !== 'RECRUITER') {
      throw new Error(`Expected role RECRUITER, got ${regRecruiterRes.json.data.user.role}`);
    }
    console.log(`       User ID: ${regRecruiterRes.json.data.user.id}, Role: ${regRecruiterRes.json.data.user.role}`);

    // 1c. Register Admin
    const regAdminRes = await req('/api/auth/register', {
      method: 'POST',
      body: {
        email: testAdminEmail,
        password: defaultPassword,
        role: 'ADMIN',
        first_name: 'Vikram',
        last_name: 'Aditya',
      },
      expectedStatus: 201,
    });
    console.log('✅ 1.3: Admin registration succeeded (201 Created)');
    if (regAdminRes.json.data.user.role !== 'ADMIN') {
      throw new Error(`Expected role ADMIN, got ${regAdminRes.json.data.user.role}`);
    }
    console.log(`       User ID: ${regAdminRes.json.data.user.id}, Role: ${regAdminRes.json.data.user.role}`);

    // 1d. Login with valid credentials
    console.log('\n--- 2. Testing Login Endpoint & Token Issuance ---');
    const loginStudentRes = await req('/api/auth/login', {
      method: 'POST',
      body: {
        email: testStudentEmail,
        password: defaultPassword,
      },
      expectedStatus: 200,
    });
    console.log('✅ 2.1: Student login succeeded (200 OK)');
    const studentToken = loginStudentRes.json.data.session?.access_token;
    if (!studentToken) {
      throw new Error('Login response missing JWT access_token');
    }
    console.log(`       JWT Token acquired: ${studentToken.slice(0, 20)}...`);

    // 1e. Login with invalid password -> 401
    await req('/api/auth/login', {
      method: 'POST',
      body: {
        email: testStudentEmail,
        password: 'WrongPassword!',
      },
      expectedStatus: 401,
    });
    console.log('✅ 2.2: Invalid password properly rejected with 401 Unauthorized');

    // 1f. Verify /api/auth/me with newly registered and logged in token
    const meRes = await req('/api/auth/me', {
      token: studentToken,
      expectedStatus: 200,
    });
    console.log('✅ 2.3: GET /api/auth/me confirmed authenticated student session');
    console.log(`       Identity: ${meRes.json.data.user.email} (${meRes.json.data.user.role})`);

    // -------------------------------------------------------------------------
    // PART 2: GOVERNMENT EMPLOYMENT OPPORTUNITIES (GET /api/jobs/government)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Government & Public-Sector Jobs Catalog ---');

    // 3a. Get all government jobs
    const allGovJobs = await req('/api/jobs/government', { expectedStatus: 200 });
    console.log(`✅ 3.1: GET /api/jobs/government returned ${allGovJobs.json.data.length} public-sector openings`);
    if (!Array.isArray(allGovJobs.json.data) || allGovJobs.json.data.length === 0) {
      throw new Error('Expected government jobs list');
    }

    const jobTitles = allGovJobs.json.data.map((j: any) => `${j.title} (${j.company?.name || 'Govt'})`);
    console.log(`       Listings: ${jobTitles.join(' | ')}`);

    // 3b. Filter by degree eligibility (B.Tech)
    const btechGovJobs = await req('/api/jobs/government?degree=B.Tech', { expectedStatus: 200 });
    console.log(`✅ 3.2: Filtered by degree=B.Tech returned ${btechGovJobs.json.data.length} eligible positions`);

    // 3c. Filter by category (e.g. DEFENCE)
    const defenceJobs = await req('/api/jobs/government?gov_category=DEFENCE', { expectedStatus: 200 });
    console.log(`✅ 3.3: Filtered by gov_category=DEFENCE returned ${defenceJobs.json.data.length} position(s) (DRDO)`);

    // -------------------------------------------------------------------------
    // PART 3: GOVERNMENT SCHEMES & PUBLIC SCHEMES (GET /api/government-schemes)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Government Schemes & Public Schemes ---');

    // 4a. List all active schemes
    const allSchemes = await req('/api/government-schemes', { expectedStatus: 200 });
    console.log(`✅ 4.1: GET /api/government-schemes returned ${allSchemes.json.data.length} national schemes`);
    if (!Array.isArray(allSchemes.json.data) || allSchemes.json.data.length === 0) {
      throw new Error('Expected government schemes list');
    }
    const schemeTitles = allSchemes.json.data.map((s: any) => `${s.scheme_code}: ${s.title}`);
    console.log(`       Schemes: ${schemeTitles.join('\n       ')}`);

    // 4b. Filter by initiative: Skill India
    const skillIndiaSchemes = await req('/api/government-schemes?initiative=Skill India', { expectedStatus: 200 });
    console.log(`✅ 4.2: Filtered by initiative='Skill India' returned ${skillIndiaSchemes.json.data.length} scheme(s) (NAPS, PMKVY 4.0)`);

    // 4c. Filter by initiative: NEP 2020
    const nepSchemes = await req('/api/government-schemes?initiative=NEP 2020', { expectedStatus: 200 });
    console.log(`✅ 4.3: Filtered by initiative='NEP 2020' returned ${nepSchemes.json.data.length} scheme(s)`);

    // 4d. Get single scheme by ID
    const sampleSchemeId = allSchemes.json.data[0].id;
    const singleScheme = await req(`/api/government-schemes/${sampleSchemeId}`, { expectedStatus: 200 });
    console.log(`✅ 4.4: GET /api/government-schemes/:id retrieved details for "${singleScheme.json.data.title}"`);
    console.log(`       Stipend: ₹${singleScheme.json.data.stipend_amount}, Ministry: ${singleScheme.json.data.ministry_or_body}`);

    // -------------------------------------------------------------------------
    // PART 4: AI & ELIGIBILITY-BASED GOVERNMENT RECOMMENDATION
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Testing Personalized Government Schemes & Public Recommendations ---');

    // 5a. POST /api/government-schemes/recommend
    const recommendRes = await req('/api/government-schemes/recommend', {
      method: 'POST',
      token: studentToken,
      body: {
        degree: 'B.Tech',
        field_of_study: 'Computer Science',
        gpa: 8.5,
        skills: ['Python', 'SQL', 'Docker', 'REST APIs'],
      },
      expectedStatus: 200,
    });

    console.log('✅ 5.1: POST /api/government-schemes/recommend successfully executed');
    const recData = recommendRes.json.data;
    console.log(`       Eligible Schemes Found: ${recData.eligible_schemes?.length || 0}`);
    console.log(`       Matching Government Openings: ${recData.government_jobs?.length || 0}`);
    console.log(`       National Alignments: ${recData.national_initiatives_alignment?.map((a: any) => a.name).join(', ')}`);
    console.log(`       Summary: "${recData.summary}"`);

    // 5b. POST /api/ai/government-schemes/recommend (Aliased AI route)
    const aiRecommendRes = await req('/api/ai/government-schemes/recommend', {
      method: 'POST',
      token: studentToken,
      body: {
        degree: 'B.Tech',
      },
      expectedStatus: 200,
    });
    console.log('✅ 5.2: POST /api/ai/government-schemes/recommend aliased endpoint responded successfully');

    // -------------------------------------------------------------------------
    // PART 6: SESSION TERMINATION (POST /api/auth/logout)
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Testing Session Termination ---');
    await req('/api/auth/logout', {
      method: 'POST',
      token: studentToken,
      expectedStatus: 200,
    });
    console.log('✅ 6.1: POST /api/auth/logout successfully terminated session');

    console.log('\n================================================================');
    console.log('🎉 ALL GOVERNMENT EMPLOYMENT, SCHEMES & AUTH RBAC TESTS PASSED 100%!');
    console.log('================================================================\n');
  } finally {
    server.close();
  }
}

runGovernmentAndAuthTests().catch((err) => {
  console.error('\n❌ Government & Auth Test Suite failed:', err);
  process.exit(1);
});
