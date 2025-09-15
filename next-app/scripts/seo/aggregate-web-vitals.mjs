#!/usr/bin/env node
/**
 * Aggregiert RUM Web Vitals aus docs/web-vitals-rum.ndjson
 * Ausgabe: docs/web-vitals-aggregate.json
 */
import fs from 'node:fs';
import path from 'node:path';

const docsDir = path.join(process.cwd(),'docs');
const src = path.join(docsDir,'web-vitals-rum.ndjson');
if(!fs.existsSync(src)){
  console.error('[rum-agg] Keine NDJSON Datei gefunden:', src);
  process.exit(0); // kein Fehler
}
const lines = fs.readFileSync(src,'utf-8').split(/\n+/).filter(Boolean);
const metrics = {};
for(const line of lines){
  try {
    const m = JSON.parse(line);
    if(!m.name || typeof m.value !== 'number') continue;
    const entry = metrics[m.name] || { count:0, sum:0, values:[] };
    entry.count++; entry.sum += m.value; entry.values.push(m.value);
    metrics[m.name] = entry;
  } catch {/* ignore single line */}
}

function percentile(arr, p){
  if(!arr.length) return null;
  const sorted = [...arr].sort((a,b)=> a-b);
  const idx = Math.floor((p/100)* (sorted.length-1));
  return sorted[idx];
}

const aggregate = Object.fromEntries(Object.entries(metrics).map(([name, stat])=> {
  const avg = stat.sum / stat.count;
  return [name, {
    count: stat.count,
    avg,
    p50: percentile(stat.values,50),
    p75: percentile(stat.values,75),
    p90: percentile(stat.values,90),
    p95: percentile(stat.values,95),
    p99: percentile(stat.values,99)
  }];
}));

const out = path.join(docsDir,'web-vitals-aggregate.json');
fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), metrics: aggregate }, null,2));
console.log('[rum-agg] Aggregat geschrieben:', out);
