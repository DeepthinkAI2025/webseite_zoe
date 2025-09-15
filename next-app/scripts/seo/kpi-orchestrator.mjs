#!/usr/bin/env node
/**
 * KPI Orchestrator
 * Schritte:
 *  1. Build (falls kein .next vorhanden oder FORCE_BUILD=1)
 *  2. Server starten (next start) auf freiem Port
 *  3. KPI Dashboard Script gegen laufenden Server ausführen
 *  4. Threshold Gate prüfen
 *  5. Server stoppen
 * Exit Codes durch Threshold Gate bestimmt, sonst 0 bei Erfolg.
 */
import { spawn } from 'child_process';
import fs from 'fs';
import net from 'net';
import path from 'path';

function findFreePort(start=3010){
  return new Promise(resolve => {
    const tryPort = (p) => {
      const srv = net.createServer();
      srv.once('error', () => tryPort(p+1));
      srv.once('listening', () => { srv.close(()=> resolve(p)); });
      srv.listen(p,'0.0.0.0');
    };
    tryPort(start);
  });
}

async function run(cmd, args, opts={}){
  return new Promise((resolve,reject)=>{
    const p = spawn(cmd,args,{ stdio:'inherit', ...opts });
    p.on('exit', code => code===0? resolve(0): reject(new Error(cmd+' exit '+code)));
  });
}

async function main(){
  const root = process.cwd();
  const buildDir = path.join(root,'.next');
  const needBuild = process.env.FORCE_BUILD === '1' || !fs.existsSync(buildDir);
  if(needBuild){
    console.log('[orchestrator] Build…');
    await run('npx',['next','build']);
  } else {
    console.log('[orchestrator] Build übersprungen (vorhanden)');
  }
  const port = await findFreePort();
  console.log('[orchestrator] Starte Server auf Port', port);
  const server = spawn('npx',['next','start','-p', String(port)], { stdio:'inherit' });
  let closed=false;
  const shutdown = ()=>{ if(!closed){ closed=true; server.kill('SIGINT'); }};
  process.on('exit', shutdown);
  process.on('SIGINT', ()=> { shutdown(); process.exit(130); });

  // Warten bis Server antwortet
  const base = `http://localhost:${port}`;
  const waitStart = Date.now();
  while(Date.now()-waitStart < 20000){
    try {
      const res = await fetch(base, { method:'GET' });
      if(res.ok) break;
    } catch { /* retry */ }
    await new Promise(r=> setTimeout(r,500));
  }
  console.log('[orchestrator] Server erreichbar – Lighthouse Baseline…');
  try {
    await run('node',['scripts/seo/lighthouse-baseline.mjs','--base', base]);
  } catch (e) {
    console.warn('[orchestrator] Lighthouse fehlgeschlagen (fahre fort):', e.message);
  }
  console.log('[orchestrator] Generiere KPI Dashboard…');
  process.env.KPI_BASE = base;
  try {
    await run('node',['scripts/seo/kpi-dashboard.mjs']);
  } catch (e) {
    console.error('[orchestrator] KPI Dashboard Fehler:', e.message);
  }

  console.log('[orchestrator] Threshold Gate…');
  let exitCode = 0;
  let softWarn = false;
  try {
    await run('node',['scripts/seo/ci-threshold-gate.mjs']);
  } catch (e) {
    // Auswertung: Exit 1 = Soft Warn, Exit 2 = Hard Fail (unterscheiden via Message Pattern)
    if(/exit 1$/.test(e.message)) {
      softWarn = true;
      console.warn('[orchestrator] Threshold Warnungen – Pipeline setzt Erfolg fort.');
    } else {
      console.error('[orchestrator] Threshold Fail:', e.message);
      exitCode = 2;
    }
  }

  console.log('[orchestrator] Stoppe Server…');
  shutdown();
  // kleine Wartezeit damit Prozess wirklich endet
  await new Promise(r=> setTimeout(r,800));

  // Optional: RUM Aggregation falls Datei existiert
  try {
    if (fs.existsSync(path.join(root,'docs','web-vitals-rum.ndjson'))) {
      console.log('[orchestrator] RUM Aggregation…');
      try { await run('node',['scripts/seo/aggregate-web-vitals.mjs']); } catch(e){ console.warn('[orchestrator] RUM Aggregation Warnung:', e.message); }
    }
  } catch {/* ignore */}

  if(exitCode!==0){
    console.error('[orchestrator] Fertig mit Fehlerstatus', exitCode);
    process.exit(exitCode);
  }
  console.log('[orchestrator] Erfolgreich abgeschlossen.' + (softWarn ? ' (mit Warnungen)' : ''));
}

main().catch(e=> { console.error('[orchestrator] Unerwarteter Fehler', e); process.exit(1); });
