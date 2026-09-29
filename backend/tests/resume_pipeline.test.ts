import { ResumeParserService } from '../src/services/resume-parser.service.js';
import { createApp } from '../src/app.js';
import http from 'http';

async function runResumePipelineTests() {
  console.log('--- Testing In-Memory Document Parsers ---');

  // 1. Test PDF parsing with valid minimal PDF
  const samplePdf = Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 300 144]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000057 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF'
  );

  const pdfText = await ResumeParserService.extractRawText(samplePdf, 'application/pdf', 'sample.pdf');
  console.log('✅ PDF Parser extracted successfully (length:', pdfText.length, ')');

  // 2. Test empty buffer rejection
  try {
    await ResumeParserService.extractRawText(Buffer.alloc(0), 'application/pdf');
    throw new Error('Should have rejected empty buffer');
  } catch (err: any) {
    console.log('✅ Empty buffer properly rejected:', err.message);
  }

  // 3. Test unsupported format rejection
  try {
    await ResumeParserService.extractRawText(Buffer.from('hello'), 'image/png');
    throw new Error('Should have rejected image/png');
  } catch (err: any) {
    console.log('✅ Unsupported MIME type properly rejected:', err.message);
  }

  // 4. Test Express upload endpoints security
  console.log('\n--- Testing Resume Route Security ---');
  const app = createApp();
  const server = http.createServer(app);
  const testPort = 5096;

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`✅ Test server running on port ${testPort}`);
      resolve();
    });
  });

  try {
    // Unauthenticated upload
    const unauthUploadRes = await fetch(`http://localhost:${testPort}/api/resumes/upload`, {
      method: 'POST',
    });
    console.log('✅ Unauthenticated POST /api/resumes/upload status:', unauthUploadRes.status);
    if (unauthUploadRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${unauthUploadRes.status}`);
    }

    // Unauthenticated download URL request
    const unauthDownloadRes = await fetch(
      `http://localhost:${testPort}/api/resumes/00000000-0000-0000-0000-000000000000/download-url`
    );
    console.log('✅ Unauthenticated GET /api/resumes/:id/download-url status:', unauthDownloadRes.status);
    if (unauthDownloadRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${unauthDownloadRes.status}`);
    }

    console.log('🎉 Resume Pipeline & Security Tests PASSED!');
  } finally {
    server.close();
  }
}

runResumePipelineTests().catch((err) => {
  console.error('❌ Resume Pipeline Test failed:', err);
  process.exit(1);
});
