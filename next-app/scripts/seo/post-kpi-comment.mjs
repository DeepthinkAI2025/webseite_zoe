#!/usr/bin/env node
/**
 * post-kpi-comment.mjs
 * Erzeugt einen konsolidierten KPI Kommentar (Diff + Sparklines + Gate Hinweis)
 * Optional: Post als PR Kommentar (GitHub) wenn GITHUB_TOKEN & PR_NUMBER oder GITHUB_REF verfügbar.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

function run(cmd){
  try { return execSync(cmd,{encoding:'utf-8'}); } catch(e){ return e.stdout || String(e); }
}

function readJson(file){
  if(!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file,'utf-8')); } catch { return null; }
}

function runScript(rel){
  // rel expected like 'scripts/seo/kpi-history-diff.mjs'
  if(fs.existsSync(rel)) return run(`node ${rel}`);
  const nested = path.join('next-app', rel);
  if(fs.existsSync(nested)) return run(`node ${nested}`);
  return `Script ${rel} nicht gefunden`;
}

// Generate Diff & Lab Sparklines (robust gegen Arbeitsverzeichnis)
const diffOut = runScript('scripts/seo/kpi-history-diff.mjs');
const sparkOut = runScript('scripts/seo/kpi-sparkline.mjs');
// RUM Sparklines optional
let rumSparkOut = '';
try { rumSparkOut = runScript('scripts/seo/rum-sparkline.mjs'); } catch { /* ignore */ }

function readJsonMulti(rel){
  // Try current wd
  const direct = path.resolve(rel);
  if(fs.existsSync(direct)) return readJson(direct);
  // Try next-app nested
  const nested = path.resolve('next-app', rel);
  if(fs.existsSync(nested)) return readJson(nested);
  return null;
}

const gate = readJsonMulti(path.join('docs','seo-kpi-dashboard.json'));
const rum = readJsonMulti(path.join('docs','rum-summary.json'));
const exposure = readJsonMulti(path.join('docs','gaio-exposure.json'));
const thresholdResult = readJsonMulti(path.join('docs','threshold-result.json'));
const weeklyHistory = readJsonMulti(path.join('docs','weekly-history.json')) || [];
const rumHistogram = readJsonMulti(path.join('docs','rum-histogram.json'));
const rumOutliers = readJsonMulti(path.join('docs','rum-outliers.json'));
const rumUrlAgg = readJsonMulti(path.join('docs','rum-url-aggregate.json'));
// Debt Auswertung (Top URLs)
let debtSummaryLine = '';
let debtDetailsBlock = '';
try {
  if(Array.isArray(rumUrlAgg) && rumUrlAgg.length){
    const debtRows = rumUrlAgg.filter(r=> typeof r.debt === 'number' && r.debt>0);
    if(debtRows.length){
      const totalDebt = debtRows.reduce((a,b)=> a + (b.debt||0),0);
      debtRows.sort((a,b)=> b.debt - a.debt);
      const topN = debtRows.slice(0,3);
      debtSummaryLine = `Performance Debt Gesamt: ${totalDebt} (Top: ${topN.map(r=>`${r.url}${r.lowSample?'(low n)':''} ${r.debt}`).join(', ')})`;
      debtDetailsBlock = '### Performance Debt (Top 10)\n' + debtRows.slice(0,10).map(r=>`- ${r.url}${r.lowSample?' (low n)':''} | Debt ${r.debt} | p75 LCP ${r.p75_lcp!=null?Math.round(r.p75_lcp)+'ms':'-'} | Events ${r.count}${r.delta_p75_lcp!=null?` | Δ ${r.delta_p75_lcp>0? '+'+Math.round(r.delta_p75_lcp):Math.round(r.delta_p75_lcp)}ms`:''}`).join('\n');
    }
  }
} catch {}
// Versuche Threshold Gate Interpretation durch erneute Logik (vereinfachte Ableitung)
function deriveGateStatus(){
  try {
    const dash = gate;
    if(!dash) return { status:'UNKNOWN', issues:['Dashboard fehlt'] };
    const issues=[]; const warns=[];
    const LCP_MAX = Number(process.env.THRESH_LCP_MS || 3000);
    const CLS_MAX = Number(process.env.THRESH_CLS || 0.1);
    const INP_MAX = Number(process.env.THRESH_INP_MS || 200);
    const TBT_MAX = Number(process.env.THRESH_TBT_MS || 250);
    const FORCE_INP = process.env.FORCE_INP === '1';
    const TYPES_MIN = Number(process.env.MIN_STRUCT_TYPES || 4);
    const lh = dash.lighthouse || {};
    const lcp = lh.lcp ?? lh.avgLcp; const cls = lh.cls ?? lh.avgCls; const inp = lh.inp ?? lh.avgInp; const tbt = lh.tbt ?? lh.avgTbt;
    const perf = lh.performanceScore ?? lh.avgPerf; const a11y=lh.avgA11y; const seo=lh.avgSeo;
    if((dash.coverage?.uniqueTypes||[]).length < TYPES_MIN) issues.push(`Structured Types ${(dash.coverage?.uniqueTypes||[]).length}/${TYPES_MIN}`);
    if(lcp!=null && lcp > LCP_MAX) issues.push(`LCP ${lcp.toFixed?lcp.toFixed(0):lcp}ms > ${LCP_MAX}`);
    if(cls!=null && cls > CLS_MAX) issues.push(`CLS ${cls} > ${CLS_MAX}`);
    if(tbt!=null && tbt > TBT_MAX) issues.push(`TBT ${tbt.toFixed?tbt.toFixed(0):tbt}ms > ${TBT_MAX}`);
    if(inp!=null && inp > INP_MAX){
      if(FORCE_INP) issues.push(`INP ${inp.toFixed?inp.toFixed(0):inp}ms > ${INP_MAX}`); else warns.push(`INP ${inp.toFixed?inp.toFixed(0):inp}ms > ${INP_MAX}`);
    }
    const MIN_PERF = Number(process.env.MIN_PERF_SCORE || 0.8);
    const MIN_A11Y = Number(process.env.MIN_A11Y_SCORE || 0.9);
    const MIN_SEO = Number(process.env.MIN_SEO_SCORE || 0.9);
    if(perf!=null && perf < MIN_PERF) issues.push(`Perf ${(perf*100).toFixed(0)} < ${(MIN_PERF*100)}`);
    if(a11y!=null && a11y < MIN_A11Y) issues.push(`A11y ${(a11y*100).toFixed(0)} < ${(MIN_A11Y*100)}`);
    if(seo!=null && seo < MIN_SEO) issues.push(`SEO ${(seo*100).toFixed(0)} < ${(MIN_SEO*100)}`);
    if(!issues.length && !warns.length) return { status:'PASS', issues:[], warns:[] };
    if(issues.length) return { status:'FAIL', issues, warns };
    return { status:'WARN', issues:[], warns };
  } catch(e){
    return { status:'UNKNOWN', issues:[e.message] };
  }
}
const gateEval = deriveGateStatus();

function withEmoji(ok){ return ok===true ? '✅' : ok===false ? '❌' : '–'; }

function summarizeGate(g){
  if(!g) return 'Kein Dashboard gefunden.';
  const lh = g.lighthouse;
  if(!lh) return 'Kein Lighthouse Abschnitt.';
  // Thresholds aus Env
  const TLCP = parseFloat(process.env.THRESH_LCP_MS||'');
  const TCLS = parseFloat(process.env.THRESH_CLS||'');
  const TINP = parseFloat(process.env.THRESH_INP_MS||'');
  const TPERF = parseFloat(process.env.MIN_PERF_SCORE||'');
  const TA11Y = parseFloat(process.env.MIN_A11Y_SCORE||'');
  const TSEO = parseFloat(process.env.MIN_SEO_SCORE||'');
  function fmtLabAvg(){
    if(lh.avgPerf != null){
      const perfPct = (lh.avgPerf*100);
      const perfOk = isFinite(TPERF)? perfPct >= TPERF : null;
      const lcpOk = isFinite(TLCP)&&lh.avgLcp? lh.avgLcp <= TLCP : null;
      const clsOk = isFinite(TCLS)&&lh.avgCls!=null? lh.avgCls <= TCLS : null;
      const inpOk = isFinite(TINP)&&lh.avgInp? lh.avgInp <= TINP : null;
      return `Lab: Perf ${(perfPct).toFixed(0)}${withEmoji(perfOk)} | LCP ${lh.avgLcp?lh.avgLcp.toFixed(0)+'ms':'–'}${withEmoji(lcpOk)} | CLS ${lh.avgCls??'–'}${withEmoji(clsOk)} | INP ${lh.avgInp?lh.avgInp.toFixed(0)+'ms':'–'}${withEmoji(inpOk)}`;
    }
    const perfPct = lh.performanceScore!=null? lh.performanceScore*100 : null;
    const perfOk = perfPct!=null && isFinite(TPERF)? perfPct >= TPERF : null;
    const lcpOk = isFinite(TLCP)&&lh.lcp? lh.lcp <= TLCP : null;
    const clsOk = isFinite(TCLS)&&lh.cls!=null? lh.cls <= TCLS : null;
    const inpOk = isFinite(TINP)&&lh.inp? lh.inp <= TINP : null;
    return `Lab (Single): Perf ${perfPct!=null?perfPct.toFixed(0):'–'}${withEmoji(perfOk)} | LCP ${lh.lcp??'–'}${withEmoji(lcpOk)} | CLS ${lh.cls??'–'}${withEmoji(clsOk)} | INP ${lh.inp??'–'}${withEmoji(inpOk)}`;
  }
  return fmtLabAvg();
}

function summarizeRum(r){
  if(!r) return 'Kein RUM Summary.';
  const m = r.metrics || {};
  const TLCP = parseFloat(process.env.RUM_LCP_P75_MS||'');
  const TINP = parseFloat(process.env.RUM_INP_P75_MS||'');
  const TCLS = parseFloat(process.env.RUM_CLS_P75||'');
  const TTTFB = parseFloat(process.env.RUM_TTFB_P75_MS||'');
  const lVal = m.LCP?.p75; const iVal = m.INP?.p75; const cVal = m.CLS?.p75; const tVal = m.TTFB?.p75;
  const l = lVal!=null? lVal.toFixed(0)+'ms':'–';
  const i = iVal!=null? iVal.toFixed(0)+'ms':'–';
  const c = cVal!=null? cVal.toFixed(3):'–';
  const t = tVal!=null? tVal.toFixed(0)+'ms':'–';
  const lOk = isFinite(TLCP)&&lVal!=null? lVal <= TLCP : null;
  const iOk = isFinite(TINP)&&iVal!=null? iVal <= TINP : null;
  const cOk = isFinite(TCLS)&&cVal!=null? cVal <= TCLS : null;
  const tOk = isFinite(TTTFB)&&tVal!=null? tVal <= TTTFB : null;
  return `RUM p75: LCP ${l}${withEmoji(lOk)} | INP ${i}${withEmoji(iOk)} | CLS ${c}${withEmoji(cOk)} | TTFB ${t}${withEmoji(tOk)}`;
}

const gateSummary = summarizeGate(gate);
const rumSummary = summarizeRum(rum);

// Exposure Kurzinfo
let exposureLine = '';
if(exposure && typeof exposure.weightedBrand === 'number'){
  exposureLine = `Exposure Index: ${exposure.weightedBrand.toFixed(2)}`;
}

// RUM Histogram Kurzsummary (nur Top Bucket Anteil LCP / INP)
let histogramLine = '';
try {
  if(rumHistogram){
    function top(bucketObj){
      const entries = Object.entries(bucketObj||{}).map(([range,v])=>({range, count:v.count||v}));
      entries.sort((a,b)=> b.count - a.count);
      return entries[0];
    }
    const lTop = top(rumHistogram.LCP);
    const iTop = top(rumHistogram.INP);
    if(lTop||iTop){
      histogramLine = 'Top Verteilungen:' + [lTop?` LCP ${lTop.range}`:'', iTop?` INP ${iTop.range}`:''].filter(Boolean).join(' | ');
    }
  }
} catch {}

// Anomalien (verwende letzte beiden Weekly Snapshots)
let anomaliesBlock = '';
try {
  if(Array.isArray(weeklyHistory) && weeklyHistory.length>=2){
    const prev = weeklyHistory[weeklyHistory.length-2];
    const curr = weeklyHistory[weeklyHistory.length-1];
    const ANOM_PCT = Number(process.env.ANOMALY_PCT || 10);
    const list = [];
    function add(label, a, b, higherIsBetter){
      if(a==null||b==null||typeof a!=='number'||typeof b!=='number'||b===0) return;
      const diff = a - b;
      const pct = (diff/b)*100;
      if(higherIsBetter){
        if(pct < -ANOM_PCT) list.push(`${label} -${Math.abs(pct).toFixed(1)}%`);
      } else {
        if(pct > ANOM_PCT) list.push(`${label} +${pct.toFixed(1)}%`);
      }
    }
    add('LCP avg', curr.lcp_avg, prev.lcp_avg, false);
    add('INP avg', curr.inp_avg, prev.inp_avg, false);
    add('RUM LCP p75', curr.rum_lcp_p75, prev.rum_lcp_p75, false);
    add('Perf', curr.perf, prev.perf, true);
    add('A11y', curr.a11y, prev.a11y, true);
    add('SEO', curr.seo, prev.seo, true);
    add('Brand Anteil', curr.brand_ratio, prev.brand_ratio, true);
    add('Exposure', curr.exposure_index, prev.exposure_index, true);
    if(list.length){
      anomaliesBlock = '### Anomalien (> '+ANOM_PCT+'% Verschlechterung)\n' + list.map(l=>' - '+l).join('\n');
    }
  }
} catch {}

const COMMENT_MARKER = '<!-- KPI-COMMENT-IDEMPOTENT -->';
// Badges für schnelle Übersicht
const hasOutliers = !!(rumOutliers && ((rumOutliers.lcp?.length||0) > 0 || (rumOutliers.inp?.length||0) > 0));
const hasAnomalies = !!anomaliesBlock;
const badges = [
  hasAnomalies? '🛑 Anomalien':'✅ Keine Anomalien',
  hasOutliers? '🔥 Outliers':'🟢 Keine Outliers'
].join(' | ');

// Langsamste URL aus Aggregation (p75 LCP höchster Wert)
let slowestUrlLine = '';
try {
  if(Array.isArray(rumUrlAgg) && rumUrlAgg.length){
    const sorted = [...rumUrlAgg].filter(r=> typeof r.p75_lcp === 'number').sort((a,b)=> b.p75_lcp - a.p75_lcp);
    if(sorted.length){
      const top = sorted[0];
      slowestUrlLine = `Langsamste URL p75 LCP: ${top.url}${top.lowSample?' (low n)':''} (${Math.round(top.p75_lcp)}ms, events ${top.count})`;
    }
  }
} catch {}

const body = [
  COMMENT_MARKER,
  gateEval.status==='PASS'? '✅ Gate PASS' : gateEval.status==='FAIL'? '❌ Gate FAIL' : gateEval.status==='WARN'? '⚠️ Gate WARN' : 'ℹ️ Gate Status unbekannt',
  badges,
  slowestUrlLine,
  debtSummaryLine,
  gateEval.issues?.length? `Issues: ${gateEval.issues.join('; ')}` : '',
  gateEval.warns?.length? `Warnungen: ${gateEval.warns.join('; ')}` : '',
  '',
  '## 🔍 SEO / Performance KPI Update',
  '',
  '### Gate Zusammenfassung',
  gateSummary,
  thresholdResult? `\nGate JSON Status: ${thresholdResult.status}` : '',
  '',
  '### RUM Status',
  rumSummary,
  histogramLine? ('\n'+histogramLine) : '',
  exposureLine? ('\n'+exposureLine) : '',
  rumOutliers && (rumOutliers.lcp?.length||rumOutliers.inp?.length)? ('\nOutliers: LCP max '+ (rumOutliers.lcp?.[0]?.value!=null? (rumOutliers.lcp[0].value.toFixed?rumOutliers.lcp[0].value.toFixed(0):rumOutliers.lcp[0].value)+'ms':'-') + ' | INP max ' + (rumOutliers.inp?.[0]?.value!=null? (rumOutliers.inp[0].value.toFixed?rumOutliers.inp[0].value.toFixed(0):rumOutliers.inp[0].value)+'ms':'-')) : '',
  '',
  '### KPI Diff',
  '```markdown',
  diffOut.trim(),
  '```',
  '',
  '### Lab Sparklines',
  '```markdown',
  sparkOut.trim(),
  '```',
  '',
  rumSparkOut?.trim()? '### RUM Sparklines' : '',
  rumSparkOut?.trim()? '```markdown' : '',
  rumSparkOut?.trim()? rumSparkOut.trim() : '',
  rumSparkOut?.trim()? '```' : '',
  '',
  debtDetailsBlock,
  debtDetailsBlock? '' : '',
  anomaliesBlock,
  anomaliesBlock? '' : '',
  '_Automatisch generiert – idempotent_' 
].join('\n');

// Write local artifact
const outFile = path.resolve('docs','pr-kpi-comment.md');
fs.writeFileSync(outFile, body);
console.log('[post-kpi-comment] Kommentar Markdown geschrieben:', outFile);

// Optional GitHub POST
const token = process.env.GITHUB_TOKEN;
let prNumber = process.env.PR_NUMBER || '';
if(!prNumber && process.env.GITHUB_REF){
  const m = process.env.GITHUB_REF.match(/refs\/pull\/(\d+)\/merge/);
  if (m) prNumber = m[1];
}
const repo = process.env.GITHUB_REPOSITORY; // owner/repo

if(token && prNumber && repo){
  const [owner, repoName] = repo.split('/');
  // Schritt 1: vorhandene Kommentare abrufen
  const listPath = `/repos/${owner}/${repoName}/issues/${prNumber}/comments`;
  function ghRequest(method, apiPath, payload){
    return new Promise((resolve,reject)=>{
      const dataStr = payload? JSON.stringify(payload): null;
      const opt = {
        hostname:'api.github.com',
        path: apiPath,
        method,
        headers:{
          'Authorization': `Bearer ${token}`,
          'User-Agent':'kpi-comment-bot',
          'Accept':'application/vnd.github+json'
        }
      };
      if(dataStr){
        opt.headers['Content-Type']='application/json';
        opt.headers['Content-Length']=Buffer.byteLength(dataStr);
      }
      const req = https.request(opt,res=>{
        let buf='';
        res.on('data',d=>buf+=d);
        res.on('end',()=>{
          if(res.statusCode && res.statusCode>=200 && res.statusCode<300){
            try { resolve(buf?JSON.parse(buf):{}); } catch { resolve({}); }
          } else {
            console.error(`[post-kpi-comment] GitHub API ${method} ${apiPath} Status ${res.statusCode}`);
            resolve(null);
          }
        });
      });
      req.on('error',reject);
      if(dataStr) req.write(dataStr);
      req.end();
    });
  }
  (async()=>{
    const comments = await ghRequest('GET', listPath);
    const existing = Array.isArray(comments)? comments.find(c=> typeof c.body==='string' && c.body.includes(COMMENT_MARKER)) : null;
    if(existing){
      const updatePath = `/repos/${owner}/${repoName}/issues/comments/${existing.id}`;
      const res = await ghRequest('PATCH', updatePath, { body });
      if(res) console.log('[post-kpi-comment] Kommentar aktualisiert (idempotent).');
    } else {
      const createPath = listPath;
      const res = await ghRequest('POST', createPath, { body });
      if(res) console.log('[post-kpi-comment] Kommentar erstellt.');
    }
  })().catch(e=> console.error('[post-kpi-comment] Netzwerkfehler:', e.message));
} else {
  console.log('[post-kpi-comment] Skip GitHub Post (TOKEN oder PR Nummer fehlt)');
}