#!/usr/bin/env node
/**
 * slack-anomalies.mjs
 * Sendet Slack Nachricht nur wenn im Weekly Report Anomalien erkannt wurden.
 * Erwartet: docs/weekly-history.json (mind. 2 Einträge) & optional docs/weekly-report-latest.md
 * Env:
 *  - SLACK_WEBHOOK (Pflicht)
 *  - ANOMALY_PCT (optional, Default 10)
 */
import fs from 'fs';
import https from 'https';
import path from 'path';

const webhook = process.env.SLACK_WEBHOOK;
if(!webhook){
  console.error('[slack-anomalies] SLACK_WEBHOOK fehlt – Abbruch.');
  process.exit(0);
}
const histFile = path.resolve('docs','weekly-history.json');
const SUPPRESS_MIN = parseInt(process.env.SUPPRESS_MINUTES||'0',10);
const cacheFile = path.resolve('docs','alert-cache.json');
if(!fs.existsSync(histFile)){
  console.error('[slack-anomalies] weekly-history.json fehlt – keine Anomalieprüfung.');
  process.exit(0);
}
let history; try { history = JSON.parse(fs.readFileSync(histFile,'utf8')); } catch { history = []; }
if(!Array.isArray(history) || history.length < 2){
  console.log('[slack-anomalies] Zu wenig History für Anomalien.');
  process.exit(0);
}
const curr = history[history.length-1];
const prev = history[history.length-2];
const ANOM_PCT = Number(process.env.ANOMALY_PCT || 10);
const anomalies = [];
function check(label, a, b, higherIsBetter){
  if(a==null||b==null||typeof a!=='number'||typeof b!=='number'||b===0) return;
  const diff = a - b; const pct = (diff/b)*100;
  if(higherIsBetter){
    if(pct < -ANOM_PCT) anomalies.push(`${label}: -${Math.abs(pct).toFixed(1)}%`);
  } else {
    if(pct > ANOM_PCT) anomalies.push(`${label}: +${pct.toFixed(1)}%`);
  }
}
check('LCP avg', curr.lcp_avg, prev.lcp_avg, false);
check('INP avg', curr.inp_avg, prev.inp_avg, false);
check('RUM LCP p75', curr.rum_lcp_p75, prev.rum_lcp_p75, false);
check('Perf Score', curr.perf, prev.perf, true);
check('A11y Score', curr.a11y, prev.a11y, true);
check('SEO Score', curr.seo, prev.seo, true);
check('Brand Anteil', curr.brand_ratio, prev.brand_ratio, true);
check('Exposure Index', curr.exposure_index, prev.exposure_index, true);
if(!anomalies.length){
  console.log('[slack-anomalies] Keine Anomalien >', ANOM_PCT,'%');
  process.exit(0);
}
let reportSnippet='';
const reportFile = path.resolve('docs','weekly-report-latest.md');
if(fs.existsSync(reportFile)){
  try { reportSnippet = fs.readFileSync(reportFile,'utf8').split('\n').slice(0,40).join('\n'); } catch{}
}
const text = `*Anomalien (> ${ANOM_PCT}% Verschlechterung)*\n` + anomalies.map(a=>`• ${a}`).join('\n') + (reportSnippet?`\n\n_Auszug:_\n${reportSnippet}`:'');

function shouldSuppress(kind, content){
  if(!SUPPRESS_MIN) return false;
  let cache={}; try { cache = JSON.parse(fs.readFileSync(cacheFile,'utf8')); } catch{}
  const key = kind+':'+Buffer.from(content).toString('base64').slice(0,40);
  const now = Date.now();
  const prev = cache[key];
  if(prev && (now - prev) < SUPPRESS_MIN*60*1000){
    console.log('[slack-anomalies] Suppressed duplicate alert (', kind, ') innerhalb', SUPPRESS_MIN,'Minuten');
    return true;
  }
  cache[key] = now;
  try { fs.writeFileSync(cacheFile, JSON.stringify(cache,null,2)); } catch{}
  return false;
}
if(shouldSuppress('anomalies', text)) process.exit(0);

function post(url, payload){
  return new Promise((resolve,reject)=>{
    const data = JSON.stringify(payload);
    const u = new URL(url);
    const opt = {method:'POST', hostname:u.hostname, path:u.pathname+u.search, headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};
    const req = https.request(opt,res=>{res.on('data',()=>{});res.on('end',()=> resolve(res.statusCode));});
    req.on('error',reject); req.write(data); req.end();
  });
}
post(webhook,{text}).then(code=>{
  console.log('[slack-anomalies] Slack Response', code);
}).catch(e=>{
  console.error('[slack-anomalies] Fehler', e.message);
});
