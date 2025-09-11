#!/usr/bin/env node
/**
 * KI-Pipeline Scaffold (Extractor -> Prompt -> Guard -> Dry-Run Patch)
 * Aktuell: KEIN externer API Call (Platzhalter). Liest meta-length-report.json,
 * erzeugt Prompt-Templates für Seiten mit status 'ok' (Baseline) oder 'dynamic_ok' (skip)
 * und Seiten mit short/long (kandidaten) – output: docs/meta-ai-suggestions.json
 */
import fs from 'fs';
import path from 'path';

const REPORT = path.resolve('docs/meta-length-report.json');
const OUT = path.resolve('docs/meta-ai-suggestions.json');

if(!fs.existsSync(REPORT)){
  console.error('Report nicht gefunden. Bitte zuerst meta-length-check ausführen.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT,'utf8'));

function buildPrompt(row){
  const base = `Erzeuge SERP-optimierten Title (52-59 Zeichen) & Description (151-160 Zeichen) für Seite ${row.page}.`;
  const ctx = [];
  if(row.title) ctx.push(`Aktueller Title: ${row.title}`);
  if(row.description) ctx.push(`Aktuelle Description: ${row.description}`);
  ctx.push('Anforderungen: klare Value Proposition, keine reinen Keyword-Listen, natürliche Sprache, kein Hard-Sales Push, Markenbezug ZOE Solar, keine doppelten Satzzeichen.');
  return base + '\n' + ctx.join('\n');
}

const suggestions = report.rows.filter(r=>!['dynamic_ok','ok'].includes(r.titleStatus) || !['dynamic_ok','ok'].includes(r.descStatus)).map(r=>({
  page: r.page,
  titleStatus: r.titleStatus,
  descStatus: r.descStatus,
  prompt: buildPrompt(r)
}));

// Provider Adapter Scaffold (ohne echten Call) optionaler Export
if(process.argv.includes('--template')){
  const adapter = `/**
 * AI Provider Adapter Beispiel
 * export async function generateMeta({title, description, url}) { ... }
 */\nexport async function generateMeta({prompt}) {\n  // Platzhalter – hier LLM API call einfügen\n  return { title: 'PLACEHOLDER TITLE', description: 'PLACEHOLDER DESCRIPTION' };\n}`;
  const adapterPath = path.resolve('src/seo/aiMetaProvider.js');
  if(!fs.existsSync(path.dirname(adapterPath))) fs.mkdirSync(path.dirname(adapterPath), { recursive:true });
  fs.writeFileSync(adapterPath, adapter, 'utf8');
  console.log('AI Provider Template -> ' + adapterPath);
}

fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), count: suggestions.length, suggestions }, null, 2));
console.log(`KI Suggestion Scaffold -> ${OUT} (${suggestions.length} Kandidaten)`);
