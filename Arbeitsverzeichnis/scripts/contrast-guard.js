#!/usr/bin/env node
import fs from 'fs';
const baselinePath='docs/contrast-baseline.json';
const currentPath='docs/contrast-report.json';
if(!fs.existsSync(baselinePath)){
  console.error('contrast-guard: keine Baseline (führe contrast-finalize zuerst aus)');
  process.exit(2);
}
if(!fs.existsSync(currentPath)){
  console.error('contrast-guard: aktueller Report fehlt (npm run check:contrast)');
  process.exit(2);
}
const base=JSON.parse(fs.readFileSync(baselinePath,'utf-8'));
const cur=JSON.parse(fs.readFileSync(currentPath,'utf-8'));
const baseSet=new Set((base.issues||[]).map(i=>i.file+':'+i.match));
const newIssues=(cur.issues||[]).filter(i=>!baseSet.has(i.file+':'+i.match));
if(newIssues.length){
  console.error('contrast-guard: neue Kontrast-Issues gefunden');
  console.error(JSON.stringify({newIssues},null,2));
  process.exit(1);
}
console.log('contrast-guard: OK (keine neuen Kontrast-Issues)');
