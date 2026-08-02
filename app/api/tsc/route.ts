export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    const { stdout: status } = await execAsync('git status', { cwd });
    const { stdout: log } = await execAsync('git log -2 --format="%H | %s | %cd"', { cwd });
    
    return NextResponse.json({ success: true, status, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, stdout: error.stdout, stderr: error.stderr, message: error.message });
  }
}
