const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
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

const rootDir = process.cwd();
const files = walk(rootDir);

let totalChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to match: import { X } from '../../utils/supabase/server';
  // or: import React from '../components/React';
  // We'll use a regex that matches the relative path and attempts to resolve it.
  
  // Regex to match imports: import ... from '...' or import '...'
  const importRegex = /from\s+['"](\.\.?\/[^'"]+)['"]/g;
  const requireRegex = /require\(['"](\.\.?\/[^'"]+)['"]\)/g;
  const justImportRegex = /import\s+['"](\.\.?\/[^'"]+)['"]/g; // e.g. import './globals.css'

  const processMatch = (match, relativePath) => {
    const fileDir = path.dirname(file);
    const resolvedPath = path.resolve(fileDir, relativePath);
    
    // Check if the resolved path is within the root directory
    if (resolvedPath.startsWith(rootDir)) {
      // Calculate the absolute path relative to the root directory
      let aliasPath = resolvedPath.replace(rootDir, '').replace(/\\/g, '/');
      if (aliasPath.startsWith('/')) aliasPath = aliasPath.substring(1);
      
      // If it's a CSS file or something, we can alias it too, but let's be careful.
      if (aliasPath.endsWith('.css')) return match; // skip css for now to be safe
      
      const newImport = `@/${aliasPath}`;
      return match.replace(relativePath, newImport);
    }
    return match;
  };

  content = content.replace(importRegex, processMatch);
  content = content.replace(requireRegex, processMatch);
  content = content.replace(justImportRegex, processMatch);

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
    totalChanged++;
  }
});

console.log(`Total files updated: ${totalChanged}`);
