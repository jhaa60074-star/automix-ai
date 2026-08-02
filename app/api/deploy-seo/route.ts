export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    
    // 1. Run build
    let buildOutput = '';
    try {
      const cleanEnv = { ...process.env };
      delete cleanEnv.NODE_ENV; // Let Next.js set it properly
      
      const { stdout } = await execAsync('npm run build', { cwd, env: cleanEnv });
      buildOutput = stdout;
    } catch (e: any) {
      return NextResponse.json({ success: false, message: 'Build failed', stdout: e.stdout, stderr: e.stderr });
    }
    
    // 2. Git add
    await execAsync('git add .', { cwd });
    
    // 3. Git commit
    const commitMsg = "SEO: Add robots, sitemap and production metadata";
    let commitSuccess = true;
    try {
      await execAsync(`git commit -m "${commitMsg}"`, { cwd });
    } catch (e) {
      commitSuccess = false;
    }
    
    // 4. Git push
    await execAsync('git push', { cwd });
    
    // 5. Get latest commit hash
    const { stdout: hash } = await execAsync('git log -1 --format="%H"', { cwd });
    
    return NextResponse.json({ success: true, commitSuccess, hash: hash.trim(), buildOutput });
  } catch (error: any) {
    return NextResponse.json({ success: false, stdout: error.stdout, stderr: error.stderr, message: error.message });
  }
}
