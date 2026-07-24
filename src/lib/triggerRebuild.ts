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
    console.log('Triggering local rebuild from Server Action...');
    try { 
      await fetch('http://localhost:3000/api/rebuild', { method: 'POST' }); 
    } catch(e) {
      console.error('Failed to trigger local rebuild:', e);
    }
  }
}
