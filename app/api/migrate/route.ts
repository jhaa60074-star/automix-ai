import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

export async function GET() {
  const rootDir = process.cwd();
  const files = walk(rootDir);

  let totalChanged = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    const importRegex = /from\s+['"](\.\.?\/[^'"]+)['"]/g;
    const requireRegex = /require\(['"](\.\.?\/[^'"]+)['"]\)/g;
    
    // We intentionally avoid replacing CSS imports in TS files unless needed, but let's be safe.
    
    const processMatch = (match: string, relativePath: string) => {
      // Don't modify relative imports for CSS files just yet
      if (relativePath.endsWith('.css')) return match;

      const fileDir = path.dirname(file);
      const resolvedPath = path.resolve(fileDir, relativePath);
      
      if (resolvedPath.startsWith(rootDir)) {
        let aliasPath = resolvedPath.replace(rootDir, '').replace(/\\/g, '/');
        if (aliasPath.startsWith('/')) aliasPath = aliasPath.substring(1);
        
        const newImport = `@/${aliasPath}`;
        return match.replace(relativePath, newImport);
      }
      return match;
    };

    content = content.replace(importRegex, processMatch);
    content = content.replace(requireRegex, processMatch);

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      totalChanged++;
    }
  });

  return NextResponse.json({ success: true, totalChanged });
}
