import { createApp } from '../src/app.js';
import http from 'http';

async function runSmokeTest() {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(5099, () => {
      console.log('✅ Smoke test server successfully bound on port 5099');
      resolve();
    });
  });

  try {
    const res = await fetch('http://localhost:5099/health');
    const json = await res.json();
    console.log('✅ /health endpoint responded with:', JSON.stringify(json, null, 2));

    if (json.success && json.data.status === 'UP') {
      console.log('🎉 Backend health check PASSED');
    } else {
      throw new Error('Health check payload invalid');
    }
  } finally {
    server.close();
  }
}

runSmokeTest().catch((err) => {
  console.error('❌ Smoke test failed:', err);
  process.exit(1);
});
