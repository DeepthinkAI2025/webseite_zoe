#!/usr/bin/env node
/**
 * slack-outliers.mjs
 * Sendet Slack Alert, falls RUM Outlier Werte definierte Schwellwerte überschreiten.
 * Erwartet vorhandene Datei docs/rum-outliers.json (aus rum-outliers.mjs).
 * Env Variablen:
 *  - SLACK_WEBHOOK_URL (erforderlich)
 *  - OUTLIER_LCP_MS (optional, default 4000)
 *  - OUTLIER_INP_MS (optional, default 500)
 *  - OUTLIER_TOP (optional Anzahl der geprüften Top Werte, default 3)
 *  - DRY_RUN (optional '1' für kein Senden)
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

const webhook = process.env.SLACK_WEBHOOK_URL;
const LCP_THR = parseInt(process.env.OUTLIER_LCP_MS||'4000',10);
const INP_THR = parseInt(process.env.OUTLIER_INP_MS||'500',10);
const TOP = parseInt(process.env.OUTLIER_TOP||'3',10);
const dry = process.env.DRY_RUN === '1';
const SUPPRESS_MIN = parseInt(process.env.SUPPRESS_MINUTES||'0',10); // 0 = keine Unterdrückung
const cacheFile = path.resolve('docs','alert-cache.json');

function readJSON(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; } }
const outliersPath = path.resolve('docs','rum-outliers.json');
const data = readJSON(outliersPath);
if(!data){
  console.log('[slack-outliers] keine rum-outliers.json gefunden, breche ab');
  process.exit(0);
}

function exceeds(list, thr){
  if(!Array.isArray(list) || list.length===0) return [];
  return list.slice(0,TOP).filter(o=> typeof o.value === 'number' && o.value > thr);
}

const lcpBad = exceeds(data.lcp, LCP_THR);
const inpBad = exceeds(data.inp, INP_THR);

if(lcpBad.length===0 && inpBad.length===0){
  console.log('[slack-outliers] keine kritischen Outliers über Schwellwerten');
  process.exit(0);
}

if(!webhook){
  console.error('[slack-outliers] SLACK_WEBHOOK_URL fehlt — kann Alert nicht senden');
  process.exit(1);
}

function formatList(label, arr, unit='ms'){
  if(!arr.length) return `${label}: ok`;
  return `${label}: ` + arr.map(o=>`${Math.round(o.value)}${unit}${o.url? ' '+o.url:''}`).join(', ');
}

const text = `RUM Outlier Alert\n${formatList('LCP', lcpBad)}\n${formatList('INP', inpBad)}`;

// Suppression Mechanismus: Hash aus Text + Typ
function shouldSuppress(kind, content){
  if(!SUPPRESS_MIN) return false;
  let cache={}; try { cache = JSON.parse(fs.readFileSync(cacheFile,'utf8')); } catch{}
  const key = kind+':'+Buffer.from(content).toString('base64').slice(0,40);
  const now = Date.now();
  const prev = cache[key];
  if(prev && (now - prev) < SUPPRESS_MIN*60*1000){
    console.log('[slack-outliers] Suppressed duplicate alert (', kind, ') innerhalb', SUPPRESS_MIN,'Minuten');
    return true;
  }
  cache[key] = now;
  try { fs.writeFileSync(cacheFile, JSON.stringify(cache,null,2)); } catch{}
  return false;
}
if(shouldSuppress('outliers', text)) process.exit(0);

function postSlack(msg){
  return new Promise((resolve,reject)=>{
    const payload = JSON.stringify({text: msg});
    const url = new URL(webhook);
    const req = https.request({method:'POST',hostname:url.hostname,path:url.pathname+url.search,protocol:url.protocol,headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}},res=>{
      let body='';res.on('data',d=>body+=d);res.on('end',()=>{ if(res.statusCode>=200 && res.statusCode<300){ resolve(body);} else reject(new Error('Slack HTTP '+res.statusCode+': '+body)); });
    });
    req.on('error',reject);
    req.write(payload);req.end();
  });
}

if(dry){
  console.log('[slack-outliers] DRY_RUN=1 -> Nachricht (nicht gesendet):\n'+text);
  process.exit(0);
}

postSlack(text).then(()=>{
  console.log('[slack-outliers] Alert gesendet');
}).catch(e=>{
  console.error('[slack-outliers] Fehler beim Senden:', e.message);
  process.exit(1);
});
