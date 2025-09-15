#!/usr/bin/env node
/**
 * RUM Dashboard Generator
 * Liest rum-summary.json & rum-history.json und erzeugt eine einfache HTML Seite mit Tabellen & Trends.
 */
import fs from 'node:fs';
import path from 'node:path';

const DOCS = path.resolve('docs');
const SUMMARY = path.join(DOCS,'rum-summary.json');
const HISTORY = path.join(DOCS,'rum-history.json');
const OUT = path.join(DOCS,'rum-dashboard.html');

if(!fs.existsSync(SUMMARY)){
  console.error('[rum-dashboard] rum-summary.json nicht gefunden. Bitte zuerst Aggregation laufen lassen.');
  process.exit(1);
}

let history = [];
if(fs.existsSync(HISTORY)){
  try { history = JSON.parse(fs.readFileSync(HISTORY,'utf-8')); if(!Array.isArray(history)) history = []; } catch { history = []; }
}
const summary = JSON.parse(fs.readFileSync(SUMMARY,'utf-8'));

function escapeHtml(s){ return String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

function metricTable(metrics){
  const rows = Object.entries(metrics).map(([name, m])=>{
    return `<tr><td>${escapeHtml(name)}</td><td>${m.count}</td><td>${(m.average).toFixed(2)}</td><td>${m.p75?.toFixed(2)||''}</td><td>${m.p90?.toFixed(2)||''}</td><td>${m.min.toFixed(2)}</td><td>${m.max.toFixed(2)}</td></tr>`;
  }).join('\n');
  return `<table class="metrics"><thead><tr><th>Metrik</th><th>Count</th><th>Ø</th><th>P75</th><th>P90</th><th>Min</th><th>Max</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function sparkline(values){
  if(!values.length) return '';
  const min = Math.min(...values); const max = Math.max(...values); const range = max-min || 1;
  const pts = values.map((v,i)=>{
    const x = (i/(values.length-1))*100; const y = 100-(((v-min)/range)*100);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="spark"><polyline fill="none" stroke="currentColor" stroke-width="2" points="${pts}" /></svg>`;
}

function historySection(hist){
  if(!hist.length) return '<p>Keine History Einträge.</p>';
  const metricNames = Object.keys(hist[hist.length-1].metrics||{});
  const blocks = metricNames.map(name=>{
    const arr = hist.map(h=> h.metrics?.[name]?.p75).filter(v=> typeof v === 'number');
    return `<div class="hist-block"><h4>${escapeHtml(name)} P75</h4>${sparkline(arr)}<div class="hist-values">${arr.slice(-5).map(v=>v.toFixed(1)).join(' • ')}</div></div>`;
  }).join('\n');
  return `<div class="history-grid">${blocks}</div>`;
}

const html = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/><title>RUM Dashboard</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;margin:2rem;color:#111;background:#fff;}
h1{font-size:1.6rem;margin-top:0;}
section{margin-bottom:2.5rem;}
.metrics{border-collapse:collapse;width:100%;font-size:0.85rem;}
.metrics th,.metrics td{border:1px solid #ddd;padding:4px 6px;text-align:right;}
.metrics th:first-child,.metrics td:first-child{text-align:left;}
.history-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));}
.spark{width:100%;height:48px;color:#2563eb;background:#f1f5f9;border-radius:4px;}
.hist-block{font-size:0.7rem;line-height:1.1;}
.hist-block h4{margin:0 0 4px;font-size:0.75rem;}
.hist-values{margin-top:4px;color:#334155;}
footer{margin-top:3rem;font-size:0.65rem;color:#64748b;}
.badge{display:inline-block;background:#e2e8f0;color:#334155;font-size:0.65rem;padding:2px 6px;border-radius:4px;margin-left:4px;}
</style></head><body>
<h1>RUM Dashboard <span class="badge">Web Vitals</span></h1>
<p>Generiert: ${escapeHtml(new Date().toLocaleString('de-DE'))} • Events gesamt: ${Object.values(summary.metrics).reduce((a,m)=>a+m.count,0)}</p>
<section><h2>Aktuelle Kennzahlen</h2>${metricTable(summary.metrics)}</section>
<section><h2>Verlauf (P75)</h2>${historySection(history)}</section>
<section><h2>Nutzung</h2><pre><code>node scripts/seo/rum-aggregate.mjs\nnode scripts/seo/rum-dashboard.mjs</code></pre></section>
<footer>Automatisch generiert – Datei: rum-dashboard.html</footer>
</body></html>`;

fs.writeFileSync(OUT, html);
console.log('[rum-dashboard] HTML geschrieben →', OUT);
