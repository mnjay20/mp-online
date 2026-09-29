import { useInterviewStore } from '../src/store/interviewStore';
import { useAuthStore } from '../src/store/authStore';
import { useCopilotStore } from '../src/store/copilotStore';
import {
  authApi,
  jobsApi,
  applicationsApi,
  resumeApi,
  interviewApi,
  copilotApi,
} from '../src/api/client';
import fs from 'fs';
import path from 'path';

async function runFrontendTestSuite() {
  console.log('=== Pathfinder Frontend Automated Verification Suite ===\n');

  // 1. Verify Production Build Artifacts
  console.log('--- 1. Testing Production Build Output ---');
  const distHtmlPath = path.resolve(import.meta.dirname, '../dist/index.html');
  if (!fs.existsSync(distHtmlPath)) {
    throw new Error('Build error: dist/index.html was not generated');
  }
  const htmlContent = fs.readFileSync(distHtmlPath, 'utf-8');
  if (!htmlContent.includes('<div id="root">') || !htmlContent.includes('assets/index')) {
    throw new Error('Build error: dist/index.html is missing root mounting div or asset references');
  }
  console.log('✅ Production bundle verified (index.html, JS/CSS bundles present and valid)');

  // 2. Test Auth & Role Switching Store
  console.log('\n--- 2. Testing Auth & Multi-Role Switching State ---');
  const authStore = useAuthStore.getState();
  if (authStore.role !== 'STUDENT') {
    throw new Error(`Expected default role STUDENT, got ${authStore.role}`);
  }
  authStore.switchRole('RECRUITER');
  if (useAuthStore.getState().role !== 'RECRUITER') {
    throw new Error("Failed to switch role to 'RECRUITER'");
  }
  authStore.switchRole('ADMIN');
  if (useAuthStore.getState().role !== 'ADMIN') {
    throw new Error("Failed to switch role to 'ADMIN'");
  }
  authStore.switchRole('STUDENT');
  console.log('✅ Auth & Role switcher state transitions verified (STUDENT <-> RECRUITER <-> ADMIN)');

  // 3. Test AI Mock Interview State Machine
  console.log('\n--- 3. Testing AI Mock Interview Conversational Engine ---');
  const interviewStore = useInterviewStore.getState();
  interviewStore.startSession('Backend Engineer', 'TECHNICAL', 3);

  const activeState = useInterviewStore.getState();
  if (!activeState.isSessionActive || activeState.turnNumber !== 1) {
    throw new Error('Failed to initialize active interview session');
  }

  // Simulate Turn 1 Submission
  activeState.addEvaluation(
    {
      turn_number: 1,
      question: activeState.currentQuestion,
      answer: 'I use Redis distributed locks with short leases.',
      score: 92,
      clarity_score: 95,
      depth_score: 88,
      feedback: 'Excellent explanation of distributed leases.',
    },
    'How do you handle lock renewal in high-contention scenarios?'
  );

  const turn2State = useInterviewStore.getState();
  if (turn2State.turnNumber !== 2 || turn2State.evaluations.length !== 1) {
    throw new Error('Turn 1 evaluation not properly recorded into interview state');
  }

  // Simulate Turn 2 and Conclusion
  turn2State.addEvaluation(
    {
      turn_number: 2,
      question: turn2State.currentQuestion,
      answer: 'Background heartbeat thread extends TTL if process is still healthy.',
      score: 94,
      clarity_score: 92,
      depth_score: 96,
      feedback: 'Very solid understanding of heartbeat watchdog pattern.',
    },
    undefined,
    true // Finished
  );

  const finishedState = useInterviewStore.getState();
  if (!finishedState.isCompleted) {
    throw new Error('Interview should be marked completed after final turn');
  }

  // Final scorecard attachment
  finishedState.setFinalReport({
    overall_score: 93,
    verdict: 'STRONG_HIRE',
    metrics: { technical_depth: 95, communication_clarity: 93, problem_solving: 91 },
    key_strengths: ['Deep grasp of concurrency primitives'],
    key_areas_for_growth: ['Study Raft leader election edge cases'],
  });

  if (useInterviewStore.getState().finalReport?.verdict !== 'STRONG_HIRE') {
    throw new Error('Final report scorecard failed to attach');
  }

  console.log('✅ AI Mock Interview state machine verified (Start -> Multi-Turn -> Evaluation -> Final Scorecard)');

  // 4. Test Recruiter ATS Candidates & Job APIs
  console.log('\n--- 4. Testing Recruiter ATS & Matching APIs ---');
  const jobs = await jobsApi.getAll();
  if (!Array.isArray(jobs) || jobs.length === 0) {
    throw new Error('Failed to fetch job requisitions');
  }
  const candidates = await jobsApi.getCandidates(jobs[0].id);
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('Failed to fetch ranked candidates for job');
  }
  // Verify candidate match score exists
  if (typeof candidates[0].match_score !== 'number') {
    throw new Error('Candidate is missing numerical match_score');
  }
  console.log(`✅ Loaded ${jobs.length} jobs and ${candidates.length} ranked candidates (Top Score: ${candidates[0].match_score}%)`);

  // 5. Test Copilot Guardrailed Chat Store
  console.log('\n--- 5. Testing Copilot Chat State ---');
  const copilotStore = useCopilotStore.getState();
  const initialCount = copilotStore.messages.length;
  copilotStore.addMessage({
    sender: 'user',
    text: 'What are my top skill gaps?',
  });
  if (useCopilotStore.getState().messages.length !== initialCount + 1) {
    throw new Error('Failed to add message to Copilot store');
  }
  console.log('✅ Copilot conversation management verified');

  console.log('\n🎉 ALL FRONTEND INTEGRATION & LOGIC TESTS PASSED SUCCESSFULLY!');
}

runFrontendTestSuite().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
