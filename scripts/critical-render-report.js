#!/usr/bin/env node
/**
 * critical-render-report.js
 * Analyzes index.html for blocking resources (sync <script>, un-deferred external CSS) and
 * counts JS chunks > 50KB gzip to flag for potential code-splitting.
 */
import fs from 'fs';
import path from 'path';

// Next.js Variante:
// Es gibt kein klassisches dist/index.html – wir approximieren "critical render" durch
// Analyse der generierten .next/server/app/*/page.js (Server Komponenten) + client Chunks.
// Fokus: Große Client Bundles & Inline <script> Patterns im dokumentierten HTML Export (falls vorhanden).

const repoRoot = process.cwd();
const nextRoot = path.join(repoRoot,'next-app');
const buildDir = path.join(nextRoot,'.next');
if(!fs.existsSync(buildDir)){
  console.error('[critical-render-report] Kein Next Build gefunden (.next fehlt). Bitte erst build ausführen.');
  process.exit(1);
}

// Sammle client JS Dateien
const clientDir = path.join(buildDir,'static', 'chunks');
let bigJs = [];
if(fs.existsSync(clientDir)){
  for(const f of fs.readdirSync(clientDir)){
    if(f.endsWith('.js')){
      const p = path.join(clientDir,f);
      const size = fs.statSync(p).size;
      if(size > 50*1024) bigJs.push({ file:f, sizeKB:+(size/1024).toFixed(1) });
    }
  }
}

// Optional: Falls ein statisches Export HTML existiert (rare) – minimaler Check
let blockingScripts = [];
let cssLinks = [];
const exportHtml = path.join(nextRoot,'out','index.html');
if(fs.existsSync(exportHtml)){
  const html = fs.readFileSync(exportHtml,'utf8');
  blockingScripts = [...html.matchAll(/<script(?![^>]*\b(type|module|defer)\b)[^>]*src="([^"]+)"/g)].map(m=>m[1]);
  cssLinks = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>m[1]);
}

const report = {
  generatedAt: new Date().toISOString(),
  buildFound: true,
  largeJsChunks: bigJs,
  blockingScripts,
  cssLinks
};

const outDir = path.join(nextRoot,'docs');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
const outFile = path.join(outDir,'critical-render-report.json');
fs.writeFileSync(outFile, JSON.stringify(report,null,2));
console.log('[critical-render-report] Report geschrieben:', path.relative(repoRoot,outFile));
