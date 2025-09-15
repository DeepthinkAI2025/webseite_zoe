#!/usr/bin/env node
/**
 * KPI History Diff
 * Vergleicht letzten und vorletzten Eintrag in kpi-history.json
 * Output: Markdown Tabelle + JSON Summary (stdout)
 */
import fs from 'fs';
import path from 'path';

const FILE = path.resolve('docs','kpi-history.json');
if(!fs.existsSync(FILE)){
  console.error('[kpi-diff] Keine History Datei gefunden.');
  process.exit(1);
}
let hist;
try { hist = JSON.parse(fs.readFileSync(FILE,'utf-8')); } catch(e){
  console.error('[kpi-diff] Ungültiges JSON:', e.message); process.exit(1);
}
if(!Array.isArray(hist) || hist.length < 2){
  console.error('[kpi-diff] Zu wenig Einträge (<2)');
  process.exit(1);
}
const prev = hist[hist.length-2];
const curr = hist[hist.length-1];

const keys = ['coverageTypes','avgLcp','avgCls','avgInp','avgPerf','avgSeo','avgA11y'];
const rows = [];
for (const k of keys){
  const a = prev[k];
  const b = curr[k];
  if (a == null && b == null) continue;
  let diff = null;
  if (typeof a === 'number' && typeof b === 'number'){
    diff = b - a;
  }
  rows.push({ metric:k, previous:a, current:b, diff });
}

function fmt(v){
  if (v == null) return '–';
  if (typeof v === 'number') {
    if (v < 1 && v > 0) return v.toFixed(3);
    return v.toFixed(0);
  }
  return String(v);
}

const md = [
  `# KPI History Diff`,
  `Vergleich: ${prev.generatedAt} → ${curr.generatedAt}`,
  '',
  '| Metrik | Vorher | Aktuell | Δ |',
  '|--------|--------|---------|----|',
  ...rows.map(r=>`| ${r.metric} | ${fmt(r.previous)} | ${fmt(r.current)} | ${r.diff==null?'–': (r.diff>0?'+':'')+fmt(r.diff)} |`)
].join('\n');

console.log(md); // Markdown Out
console.log('\nJSON Summary:\n'+JSON.stringify({ previous:prev.generatedAt, current:curr.generatedAt, rows },null,2));