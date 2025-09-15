#!/usr/bin/env node
/**
 * build-seo-dashboard.mjs
 * Erzeugt ein statisches HTML Dashboard aus bestehenden JSON Artefakten.
 * Quellen (optional, robust falls fehlend):
 *  - seo-kpi-dashboard.json
 *  - rum-summary.json
 *  - rum-histogram.json
 *  - rum-outliers.json
 *  - gaio-exposure.json / exposure-normalized.json
 *  - brand-history.json / brand-sparkline.md
 *  - weekly-history.json
 * Ausgaben:
 *  - docs/seo-dashboard.html
 * Env:
 *  - DASHBOARD_TITLE (optional)
 */
import fs from 'fs';
import path from 'path';

const docsDir = path.resolve('docs');
function read(p){ try { return JSON.parse(fs.readFileSync(path.join(docsDir,p),'utf8')); } catch{ return null; } }
function readTxt(p){ try { return fs.readFileSync(path.join(docsDir,p),'utf8'); } catch{ return null; } }

const kpi = read('seo-kpi-dashboard.json');
const rum = read('rum-summary.json');
const hist = read('rum-histogram.json');
const outliers = read('rum-outliers.json');
const exposure = read('gaio-exposure.json');
const exposureNorm = read('exposure-normalized.json');
const brandHist = read('brand-history.json');
const brandSpark = readTxt('brand-sparkline.md');
const exposureSpark = readTxt('exposure-sparkline.md');
const exposureSparkNorm = readTxt('exposure-sparkline-normalized.md');
const weeklyHistory = read('weekly-history.json');
const gateResult = read('threshold-result.json');
const urlAgg = read('rum-url-aggregate.json');

function esc(s){ return (s==null?'':String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))); }

function table(rows, header=true){
  if(!rows||!rows.length) return '<p><em>Keine Daten</em></p>';
  const head = header? '<thead><tr>'+ rows[0].map(h=>`<th>${esc(h)}</th>`).join('') + '</tr></thead>' : '';
  const bodyRows = header? rows.slice(1): rows;
  const body = '<tbody>' + bodyRows.map(r=>'<tr>'+r.map(c=>`<td>${esc(c)}</td>`).join('')+'</tr>').join('') + '</tbody>';
  return `<table>${head}${body}</table>`;
}

function section(title, content){ return `<section><h2>${esc(title)}</h2>${content}</section>`; }

// KPI Section
let kpiHtml = '<p><em>Keine KPI Daten</em></p>';
if(kpi){
  const lh = kpi.lighthouse||{};
  kpiHtml = table([
    ['Metrik','Wert'],
    ['LCP avg', lh.avgLcp!=null? lh.avgLcp.toFixed(0)+'ms':'-'],
    ['CLS avg', lh.avgCls ?? '-'],
    ['INP avg', lh.avgInp!=null? lh.avgInp.toFixed(0)+'ms':'-'],
    ['TBT avg', lh.avgTbt!=null? lh.avgTbt.toFixed(0)+'ms':'-'],
    ['Performance', lh.avgPerf!=null? (lh.avgPerf*100).toFixed(0)+'%':'-'],
    ['A11y', lh.avgA11y!=null? (lh.avgA11y*100).toFixed(0)+'%':'-'],
    ['SEO', lh.avgSeo!=null? (lh.avgSeo*100).toFixed(0)+'%':'-'],
    ['Structured Types', (kpi.coverage?.uniqueTypes||[]).length]
  ]);
}

// RUM Summary
let rumHtml = '<p><em>Keine RUM Daten</em></p>';
if(rum){
  const m = rum.metrics || rum;
  rumHtml = table([
    ['Metric','p75'],
    ['LCP', m.LCP?.p75!=null? m.LCP.p75.toFixed(0)+'ms':'-'],
    ['INP', m.INP?.p75!=null? m.INP.p75.toFixed(0)+'ms':'-'],
    ['CLS', m.CLS?.p75!=null? m.CLS.p75.toFixed(3):'-'],
    ['TTFB', m.TTFB?.p75!=null? m.TTFB.p75.toFixed(0)+'ms':'-']
  ]);
}

// Histogram
let histHtml = '<p><em>Kein Histogramm</em></p>';
if(hist){
  function distRows(label,obj){
    if(!obj) return [];
    const thr = obj.thresholds || [];
    const labels=[];
    for(let i=0;i<=thr.length;i++){
      let range;
      if(i===0) range = '<'+thr[0];
      else if(i===thr.length) range = '>'+thr[thr.length-1];
      else range = thr[i-1]+'-'+thr[i];
      const pct = obj.distribution?.[i]!=null? (obj.distribution[i]*100).toFixed(1)+'%':'-';
      labels.push([label+' '+range, pct]);
    }
    return labels;
  }
  const rows = [['Bucket','Anteil']]
    .concat(distRows('LCP', hist.lcp))
    .concat(distRows('INP', hist.inp));
  histHtml = table(rows);
}

// Outliers
let outlierHtml = '<p><em>Keine Outliers</em></p>';
if(outliers){
  function mapRows(label, arr){ return arr.map(o=> [label, o.value!=null? (o.value.toFixed?o.value.toFixed(0):o.value)+'ms':'-', o.url||'-']); }
  const rows = [['Metric','Wert','URL']]
    .concat(mapRows('LCP', outliers.lcp||[]))
    .concat(mapRows('INP', outliers.inp||[]));
  outlierHtml = table(rows);
}

// Exposure / Brand
let exposureHtml = '<p><em>Keine Exposure Daten</em></p>';
if(exposure){
  const base = exposure.weightedBrand!=null? exposure.weightedBrand.toFixed(2):'-';
  const norm = exposureNorm?.normalized!=null? exposureNorm.normalized.toFixed(1):'-';
  exposureHtml = `<p>Exposure Index: <strong>${base}</strong> (normalisiert: ${norm})</p>`;
  if(exposureSpark) exposureHtml += `<pre class="spark">${esc(exposureSpark)}</pre>`;
  if(exposureSparkNorm) exposureHtml += `<pre class="spark">${esc(exposureSparkNorm)}</pre>`;
}
let brandHtml = '<p><em>Keine Brand History</em></p>';
if(brandHist){
  const last = brandHist[brandHist.length-1];
  const lastPct = last?.ratio!=null? (last.ratio*100).toFixed(0)+'%':'-';
  brandHtml = `<p>Brand Anteil zuletzt: ${lastPct}</p>`;
  if(brandSpark) brandHtml += `<pre class="spark">${esc(brandSpark)}</pre>`;
}

// Weekly History (vereinfachte Trend Tabelle)
let weeklyHtml = '<p><em>Keine History</em></p>';
if(Array.isArray(weeklyHistory) && weeklyHistory.length){
  const rows = [['Datum','LCP','INP','Perf','A11y','SEO','Brand','Exposure']]
    .concat(weeklyHistory.slice(-20).map(h=>[
      h.date,
      h.lcp_avg!=null? h.lcp_avg.toFixed(0)+'ms':'-',
      h.inp_avg!=null? h.inp_avg.toFixed(0)+'ms':'-',
      h.perf!=null? (h.perf*100).toFixed(0)+'%':'-',
      h.a11y!=null? (h.a11y*100).toFixed(0)+'%':'-',
      h.seo!=null? (h.seo*100).toFixed(0)+'%':'-',
      h.brand_ratio!=null? (h.brand_ratio*100).toFixed(0)+'%':'-',
      h.exposure_index!=null? h.exposure_index.toFixed(2):'-'
    ]));
  weeklyHtml = table(rows);
}

// Gate Status
let gateHtml = '<p><em>Kein Gate Ergebnis</em></p>';
if(gateResult){
  gateHtml = `<p>Status: <strong>${esc(gateResult.status)}</strong> Mode: ${esc(gateResult.gateMode||'n/a')} Issues: ${gateResult.issues.length} Warnungen: ${gateResult.warnings.length}</p>`;
}

const title = process.env.DASHBOARD_TITLE || 'SEO / Performance Dashboard';
const css = `body{font-family:system-ui,Arial,sans-serif;margin:2rem;line-height:1.4;background:#0e1116;color:#e2e8f0;}h1,h2{color:#fff;}table{border-collapse:collapse;margin:1rem 0;width:100%;font-size:0.9rem;}th,td{border:1px solid #334155;padding:4px 8px;}th{background:#1e293b;text-align:left;cursor:pointer;user-select:none;}th.sort-asc::after{content:' \\25B2';}th.sort-desc::after{content:' \\25BC';}section{margin-bottom:2.5rem;}pre.spark{background:#1e293b;padding:6px 8px;display:inline-block;margin:4px 8px 4px 0;color:#38bdf8;}a{color:#38bdf8;} .grid{display:grid;gap:1.5rem;} .cols-2{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));} td.good{background:rgba(34,197,94,0.18);} td.warn{background:rgba(234,179,8,0.18);} td.bad{background:rgba(239,68,68,0.22);} .legend span{display:inline-block;margin-right:12px;font-size:0.75rem;opacity:0.8;padding:2px 6px;border-radius:4px;} .legend .lg-good{background:rgba(34,197,94,0.25);} .legend .lg-warn{background:rgba(234,179,8,0.25);} .legend .lg-bad{background:rgba(239,68,68,0.3);}`;

// URL Aggregation Tabelle (Top 15 nach p75 LCP)
let urlAggHtml = '<p><em>Keine URL Aggregation</em></p>';
if(Array.isArray(urlAgg) && urlAgg.length){
  const top = urlAgg.slice(0,15);
  const rows = [['URL','Events','p75 LCP','Δ LCP','p75 INP','p75 CLS','p75 TTFB','Debt']]
    .concat(top.map(r=>{
      const delta = r.delta_p75_lcp!=null? (r.delta_p75_lcp>0? '+'+Math.round(r.delta_p75_lcp):Math.round(r.delta_p75_lcp))+'ms':'-';
      return [
        r.url + (r.lowSample? ' (low n)':''),
        r.count + (r.lowSample? '*':''),
        r.p75_lcp!=null? Math.round(r.p75_lcp)+'ms':'-',
        delta,
        r.p75_inp!=null? Math.round(r.p75_inp)+'ms':'-',
        r.p75_cls!=null? r.p75_cls.toFixed(3):'-',
        r.p75_ttfb!=null? Math.round(r.p75_ttfb)+'ms':'-',
        r.debt!=null? r.debt: '-'
      ];
    }));
  urlAggHtml = table(rows);
  urlAggHtml += '<p><small>* Ein Stern markiert niedrige Stichprobe &quot;low n&quot; – Werte mit Vorsicht interpretieren.</small></p>';
}

// Threshold Ableitung (für Farb-Logik)
const rawThr = gateResult?.thresholds || {};
const dynThr = {
  LCP_MAX: rawThr.LCP_MAX || Number(process.env.THRESH_LCP_MS)||3000,
  INP_MAX: rawThr.INP_MAX || Number(process.env.THRESH_INP_MS)||200,
  CLS_MAX: rawThr.CLS_MAX || Number(process.env.THRESH_CLS)||0.1,
  TBT_MAX: rawThr.TBT_MAX || Number(process.env.THRESH_TBT_MS)||250,
  PERF_MIN: rawThr.MIN_PERF_SCORE != null ? rawThr.MIN_PERF_SCORE*100 : (Number(process.env.MIN_PERF_SCORE)||0.8)*100,
  A11Y_MIN: rawThr.MIN_A11Y_SCORE != null ? rawThr.MIN_A11Y_SCORE*100 : (Number(process.env.MIN_A11Y_SCORE)||0.9)*100,
  SEO_MIN: rawThr.MIN_SEO_SCORE != null ? rawThr.MIN_SEO_SCORE*100 : (Number(process.env.MIN_SEO_SCORE)||0.9)*100,
  RUM_LCP_P75: rawThr.rum?.LCP_P75 || Number(process.env.RUM_LCP_P75_MS)||2500,
  RUM_INP_P75: rawThr.rum?.INP_P75 || Number(process.env.RUM_INP_P75_MS)||200,
  RUM_CLS_P75: rawThr.rum?.CLS_P75 || Number(process.env.RUM_CLS_P75)||0.1,
  RUM_TTFB_P75: rawThr.rum?.TTFB_P75 || Number(process.env.RUM_TTFB_P75_MS)||600
};

const html = `<!DOCTYPE html><html lang=\"de\"><head><meta charset=\"utf-8\"/><title>${esc(title)}</title><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><style>${css}</style></head><body><h1>${esc(title)}</h1>
<div class="legend"><span class="lg-good">gut</span><span class="lg-warn">grenzwertig</span><span class="lg-bad">schlecht</span></div>
${section('Gate Ergebnis', gateHtml)}
<div class="grid cols-2">
${section('KPI (Lab)', kpiHtml)}
${section('RUM Summary', rumHtml)}
${section('RUM Histogram', histHtml)}
${section('RUM Outliers', outlierHtml)}
${section('Exposure', exposureHtml)}
${section('Brand', brandHtml)}
</div>
${section('Weekly History (letzte 20)', weeklyHtml)}
${section('RUM URL Aggregation (Top 15)', urlAggHtml)}
<script>(function(){
  const THR = ${JSON.stringify(dynThr)};
  function parseMs(v){ if(!v) return null; const m = v.match(/(-?\d+(?:\.\d+)?)ms/); return m? parseFloat(m[1]): null; }
  function parsePct(v){ if(!v) return null; const m=v.match(/(-?\d+(?:\.\d+)?)%/); return m? parseFloat(m[1]): null; }
  function headerForCell(cell){ const tr = cell.parentElement; const tbl = tr.closest('table'); if(!tbl) return null; const idx = Array.prototype.indexOf.call(tr.children, cell); const th = tbl.querySelectorAll('thead th')[idx]; return th? th.textContent.trim().toLowerCase(): null; }
  function classify(cell){
    const txt = cell.textContent.trim();
    let val = null; let type='';
    if(txt.endsWith('ms')){ val = parseMs(txt); type='ms'; }
    else if(txt.endsWith('%')){ val = parsePct(txt); type='%'; }
    else if(/^[0-9.]+$/.test(txt)){ val=parseFloat(txt); type='num'; }
    if(val==null) return;
    const header = headerForCell(cell) || '';
    let cls='';
    // Dynamische Schwellen
    if(type==='ms'){
      let limit=null;
      if(header.includes('lcp')) limit = THR.RUM_LCP_P75 || THR.LCP_MAX;
      else if(header.includes('inp')) limit = THR.RUM_INP_P75 || THR.INP_MAX;
      else if(header.includes('ttfb')) limit = THR.RUM_TTFB_P75;
      if(limit!=null){
        if(val <= limit) cls='good'; else if(val <= limit*1.2) cls='warn'; else cls='bad';
      }
    } else if(type==='%' ){ // Scores
      let min=null;
      if(header.includes('perf')) min = THR.PERF_MIN; else if(header.includes('a11y')) min = THR.A11Y_MIN; else if(header.includes('seo')) min = THR.SEO_MIN;
      if(min!=null){ if(val >= min) cls='good'; else if(val >= min-5) cls='warn'; else cls='bad'; }
    } else if(type==='num' && val <=1 && val >=0){ // ratio
      const pct = val*100; if(pct>=90) cls='good'; else if(pct>=80) cls='warn'; else cls='bad';
    }
    // Spezielle Klassifikation: Debt / Delta LCP
    if(header.includes('debt') && type==='num'){
      if(val<=0) cls='good'; else if(val<=1500) cls='warn'; else cls='bad';
    } else if((header.includes('Δ lcp') || header.includes('delta lcp')) && type==='ms'){
      // Delta: Verbesserung negativ gut, leichte +/-50 neutral warn, starker Anstieg schlecht
      if(val<=-50) cls='good'; else if(Math.abs(val)<=50) cls='warn'; else if(val>50) cls='bad';
    }
    if(!cls){ // Fallback Heuristik
      if(type==='ms') cls = val<2000? 'good': val<3500? 'warn':'bad';
      else if(type==='%' ) cls = val>=90? 'good': val>=80? 'warn':'bad';
    }
    if(cls) cell.classList.add(cls);
  }
  document.querySelectorAll('table').forEach(tbl=>{
    tbl.querySelectorAll('tbody tr td').forEach(classify);
    const headers = tbl.querySelectorAll('thead th');
    headers.forEach((th,i)=>{
      th.addEventListener('click',()=>{
        const rows = Array.from(tbl.querySelectorAll('tbody tr'));
        const current = th.classList.contains('sort-asc')? 'asc': th.classList.contains('sort-desc')? 'desc': null;
        headers.forEach(h=>h.classList.remove('sort-asc','sort-desc'));
        const dir = current==='asc' ? 'desc' : 'asc';
        th.classList.add(dir==='asc'?'sort-asc':'sort-desc');
        rows.sort((a,b)=>{
          const ta = a.children[i]?.textContent.trim();
          const tb = b.children[i]?.textContent.trim();
          const na = parseFloat(ta.replace(/[^0-9.-]/g,''));
          const nb = parseFloat(tb.replace(/[^0-9.-]/g,''));
          if(!isNaN(na) && !isNaN(nb)) return dir==='asc'? na-nb : nb-na;
          return dir==='asc'? ta.localeCompare(tb) : tb.localeCompare(ta);
        });
        const tbody = tbl.querySelector('tbody');
        rows.forEach(r=>tbody.appendChild(r));
      });
    });
  });
})();</script>
<footer><p>Generiert: ${esc(new Date().toISOString())}</p></footer>
</body></html>`;

fs.writeFileSync(path.join(docsDir,'seo-dashboard.html'), html,'utf8');
console.log('[build-seo-dashboard] fertig: docs/seo-dashboard.html');
