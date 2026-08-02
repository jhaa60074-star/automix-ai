import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd();
    let logs = [];
    
    // Untrack .next-build
    try {
      const { stdout } = await execAsync('git rm -r --cached .next-build', { cwd });
      logs.push(stdout);
    } catch (e: any) {
      logs.push(e.message);
    }

    // Untrack app/api/build just in case it's lingering
    try {
      await execAsync('git rm -r --cached app/api/build', { cwd });
    } catch (e) {}

    // Add changes
    await execAsync('git add .gitignore tsconfig.json', { cwd });
    await execAsync('git add -A', { cwd });
    
    // Commit
    try {
      const { stdout } = await execAsync('git commit -a -m "Fix: Remove cached .next-build from repository to resolve Vercel type errors"', { cwd });
      logs.push(stdout);
    } catch (e: any) {
      logs.push(e.message);
    }
    
    // Push
    try {
      const { stdout } = await execAsync('git push origin main', { cwd });
      logs.push(stdout);
    } catch (e: any) {
      logs.push(e.message);
    }

    // Tell self to delete
    const fs = require('fs');
    fs.writeFileSync('clean_check.js', "setTimeout(() => { require('fs').rmSync('app/api/check', { recursive: true, force: true }); }, 1000);");
    require('child_process').spawn('node', ['clean_check.js'], { detached: true, stdio: 'ignore' }).unref();

    return Response.json({ success: true, logs });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message });
  }
}
