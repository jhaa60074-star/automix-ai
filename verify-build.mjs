import { execSync } from 'child_process';
import fs from 'fs';

console.log("Starting production build verification...");
try {
  console.log("Removing .next directory...");
  fs.rmSync('.next', { recursive: true, force: true });
  console.log(".next removed successfully.");
} catch (error) {
  console.error("Warning: Could not remove .next directory completely (might be locked by dev servers):", error.message);
}

try {
  console.log("Running npm run build...");
  execSync('npm run build', { stdio: 'inherit' });
  console.log("SUCCESS: Build completed with zero errors.");
  fs.writeFileSync('build-success.txt', 'Build completed successfully');
} catch (error) {
  console.error("Build failed!", error.message);
  fs.writeFileSync('build-error.txt', error.message);
}
