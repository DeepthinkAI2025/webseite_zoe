#!/usr/bin/env node
/**
 * CI Threshold Gate
 * Prüft Kennzahlen & Coverage gegen definierte Schwellen.
 * Quellen:
 *  - seo-kpi-dashboard.json (Struktur & Lighthouse Fallback)
 * Env Overrides:
 *  - THRESH_LCP_MS (default 3000)
 *  - THRESH_CLS (default 0.1)
 *  - THRESH_INP_MS (default 200)  (nur Hard Fail falls FORCE_INP=1 gesetzt)
 *  - THRESH_TBT_MS (default 250)
 *  - MIN_STRUCT_TYPES (default 4)
 * Zusätzlich (RUM/Lab Score Mindestwerte – optional):
 *  - MIN_PERF_SCORE (0-1, default 0.8) Durchschnitt Performance oder performanceScore
 *  - MIN_A11Y_SCORE (0-1, default 0.9) Durchschnitt Accessibility
 *  - MIN_SEO_SCORE (0-1, default 0.9) Durchschnitt SEO
 * Exit Codes:
 *  0 ok, 1 soft warn (nur fehlende Metriken), 2 hard fail (Schwelle unterschritten)
 */
import fs from 'fs';
import path from 'path';

const DASHBOARD = path.resolve('docs','seo-kpi-dashboard.json');
if(!fs.existsSync(DASHBOARD)){
  console.error('❌ threshold: Dashboard fehlt – zuerst KPI Dashboard erzeugen.');
  process.exit(2);
}
let data;
try { data = JSON.parse(fs.readFileSync(DASHBOARD,'utf-8')); } catch(e){
  console.error('❌ threshold: Dashboard JSON ungültig:', e.message); process.exit(2);
}

const LCP_MAX = Number(process.env.THRESH_LCP_MS || 3000);
const CLS_MAX = Number(process.env.THRESH_CLS || 0.1);
const INP_MAX = Number(process.env.THRESH_INP_MS || 200);
const TBT_MAX = Number(process.env.THRESH_TBT_MS || 250);
const FORCE_INP = process.env.FORCE_INP === '1';
const TYPES_MIN = Number(process.env.MIN_STRUCT_TYPES || 4);
const MIN_PERF = Number(process.env.MIN_PERF_SCORE || 0.8);
const MIN_A11Y = Number(process.env.MIN_A11Y_SCORE || 0.9);
const MIN_SEO = Number(process.env.MIN_SEO_SCORE || 0.9);
// Profile Support (preview vs prod) – erlaubt alternative Schwellen
const PROFILE = process.env.PROFILE || '';
function profOverride(base, envName){
  if(!PROFILE) return base;
  const key = envName + '_' + PROFILE.toUpperCase();
  if(process.env[key] != null) return Number(process.env[key]);
  return base;
}
const LCP_MAX_E = profOverride(LCP_MAX,'THRESH_LCP_MS');
const CLS_MAX_E = profOverride(CLS_MAX,'THRESH_CLS');
const INP_MAX_E = profOverride(INP_MAX,'THRESH_INP_MS');
const TBT_MAX_E = profOverride(TBT_MAX,'THRESH_TBT_MS');
const MIN_PERF_E = profOverride(MIN_PERF,'MIN_PERF_SCORE');
const MIN_A11Y_E = profOverride(MIN_A11Y,'MIN_A11Y_SCORE');
const MIN_SEO_E = profOverride(MIN_SEO,'MIN_SEO_SCORE');
const USE_RUM = process.env.USE_RUM === '1';
const RUM_FILE = path.resolve('docs','rum-summary.json');
const RUM_LCP_P75 = Number(process.env.RUM_LCP_P75_MS || 2500);
const RUM_INP_P75 = Number(process.env.RUM_INP_P75_MS || 200);
const RUM_CLS_P75 = Number(process.env.RUM_CLS_P75 || 0.1);
const RUM_TTFB_P75 = Number(process.env.RUM_TTFB_P75_MS || 600);

const issues = [];
const warnings = [];
const OUT_FILE = path.resolve('docs','threshold-result.json');

function writeResult(exitCode, explicitStatus){
  const status = explicitStatus || (exitCode === 0 ? (warnings.length? 'WARN':'PASS') : (exitCode === 1 ? 'WARN':'FAIL'));
  const payload = {
    timestamp: new Date().toISOString(),
    status,
    exitCode,
    gateMode: GATE_MODE,
    profile: PROFILE || null,
    issues: [...issues],
    warnings: [...warnings],
    thresholds: {
      LCP_MAX: LCP_MAX_E,
      CLS_MAX: CLS_MAX_E,
      INP_MAX: INP_MAX_E,
      TBT_MAX: TBT_MAX_E,
      MIN_PERF: MIN_PERF_E,
      MIN_A11Y: MIN_A11Y_E,
      MIN_SEO: MIN_SEO_E,
      rum: USE_RUM ? {
        LCP_P75: RUM_LCP_P75,
        INP_P75: RUM_INP_P75,
        CLS_P75: RUM_CLS_P75,
        TTFB_P75: RUM_TTFB_P75
      } : null
    },
    coverage: { uniqueTypes: coverageTypes.length }
  };
  try { fs.writeFileSync(OUT_FILE, JSON.stringify(payload,null,2)); } catch(e){ /* ignore */ }
  return exitCode;
}

// Structured Data Coverage
const coverageTypes = data.coverage?.uniqueTypes || [];
if(coverageTypes.length < TYPES_MIN){
  issues.push(`Structured Data Typen zu gering (${coverageTypes.length} < ${TYPES_MIN})`);
}

// Lighthouse Metrics
const lh = data.lighthouse;
if(!lh){
  warnings.push('Kein Lighthouse Report gefunden – nur Warnung.');
} else {
  // Unterstützt sowohl Einzel- als auch Aggregatformat
  const lcp = lh.lcp ?? lh.avgLcp;
  const cls = lh.cls ?? lh.avgCls;
  const inp = lh.inp ?? lh.avgInp;
  const tbt = lh.avgTbt ?? lh.tbt;
  const perf = lh.performanceScore ?? lh.avgPerf;
  const a11y = lh.avgA11y; // nur verfügbar bei Aggregat
  const seo = lh.avgSeo;   // nur verfügbar bei Aggregat
  if (lcp != null && lcp > LCP_MAX_E) issues.push(`LCP ${lcp.toFixed ? lcp.toFixed(0):lcp}ms > ${LCP_MAX_E}ms`);
  if (cls != null && cls > CLS_MAX_E) issues.push(`CLS ${cls} > ${CLS_MAX_E}`);
  if (tbt != null && tbt > TBT_MAX_E) issues.push(`TBT ${tbt.toFixed ? tbt.toFixed(0):tbt}ms > ${TBT_MAX_E}ms`);
  if (inp != null && inp > INP_MAX_E) {
    if (FORCE_INP) issues.push(`INP ${inp.toFixed ? inp.toFixed(0):inp}ms > ${INP_MAX_E}ms`);
    else warnings.push(`INP ${inp.toFixed ? inp.toFixed(0):inp}ms > ${INP_MAX_E}ms (nur Warnung – FORCE_INP=1 für Hard Fail)`);
  }
  if (perf != null && perf < MIN_PERF_E) issues.push(`Performance Score ${(perf*100).toFixed(0)} < ${(MIN_PERF_E*100)} Ziel`);
  if (a11y != null && a11y < MIN_A11Y_E) issues.push(`Accessibility Score ${(a11y*100).toFixed(0)} < ${(MIN_A11Y_E*100)} Ziel`);
  if (seo != null && seo < MIN_SEO_E) issues.push(`SEO Score ${(seo*100).toFixed(0)} < ${(MIN_SEO_E*100)} Ziel`);
  if (perf == null) warnings.push('Performance Score fehlt (kein Score oder Aggregat)');
  if (lcp == null) warnings.push('LCP fehlt (Report unvollständig)');
  if (cls == null) warnings.push('CLS fehlt');
  if (inp == null) warnings.push('INP fehlt');
  if (tbt == null) warnings.push('TBT fehlt');
}

// Compliance Mode: soft => niemals Exit 2 für Perf/A11y/SEO Metriken (nur strukturelle Issues), hard => Standard
const GATE_MODE = process.env.GATE_MODE || 'hard';

if(!issues.length && !warnings.length){
  // Optional RUM Checks erst NACH Lab Checks ausführen, um klare Priorisierung zu behalten
  if (USE_RUM) {
    if (fs.existsSync(RUM_FILE)) {
      try {
        const rum = JSON.parse(fs.readFileSync(RUM_FILE,'utf-8'));
        const lcpP75 = rum.metrics?.LCP?.p75;
        const inpP75 = rum.metrics?.INP?.p75;
        const clsP75 = rum.metrics?.CLS?.p75;
  const rumIssues = [];
        if (lcpP75 != null && lcpP75 > RUM_LCP_P75) rumIssues.push(`RUM LCP p75 ${lcpP75.toFixed(0)}ms > ${RUM_LCP_P75}ms`);
        if (inpP75 != null && inpP75 > RUM_INP_P75) rumIssues.push(`RUM INP p75 ${inpP75.toFixed(0)}ms > ${RUM_INP_P75}ms`);
        if (clsP75 != null && clsP75 > RUM_CLS_P75) rumIssues.push(`RUM CLS p75 ${clsP75} > ${RUM_CLS_P75}`);
  const ttfbP75 = rum.metrics?.TTFB?.p75;
  if (ttfbP75 != null && ttfbP75 > RUM_TTFB_P75) rumIssues.push(`RUM TTFB p75 ${ttfbP75.toFixed(0)}ms > ${RUM_TTFB_P75}ms`);
        if (rumIssues.length){
          console.error('❌ threshold: RUM Verstöße');
          rumIssues.forEach(r=> console.error(' -', r));
          process.exit(writeResult(2));
        }
        console.log('✅ threshold: Alle Schwellen (inkl. RUM falls vorhanden) erfüllt.');
        process.exit(writeResult(0));
      } catch (e){
        console.warn('⚠️ RUM Datei fehlerhaft – ignoriere (kein Fail):', e.message);
        console.log('✅ threshold: Alle Schwellen erfüllt.');
        process.exit(writeResult(0));
      }
    } else {
      console.log('ℹ️ threshold: USE_RUM=1 aber keine rum-summary.json – überspringe RUM Checks.');
      console.log('✅ threshold: Alle Schwellen erfüllt.');
      process.exit(writeResult(0));
    }
  }
  console.log('✅ threshold: Alle Schwellen erfüllt.');
  process.exit(writeResult(0));
}

if(issues.length){
  // Wenn Compliance Mode soft und Issues betreffen nur Performance/A11y/SEO -> zu Warnungen herabstufen
  if(GATE_MODE === 'soft'){
    const perfIssuePattern = /^(LCP|CLS|TBT|INP|Performance Score|Accessibility Score|SEO Score)/;
    const structural = issues.filter(i=> !perfIssuePattern.test(i));
    if(structural.length===0){
      structural.forEach(()=>{}); // noop
      warnings.push(...issues);
      issues.length = 0;
    }
  }
}

if(issues.length){
  console.error('❌ threshold: HARTE FEHLER');
  issues.forEach(i=> console.error(' -', i));
  if(warnings.length){
    console.error('⚠️  Zusätzliche Warnungen:');
    warnings.forEach(w=> console.error(' -', w));
  }
  process.exit(writeResult(2));
}

if(warnings.length){
  console.warn('⚠️ threshold: Nur Warnungen (kein harter Fail)');
  warnings.forEach(w=> console.warn(' -', w));
  process.exit(writeResult(1));
}

console.log('✅ threshold: Keine Issues / Warnungen nach Compliance Bewertung');
process.exit(writeResult(0));
