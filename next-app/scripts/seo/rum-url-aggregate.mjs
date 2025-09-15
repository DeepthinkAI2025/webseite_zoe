#!/usr/bin/env node
/**
 * rum-url-aggregate.mjs
 * Aggregiert RUM Events (rum-metrics.jsonl) pro URL: p75 LCP, INP, CLS, TTFB sowie Count.
 * Ausgaben:
 *  - docs/rum-url-aggregate.json (Array sortiert nach LCP p75 desc)
 *  - docs/rum-url-aggregate.md (Markdown Tabelle Top N)
 * Env:
 *  - RUM_URL_AGG_TOP (default 20)
 *  - MIN_EVENTS_PER_URL (default 5) -> URLs mit weniger werden ignoriert
 */
import fs from 'fs';
import path from 'path';

const jsonlPath = path.resolve('docs','rum-metrics.jsonl');
const outJson = path.resolve('docs','rum-url-aggregate.json');
const outMd = path.resolve('docs','rum-url-aggregate.md');
const TOP = parseInt(process.env.RUM_URL_AGG_TOP||'20',10);
const MIN_EVENTS = parseInt(process.env.MIN_EVENTS_PER_URL||'5',10);

if(!fs.existsSync(jsonlPath)){
  console.log('[rum-url-aggregate] keine rum-metrics.jsonl gefunden -> Abbruch');
  process.exit(0);
}

function percentile(sorted, p){
  if(!sorted.length) return null;
  const idx = (p/100)*(sorted.length-1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if(lo===hi) return sorted[lo];
  const w = idx - lo; return sorted[lo]*(1-w)+sorted[hi]*w;
}

const perUrl = new Map();
const lines = fs.readFileSync(jsonlPath,'utf8').split(/\n+/).filter(Boolean);
for(const line of lines){
  try {
    const ev = JSON.parse(line);
    const url = ev.url || ev.page || 'unknown';
    if(!perUrl.has(url)) perUrl.set(url,{lcp:[],inp:[],cls:[],ttfb:[],count:0});
    const bucket = perUrl.get(url);
    if(typeof ev.lcp==='number') bucket.lcp.push(ev.lcp);
    if(typeof ev.inp==='number') bucket.inp.push(ev.inp);
    if(typeof ev.cls==='number') bucket.cls.push(ev.cls);
    if(typeof ev.ttfb==='number') bucket.ttfb.push(ev.ttfb);
    bucket.count++;
  } catch{}
}

const rows=[];
const MIN_SAMPLE_CONF = parseInt(process.env.MIN_RUM_SAMPLE || '50',10);
for(const [url,vals] of perUrl.entries()){
  if(vals.count < MIN_EVENTS) continue;
  vals.lcp.sort((a,b)=>a-b); vals.inp.sort((a,b)=>a-b); vals.cls.sort((a,b)=>a-b); vals.ttfb.sort((a,b)=>a-b);
  rows.push({
    url,
    count: vals.count,
    p75_lcp: percentile(vals.lcp,75),
    p75_inp: percentile(vals.inp,75),
    p75_cls: percentile(vals.cls,75),
    p75_ttfb: percentile(vals.ttfb,75),
    lowSample: vals.count < MIN_SAMPLE_CONF
  });
}

rows.sort((a,b)=> (b.p75_lcp||0) - (a.p75_lcp||0));

// History laden
const histFile = path.resolve('docs','rum-url-history.json');
let history=[]; try { history = JSON.parse(fs.readFileSync(histFile,'utf8')); if(!Array.isArray(history)) history=[]; } catch{}
// Latest Snapshot Map für Delta Vergleich
const prev = history.length? history[history.length-1].data : null;
const prevMap = new Map();
if(prev){ prev.forEach(r=> prevMap.set(r.url, r)); }

// Deltas & optional Debt Score (wird später mit Gewicht erweitert)
const TARGET_LCP = Number(process.env.RUM_LCP_P75_MS)||2500;
const weightMap = (()=>{ try { return JSON.parse(process.env.RUM_URL_WEIGHT_MAP||'{}'); } catch { return {}; } })();
function calcDebt(entry){
  if(entry.p75_lcp==null) return null;
  const gap = entry.p75_lcp - TARGET_LCP; if(gap <= 0) return 0;
  const weight = typeof weightMap[entry.url]==='number'? weightMap[entry.url] : 1;
  return Math.round(gap * Math.sqrt(entry.count) * weight);
}

for(const r of rows){
  const before = prevMap.get(r.url);
  if(before && before.p75_lcp!=null && r.p75_lcp!=null){
    r.delta_p75_lcp = r.p75_lcp - before.p75_lcp;
  }
  r.debt = calcDebt(r);
}

// Persist aktuelles Aggregat
fs.writeFileSync(outJson, JSON.stringify(rows,null,2));

// History Eintrag hinzufügen (max 60)
history.push({ timestamp: new Date().toISOString(), targetLcp: TARGET_LCP, data: rows.map(r=>({url:r.url,p75_lcp:r.p75_lcp, count:r.count})) });
if(history.length>60) history = history.slice(-60);
fs.writeFileSync(histFile, JSON.stringify(history,null,2));

const top = rows.slice(0,TOP);
let md = '# RUM URL Aggregation\n\n';
md += `Gefiltert: MIN_EVENTS_PER_URL=${MIN_EVENTS}, Gesamt URLs=${rows.length}, Anzeige Top=${top.length}.\n\n`;
md += '| URL | Events | p75 LCP | Δ LCP | p75 INP | p75 CLS | p75 TTFB | Debt |\n|-----|--------|---------|------|---------|---------|---------|------|\n';
for(const r of top){
  const label = r.lowSample? ' (low n)':'';
  md += `| ${r.url} | ${r.count}${label} | ${r.p75_lcp!=null?Math.round(r.p75_lcp)+'ms':'-'} | ${r.delta_p75_lcp!=null?(r.delta_p75_lcp>0? '+'+Math.round(r.delta_p75_lcp):Math.round(r.delta_p75_lcp))+'ms':'-' } | ${r.p75_inp!=null?Math.round(r.p75_inp)+'ms':'-'} | ${r.p75_cls!=null?r.p75_cls.toFixed(3):'-'} | ${r.p75_ttfb!=null?Math.round(r.p75_ttfb)+'ms':'-'} | ${r.debt!=null?r.debt:'-'} |\n`;
}
fs.writeFileSync(outMd, md);
console.log('[rum-url-aggregate] fertig: rum-url-aggregate.json & .md');
