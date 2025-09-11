#!/usr/bin/env node
/**
 * Vergleicht zwei axe-core JSON Reports und gibt eine Diff Übersicht zurück.
 * Nutzung: node scripts/axe-diff.js <alt.json> <neu.json>
 */
import fs from 'fs';

const [,, oldPath='docs/axe-a11y-report-prev.json', newPath='docs/axe-a11y-report.json'] = process.argv;
if(!fs.existsSync(oldPath) || !fs.existsSync(newPath)) {
  console.error('Datei nicht gefunden. Erwartet:', oldPath, newPath);
  process.exit(2);
}
const oldReport = JSON.parse(fs.readFileSync(oldPath,'utf-8'));
const newReport = JSON.parse(fs.readFileSync(newPath,'utf-8'));

function collectNodes(report){
  const map = new Map();
  for(const r of report.results||[]) {
    for(const v of r.violations||[]) {
      for(const n of v.nodes||[]) {
        const key = `${r.page}::${v.id}::${n.target.join('|')}`;
        map.set(key, { page:r.page, rule:v.id, target:n.target, impact:v.impact });
      }
    }
  }
  return map;
}

const oldNodes = collectNodes(oldReport);
const newNodes = collectNodes(newReport);

const removed = [];
for(const k of oldNodes.keys()) if(!newNodes.has(k)) removed.push(oldNodes.get(k));
const added = [];
for(const k of newNodes.keys()) if(!oldNodes.has(k)) added.push(newNodes.get(k));

const summary = {
  baseline: oldPath,
  current: newPath,
  oldViolations: oldReport.totals?.violations ?? null,
  newViolations: newReport.totals?.violations ?? null,
  delta: (newReport.totals?.violations ?? 0) - (oldReport.totals?.violations ?? 0),
  added: added.length,
  removed: removed.length,
  addedDetails: added,
  removedDetails: removed
};

console.log(JSON.stringify(summary,null,2));

// Exit >0 falls neue Violations hinzugekommen
if(summary.delta > 0 || summary.added > 0) process.exit(1);
