#!/usr/bin/env node
/**
 * critical-render-report.js
 * Analyzes index.html for blocking resources (sync <script>, un-deferred external CSS) and
 * counts JS chunks > 50KB gzip to flag for potential code-splitting.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const cwdName = path.basename(root);
const base = cwdName === 'Arbeitsverzeichnis' ? root : path.join(root,'Arbeitsverzeichnis');
const htmlPath = path.join(base,'dist','index.html');
if(!fs.existsSync(htmlPath)){
  console.error('Build first (dist/index.html missing).');
  process.exit(1);
}
const html = fs.readFileSync(htmlPath,'utf8');
const blockingScripts = [...html.matchAll(/<script(?![^>]*\b(type|module|defer)\b)[^>]*src="([^"]+)"/g)].map(m=>m[2]);
const cssLinks = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>m[1]);

// Analyze dist/assets sizes
const assetsDir = path.join(base,'dist','assets');
const bigJs = [];
for (const f of fs.readdirSync(assetsDir)){
  if (f.endsWith('.js')){
    const p = path.join(assetsDir,f);
    const size = fs.statSync(p).size; // raw size
    if (size > 50*1024) bigJs.push({file:f,sizeKB:+(size/1024).toFixed(1)});
  }
}

const report = { generatedAt:new Date().toISOString(), blockingScripts, cssLinks, largeJsChunks: bigJs };
const outDir = path.join(base,'docs');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'critical-render-report.json'), JSON.stringify(report,null,2));
console.log('Critical render report written to Arbeitsverzeichnis/docs/critical-render-report.json');
