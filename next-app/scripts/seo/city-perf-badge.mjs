#!/usr/bin/env node
/**
 * City Performance Badge Generator
 * Liest Ranking Datei (mit optionalem Composite Abschnitt) und erzeugt eine einfache
 * Markdown Badge Zeile + JSON für weitere Nutzung.
 *
 * Usage:
 *   node scripts/seo/city-perf-badge.mjs --ranking docs/city-perf-ranking.json --out docs/city-perf-badge.json
 *   Flags:
 *     --metric composite   (default falls vorhanden, sonst lcp)
 *     --metric lcp
 *     --metric perfScore
 *
 * Output JSON Struktur:
 * {
 *   generatedAt, metric, top: { slug, value }, markdownBadge
 * }
 *
 * Badge Prinzip:
 *  - Composite: Wert *100 gerundet als Score (0-100)
 *  - LCP: ms (je niedriger desto besser) -> invertierte Darstellung: "LCP <value>ms"
 *  - perfScore: 0-1 → Prozent
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();
const rankingFile = argv.ranking || 'docs/city-perf-ranking.json';
const outFile = argv.out || 'docs/city-perf-badge.json';
let metric = argv.metric; // composite | lcp | perfScore

if(!fs.existsSync(rankingFile)){
  console.error('Ranking file missing'); process.exit(1);
}
const ranking = JSON.parse(fs.readFileSync(rankingFile,'utf-8'));

// Metric Auswahl Logik
if(!metric){
  metric = ranking.composite ? 'composite' : 'lcp';
}
if(!['composite','lcp','perfScore'].includes(metric)){
  console.error('Unsupported metric', metric); process.exit(1);
}

let top = null;
if(metric === 'composite'){
  if(!ranking.composite){ console.error('Composite not present in ranking'); process.exit(1); }
  top = ranking.composite.ranking[0];
} else if(metric === 'lcp') {
  top = ranking.lcpRanking[0];
} else if(metric === 'perfScore') {
  top = ranking.performanceScoreRanking[0];
}
if(!top){ console.error('No top entry found'); process.exit(1); }

let badgeLabel = '';
let badgeValue = '';
if(metric === 'composite'){
  badgeLabel = 'city%20composite';
  badgeValue = (top.compositeScore * 100).toFixed(0);
} else if(metric === 'lcp') {
  badgeLabel = 'city%20lcp';
  badgeValue = Math.round(top.lcpMs).toString();
} else if(metric === 'perfScore') {
  badgeLabel = 'city%20perf';
  badgeValue = (top.performanceScore * 100).toFixed(0);
}

// Farbskalen simpel
function color(metric,value){
  if(metric === 'lcp'){
    if(value < 1800) return 'brightgreen';
    if(value < 2500) return 'yellow';
    return 'orange';
  }
  // composite / perfScore (0..100)
  const v = Number(value);
  if(v >= 90) return 'brightgreen';
  if(v >= 75) return 'green';
  if(v >= 60) return 'yellow';
  return 'orange';
}
const col = color(metric,badgeValue);
const markdownBadge = `![Top City ${metric}]` + `(https://img.shields.io/badge/${badgeLabel}-${encodeURIComponent(badgeValue)}-${col})`;

const payload = {
  generatedAt: new Date().toISOString(),
  metric,
  top: {
    slug: top.slug,
    value: metric === 'lcp' ? top.lcpMs : (metric === 'composite' ? top.compositeScore : top.performanceScore)
  },
  markdownBadge
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload,null,2));
console.log('Badge JSON geschrieben:', outFile);

// Optional zusätzlich Markdown Datei
if(argv.markdown){
  const mdFile = outFile.replace(/\.json$/, '.md');
  const lines = [
    '# City Performance Badge',
    '',
    markdownBadge,
    '',
    `Metric: ${metric}`,
    `Top City: ${payload.top.slug}`,
    ''
  ];
  fs.writeFileSync(mdFile, lines.join('\n'));
  console.log('Badge Markdown geschrieben:', mdFile);
}
