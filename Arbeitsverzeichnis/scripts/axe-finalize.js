#!/usr/bin/env node
import fs from 'fs';
const src='docs/axe-a11y-report.json';
if(!fs.existsSync(src)){ console.error('axe-finalize: Report fehlt'); process.exit(2);} 
const data=JSON.parse(fs.readFileSync(src,'utf-8'));
if((data.totals?.violations||0)!==0){ console.error('axe-finalize: Violations > 0'); process.exit(1);} 
fs.copyFileSync(src,'docs/axe-a11y-report-final.json');
if(!fs.existsSync('docs/axe-a11y-report-prev.json')) fs.copyFileSync(src,'docs/axe-a11y-report-prev.json');
console.log('axe-finalize: final & baseline gespeichert');