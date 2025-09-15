#!/usr/bin/env node
/**
 * css-redundancy-report.js (Next.js angepasst)
 * Sucht größte gebaute CSS Datei unter .next/static/css und analysiert:
 *  - Duplicate box-shadow Deklarationen
 *  - Mehrfach definierte Custom Properties
 *  - Große PNG Assets (>300KB)
 * Output: next-app/docs/css-redundancy-report.json
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const nextRoot = path.join(root,'next-app');
const cssDir = path.join(nextRoot,'.next','static','css');
if(!fs.existsSync(cssDir)){
  console.error('[css-redundancy-report] Kein Next Build gefunden (.next/static/css fehlt).');
  process.exit(1);
}
const cssCandidates = fs.readdirSync(cssDir).filter(f=>f.endsWith('.css'));
if(!cssCandidates.length){
  console.error('[css-redundancy-report] Keine CSS Datei gefunden.');
  process.exit(1);
}
// Größte Datei als Aggregat wählen
const cssFile = cssCandidates.map(f=>({f,size:fs.statSync(path.join(cssDir,f)).size}))
  .sort((a,b)=>b.size-a.size)[0].f;
const cssFilePath = path.join(cssDir, cssFile);

const css = fs.readFileSync(cssFilePath,'utf8');
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
const publicDir = path.join(nextRoot,'public');
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
  cssFile: cssFilePath.replace(root+'/', ''),
  totalBoxShadowDeclarations: Object.values(shadowCounts).reduce((a,b)=>a+b,0),
  uniqueBoxShadows: Object.keys(shadowCounts).length,
  topBoxShadows: Object.entries(shadowCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([shadow,count])=>({shadow,count})),
  redundantShadows,
  duplicateCustomProps,
  largePngs
};

const outDir = path.join(nextRoot,'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
const outFile = path.join(outDir,'css-redundancy-report.json');
fs.writeFileSync(outFile, JSON.stringify(report,null,2));
console.log('[css-redundancy-report] geschrieben:', path.relative(root,outFile));
