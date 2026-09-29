import { ApplicationsService, VALID_ATS_TRANSITIONS } from '../src/modules/applications/applications.service.js';
import { createApp } from '../src/app.js';
import http from 'http';

async function runRecruiterAndAtsTests() {
  console.log('=== Recruiter Workflows & ATS State Machine Test Suite ===\n');

  // 1. Verify ATS State Machine Transition Rules
  console.log('--- 1. Testing ATS State Machine Definition & Boundaries ---');
  
  // Standard progression
  if (!VALID_ATS_TRANSITIONS['APPLIED'].includes('REVIEWING')) {
    throw new Error("State machine violation: 'APPLIED' must allow transition to 'REVIEWING'");
  }
  if (!VALID_ATS_TRANSITIONS['REVIEWING'].includes('INTERVIEW_SCHEDULED')) {
    throw new Error("State machine violation: 'REVIEWING' must allow transition to 'INTERVIEW_SCHEDULED'");
  }
  if (!VALID_ATS_TRANSITIONS['INTERVIEW_SCHEDULED'].includes('OFFER')) {
    throw new Error("State machine violation: 'INTERVIEW_SCHEDULED' must allow transition to 'OFFER'");
  }
  if (!VALID_ATS_TRANSITIONS['OFFER'].includes('SELECTED')) {
    throw new Error("State machine violation: 'OFFER' must allow transition to 'SELECTED'");
  }

  // Rejection capability at each intermediate stage
  for (const stage of ['APPLIED', 'REVIEWING', 'INTERVIEW_SCHEDULED', 'OFFER']) {
    if (!VALID_ATS_TRANSITIONS[stage].includes('REJECTED')) {
      throw new Error(`State machine violation: '${stage}' must allow transition to 'REJECTED'`);
    }
  }

  // Terminal states must have no outgoing transitions
  if (VALID_ATS_TRANSITIONS['REJECTED'].length !== 0) {
    throw new Error("State machine violation: 'REJECTED' must be a terminal state");
  }
  if (VALID_ATS_TRANSITIONS['SELECTED'].length !== 0) {
    throw new Error("State machine violation: 'SELECTED' must be a terminal state");
  }
  if (VALID_ATS_TRANSITIONS['WITHDRAWN'].length !== 0) {
    throw new Error("State machine violation: 'WITHDRAWN' must be a terminal state");
  }

  // Disallowed transitions
  if (VALID_ATS_TRANSITIONS['APPLIED'].includes('OFFER')) {
    throw new Error("State machine violation: Direct jump 'APPLIED' -> 'OFFER' must be forbidden");
  }
  if (VALID_ATS_TRANSITIONS['APPLIED'].includes('INTERVIEW_SCHEDULED')) {
    throw new Error("State machine violation: Direct jump 'APPLIED' -> 'INTERVIEW_SCHEDULED' must be forbidden");
  }
  console.log('✅ State Machine definitions strictly adhere to APPLIED -> REVIEWING -> INTERVIEW_SCHEDULED -> OFFER / REJECTED');

  // 2. Test HTTP Endpoint Security for Recruiter & ATS Routes
  console.log('\n--- 2. Testing HTTP Route Guards (RBAC & Auth) ---');
  const app = createApp();
  const server = http.createServer(app);
  const testPort = 5094;

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`✅ Test server running on port ${testPort}`);
      resolve();
    });
  });

  try {
    // 2a. Unauthenticated POST /api/jobs
    const unauthPostJob = await fetch(`http://localhost:${testPort}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: '00000000-0000-0000-0000-000000000000',
        title: 'Backend Engineer',
        description: 'Test job description with more than 10 characters',
        skills: [{ skill_id: '00000000-0000-0000-0000-000000000001', weight: 2.0 }],
      }),
    });
    console.log('✅ Unauthenticated POST /api/jobs ->', unauthPostJob.status);
    if (unauthPostJob.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for POST /api/jobs, got ${unauthPostJob.status}`);
    }

    // 2b. Unauthenticated GET /api/jobs/:id/candidates
    const unauthGetCandidates = await fetch(`http://localhost:${testPort}/api/jobs/00000000-0000-0000-0000-000000000000/candidates`);
    console.log('✅ Unauthenticated GET /api/jobs/:id/candidates ->', unauthGetCandidates.status);
    if (unauthGetCandidates.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for candidates endpoint, got ${unauthGetCandidates.status}`);
    }

    // 2c. Unauthenticated POST /api/internships
    const unauthPostInternship = await fetch(`http://localhost:${testPort}/api/internships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: '00000000-0000-0000-0000-000000000000',
        title: 'Software Intern',
        description: 'Internship description here with enough length',
      }),
    });
    console.log('✅ Unauthenticated POST /api/internships ->', unauthPostInternship.status);
    if (unauthPostInternship.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for POST /api/internships, got ${unauthPostInternship.status}`);
    }

    // 2d. Unauthenticated PATCH /api/applications/:id/status
    const unauthPatchStatus = await fetch(`http://localhost:${testPort}/api/applications/00000000-0000-0000-0000-000000000000/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'REVIEWING',
        notes: 'Moving to review stage',
      }),
    });
    console.log('✅ Unauthenticated PATCH /api/applications/:id/status ->', unauthPatchStatus.status);
    if (unauthPatchStatus.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for status transition, got ${unauthPatchStatus.status}`);
    }

    // 2e. Public GET /api/jobs should be accessible
    const publicJobsRes = await fetch(`http://localhost:${testPort}/api/jobs`);
    console.log('✅ Public GET /api/jobs ->', publicJobsRes.status);
    if (publicJobsRes.status !== 200) {
      throw new Error(`Expected 200 OK for public jobs catalog, got ${publicJobsRes.status}`);
    }

    // 2f. Public GET /api/internships should be accessible
    const publicInternshipsRes = await fetch(`http://localhost:${testPort}/api/internships`);
    console.log('✅ Public GET /api/internships ->', publicInternshipsRes.status);
    if (publicInternshipsRes.status !== 200) {
      throw new Error(`Expected 200 OK for public internships catalog, got ${publicInternshipsRes.status}`);
    }

    console.log('\n🎉 ALL RECRUITER & ATS WORKFLOW TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

runRecruiterAndAtsTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
