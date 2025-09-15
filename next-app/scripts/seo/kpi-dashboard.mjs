#!/usr/bin/env node
/**
 * KPI Dashboard Aggregator
 * Sammelt:
 *  - Letzten Lighthouse Fallback/Baseline Report (docs/lighthouse-baseline-*.json | fallback)
 *  - Structured Data Typen je Seite (ein einfacher Fetch der Start- & Pricing-Seite)
 *  - Generiert docs/seo-kpi-dashboard.json & optional Markdown Summary
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const DOCS_DIR = path.join(ROOT, 'docs');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

function findLatestLhReport() {
  const current = path.join(DOCS_DIR,'lighthouse-baseline-current.json');
  if (fs.existsSync(current)) {
    try { return JSON.parse(fs.readFileSync(current,'utf-8')); } catch {/* fallback */}
  }
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.startsWith('lighthouse-baseline') && f.endsWith('.json'));
  if (!files.length) return null;
  const sorted = files.map(f => ({ f, t: fs.statSync(path.join(DOCS_DIR,f)).mtimeMs }))
    .sort((a,b)=> b.t - a.t);
  for (const cand of sorted) {
    try { return JSON.parse(fs.readFileSync(path.join(DOCS_DIR, cand.f), 'utf-8')); } catch {/* try next */}
  }
  return null;
}

function healJson(raw){
  return raw.replace(/<!--.*?-->/gs,'').trim();
}

async function extractStructuredData(url){
  try {
    const res = await fetch(url, { headers:{ 'User-Agent':'KPI-Dashboard/1.0' }});
    const html = await res.text();
    const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=> healJson(m[1]));
    const types = new Set();
    const errors = [];
    scripts.forEach(raw => {
      try {
        const json = JSON.parse(raw.trim());
        const collect = (j)=>{ if(j && j['@type']) types.add(j['@type']); };
        if (Array.isArray(json)) json.forEach(collect); else collect(json);
        // Deep extraction for arrays
        if (json && typeof json === 'object') {
          if (Array.isArray(json.itemListElement)) json.itemListElement.forEach(collect);
          if (Array.isArray(json.mainEntity)) json.mainEntity.forEach(collect);
        }
      } catch (e) { errors.push(e.message); }
    });
    return { url, count: scripts.length, types:[...types].sort(), errors };
  } catch (e) {
    return { url, error: e.message };
  }
}

async function main(){
  const base = process.env.KPI_BASE || 'http://localhost:3000';
  const pages = ['/', '/pricing', '/contact', '/technology', '/projects', '/why-us'];
  const struct = [];
  for (const p of pages) {
    struct.push(await extractStructuredData(base + p));
  }

  const lh = findLatestLhReport();
  let metricSummary = null;
  let pageMetrics = [];
  if (lh) {
    if (Array.isArray(lh.pages)) {
      pageMetrics = lh.pages.map(p => ({
        path: p.path,
        lcp: p.summary?.metrics?.lcp ?? null,
        cls: p.summary?.metrics?.cls ?? null,
        tbt: p.summary?.metrics?.tbt ?? null,
        inp: p.summary?.metrics?.interactive ?? null,
        performance: p.summary?.performance ?? null,
        accessibility: p.summary?.accessibility ?? null,
        seo: p.summary?.seo ?? null
      }));
      const avg = (arr)=> arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
      metricSummary = {
        source: 'lighthouse-baseline',
        pageCount: pageMetrics.length,
        avgLcp: avg(pageMetrics.map(m=>m.lcp).filter(v=>typeof v==='number')),
        avgCls: avg(pageMetrics.map(m=>m.cls).filter(v=>typeof v==='number')),
        avgInp: avg(pageMetrics.map(m=>m.inp).filter(v=>typeof v==='number')),
        avgTbt: avg(pageMetrics.map(m=>m.tbt).filter(v=>typeof v==='number')),
        avgPerf: avg(pageMetrics.map(m=>m.performance).filter(v=>typeof v==='number')),
        avgSeo: avg(pageMetrics.map(m=>m.seo).filter(v=>typeof v==='number')),
        avgA11y: avg(pageMetrics.map(m=>m.accessibility).filter(v=>typeof v==='number'))
      };
    } else {
      metricSummary = {
        source: 'lighthouse-baseline',
        warning: lh.warning,
        performanceScore: lh.categories?.performance?.score ?? null,
        lcp: lh.audits?.['largest-contentful-paint']?.numericValue,
        cls: lh.audits?.['cumulative-layout-shift']?.numericValue,
        inp: lh.audits?.['interactive']?.numericValue || lh.audits?.['total-blocking-time']?.numericValue,
      };
    }
  }

  const dashboard = {
    generatedAt: new Date().toISOString(),
    base,
    structuredData: struct,
    lighthouse: metricSummary,
    lighthousePages: pageMetrics,
    coverage: {
      uniqueTypes: [...new Set(struct.flatMap(s => s.types || []))].sort(),
      pageCount: struct.length
    }
  };

  const outJson = path.join(DOCS_DIR, 'seo-kpi-dashboard.json');
  fs.writeFileSync(outJson, JSON.stringify(dashboard, null, 2));
  // History Append (optional)
  if (process.env.KPI_HISTORY !== '0') {
    try {
      const histFile = path.join(DOCS_DIR,'kpi-history.json');
      let hist = [];
      if (fs.existsSync(histFile)) {
        try { hist = JSON.parse(fs.readFileSync(histFile,'utf-8')); if(!Array.isArray(hist)) hist = []; } catch {/* reset */}
      }
      hist.push({
        generatedAt: dashboard.generatedAt,
        coverageTypes: dashboard.coverage.uniqueTypes.length,
        types: dashboard.coverage.uniqueTypes,
        avgLcp: dashboard.lighthouse?.avgLcp ?? dashboard.lighthouse?.lcp ?? null,
        avgCls: dashboard.lighthouse?.avgCls ?? dashboard.lighthouse?.cls ?? null,
        avgInp: dashboard.lighthouse?.avgInp ?? dashboard.lighthouse?.inp ?? null,
        avgPerf: dashboard.lighthouse?.avgPerf ?? dashboard.lighthouse?.performanceScore ?? null,
        avgSeo: dashboard.lighthouse?.avgSeo ?? null,
        avgA11y: dashboard.lighthouse?.avgA11y ?? null
      });
      // Begrenzen (Memory) – nur letzte 200 Einträge
      if (hist.length > 200) hist = hist.slice(-200);
      fs.writeFileSync(histFile, JSON.stringify(hist,null,2));
      console.log('[kpi] History appended (', hist.length, 'records )');
    } catch (e) {
      console.warn('[kpi] History append Fehler:', e.message);
    }
  }
  const md = [
    `# SEO KPI Dashboard`,
    `Generiert: ${dashboard.generatedAt}`,
    `\n## Structured Data Coverage`,
    `Einzigartige Typen: ${dashboard.coverage.uniqueTypes.join(', ') || '–'}`,
    ...struct.map(s => `- ${s.url}: ${s.types?.join(', ') || 'Fehler'}${s.errors?.length? ' (Errors '+s.errors.length+')':''}`),
    `\n## Lighthouse (Baseline/Fallback)`,
    metricSummary ? (
      metricSummary.avgPerf != null
  ? `Durchschnitt Performance: ${(metricSummary.avgPerf*100).toFixed(0)}\nDurchschnitt LCP: ${metricSummary.avgLcp?.toFixed(0) ?? '–'} ms\nDurchschnitt CLS: ${metricSummary.avgCls?.toFixed(3) ?? '–'}\nDurchschnitt INP: ${metricSummary.avgInp?.toFixed(0) ?? '–'} ms\nDurchschnitt TBT: ${metricSummary.avgTbt?.toFixed(0) ?? '–'} ms`
        : `Performance Score: ${metricSummary.performanceScore ?? '–'}\nLCP: ${metricSummary.lcp ?? '–'} ms\nCLS: ${metricSummary.cls ?? '–'}\nINP/TBT Proxy: ${metricSummary.inp ?? '–'}`
    ) : 'Kein Report gefunden',
  ...(pageMetrics.length ? ['\n### Seitenmetriken', ...pageMetrics.map(pm=>`- ${pm.path}: LCP ${pm.lcp!=null?pm.lcp.toFixed(0):'–'}ms | CLS ${pm.cls ?? '–'} | INP ${pm.inp!=null?pm.inp.toFixed(0):'–'}ms | TBT ${pm.tbt!=null?pm.tbt.toFixed(0):'–'}ms | Perf ${pm.performance!=null ? (pm.performance*100).toFixed(0):'–'}`)] : [])
  ].join('\n');
  fs.writeFileSync(path.join(DOCS_DIR, 'seo-kpi-dashboard.md'), md);
  console.log('[kpi] Dashboard geschrieben:', outJson);
}

main().catch(e=>{ console.error('[kpi] Fehler:', e); process.exit(1); });
