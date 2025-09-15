#!/usr/bin/env node
/**
 * RUM Aggregator
 * Liest docs/rum-metrics.jsonl und erzeugt docs/rum-summary.json
 * Aggregiert Mittelwerte, P75 und Anzahl Events pro Metrik.
 */
import fs from 'fs';
import path from 'path';

const DOCS = path.resolve('docs');
const SRC = path.join(DOCS,'rum-metrics.jsonl');
const OUT = path.join(DOCS,'rum-summary.json');
const HIST = path.join(DOCS,'rum-history.json');

if(!fs.existsSync(SRC)){
  console.error('[rum] Keine rum-metrics.jsonl gefunden. (Noch keine Events?)');
  process.exit(0);
}

const lines = fs.readFileSync(SRC,'utf-8').trim().split(/\n+/).filter(Boolean);
const byName = new Map();
for(const line of lines){
  try {
    const j = JSON.parse(line);
    if(!j.name || typeof j.value !== 'number') continue;
    if(!byName.has(j.name)) byName.set(j.name, []);
    byName.get(j.name).push(j.value);
  } catch {/* ignore malformed */}
}

function p(arr, q){
  if(!arr.length) return null; const sorted = [...arr].sort((a,b)=>a-b);
  const idx = Math.min(sorted.length-1, Math.floor(q*(sorted.length-1)));
  return sorted[idx];
}

const summary = { generatedAt: new Date().toISOString(), metrics:{} };
for (const [name, values] of byName.entries()){
  const avg = values.reduce((a,b)=>a+b,0)/values.length;
  summary.metrics[name] = {
    count: values.length,
    average: avg,
    p75: p(values, 0.75),
    p90: p(values, 0.90),
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

if(!fs.existsSync(DOCS)) fs.mkdirSync(DOCS,{recursive:true});
fs.writeFileSync(OUT, JSON.stringify(summary,null,2));
console.log('[rum] Summary geschrieben:', OUT);
if (process.env.RUM_HISTORY !== '0') {
  try {
    let hist = [];
    if (fs.existsSync(HIST)) {
      try { hist = JSON.parse(fs.readFileSync(HIST,'utf-8')); if(!Array.isArray(hist)) hist = []; } catch {/* reset */}
    }
    hist.push(summary);
    if (hist.length > 300) hist = hist.slice(-300);
    fs.writeFileSync(HIST, JSON.stringify(hist,null,2));
    console.log('[rum] History appended (', hist.length, 'records )');
  } catch (e){
    console.warn('[rum] History append Fehler:', e.message);
  }
}