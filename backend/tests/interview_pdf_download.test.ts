import { createApp } from '../src/app.js';
import { supabaseAdmin } from '../src/config/supabase.js';
import { PDFParse } from 'pdf-parse';

const PORT = 5093;
const BASE_URL = `http://127.0.0.1:${PORT}`;

interface RequestOptions {
  method?: string;
  token?: string;
  body?: any;
  expectedStatus?: number;
  responseType?: 'json' | 'buffer';
}

async function req(path: string, options: RequestOptions = {}) {
  const { method = 'GET', token, body, expectedStatus = 200, responseType = 'json' } = options;

  const headers: Record<string, string> = {
    Connection: 'close',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (expectedStatus && res.status !== expectedStatus) {
    let errorDetails = '';
    try {
      const errJson = await res.json();
      errorDetails = JSON.stringify(errJson, null, 2);
    } catch {
      errorDetails = await res.text();
    }
    throw new Error(`[${method} ${path}] Expected HTTP ${expectedStatus}, got ${res.status}. Body: ${errorDetails}`);
  }

  if (responseType === 'buffer') {
    const arrayBuffer = await res.arrayBuffer();
    return {
      status: res.status,
      headers: res.headers,
      buffer: Buffer.from(arrayBuffer),
    };
  }

  const json = await res.json();
  return { status: res.status, headers: res.headers, json };
}

async function acquireStudentSession(email: string, password = 'Password123!') {
  // Try login
  let { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (!error && data?.session?.access_token) {
    return { token: data.session.access_token, user: data.user! };
  }

  // Fallback to create user directly
  const { data: userId } = await (supabaseAdmin as any).rpc('create_auth_user_fallback', {
    p_email: email,
    p_password: password,
    p_role: 'STUDENT',
  });

  // Ensure student profile
  await (supabaseAdmin as any)
    .from('students')
    .upsert({
      user_id: userId,
      first_name: 'Alex',
      last_name: 'Developer',
      role: 'STUDENT',
    }, { onConflict: 'user_id' });

  const { data: loginData, error: loginErr } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (loginErr || !loginData?.session?.access_token) {
    throw new Error(`Failed to acquire session for ${email}: ${loginErr?.message}`);
  }

  return { token: loginData.session.access_token, user: loginData.user! };
}

async function runInterviewPdfTests() {
  console.log('================================================================');
  console.log('📄 QA TEST SUITE: MOCK INTERVIEW REPORT PDF GENERATION & DOWNLOAD');
  console.log('================================================================\n');

  const app = createApp();
  const server = app.listen(PORT);
  console.log(`✅ Test server running on port ${PORT}`);

  try {
    const timestamp = Date.now();
    const student1Email = `qa.mock.student1.${timestamp}@gmail.com`;
    const student2Email = `qa.mock.student2.${timestamp}@gmail.com`;

    console.log('\n--- 1. Authenticating Test Candidate Sessions ---');
    const { token: studentToken } = await acquireStudentSession(student1Email);
    console.log(`✅ Student 1 authenticated (${student1Email})`);

    const { token: attackerToken } = await acquireStudentSession(student2Email);
    console.log(`✅ Student 2 authenticated (${student2Email})`);

    // -------------------------------------------------------------
    // STEP 1: Generate Mock Interview Session
    // -------------------------------------------------------------
    console.log('\n--- 2. Generating Mock Interview Session ---');
    const genRes = await req('/api/interviews/generate', {
      method: 'POST',
      token: studentToken,
      body: {
        interview_type: 'TECHNICAL',
        title: 'Senior Full Stack Technical Assessment',
        question_count: 2,
      },
      expectedStatus: 201,
    });

    const interviewId = genRes.json.data.id;
    const questions = genRes.json.data.questions || [];
    console.log(`✅ 2.1: Mock interview created (ID: ${interviewId}) with ${questions.length} questions`);
    if (questions.length === 0) throw new Error('Expected interview questions to be generated');

    // -------------------------------------------------------------
    // STEP 2: Submit Answers & Turn Evaluation
    // -------------------------------------------------------------
    console.log('\n--- 3. Submitting Answers & Interactive Turn Processing ---');
    const q1 = questions[0];
    const answerRes = await req(`/api/interviews/${interviewId}/answers`, {
      method: 'POST',
      token: studentToken,
      body: {
        question_id: q1.id,
        student_answer:
          'In microservice architectures, I prefer asynchronous event-driven messaging with Apache Kafka or RabbitMQ for decoupled tasks, coupled with gRPC or RESTful HTTPS APIs for synchronous inter-service communication with circuit breakers.',
      },
      expectedStatus: 201,
    });
    console.log(`✅ 3.1: Answer submitted for Question 1 (Score: ${answerRes.json.data.score}/100)`);

    // -------------------------------------------------------------
    // STEP 3: Generate Final Comprehensive Performance Scorecard
    // -------------------------------------------------------------
    console.log('\n--- 4. Generating Comprehensive Scorecard & PDF Document ---');
    const reportRes = await req(`/api/interviews/${interviewId}/report`, {
      method: 'POST',
      token: studentToken,
      body: {
        career_title: 'Full Stack Engineer',
      },
      expectedStatus: 200,
    });

    const reportData = reportRes.json.data;
    console.log(`✅ 4.1: Report successfully generated:`);
    console.log(`       Overall Score: ${reportData.overall_score}/100`);
    console.log(`       Readiness Level: ${reportData.readiness_level}`);
    console.log(`       PDF Download Endpoint: ${reportData.pdf_download_url}`);
    if (reportData.storage_pdf_url) {
      console.log(`       Cloud Storage PDF URL: ${reportData.storage_pdf_url.substring(0, 60)}...`);
    }

    if (!reportData.pdf_download_url || !reportData.pdf_download_url.includes('/report/pdf')) {
      throw new Error(`Expected pdf_download_url in report response, got: ${reportData.pdf_download_url}`);
    }

    // -------------------------------------------------------------
    // STEP 4: Query Saved Report JSON via GET /api/interviews/:id/report
    // -------------------------------------------------------------
    console.log('\n--- 5. Retrieving Cached Report via GET /api/interviews/:id/report ---');
    const getReportRes = await req(`/api/interviews/${interviewId}/report`, {
      token: studentToken,
      expectedStatus: 200,
    });

    const fetchedReport = getReportRes.json.data;
    console.log(`✅ 5.1: Cached report retrieved without re-running AI`);
    console.log(`       Summary: "${fetchedReport.summary_evaluation?.substring(0, 80)}..."`);
    console.log(`       PDF Download URL: ${fetchedReport.pdf_download_url}`);
    if (fetchedReport.overall_score !== reportData.overall_score) {
      throw new Error('Cached score does not match generated score');
    }

    // -------------------------------------------------------------
    // STEP 5: Binary PDF Download Stream via GET /api/interviews/:id/report/pdf
    // -------------------------------------------------------------
    console.log('\n--- 6. Verifying Direct Binary PDF Download (Attachment Mode) ---');
    const pdfRes = await req(`/api/interviews/${interviewId}/report/pdf`, {
      token: studentToken,
      responseType: 'buffer',
      expectedStatus: 200,
    });

    const contentType = pdfRes.headers.get('content-type');
    const contentDisposition = pdfRes.headers.get('content-disposition');
    const contentLength = pdfRes.headers.get('content-length');
    const pdfBuffer: Buffer = pdfRes.buffer;

    console.log(`✅ 6.1: HTTP 200 OK received for PDF download`);
    console.log(`       Content-Type: ${contentType}`);
    console.log(`       Content-Disposition: ${contentDisposition}`);
    console.log(`       Byte Length: ${pdfBuffer.length} bytes`);

    if (contentType !== 'application/pdf') {
      throw new Error(`Expected Content-Type application/pdf, got ${contentType}`);
    }
    if (!contentDisposition || !contentDisposition.includes('attachment') || !contentDisposition.includes('.pdf')) {
      throw new Error(`Expected attachment Content-Disposition header, got ${contentDisposition}`);
    }
    if (pdfBuffer.length < 1000) {
      throw new Error(`PDF Buffer suspiciously small (${pdfBuffer.length} bytes)`);
    }

    // Check magic bytes "%PDF-"
    const magicBytes = pdfBuffer.subarray(0, 5).toString('ascii');
    if (!magicBytes.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header signature: "${magicBytes}"`);
    }
    console.log(`✅ 6.2: PDF binary magic header signature verified: "${magicBytes}"`);

    // Parse PDF text content to verify elements
    const parser = new PDFParse({ data: pdfBuffer });
    const parsedTextResult = await parser.getText();
    const pdfText = parsedTextResult?.text || '';
    console.log(`✅ 6.3: PDF text parsed successfully:`);
    console.log(`       Snippet: "${pdfText.substring(0, 160).replace(/\s+/g, ' ')}..."`);

    if (!pdfText.includes('MP ONLINE') || !pdfText.includes('Mock Interview Assessment')) {
      throw new Error('PDF missing expected platform header / branding');
    }
    if (!pdfText.includes('HIRING READINESS CLASSIFICATION')) {
      throw new Error('PDF missing hiring readiness section');
    }
    console.log('✅ 6.4: Brand identity, candidate scorecard, and readiness badges verified inside PDF');

    // -------------------------------------------------------------
    // STEP 6: Inline View Mode via ?view=inline
    // -------------------------------------------------------------
    console.log('\n--- 7. Verifying Inline Browser View Mode (?view=inline) ---');
    const inlinePdfRes = await req(`/api/interviews/${interviewId}/report/pdf?view=inline`, {
      token: studentToken,
      responseType: 'buffer',
      expectedStatus: 200,
    });

    const inlineDisposition = inlinePdfRes.headers.get('content-disposition');
    console.log(`✅ 7.1: Inline disposition verified: "${inlineDisposition}"`);
    if (!inlineDisposition || !inlineDisposition.startsWith('inline')) {
      throw new Error(`Expected inline Content-Disposition, got ${inlineDisposition}`);
    }

    // -------------------------------------------------------------
    // STEP 7: Security & Multi-Tenant Authorization Protection
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Security & Tenant Isolation ---');

    // 8a: Student 2 attempting to download Student 1's PDF report
    await req(`/api/interviews/${interviewId}/report/pdf`, {
      token: attackerToken,
      expectedStatus: 404,
    });
    console.log('✅ 8.1: Unauthorized student rejected with 404 Not Found (Data Isolation Protected)');

    // 8b: Unauthenticated request rejected
    await req(`/api/interviews/${interviewId}/report/pdf`, {
      expectedStatus: 401,
    });
    console.log('✅ 8.2: Unauthenticated request rejected with 401 Unauthorized');

    console.log('\n================================================================');
    console.log('🎉 ALL MOCK INTERVIEW PDF GENERATION & DOWNLOAD TESTS PASSED 100%!');
    console.log('================================================================\n');
  } finally {
    server.close();
  }
}

runInterviewPdfTests().catch((err) => {
  console.error('\n❌ Mock Interview PDF Test Suite failed:', err);
  process.exit(1);
});
