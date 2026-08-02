import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    
    let commitOutput = '';
    try {
      const { stdout: addOut } = await execAsync('git add .', { cwd });
      const { stdout: commitOut } = await execAsync('git commit -m "Fix: Create production help-center and data-deletion routes"', { cwd });
      const { stdout: pushOut } = await execAsync('git push origin main', { cwd });
      commitOutput = `${addOut}\n${commitOut}\n${pushOut}`;
    } catch (e: any) {
      if (!e.stdout?.includes('nothing to commit')) {
        return NextResponse.json({ success: false, message: 'Git push failed', stdout: e.stdout, stderr: e.stderr });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Git push completed', 
      commitOutput
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
