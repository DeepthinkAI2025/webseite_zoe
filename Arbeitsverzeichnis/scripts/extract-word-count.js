#!/usr/bin/env node
/**
 * Extrahiert Wortanzahlen für definierte inhaltsstarke Seiten (Pillar, Blog Success Stories)
 * und aktualisiert (optional) eingebettete statische Werte oder generiert Report.
 */
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const targetFiles = [
  'src/pages/PhotovoltaikKosten.jsx',
  'src/pages/Stromspeicher.jsx',
  'src/pages/SuccessStory.jsx'
];

function stripJsxToText(code){
  // naive: entferne JS/JSX Blöcke, Tags -> Text
  const noJs = code
    .replace(/<script[\s\S]*?<\/script>/gi,' ')
    .replace(/\{[\s\S]*?\}/g,' ') // simple brace removal (can over-remove)
    .replace(/<style[\s\S]*?<\/style>/gi,' ');
  const text = noJs.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;?/g,' ').replace(/\s+/g,' ').trim();
  return text;
}

const results = [];
for(const rel of targetFiles){
  const abs = path.join(process.cwd(), rel);
  if(!fs.existsSync(abs)) continue;
  const code = fs.readFileSync(abs,'utf-8');
  const text = stripJsxToText(code);
  const words = text.split(/\s+/).filter(Boolean);
  results.push({ file: rel, wordCount: words.length });
}

const outPath = 'docs/word-count-report.json';
fs.writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), pages: results }, null, 2));
console.log('Word count report written:', outPath);

// Optional: Could patch files – left non-mutating for safety.
