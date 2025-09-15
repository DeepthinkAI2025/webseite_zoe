#!/usr/bin/env node
/**
 * Lighthouse Baseline Rotation Script
 * Ziel:
 *  - Alle Dateien matching `lighthouse-baseline-*.json` (inkl. fallback) nach `docs/lighthouse-baselines/` verschieben
 *  - `lighthouse-baseline-current.json` bleibt als Symlink/Kopie im alten Pfad bestehen (Backward Compatibility optional)
 *  - Nur die letzten N Snapshots (konfigurierbar) behalten
 *  - Ausgabe einer JSON Zusammenfassung für CI Artefakte
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'next-app');
const DOCS = path.join(ROOT, 'docs');
const TARGET_DIR = path.join(DOCS, 'lighthouse-baselines');
const KEEP = parseInt(process.env.LH_BASELINE_KEEP || '5', 10);
const SUMMARY_PATH = path.join(TARGET_DIR, 'rotation-summary.json');

async function ensureDir(dir){
  await fs.mkdir(dir, { recursive: true });
}

async function listBaselines(){
  const entries = await fs.readdir(DOCS);
  return entries.filter(f => /^lighthouse-baseline-(?:fallback-)?\d+\.json$/.test(f));
}

async function moveFiles(files){
  const moved = [];
  for (const file of files){
    const src = path.join(DOCS, file);
    const dest = path.join(TARGET_DIR, file);
    await fs.rename(src, dest).catch(async err => {
      if (err.code === 'EXDEV') { // cross-device fallback
        const data = await fs.readFile(src);
        await fs.writeFile(dest, data);
        await fs.unlink(src);
      } else throw err;
    });
    moved.push(file);
  }
  return moved;
}

async function pruneOld(){
  const files = (await fs.readdir(TARGET_DIR))
    .filter(f => /^lighthouse-baseline-\d+\.json$/.test(f))
    .sort();
  // Sort basiert auf Timestamp (numerisch als String vergleichbar da gleich lang)
  if (files.length <= KEEP) return { removed: [], kept: files };
  const remove = files.slice(0, files.length - KEEP);
  for (const r of remove){
    await fs.unlink(path.join(TARGET_DIR, r));
  }
  return { removed: remove, kept: files.filter(f => !remove.includes(f)) };
}

async function refreshCurrentSymlink(){
  const currentPath = path.join(DOCS, 'lighthouse-baseline-current.json');
  let latest = null;
  const candidates = (await fs.readdir(TARGET_DIR))
    .filter(f => /^lighthouse-baseline-\d+\.json$/.test(f))
    .sort();
  if (candidates.length) latest = candidates[candidates.length -1];
  if (!latest) return null;
  // Kopie statt Symlink (Symlink kann unter Windows Probleme machen)
  const data = await fs.readFile(path.join(TARGET_DIR, latest), 'utf-8');
  await fs.writeFile(currentPath, data);
  return latest;
}

async function main(){
  await ensureDir(TARGET_DIR);
  const before = await listBaselines();
  const moved = await moveFiles(before);
  const prune = await pruneOld();
  const latest = await refreshCurrentSymlink();
  const summary = { timestamp: new Date().toISOString(), moved, pruned: prune.removed, kept: prune.kept, latest };
  await fs.writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2));
  console.log('[lh-rotate] moved=%d pruned=%d kept=%d latest=%s', moved.length, prune.removed.length, prune.kept.length, latest);
  console.log('[lh-rotate] summary written -> %s', SUMMARY_PATH);
}

main().catch(err => { console.error('[lh-rotate] ERROR', err); process.exit(1); });
