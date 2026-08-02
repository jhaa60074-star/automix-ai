export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    const { stdout: log } = await execAsync('git log -5 --format="%H | %s | %cd"', { cwd });
    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
