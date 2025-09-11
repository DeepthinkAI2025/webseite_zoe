#!/usr/bin/env node
import fs from 'fs';
const src='docs/contrast-report.json';
if(!fs.existsSync(src)){
  console.error('contrast-finalize: report fehlt (erzeuge mit npm run check:contrast)');
  process.exit(2);
}
const data=JSON.parse(fs.readFileSync(src,'utf-8'));
if(data.issues && data.issues.length){
  console.error('contrast-finalize: offene Issues – kann Baseline nicht einfrieren');
  process.exit(1);
}
if(!fs.existsSync('docs/contrast-baseline.json')) fs.copyFileSync(src,'docs/contrast-baseline.json');
console.log('contrast-finalize: baseline gespeichert');
