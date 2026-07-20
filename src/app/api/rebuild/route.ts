import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Run the rebuild script
    const scriptPath = path.join(process.cwd(), 'scripts', 'build-static-site.js');
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);
    
    console.log('Build static site output:', stdout);
    if (stderr) console.error('Build static site error:', stderr);

    return NextResponse.json({ success: true, message: 'Website rebuilt successfully' });
  } catch (error) {
    console.error('Failed to rebuild website:', error);
    return NextResponse.json({ success: false, error: 'Failed to rebuild website' }, { status: 500 });
  }
}
