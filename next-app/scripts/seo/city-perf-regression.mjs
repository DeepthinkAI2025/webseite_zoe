#!/usr/bin/env node
/**
 * City Performance Regression Detector
 * Vergleicht letzten vs. vorletzten History Eintrag und meldet Regressions (delta LCP > Threshold).
 * Optional Slack Webhook Alert.
 *
 * Usage:
 *   node scripts/seo/city-perf-regression.mjs --history docs/city-perf-history.json --threshold 300 \
 *       --out docs/city-perf-regressions.json --slack $SLACK_WEBHOOK_URL
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();
const historyFile = argv.history || 'docs/city-perf-history.json';
const outFile = argv.out || 'docs/city-perf-regressions.json';
const threshold = Number(argv.threshold || 300); // LCP ms
const inpThreshold = argv.inpThreshold ? Number(argv.inpThreshold) : null; // optional INP ms
const slackWebhook = argv.slack || process.env.SLACK_WEBHOOK_URL;

if(!fs.existsSync(historyFile)){
  console.error('History file not found:', historyFile); process.exit(1);
}
let history = [];
try { history = JSON.parse(fs.readFileSync(historyFile,'utf-8')); } catch(e){ console.error('Failed to parse history', e); process.exit(1); }
if(!Array.isArray(history) || history.length < 2){
  console.log('Not enough history entries (need >=2).'); process.exit(0);
}
const current = history[history.length - 1].results || [];
const prev = history[history.length - 2].results || [];
const prevMap = Object.fromEntries(prev.map(r => [r.slug, r]));

const regressions = [];
const inpRegressions = [];
for(const cur of current){
  if(cur.error) continue;
  const p = prevMap[cur.slug];
  if(!p || p.error) continue;
  const deltaLcp = (cur.lcpMs ?? 0) - (p.lcpMs ?? 0);
  if(deltaLcp > threshold){
    regressions.push({ slug: cur.slug, prevLcp: p.lcpMs, curLcp: cur.lcpMs, deltaLcp });
  }
  if(inpThreshold != null){
    const deltaInp = (cur.inpMs ?? 0) - (p.inpMs ?? 0);
    if(deltaInp > inpThreshold){
      inpRegressions.push({ slug: cur.slug, prevInp: p.inpMs, curInp: cur.inpMs, deltaInp });
    }
  }
}

const payload = {
  generatedAt: new Date().toISOString(),
  thresholdMs: threshold,
  regressions,
  inpThresholdMs: inpThreshold,
  inpRegressions,
  count: regressions.length,
  inpCount: inpRegressions.length
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
console.log('Wrote', outFile, 'regressions:', regressions.length);

if(slackWebhook && (regressions.length || inpRegressions.length)){
  let text = '';
  if(regressions.length){
    text += `*City LCP Regressions* (>${threshold}ms)\n` + regressions.map(r => `• ${r.slug}: +${Math.round(r.deltaLcp)}ms (was ${Math.round(r.prevLcp)} → ${Math.round(r.curLcp)})`).join('\n');
  }
  if(inpRegressions.length){
    if(text) text += '\n\n';
    text += `*City INP Regressions* (>${inpThreshold}ms)\n` + inpRegressions.map(r => `• ${r.slug}: +${Math.round(r.deltaInp)}ms (was ${Math.round(r.prevInp)} → ${Math.round(r.curInp)})`).join('\n');
  }
  try {
    const url = new URL(slackWebhook);
    const data = JSON.stringify({ text });
    const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'POST', headers: { 'Content-Type':'application/json', 'Content-Length': Buffer.byteLength(data) }}, res => { res.resume(); });
    req.on('error', e => console.warn('Slack post failed', e));
    req.write(data); req.end();
    console.log('Posted Slack alert');
  } catch(e){ console.warn('Slack webhook error', e); }
}
