#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'docs', 'web-vitals-rum.ndjson');
if(!fs.existsSync(file)){
  console.error('Keine RUM Datei gefunden');
  process.exit(0);
}
const lines = fs.readFileSync(file,'utf8').trim().split(/\n+/).filter(Boolean);
const metrics = {};
for(const l of lines){
  try { const m = JSON.parse(l); if(!m.name) continue; (metrics[m.name] ||= []).push(m.value); } catch{}
}
const summary = Object.fromEntries(Object.entries(metrics).map(([k, arr]) => {
  arr.sort((a,b)=>a-b);
  const p = q=> arr[Math.min(arr.length-1, Math.floor(q*(arr.length-1)))];
  const avg = arr.reduce((s,v)=>s+v,0)/arr.length;
  return [k, { count: arr.length, p50: p(0.5), p75: p(0.75), p90: p(0.9), p95: p(0.95), avg: Number(avg.toFixed(2)) }];
}));
const out = { ts: Date.now(), summary };
const outFile = path.join(process.cwd(), 'docs', 'rum-summary.json');
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log('RUM Summary geschrieben:', outFile);
