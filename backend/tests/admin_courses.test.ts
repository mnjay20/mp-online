import { createApp } from '../src/app.js';
import http from 'http';

async function runCoursesTest() {
  const app = createApp();
  const server = http.createServer(app);
  const testPort = 5098;

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`✅ Test server running on port ${testPort}`);
      resolve();
    });
  });

  try {
    // 1. Test public course catalog listing
    const catalogRes = await fetch(`http://localhost:${testPort}/api/courses`);
    const catalogJson = await catalogRes.json();
    console.log('✅ GET /api/courses status:', catalogRes.status);
    if (catalogRes.status !== 200 || !catalogJson.success) {
      throw new Error(`Catalog endpoint failed with status ${catalogRes.status}`);
    }
    console.log(`✅ Loaded ${catalogJson.data.length} courses from live catalog`);

    // 2. Test unauthenticated POST /api/courses returns 401
    const unauthPostRes = await fetch(`http://localhost:${testPort}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthorized Test Course',
        provider: 'Test',
        description: 'Test',
        url: 'https://example.com',
      }),
    });
    console.log('✅ Unauthenticated POST /api/courses status:', unauthPostRes.status);
    if (unauthPostRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${unauthPostRes.status}`);
    }

    // 3. Test unauthenticated DELETE /api/courses/:id returns 401
    const unauthDelRes = await fetch(`http://localhost:${testPort}/api/courses/00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
    });
    console.log('✅ Unauthenticated DELETE /api/courses/:id status:', unauthDelRes.status);
    if (unauthDelRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${unauthDelRes.status}`);
    }

    // 4. Test unauthenticated POST /api/admin/courses returns 401
    const adminPostRes = await fetch(`http://localhost:${testPort}/api/admin/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthorized Admin Course',
        provider: 'Test',
        description: 'Test',
        url: 'https://example.com',
      }),
    });
    console.log('✅ Unauthenticated POST /api/admin/courses status:', adminPostRes.status);
    if (adminPostRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${adminPostRes.status}`);
    }

    console.log('🎉 Admin Courses security & routing tests PASSED!');
  } finally {
    server.close();
  }
}

runCoursesTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
