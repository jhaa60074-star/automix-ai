import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    const cleanEnv = { ...process.env };
    delete cleanEnv.NODE_ENV; // ensure next sets production properly
    
    const { stdout, stderr } = await execAsync('npm run build', { cwd, env: cleanEnv });
    
    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error: any) {
    return NextResponse.json({ success: false, stdout: error.stdout, stderr: error.stderr, message: error.message });
  }
}
