import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

export async function triggerRebuild() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (hookUrl) {
    console.log('Triggering Vercel Deploy Hook from Server Action...');
    try { 
      await fetch(hookUrl, { method: 'POST' }); 
    } catch(e) {
      console.error('Failed to trigger hook:', e);
    }
  } else {
    console.log('Triggering local rebuild from Server Action directly...');
    try { 
      const { stdout, stderr } = await execAsync('npx tsx scripts/build-static.ts');
      if (stderr) console.warn('Build script stderr:', stderr);
      console.log('Build script stdout:', stdout);
    } catch(e) {
      console.error('Failed to trigger local rebuild:', e);
    }
  }
}
