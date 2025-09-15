#!/usr/bin/env node
/**
 * Lighthouse Compare
 * Vergleicht zwei Lighthouse Baseline Snapshots (JSON) und erzeugt ein Delta (Performance, Accessibility, SEO + Kernmetriken LCP, CLS, TBT, FCP).
 * Nutzung:
 *  node scripts/seo/lighthouse-compare.mjs --old docs/lighthouse-baseline-OLD.json --new docs/lighthouse-baseline-current.json [--out docs/lighthouse-diff.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';

function parseArgs(){
  const cfg = { old:null, newer:null, out:null };
  for (let i=2;i<argv.length;i++){
    if(argv[i]==='--old') cfg.old = argv[++i];
    if(argv[i]==='--new') cfg.newer = argv[++i];
    if(argv[i]==='--out') cfg.out = argv[++i];
  }
  if(!cfg.old || !cfg.newer){
    console.error('Argumente fehlen: --old <file> --new <file>');
    process.exit(1);
  }
  return cfg;
}

function load(file){
  if(!fs.existsSync(file)){ console.error('Datei fehlt:', file); process.exit(1); }
  return JSON.parse(fs.readFileSync(file,'utf-8'));
}

function indexByPath(snapshot){
  const map = new Map();
  (snapshot.pages||[]).forEach(p=> map.set(p.path, p));
  return map;
}

function diff(oldSnap, newSnap){
  const oldIdx = indexByPath(oldSnap);
  const changes = [];
  for (const page of newSnap.pages || []){
    const prev = oldIdx.get(page.path);
    if(!prev){
      changes.push({ path: page.path, status: 'added', current: page.summary });
      continue;
    }
    const cur = page.summary;
    const prevSum = prev.summary;
    const delta = {
      performance: cur.performance - prevSum.performance,
      accessibility: cur.accessibility - prevSum.accessibility,
      seo: cur.seo - prevSum.seo,
      lcp: cur.metrics.lcp - prevSum.metrics.lcp,
      cls: cur.metrics.cls - prevSum.metrics.cls,
      tbt: cur.metrics.tbt - prevSum.metrics.tbt,
      fcp: cur.metrics.fcp - prevSum.metrics.fcp
    };
    changes.push({ path: page.path, status: 'modified', delta, current: cur, previous: prevSum });
    oldIdx.delete(page.path);
  }
  // Verbleibende alte Einträge = entfernt
  for (const [p, val] of oldIdx.entries()){
    changes.push({ path: p, status: 'removed', previous: val.summary });
  }
  return { generatedAt: new Date().toISOString(), baseOld: oldSnap.base, baseNew: newSnap.base, changes };
}

const args = parseArgs();
const oldSnap = load(args.old);
const newSnap = load(args.newer);
const result = diff(oldSnap, newSnap);
const outFile = args.out || path.join('docs','lighthouse-diff.json');
const outDir = path.dirname(outFile);
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(outFile, JSON.stringify(result,null,2));
console.log('Diff geschrieben →', outFile);

// Optional Markdown Kurzfassung
try {
  const mdLines = ['# Lighthouse Diff','',`Alt: ${args.old}`,'',`Neu: ${args.newer}`,'','| Path | Perf Δ | A11y Δ | SEO Δ | LCP Δ (ms) | CLS Δ | TBT Δ (ms) | FCP Δ (ms) |', '|------|--------|--------|-------|-----------|-------|------------|-----------|'];
  for (const c of result.changes){
    if(c.status !== 'modified') continue;
    const d = c.delta;
    const fmt = (v, pct=false)=> v==null? '': (pct? (v*100).toFixed(0)+'%' : (Math.round(v))); // Scores sind 0..1
    mdLines.push(`| ${c.path} | ${fmt(d.performance,true)} | ${fmt(d.accessibility,true)} | ${fmt(d.seo,true)} | ${fmt(d.lcp)} | ${d.cls?.toFixed(3)} | ${fmt(d.tbt)} | ${fmt(d.fcp)} |`);
  }
  fs.writeFileSync(path.join('docs','lighthouse-diff.md'), mdLines.join('\n'));
  console.log('Markdown Diff → docs/lighthouse-diff.md');
} catch {}
