#!/usr/bin/env node
/**
 * SEO / GAIO Orchestrator CLI
 * Usage: node scripts/seo/index.mjs <command>
 * Commands:
 *  dashboard      -> KPI Dashboard
 *  rum            -> RUM Aggregation + Histogram
 *  gaio           -> GAIO Snapshot + Brand + Exposure + Brand History
 *  weekly         -> Vollständiger Weekly Report (inkl. Sparklines wenn vorhanden)
 */
import { execSync } from 'child_process';
import fs from 'fs';

function run(cmd){
  console.log('> '+cmd);
  try { execSync(cmd,{stdio:'inherit'}); } catch(e){ console.error('Fehler bei',cmd); }
}

const arg = process.argv[2];
if(!arg){
  console.log('Verfügbar: dashboard | rum | gaio | weekly');
  process.exit(0);
}

switch(arg){
  case 'dashboard':
    run('node scripts/seo/kpi-dashboard.mjs');
    break;
  case 'rum':
    run('node scripts/seo/rum-aggregate.mjs');
    run('MARKDOWN=1 node scripts/seo/rum-histogram.mjs');
      run('node scripts/seo/rum-url-aggregate.mjs');
      run('node scripts/seo/rum-outliers.mjs || true');
    break;
  case 'gaio':
    run('node scripts/seo/gaio-check.mjs > docs/gaio-snapshot.json');
    run('node scripts/seo/gaio-brand-mention.mjs > docs/gaio-brand-mention.json');
    run('node scripts/seo/brand-history.mjs');
    run('node scripts/seo/gaio-exposure-index.mjs');
      run('node scripts/seo/gaio-exposure-history.mjs || true');
    break;
  case 'weekly':
    run('node scripts/seo/index.mjs dashboard');
    run('node scripts/seo/index.mjs rum');
    run('node scripts/seo/index.mjs gaio');
    run('node scripts/seo/kpi-sparkline.mjs > docs/kpi-sparklines.md || true');
    run('node scripts/seo/rum-sparkline.mjs > docs/rum-sparklines.md || true');
    run('node scripts/seo/weekly-report.mjs REPORT_OUT=docs/weekly-reports/report-$(date +%Y-%m-%d).md > docs/weekly-report-latest.md');
    run('node scripts/seo/md-to-html.mjs docs/weekly-report-latest.md > docs/weekly-report-latest.html');
  run('node scripts/seo/build-seo-dashboard.mjs');
  run('node scripts/seo/slack-anomalies.mjs || true');
  run('node scripts/seo/slack-outliers.mjs || true');
    break;
  default:
    console.log('Unbekanntes Kommando');
}
