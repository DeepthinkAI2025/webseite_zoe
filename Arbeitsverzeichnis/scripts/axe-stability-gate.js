#!/usr/bin/env node
/**
 * Axe Stability Gate
 * Erwartet 3 Report-Dateien (JSON) und fails, wenn eine >0 Violations enthält
 * Usage: node scripts/axe-stability-gate.js docs/axe-a11y-report-run1.json docs/axe-a11y-report-run2.json docs/axe-a11y-report-run3.json
 */
import fs from 'fs';

const files = process.argv.slice(2);
if(files.length !== 3){
  console.error('Usage: node scripts/axe-stability-gate.js <run1.json> <run2.json> <run3.json>');
  process.exit(2);
}

function readReport(p){
  const raw = fs.readFileSync(p, 'utf-8');
  const json = JSON.parse(raw);
  const total = (json.violations?.length ?? json.violationsCount ?? 0);
  return { path: p, total };
}

const runs = files.map(readReport);
const hasAny = runs.some(r => r.total > 0);
const summary = {
  generated: new Date().toISOString(),
  runs,
  stableZero: !hasAny
};
fs.writeFileSync('docs/axe-a11y-stability.json', JSON.stringify(summary, null, 2));
console.log('Axe Stability:', summary);
if(hasAny){
  console.error('Axe Stability Gate FAIL: Non-zero violations in one or more runs');
  process.exit(1);
}
process.exit(0);
