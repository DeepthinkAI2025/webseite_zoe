#!/usr/bin/env node
/**
 * RUM Sparkline Generator
 * Liest rum-history.json und erzeugt Unicode Sparklines für p75 Werte (LCP, INP, CLS, TTFB)
 * Ausgabe: Markdown -> stdout
 */
import fs from 'fs';
import path from 'path';

const FILE = path.resolve('docs','rum-history.json');
if(!fs.existsSync(FILE)){
  console.error('[rum-sparkline] rum-history.json fehlt');
  process.exit(1);
}
let hist;
try { hist = JSON.parse(fs.readFileSync(FILE,'utf-8')); } catch(e){
  console.error('[rum-sparkline] Ungültiges JSON:', e.message); process.exit(1);
}
if(!Array.isArray(hist) || hist.length < 2){
  console.error('[rum-sparkline] Zu wenig Daten (<2)');
  process.exit(1);
}

const metrics = [
  { path:['metrics','LCP','p75'], label:'RUM LCP p75 (ms)', scale: v=> v },
  { path:['metrics','INP','p75'], label:'RUM INP p75 (ms)', scale: v=> v },
  { path:['metrics','CLS','p75'], label:'RUM CLS p75', scale: v=> v, format:v=> v!=null? v.toFixed(3):'–' },
  { path:['metrics','TTFB','p75'], label:'RUM TTFB p75 (ms)', scale: v=> v }
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

function deepGet(obj, pathArr){
  return pathArr.reduce((acc,k)=> acc && acc[k] != null ? acc[k] : null, obj);
}

const md = [];
md.push('# RUM Sparklines');
md.push(`Datensätze: ${hist.length}`);
md.push('');
for (const m of metrics){
  const rawVals = hist.map(h=> deepGet(h, m.path));
  const vals = rawVals.map(v=> m.scale? m.scale(v): v);
  const line = spark(vals);
  const latest = rawVals[rawVals.length-1];
  const latestStr = latest==null? '–' : (m.format? m.format(latest) : (latest.toFixed ? latest.toFixed(0): latest));
  md.push(`**${m.label}**: ${line} (letzte: ${latestStr})`);
}

console.log(md.join('\n'));