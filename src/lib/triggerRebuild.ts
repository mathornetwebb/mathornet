import { exec } from 'child_process';

let isRebuilding = false;

export async function triggerRebuild() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (hookUrl) {
    console.log('Triggering Vercel Deploy Hook in background...');
    fetch(hookUrl, { method: 'POST' }).catch(err => {
      console.error('Failed to trigger deploy hook:', err);
    });
    return;
  }

  // Prevent multiple overlapping builds from slowing down the server
  if (isRebuilding) {
    console.log('Local rebuild already in progress, skipping duplicate call');
    return;
  }

  isRebuilding = true;
  console.log('Starting local background rebuild...');
  exec('npx tsx scripts/build-static.ts', (err, stdout, stderr) => {
    isRebuilding = false;
    if (err) {
      console.error('Background rebuild error:', err);
      return;
    }
    if (stderr && !stderr.includes('tip:')) {
      console.warn('Background rebuild stderr:', stderr);
    }
    console.log('Background rebuild completed successfully');
  });
}
