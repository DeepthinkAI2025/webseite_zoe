#!/usr/bin/env node
/**
 * Lighthouse Gate Script
 * Startet lokalen Server falls nicht bereits laufend, führt Lighthouse über definierte Pfade aus
 * und validiert Score/Metrik Schwellen. Nutzt vorhandenes baseline Script als Kern.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const PATHS = (process.env.LH_PATHS || '/ /pricing /technology').split(/\s+/).filter(Boolean);
const MIN_PERF = parseFloat(process.env.MIN_PERF_SCORE || '0.85');
const MIN_A11Y = parseFloat(process.env.MIN_A11Y_SCORE || '0.90');
const MIN_SEO = parseFloat(process.env.MIN_SEO_SCORE || '0.95');

async function runCmd(cmd, args, opts={}){ return new Promise((res,rej)=>{ const p=spawn(cmd,args,{stdio:'inherit',...opts}); p.on('exit',c=> c===0?res():rej(new Error(cmd+" exit "+c)));}); }

async function ensureServer(){
  try {
    const res = await fetch(BASE, { method:'HEAD' });
    if(res.ok) return null; // schon da aber evtl. non-200
  } catch {}
  // server starten
  const srv = spawn('npm',['start'], { cwd: process.cwd(), stdio:'inherit' });
  // warten
  let tries=0;
  while(tries++ < 30){
    await new Promise(r=>setTimeout(r,2000));
    try { const r = await fetch(BASE); if(r.ok) return srv; } catch {}
  }
  throw new Error('Server nicht erreichbar für Lighthouse');
}

function aggregate(snapshot){
  // Mittelwerte über Seiten
  const agg = { performance:0, accessibility:0, seo:0, count:snapshot.pages.length };
  for(const p of snapshot.pages){
    agg.performance += p.summary.performance || 0;
    agg.accessibility += p.summary.accessibility || 0;
    agg.seo += p.summary.seo || 0;
  }
  agg.performance /= agg.count; agg.accessibility /= agg.count; agg.seo /= agg.count;
  return agg;
}

async function main(){
  const server = await ensureServer();
  // baseline script aufrufen
  const args = ['scripts/seo/lighthouse-baseline.mjs','--base', BASE, '--paths', ...PATHS];
  await runCmd('node', args);
  const current = path.join(process.cwd(),'docs','lighthouse-baseline-current.json');
  if(!fs.existsSync(current)) throw new Error('Baseline Report nicht gefunden');
  const snapshot = JSON.parse(fs.readFileSync(current,'utf8'));
  const agg = aggregate(snapshot);
  const result = { generatedAt:new Date().toISOString(), base:BASE, thresholds:{ MIN_PERF, MIN_A11Y, MIN_SEO }, aggregate:agg };
  const outFile = path.join(process.cwd(),'docs','lighthouse-gate-result.json');
  fs.writeFileSync(outFile, JSON.stringify(result,null,2));
  let fail = false;
  if(agg.performance < MIN_PERF) fail = true;
  if(agg.accessibility < MIN_A11Y) fail = true;
  if(agg.seo < MIN_SEO) fail = true;
  if(server) server.kill();
  if(fail){
    console.error('Lighthouse Gate FAILED');
    console.error(JSON.stringify(result,null,2));
    process.exit(1);
  } else {
    console.log('Lighthouse Gate PASSED');
    console.log(JSON.stringify(result,null,2));
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
