import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

    if (deployHookUrl) {
      console.log('Triggering Vercel Deploy Hook...');
      const response = await fetch(deployHookUrl, { method: 'POST' });
      
      if (!response.ok) {
        throw new Error(`Deploy hook failed with status: ${response.status}`);
      }
      
      return NextResponse.json({ success: true, message: 'Vercel deploy hook triggered successfully' });
    } else {
      console.log('No deploy hook found, running local static build...');
      // Run the local build script
      const { stdout, stderr } = await execAsync('npx tsx scripts/build-static.ts');
      if (stderr) {
        console.warn('Build script stderr:', stderr);
      }
      console.log('Build script stdout:', stdout);
      
      return NextResponse.json({ success: true, message: 'Local rebuild completed successfully' });
    }
  } catch (error) {
    console.error('Failed to trigger rebuild:', error);
    return NextResponse.json({ success: false, error: 'Failed to trigger rebuild' }, { status: 500 });
  }
}
