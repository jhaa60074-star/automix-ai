import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    
    // 1. Git add
    await execAsync('git add .', { cwd });
    
    // 2. Git commit
    const commitMsg = "Fix: Complete production audit, absolute alias migration, and build repair";
    await execAsync(`git commit -m "${commitMsg}"`, { cwd });
    
    // 3. Git push
    await execAsync('git push', { cwd });
    
    // 4. Get latest commit hash and date
    const { stdout: hash } = await execAsync('git log -1 --format="%H"', { cwd });
    const { stdout: date } = await execAsync('git log -1 --format="%cd"', { cwd });
    
    return NextResponse.json({ success: true, hash: hash.trim(), date: date.trim() });
  } catch (error: any) {
    return NextResponse.json({ success: false, stdout: error.stdout, stderr: error.stderr, message: error.message });
  }
}
