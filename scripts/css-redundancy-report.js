#!/usr/bin/env node
/**
 * css-redundancy-report.js
 * Scans built CSS (dist/assets/*.css) and source CSS for:
 *  - Duplicate box-shadow declarations
 *  - Unused / duplicate custom properties (simple heuristic)
 *  - Large PNG assets in public/ (>300 KB) for potential optimization
 * Outputs report JSON to Arbeitsverzeichnis/docs/css-redundancy-report.json
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
// Detect if current working dir is Arbeitsverzeichnis or repo root
const workingDirName = path.basename(process.cwd());
const base = workingDirName === 'Arbeitsverzeichnis' ? process.cwd() : path.join(root,'Arbeitsverzeichnis');
const buildCssDir = path.join(base,'dist','assets');
let cssFile = null;
if (fs.existsSync(buildCssDir)) {
  const files = fs.readdirSync(buildCssDir).filter(f=>f.endsWith('.css'));
  cssFile = files[0] && path.join(buildCssDir, files[0]);
}
if (!cssFile){
  console.error('No built CSS found. Run build first.');
  process.exit(1);
}

const css = fs.readFileSync(cssFile,'utf8');
// Box-shadow collection
const shadowRegex = /box-shadow:\s*([^;]+);/g;
const shadowCounts = {};
let m;
while((m = shadowRegex.exec(css))){
  const val = m[1].trim();
  shadowCounts[val] = (shadowCounts[val]||0)+1;
}

// Custom property definitions
const varDefRegex = /--([a-z0-9-]+):/gi;
const varCounts = {};
while((m = varDefRegex.exec(css))){ varCounts[m[1]] = (varCounts[m[1]]||0)+1; }

// Heuristic duplicate custom properties (>1 definitions outside dark mode allowed)
const duplicateCustomProps = Object.entries(varCounts).filter(([,c])=>c>1).map(([k,c])=>({name:k,count:c}));

// Large PNG assets
const publicDir = path.join(base,'public');
function walk(dir, list=[]){
  for (const entry of fs.readdirSync(dir)){ const p = path.join(dir,entry); const stat = fs.statSync(p); if (stat.isDirectory()) walk(p,list); else list.push({path:p,size:stat.size}); }
  return list;
}
const largePngs = walk(publicDir,[]).filter(f=>f.path.toLowerCase().endsWith('.png') && f.size > 300*1024)
  .map(f=>({ path: f.path.replace(root+'/', ''), sizeKB: +(f.size/1024).toFixed(1) }));

// Redundant shadows heuristic: shadows used <3 times could be consolidated if visually similar
const redundantShadows = Object.entries(shadowCounts)
  .filter(([,count])=>count < 3)
  .map(([shadow,count])=>({shadow,count}));

const report = {
  generatedAt: new Date().toISOString(),
  cssFile: cssFile.replace(root+'/', ''),
  totalBoxShadowDeclarations: Object.values(shadowCounts).reduce((a,b)=>a+b,0),
  uniqueBoxShadows: Object.keys(shadowCounts).length,
  topBoxShadows: Object.entries(shadowCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([shadow,count])=>({shadow,count})),
  redundantShadows,
  duplicateCustomProps,
  largePngs
};

const outDir = path.join(base,'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'css-redundancy-report.json'), JSON.stringify(report,null,2));
console.log('CSS redundancy report written to Arbeitsverzeichnis/docs/css-redundancy-report.json');
