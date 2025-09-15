#!/usr/bin/env node
/**
 * KPI Sparkline Generator
 * Erstellt einfache Unicode Sparklines für ausgewählte Kennzahlen aus kpi-history.json
 * Ausgabe: Markdown -> stdout
 */
import fs from 'fs';
import path from 'path';

const FILE = path.resolve('docs','kpi-history.json');
if(!fs.existsSync(FILE)){
  console.error('[sparkline] kpi-history.json fehlt');
  process.exit(1);
}
let hist;
try { hist = JSON.parse(fs.readFileSync(FILE,'utf-8')); } catch(e){
  console.error('[sparkline] Ungültiges JSON:', e.message); process.exit(1);
}
if(!Array.isArray(hist) || hist.length < 2){
  console.error('[sparkline] Zu wenig Daten (<2)');
  process.exit(1);
}

const metrics = [
  { key:'avgPerf', label:'Performance Score', scale: v=> v!=null? (v*100):null, suffix:'%' },
  { key:'avgLcp', label:'LCP (ms)' },
  { key:'avgCls', label:'CLS', format:v=> v!=null? v.toFixed(3):'–' },
  { key:'avgInp', label:'INP (ms)' },
];

const blocks = '▁▂▃▄▅▆▇█';
function spark(values){
  const nums = values.filter(v=> typeof v === 'number' && !isNaN(v));
  if(!nums.length) return '–';
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === max) return '─'.repeat(values.length);
  return values.map(v=>{
    if (typeof v !== 'number' || isNaN(v)) return ' '; 
    const idx = Math.round(((v - min)/(max - min)) * (blocks.length-1));
    return blocks[idx];
  }).join('');
}

function fmt(v){
  if (v == null) return '–';
  if (typeof v === 'number') return v.toFixed(0);
  return String(v);
}

const md = [];
md.push('# KPI Sparklines');
md.push(`Datensätze: ${hist.length}`);
md.push('');
for (const m of metrics){
  const vals = hist.map(h=>{
    const raw = h[m.key];
    return m.scale ? m.scale(raw) : raw;
  });
  const line = spark(vals);
  const latest = vals[vals.length-1];
  const latestStr = latest==null? '–' : (m.format? m.format(latest) : (m.suffix? latest.toFixed(0)+m.suffix: latest.toFixed ? latest.toFixed(0): latest));
  md.push(`**${m.label}**: ${line} (letzte: ${latestStr})`);
}

console.log(md.join('\n'));