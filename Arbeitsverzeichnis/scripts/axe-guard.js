#!/usr/bin/env node
/**
 * Bricht (Exit 1) ab, falls axe Report Violations > erlaubtem Schwellenwert.
 * Nutzung: node scripts/axe-guard.js [threshold]
 */
import fs from 'fs';
const threshold = Number(process.argv[2] || 0);
const reportPath = 'docs/axe-a11y-report.json';
if(!fs.existsSync(reportPath)) {
  console.error('Kein axe Report gefunden unter', reportPath);
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(reportPath,'utf-8'));
const violations = report.totals?.violations ?? 0;
if(violations > threshold) {
  console.error(`axe-guard: ${violations} Violations > Threshold ${threshold}`);
  process.exit(1);
}
console.log(`axe-guard: OK (${violations} <= ${threshold})`);
