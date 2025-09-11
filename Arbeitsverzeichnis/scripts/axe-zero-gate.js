#!/usr/bin/env node
/**
 * Axe Zero Gate: Liest finalen Axe Report (docs/axe-a11y-report-final.json) und bricht mit Exit 1 ab,
 * falls neue Violations gegenüber Baseline existieren oder count > 0.
 * Optional --baseline <file> Flag für alternativen Vergleich.
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let baselineFile = 'docs/axe-a11y-report-final.json';
for(let i=0;i<args.length;i++){
  if(args[i]==='--baseline' && args[i+1]) baselineFile = args[i+1];
}

if(!fs.existsSync(baselineFile)){
  console.error(`[axe-zero-gate] Baseline nicht gefunden: ${baselineFile}`);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselineFile,'utf8'));
// Baseline Struktur: { totals:{ violations:0}, results:[{violations:[]},...] }
let count = 0;
if(baseline.totals && typeof baseline.totals.violations === 'number') {
  count = baseline.totals.violations;
} else if(Array.isArray(baseline.results)) {
  count = baseline.results.reduce((acc,r)=>acc + (r.violations ? r.violations.length : 0),0);
}

if(count === 0){
  console.log('[axe-zero-gate] OK: 0 Violations.');
  process.exit(0);
}
console.error(`[axe-zero-gate] FAIL: ${count} Axe Violations vorhanden – bitte beheben.`);
process.exit(1);
