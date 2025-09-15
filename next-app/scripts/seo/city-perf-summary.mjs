#!/usr/bin/env node
/**
 * City Performance Summary
 * Kombiniert Ranking (`city-perf-ranking.json`) + Regression (`city-perf-regressions.json`)
 * in eine Markdown Übersicht.
 *
 * Usage:
 *  node scripts/seo/city-perf-summary.mjs \
 *    --ranking docs/city-perf-ranking.json \
 *    --regress docs/city-perf-regressions.json \
 *    --out docs/city-perf-summary.md
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();
const rankingFile = argv.ranking || 'docs/city-perf-ranking.json';
const regressFile = argv.regress || 'docs/city-perf-regressions.json';
const outFile = argv.out || 'docs/city-perf-summary.md';

if(!fs.existsSync(rankingFile)){
  console.error('Ranking file missing'); process.exit(1);
}
const ranking = JSON.parse(fs.readFileSync(rankingFile,'utf-8'));
let regress = { regressions: [], thresholdMs: null };
if(fs.existsSync(regressFile)){
  regress = JSON.parse(fs.readFileSync(regressFile,'utf-8'));
}

function table(rows){ return rows.join('\n'); }

const lcpTable = table([
  '| Pos | City | LCP ms | Score |',
  '|-----|------|--------|-------|',
  ...ranking.lcpRanking.map(r => `| ${r.position} | ${r.slug} | ${Math.round(r.lcpMs ?? 0)} | ${(r.performanceScore ?? 0).toFixed(2)} |`)
]);
const scoreTable = table([
  '| Pos | City | Score | LCP ms |',
  '|-----|------|-------|--------|',
  ...ranking.performanceScoreRanking.map(r => `| ${r.position} | ${r.slug} | ${(r.performanceScore ?? 0).toFixed(2)} | ${Math.round(r.lcpMs ?? 0)} |`)
]);

let compositeSection = '';
if(ranking.composite && ranking.composite.ranking){
  const hasInp = ranking.composite.ranking.some(r => r.inpMs != null);
  const header = hasInp ? '| Pos | City | Composite | LCP ms | INP ms | CLS | TBT ms | Perf Score |' : '| Pos | City | Composite | LCP ms | CLS | TBT ms | Perf Score |';
  const sep = hasInp ? '|-----|------|-----------|--------|--------|-----|--------|------------|' : '|-----|------|-----------|--------|-----|--------|------------|';
  const rows = ranking.composite.ranking.map(r => hasInp ? `| ${r.position} | ${r.slug} | ${r.compositeScore.toFixed(4)} | ${Math.round(r.lcpMs ?? 0)} | ${Math.round(r.inpMs ?? 0)} | ${(r.cls ?? 0).toFixed(3)} | ${Math.round(r.tbtMs ?? 0)} | ${(r.performanceScore ?? 0).toFixed(2)} |` : `| ${r.position} | ${r.slug} | ${r.compositeScore.toFixed(4)} | ${Math.round(r.lcpMs ?? 0)} | ${(r.cls ?? 0).toFixed(3)} | ${Math.round(r.tbtMs ?? 0)} | ${(r.performanceScore ?? 0).toFixed(2)} |`);
  compositeSection = [
    '## Composite Score',
    '',
    `Gewichte: LCP=${ranking.composite.config.weights.wLcp}${ranking.composite.config.weights.wInp != null ? `, INP=${ranking.composite.config.weights.wInp}`:''}, CLS=${ranking.composite.config.weights.wCls}, TBT=${ranking.composite.config.weights.wTbt}`,
    '',
    header,
    sep,
    ...rows,
    ''
  ].join('\n');
}

const regressBlock = regress.regressions.length ? (
  ['## Regressions', '', `Threshold: +${regress.thresholdMs} ms`, '', '| City | Δ LCP ms | Vorher | Aktuell |', '|------|----------|--------|---------|', ...regress.regressions.map(r => `| ${r.slug} | +${Math.round(r.deltaLcp)} | ${Math.round(r.prevLcp)} | ${Math.round(r.curLcp)} |`), '']
).join('\n') : '## Regressions\n\nKeine Regressions über Schwellwert.';

const md = [
  '# City Performance Summary',
  '',
  `Generated: ${ranking.generatedAt || new Date().toISOString()}`,
  '',
  '## Ranking – LCP',
  '',
  lcpTable,
  '',
  '## Ranking – Performance Score',
  '',
  scoreTable,
  '',
  regressBlock,
  compositeSection,
  ''
].join('\n');

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, md);
console.log('Wrote summary', outFile);
