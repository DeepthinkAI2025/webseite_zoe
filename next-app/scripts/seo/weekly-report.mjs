#!/usr/bin/env node
/**
 * Weekly Consolidated Report
 * Aggregiert: KPI Dashboard, RUM Summary, GAIO Snapshot, Brand Mention
 * Ausgabe: Markdown (STDOUT) + optional Datei via REPORT_OUT (Pfad)
 */
import fs from 'fs';
import path from 'path';

function readJson(p){
  try {return JSON.parse(fs.readFileSync(p,'utf8'));} catch{ return null; }
}

const root = process.cwd();
const docsDir = path.join(root,'docs');

const kpi = readJson(path.join(docsDir,'seo-kpi-dashboard.json'));
const rum = readJson(path.join(docsDir,'rum-summary.json'));
const gaio = readJson(path.join(docsDir,'gaio-snapshot.json')) || readJson(path.join(docsDir,'gaio-snapshot.json'.replace('docs/','')));
const brand = readJson(path.join(docsDir,'gaio-brand-mention.json'));
const exposure = readJson(path.join(docsDir,'gaio-exposure.json'));
// Optional vorhandene Sparkline Markdown Dateien
const labSparklines = fs.existsSync(path.join(docsDir,'kpi-sparklines.md')) ? fs.readFileSync(path.join(docsDir,'kpi-sparklines.md'),'utf8').trim() : null;
const rumSparklines = fs.existsSync(path.join(docsDir,'rum-sparklines.md')) ? fs.readFileSync(path.join(docsDir,'rum-sparklines.md'),'utf8').trim() : null;
const brandSparkline = fs.existsSync(path.join(docsDir,'brand-sparkline.md')) ? fs.readFileSync(path.join(docsDir,'brand-sparkline.md'),'utf8').trim() : null;
const exposureSparkline = fs.existsSync(path.join(docsDir,'exposure-sparkline.md')) ? fs.readFileSync(path.join(docsDir,'exposure-sparkline.md'),'utf8').trim() : null;
const rumHistogramMd = fs.existsSync(path.join(docsDir,'rum-histogram.md')) ? fs.readFileSync(path.join(docsDir,'rum-histogram.md'),'utf8').trim() : null;
const rumOutliersMd = fs.existsSync(path.join(docsDir,'rum-outliers.md')) ? fs.readFileSync(path.join(docsDir,'rum-outliers.md'),'utf8').trim() : null;

const date = new Date().toISOString().slice(0,10);

// Weekly History (vereinfachte Kennzahlen) für Delta Berechnung
const historyFile = path.join(docsDir,'weekly-history.json');
let history = [];
try { history = JSON.parse(fs.readFileSync(historyFile,'utf8')); if(!Array.isArray(history)) history = []; } catch {}

function last(arr){ return arr[arr.length-1]; }

function collectSnapshot(){
  const snap = { date, 
    lcp_avg: kpi?.lighthouse?.avgLcp ?? null,
    cls_avg: kpi?.lighthouse?.avgCls ?? null,
    inp_avg: kpi?.lighthouse?.avgInp ?? null,
    perf: kpi?.lighthouse?.avgPerf ?? null,
    a11y: kpi?.lighthouse?.avgA11y ?? null,
    seo: kpi?.lighthouse?.avgSeo ?? null,
    rum_lcp_p75: rum?.lcp?.p75 ?? null,
    rum_inp_p75: rum?.inp?.p75 ?? null,
    rum_cls_p75: rum?.cls?.p75 ?? null,
    rum_ttfb_p75: rum?.ttfb?.p75 ?? null,
    brand_ratio: brand?.ratio ?? null,
    gaio_queries: gaio?.queries?.length ?? null,
    exposure_index: exposure?.weightedBrand ?? null
  };
  return snap;
}

const currentSnap = collectSnapshot();
const previousSnap = last(history);
const ANOMALY_PCT = Number(process.env.ANOMALY_PCT || 10); // Prozent Verschlechterung Schwelle

function delta(curr, prev){
  if(curr==null || prev==null || typeof curr !== 'number' || typeof prev !== 'number') return '';
  if(prev === 0) return '';
  const diff = curr - prev;
  const pct = (diff/prev)*100;
  const arrow = diff>0 ? '⬆️' : diff<0 ? '⬇️' : '➡️';
  return `${arrow} ${diff>0?'+':''}${diff.toFixed( (Math.abs(diff)<1)?2:1 )} (${pct>0?'+':''}${pct.toFixed(1)}%)`;
}

function deltaMs(curr, prev){
  if(curr==null || prev==null) return '';
  const diff = curr - prev;
  const arrow = diff<0 ? '⬇️' : diff>0 ? '⬆️' : '➡️'; // bei Zeiten ist weniger besser
  const pct = prev? (diff/prev)*100:0;
  return `${arrow} ${diff>0?'+':''}${diff.toFixed(0)}ms (${pct>0?'+':''}${pct.toFixed(1)}%)`;
}

function fmtPct(v){ if(v==null) return '-'; return (v*100).toFixed(0)+'%'; }
function fmtMs(v){ if(v==null) return '-'; return v.toFixed(0)+'ms'; }

// KPI Core
let kpiSection = 'Keine KPI Daten gefunden';
if(kpi){
  const lh = kpi.lighthouse||{};
  kpiSection = `| Metrik | Wert |
|--------|------|
| LCP (avg) | ${fmtMs(lh.avgLcp)} |
| CLS (avg) | ${lh.avgCls ?? '-'} |
| INP (avg) | ${fmtMs(lh.avgInp)} |
| TBT (avg) | ${fmtMs(lh.avgTbt)} |
| Performance Score | ${fmtPct(lh.avgPerf)} |
| A11y Score | ${fmtPct(lh.avgA11y)} |
| SEO Score | ${fmtPct(lh.avgSeo)} |
| Structured Types (unique) | ${(kpi.coverage?.uniqueTypes||[]).length} |`;
}

let deltaSection = '';
if(previousSnap){
  deltaSection = `| Kennzahl | Δ Woche |
|----------|--------|
| LCP avg | ${deltaMs(currentSnap.lcp_avg, previousSnap.lcp_avg)} |
| INP avg | ${deltaMs(currentSnap.inp_avg, previousSnap.inp_avg)} |
| CLS avg | ${delta(currentSnap.cls_avg, previousSnap.cls_avg)} |
| Perf Score | ${delta(currentSnap.perf, previousSnap.perf)} |
| A11y Score | ${delta(currentSnap.a11y, previousSnap.a11y)} |
| SEO Score | ${delta(currentSnap.seo, previousSnap.seo)} |
| RUM LCP p75 | ${deltaMs(currentSnap.rum_lcp_p75, previousSnap.rum_lcp_p75)} |
| RUM INP p75 | ${deltaMs(currentSnap.rum_inp_p75, previousSnap.rum_inp_p75)} |
| Brand Anteil | ${delta(currentSnap.brand_ratio, previousSnap.brand_ratio)} |
| GAIO Queries | ${delta(currentSnap.gaio_queries, previousSnap.gaio_queries)} |`;
  if(previousSnap.exposure_index != null || currentSnap.exposure_index != null){
    // Exposure Delta als separate Zeile anhängen (Reihenfolge: nach GAIO Queries)
    deltaSection = deltaSection.replace(/\| GAIO Queries \|.*\|$/, match=> match + `\n| Exposure Index | ${delta(currentSnap.exposure_index, previousSnap.exposure_index)} |`);
  }
}

// RUM
let rumSection = 'Keine RUM Daten';
if(rum){
  rumSection = `| Metrik (p75) | Wert |
|-------------|------|
| LCP | ${fmtMs(rum.lcp?.p75)} |
| INP | ${fmtMs(rum.inp?.p75)} |
| CLS | ${rum.cls?.p75 ?? '-'} |
| TTFB | ${fmtMs(rum.ttfb?.p75)} |`;
}

// GAIO
let gaioSection = 'Kein GAIO Snapshot';
if(gaio){
  const total = gaio.queries?.length || 0;
  let exp = '';
  if(exposure && typeof exposure.weightedBrand === 'number'){
    exp = ` | Exposure Index: ${exposure.weightedBrand.toFixed(2)}`;
  }
  gaioSection = `Total Queries: ${total}${exp}`;
}

// Brand
let brandSection = 'Keine Brand Mentions';
if(brand){
  const ratio = brand.ratio!=null? (brand.ratio*100).toFixed(0)+'%':'-';
  brandSection = `Brand Queries Anteil: ${ratio}`;
}

const lines = [];
lines.push(`# Weekly SEO / GAIO Report – ${date}`);
lines.push('');
lines.push('## Zusammenfassung');
lines.push('- Technische KPIs & strukturierte Daten geprüft');
lines.push('- RUM Nutzererfahrung (p75) Überblick');
lines.push('- GAIO Query Status & Brand Anteil');
lines.push('');
lines.push('## KPI Dashboard');
lines.push(kpiSection);
if(deltaSection){
  lines.push('');
  lines.push('### Woche-zu-Woche Δ');
  lines.push(deltaSection);
}
// Anomalie Detection (nur wenn vorheriger Snap existiert)
if(previousSnap){
  const anomalies = [];
  function worsen(curr, prev, higherIsBetter){
    if(curr==null||prev==null||typeof curr!=='number'||typeof prev!=='number'||prev===0) return null;
    const diff = curr - prev;
    const pct = (diff/prev)*100;
    if(higherIsBetter){
      if(pct < -ANOMALY_PCT) return {pct: Math.abs(pct), direction:'down', diff};
    } else { // lower is better
      if(pct > ANOMALY_PCT) return {pct, direction:'up', diff};
    }
    return null;
  }
  const checks = [
    {label:'LCP avg', v: worsen(currentSnap.lcp_avg, previousSnap.lcp_avg, false)},
    {label:'INP avg', v: worsen(currentSnap.inp_avg, previousSnap.inp_avg, false)},
    {label:'RUM LCP p75', v: worsen(currentSnap.rum_lcp_p75, previousSnap.rum_lcp_p75, false)},
    {label:'Perf Score', v: worsen(currentSnap.perf, previousSnap.perf, true)},
    {label:'A11y Score', v: worsen(currentSnap.a11y, previousSnap.a11y, true)},
    {label:'SEO Score', v: worsen(currentSnap.seo, previousSnap.seo, true)},
    {label:'Brand Anteil', v: worsen(currentSnap.brand_ratio, previousSnap.brand_ratio, true)},
    {label:'Exposure Index', v: worsen(currentSnap.exposure_index, previousSnap.exposure_index, true)},
  ];
  checks.forEach(c=>{ if(c.v) anomalies.push(`${c.label}: ${c.v.direction==='up'?'+':''}${c.v.diff.toFixed( (Math.abs(c.v.diff)<1)?2:1 )} (${c.v.pct.toFixed(1)}%) Verschlechterung`); });
  if(anomalies.length){
    lines.push('');
    lines.push('### Anomalien (> ' + ANOMALY_PCT + '% Verschlechterung)');
    anomalies.forEach(a=> lines.push('- ' + a));
  }
}
if(labSparklines){
  lines.push('');
  lines.push('### Lab KPI Sparklines');
  lines.push('```');
  lines.push(labSparklines);
  lines.push('```');
}
lines.push('');
lines.push('## RUM (Real User Monitoring)');
lines.push(rumSection);
if(rumSparklines){
  lines.push('');
  lines.push('### RUM Sparklines');
  lines.push('```');
  lines.push(rumSparklines);
  lines.push('```');
}
if(rumHistogramMd){
  lines.push('');
  lines.push('### RUM Histogramme (Verteilung)');
  lines.push('```');
  lines.push(rumHistogramMd);
  lines.push('```');
}
if(rumOutliersMd){
  lines.push('');
  lines.push('### RUM Outliers');
  lines.push(rumOutliersMd);
}
lines.push('');
lines.push('## GAIO Snapshot');
lines.push(gaioSection);
lines.push('');
lines.push('## Brand Mentions');
lines.push(brandSection);
if(brandSparkline){
  lines.push('');
  lines.push('### Brand Trend');
  lines.push('```');
  lines.push(brandSparkline);
  lines.push('```');
}
if(exposureSparkline){
  lines.push('');
  lines.push('### Exposure Index Trend');
  lines.push('```');
  lines.push(exposureSparkline);
  lines.push('```');
}
lines.push('');
lines.push('## Hinweise');
lines.push('- Dieser Report ist eine Momentaufnahme – Trends siehe Sparklines in PR Kommentaren');
lines.push('- Fehlende Werte bedeuten: Quelle noch nicht erzeugt oder kein Traffic');
if(!previousSnap) lines.push('- Erstes Sample – keine Deltas berechenbar');

// Persist history (max 100)
history.push(currentSnap);
if(history.length>100) history = history.slice(-100);
try { fs.writeFileSync(historyFile, JSON.stringify(history,null,2),'utf8'); } catch {}

const md = lines.join('\n');
if(process.env.REPORT_OUT){
  fs.writeFileSync(process.env.REPORT_OUT, md,'utf8');
}
console.log(md);
