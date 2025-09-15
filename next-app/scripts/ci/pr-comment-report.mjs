#!/usr/bin/env node
/**
 * PR Kommentar Report Generator
 * Aggregiert vorhandene Artefakte (wenn vorhanden):
 *  - A11y Smoke Ergebnis (simuliert via a11y-smoke stdout JSON? -> TODO: zukünftig JSON persistieren)
 *  - Lighthouse Gate Metriken: next-app/docs/lighthouse-perf-metrics.json (falls generiert)
 *  - KPI Dashboard: next-app/docs/seo-kpi-dashboard.json
 *  - Structured Data Coverage: extrahiert aus seo-kpi-dashboard.json falls Felder vorhanden
 * Output Markdown nach STDOUT (für gh api / create-comment Nutzung) & schreibt optional Datei.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'next-app');
const DOCS = path.join(ROOT, 'docs');
const OUT_FILE = process.env.PR_COMMENT_OUT || path.join(DOCS, 'pr-comment-report.md');

async function readJsonOptional(p){
  try { return JSON.parse(await fs.readFile(p,'utf-8')); } catch { return null; }
}

async function main(){
  const kpi = await readJsonOptional(path.join(DOCS,'seo-kpi-dashboard.json'));
  const lh = await readJsonOptional(path.join(DOCS,'lighthouse-perf-metrics.json'));
  const threshold = await readJsonOptional(path.join(DOCS,'threshold-result.json'));
  const lines = [];
  lines.push('# CI Qualitätsbericht');
  lines.push('');
  // Lighthouse
  if(lh){
    lines.push('## Lighthouse');
    const cats = lh.categories || lh.scores || lh;
    const fmt = (v)=> v==null?'-': (v>1? (v/100).toFixed(2) : Number(v).toFixed(2));
    if(cats.performance || cats.accessibility || cats.seo){
      lines.push('| Kategorie | Score |');
      lines.push('|-----------|-------|');
      if(cats.performance) lines.push(`| Performance | ${fmt(cats.performance)} |`);
      if(cats.accessibility) lines.push(`| Accessibility | ${fmt(cats.accessibility)} |`);
      if(cats.seo) lines.push(`| SEO | ${fmt(cats.seo)} |`);
      lines.push('');
    }
  }
  if(threshold){
    lines.push('## Threshold Gate');
    lines.push(`Status: **${threshold.status}**  (ExitCode ${threshold.exitCode})`);
    if(threshold.issues?.length){
      lines.push('### Issues');
      for(const i of threshold.issues.slice(0,25)) lines.push(`- ${i}`);
    }
    if(threshold.warnings?.length){
      lines.push('### Warnings');
      for(const w of threshold.warnings.slice(0,25)) lines.push(`- ${w}`);
    }
    lines.push('');
  }
  if(kpi){
    lines.push('## KPI Dashboard (Auszug)');
    if(kpi.avgPerf || kpi.avgSeo || kpi.avgA11y){
      lines.push('| Metrik | Wert |');
      lines.push('|--------|------|');
      if(kpi.avgPerf) lines.push(`| Avg Perf | ${kpi.avgPerf.toFixed(2)} |`);
      if(kpi.avgA11y) lines.push(`| Avg A11y | ${kpi.avgA11y.toFixed(2)} |`);
      if(kpi.avgSeo) lines.push(`| Avg SEO | ${kpi.avgSeo.toFixed(2)} |`);
      lines.push('');
    }
    if(kpi.coverageTypes){
      lines.push(`Structured Data Types: **${kpi.coverageTypes}**`);
      lines.push('');
    }
  }
  lines.push('_(Automatisch generiert)_');
  const md = lines.join('\n');
  await fs.writeFile(OUT_FILE, md);
  process.stdout.write(md + '\n');
}

main().catch(e=>{ console.error(e); process.exit(1); });
