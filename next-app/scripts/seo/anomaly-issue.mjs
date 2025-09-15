#!/usr/bin/env node
/**
 * anomaly-issue.mjs
 * Erstellt (idempotent) ein GitHub Issue wenn eine Metrik zwei Wochen in Folge als Anomalie markiert wurde.
 * Voraussetzungen:
 *  - docs/weekly-history.json
 *  - Env: GITHUB_TOKEN, GITHUB_REPOSITORY
 * Optional:
 *  - ANOMALY_PCT (Default 10)
 * Verhalten:
 *  - Prüft letzte drei Snapshots (curr, prev, prev2) – Anomalie wenn curr & prev Verschlechterung vs. jeweiligem Vorgänger > Schwelle
 *  - Issue Titel pattern: "Anomalie: <Metric> wiederholt verschlechtert"
 *  - Fügt Label `anomaly` hinzu (falls Repo erlaubt – sonst ignoriert)
 */
import fs from 'fs';
import https from 'https';
import path from 'path';

const histPath = path.resolve('docs','weekly-history.json');
let history=[]; try { history=JSON.parse(fs.readFileSync(histPath,'utf8')); if(!Array.isArray(history)) history=[]; } catch{}
if(history.length < 3){
  console.log('[anomaly-issue] Zu wenig History – skip');
  process.exit(0);
}
const ANOM_PCT = Number(process.env.ANOMALY_PCT || 10);
const curr = history[history.length-1];
const prev = history[history.length-2];
const prev2 = history[history.length-3];

function worsened(a,b,higherIsBetter){
  if(a==null||b==null||typeof a!=='number'||typeof b!=='number'||b===0) return false;
  const diff = a - b; const pct = (diff/b)*100;
  if(higherIsBetter) return pct < -ANOM_PCT; // Score gefallen
  return pct > ANOM_PCT; // Zeit gestiegen
}
const metrics=[
  {key:'lcp_avg', label:'LCP avg', better:'lower'},
  {key:'inp_avg', label:'INP avg', better:'lower'},
  {key:'rum_lcp_p75', label:'RUM LCP p75', better:'lower'},
  {key:'perf', label:'Performance Score', better:'higher'},
  {key:'a11y', label:'A11y Score', better:'higher'},
  {key:'seo', label:'SEO Score', better:'higher'},
  {key:'brand_ratio', label:'Brand Anteil', better:'higher'},
  {key:'exposure_index', label:'Exposure Index', better:'higher'},
];

function pctChange(a,b){ if(a==null||b==null||typeof a!=='number'||typeof b!=='number'||b===0) return null; return (a-b)/b*100; }
function severity(pct, better){
  if(pct==null) return null;
  // pct >0 heißt Anstieg; bei "lower is better" ist positiver pct schlecht.
  // Wir klassifizieren nur Verschlechterungen.
  if(better==='lower'){ // Verschlechterung wenn pct>0
    if(pct>30) return 'HIGH'; if(pct>15) return 'MED'; if(pct>10) return 'LOW';
  } else { // higher is better -> Verschlechterung wenn pct<0
    if(pct<-30) return 'HIGH'; if(pct<-15) return 'MED'; if(pct<-10) return 'LOW';
  }
  return null;
}

const repeated=[];
for(const m of metrics){
  const higherBetter = m.better==='higher';
  if(worsened(curr[m.key], prev[m.key], higherBetter) && worsened(prev[m.key], prev2[m.key], higherBetter)){
    // Berechne kumulative Verschlechterung vs. ältester Wert (prev2)
    const pct = pctChange(curr[m.key], prev2[m.key]);
    const sev = severity(pct, m.better);
    repeated.push({...m, pctTotal:pct, severity: sev||'LOW'});
  }
}
if(!repeated.length){
  console.log('[anomaly-issue] Keine wiederholten Anomalien');
  process.exit(0);
}
const token = process.env.GITHUB_TOKEN;
const repoFull = process.env.GITHUB_REPOSITORY;
if(!token || !repoFull){
  console.error('[anomaly-issue] GITHUB_TOKEN oder GITHUB_REPOSITORY fehlt – kann kein Issue erstellen.');
  process.exit(0);
}
const [owner, repo] = repoFull.split('/');

function gh(method, pathUrl, payload){
  return new Promise((resolve,reject)=>{
    const data = payload? JSON.stringify(payload):null;
    const opt = {hostname:'api.github.com', path:pathUrl, method, headers:{'Authorization':`Bearer ${token}`,'User-Agent':'anomaly-issue-bot','Accept':'application/vnd.github+json'}};
    if(data){ opt.headers['Content-Type']='application/json'; opt.headers['Content-Length']=Buffer.byteLength(data); }
    const req = https.request(opt,res=>{ let buf=''; res.on('data',d=>buf+=d); res.on('end',()=>{ try { resolve(JSON.parse(buf||'{}')); } catch { resolve({}); } }); });
    req.on('error',reject); if(data) req.write(data); req.end();
  });
}

// Lade existierende Issues (offen) und prüfe ob bereits erstellt
const existing = await gh('GET', `/repos/${owner}/${repo}/issues?state=open&labels=anomaly`);
function hasIssue(label){
  return Array.isArray(existing) && existing.some(i=> i.title && i.title.includes(label));
}
for(const m of repeated){
  const sevTag = m.severity ? `[${m.severity}] `: '';
  const title = `${sevTag}Anomalie: ${m.label} wiederholt verschlechtert`;
  if(hasIssue(m.label)){
    console.log('[anomaly-issue] Bereits vorhanden:', title);
    continue;
  }
  const body = `Die Kennzahl **${m.label}** hat sich wiederholt verschlechtert (Severity: ${m.severity}).\n\nSchwelle: > ${ANOM_PCT}% pro Woche in falsche Richtung (2 Wochen Sequenz).\nKumulative Veränderung vs. Woche -2: ${m.pctTotal!=null? m.pctTotal.toFixed(1)+'%':'n/a'}\n\nVerlauf (letzte 3 Wochen):\n- Woche -2: ${prev2[m.key]}\n- Woche -1: ${prev[m.key]}\n- Woche  0: ${curr[m.key]}\n\nAktion: Ursachenanalyse & Maßnahmen definieren.\nLabels: anomaly, severity-${(m.severity||'low').toLowerCase()}`;
  const labels = ['anomaly', `severity-${(m.severity||'LOW').toLowerCase()}`];
  const created = await gh('POST', `/repos/${owner}/${repo}/issues`, {title, body, labels});
  if(created && created.number){
    console.log('[anomaly-issue] Issue erstellt:', created.number, title);
  }
}
