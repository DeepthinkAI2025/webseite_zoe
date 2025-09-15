#!/usr/bin/env node
/**
 * City Performance Ranking
 * Liest aktuelle `docs/city-perf.json` oder History (`--history docs/city-perf-history.json`)
 * und erzeugt Ranking nach LCP & Performance Score.
 *
 * Usage:
 *   node scripts/seo/city-perf-ranking.mjs --perf docs/city-perf.json --out docs/city-perf-ranking.json
 *   node scripts/seo/city-perf-ranking.mjs --history docs/city-perf-history.json --out docs/city-perf-ranking.json
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){
  const a = process.argv.slice(2); const o = {}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o;
}
const argv = parseArgs();
const perfFile = argv.perf || 'docs/city-perf.json';
const historyFile = argv.history; // optional
const outFile = argv.out || 'docs/city-perf-ranking.json';

let snapshot = [];
if(historyFile && fs.existsSync(historyFile)){
  try {
    const history = JSON.parse(fs.readFileSync(historyFile,'utf-8'));
    if(Array.isArray(history) && history.length){
      snapshot = history[history.length - 1].results;
    }
  } catch(e){ /* fallback below */ }
}
if(snapshot.length === 0){
  if(!fs.existsSync(perfFile)){
    console.error('No performance data found.');
    process.exit(1);
  }
  snapshot = JSON.parse(fs.readFileSync(perfFile,'utf-8'));
}

// Filter errors
snapshot = snapshot.filter(r => !r.error);

// Rankings (Basis)
const lcpRank = [...snapshot].sort((a,b) => (a.lcpMs ?? Infinity) - (b.lcpMs ?? Infinity));
const scoreRank = [...snapshot].sort((a,b) => (b.performanceScore ?? 0) - (a.performanceScore ?? 0));

// Optional Composite Score: gewichtete Normalisierung aus LCP, INP, CLS, TBT
// Flags: --composite (aktiviert)
//   --wLcp 0.4 --wInp 0.3 --wCls 0.15 --wTbt 0.15 (Default Gewichte)
// Normalisierung:
//   LCP (ms) invertiert gegen 4000ms Cap
//   INP (ms) invertiert gegen 400ms Cap
//   CLS invertiert 0..0.3
//   TBT (ms) invertiert gegen 600ms Cap.
let compositeRank = [];
let compositeConfig = null;
if(argv.composite){
  const wLcp = Number(argv.wLcp || 0.4);
  const wInp = Number(argv.wInp || 0.3);
  const wCls = Number(argv.wCls || 0.15);
  const wTbt = Number(argv.wTbt || 0.15);
  const total = wLcp + wInp + wCls + wTbt;
  const norm = (v,min,max) => {
    if(v == null) return 0; const clamped = Math.min(Math.max(v,min), max); return 1 - ((clamped - min)/(max-min));
  };
  compositeConfig = { enabled: true, weights:{ wLcp, wInp, wCls, wTbt, normalized: total }, caps:{ lcpMs:4000, inpMs:400, cls:0.3, tbtMs:600 } };
  compositeRank = snapshot.map(r => {
    const nLcp = norm(r.lcpMs ?? 4000, 0, 4000);
    const nInp = norm(r.inpMs ?? 400, 0, 400);
    const nCls = norm(r.cls ?? 0.3, 0, 0.3);
    const nTbt = norm(r.tbtMs ?? 600, 0, 600);
    const compositeScore = (nLcp * wLcp) + (nInp * wInp) + (nCls * wCls) + (nTbt * wTbt);
    return { ...r, compositeScore };
  }).sort((a,b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0));
}

function withPosition(list, key){
  return list.map((r,i) => ({ position: i+1, slug: r.slug, url: r.url, [key]: r[key], lcpMs: r.lcpMs, performanceScore: r.performanceScore }));
}

const result = {
  generatedAt: new Date().toISOString(),
  source: historyFile && fs.existsSync(historyFile) ? 'history-latest' : 'snapshot',
  lcpRanking: withPosition(lcpRank, 'lcpMs'),
  performanceScoreRanking: withPosition(scoreRank, 'performanceScore'),
  composite: compositeConfig ? {
    config: compositeConfig,
    ranking: compositeRank.map((r,i) => ({ position: i+1, slug: r.slug, url: r.url, compositeScore: Number(r.compositeScore?.toFixed(4)), lcpMs: r.lcpMs, inpMs: r.inpMs, cls: r.cls, tbtMs: r.tbtMs, performanceScore: r.performanceScore }))
  } : null
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log('Wrote ranking', outFile);

// Optional Markdown
if(argv.markdown){
  const mdFile = outFile.replace(/\.json$/, '.md');
  const sections = [
    '# City Performance Ranking',
    '',
    `Generated: ${result.generatedAt}`,
    '',
    '## LCP (niedriger besser)',
    '',
    '| Pos | City | LCP ms | Score |',
    '|-----|------|--------|-------|',
    ...result.lcpRanking.map(r => `| ${r.position} | ${r.slug} | ${Math.round(r.lcpMs ?? 0)} | ${(r.performanceScore ?? 0).toFixed(2)} |`),
    '',
    '## Performance Score (höher besser)',
    '',
    '| Pos | City | Score | LCP ms |',
    '|-----|------|-------|--------|',
    ...result.performanceScoreRanking.map(r => `| ${r.position} | ${r.slug} | ${(r.performanceScore ?? 0).toFixed(2)} | ${Math.round(r.lcpMs ?? 0)} |`)
  ];
  if(result.composite){
    sections.push('', '## Composite Score (konfigurierbar)', '', `Gewichte: LCP=${result.composite.config.weights.wLcp}, INP=${result.composite.config.weights.wInp}, CLS=${result.composite.config.weights.wCls}, TBT=${result.composite.config.weights.wTbt}`, '', '| Pos | City | Composite | LCP ms | INP ms | CLS | TBT ms | Perf Score |', '|-----|------|-----------|--------|--------|-----|--------|------------|');
    sections.push(...result.composite.ranking.map(r => `| ${r.position} | ${r.slug} | ${r.compositeScore.toFixed(4)} | ${Math.round(r.lcpMs ?? 0)} | ${Math.round(r.inpMs ?? 0)} | ${(r.cls ?? 0).toFixed(3)} | ${Math.round(r.tbtMs ?? 0)} | ${(r.performanceScore ?? 0).toFixed(2)} |`));
  }
  const md = sections.join('\n');
  fs.writeFileSync(mdFile, md);
  console.log('Wrote markdown ranking', mdFile);
}
