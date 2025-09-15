#!/usr/bin/env node
/**
 * gaio-check.mjs
 * Liest definierte GAIO Query Set Datei und erzeugt einen Snapshot Report.
 * (Platzhalter ohne externe API Calls – bereit für spätere Integration Perplexity / SerpAPI / interne Logs)
 */
import fs from 'fs';
import path from 'path';

const QUERIES_FILE = process.env.GAIO_QUERIES || 'next-app/seo/gaio-queries.json';
const OUT_DIR = 'next-app/docs';
const REPORT_FILE = path.join(OUT_DIR, 'gaio-query-report.json');
const SUMMARY_MD = path.join(OUT_DIR, 'gaio-query-summary.md');

function loadQueries(){
  const p = path.resolve(QUERIES_FILE);
  if(!fs.existsSync(p)){
    console.error('[gaio-check] Query Datei fehlt:', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p,'utf-8'));
}

function nowIso(){ return new Date().toISOString(); }

const queries = loadQueries();

// Placeholder: Simulierte Evaluation – später echte Ranking / Presence Checks.
const results = queries.map(q => ({
  id: q.id,
  query: q.query,
  intent: q.intent,
  page: q.page,
  importance: q.importance,
  // Flags für spätere Füllung
  brandMention: null, // bool
  presentInAIOverview: null, // bool
  lastChecked: nowIso()
}));

const snapshot = {
  generatedAt: nowIso(),
  total: results.length,
  importanceWeighted: results.reduce((acc,r)=> acc + (r.importance||1),0),
  results
};

if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR,{recursive:true});
fs.writeFileSync(REPORT_FILE, JSON.stringify(snapshot,null,2));

// Markdown Summary (kompakt)
const lines = [
  '# GAIO Query Snapshot',
  '',
  `Zeitpunkt: ${snapshot.generatedAt}`,
  `Queries: ${snapshot.total} (Importance Sum: ${snapshot.importanceWeighted})`,
  '',
  '| Query | Intent | Page | Importance | Brand Mention | AI Overview |',
  '|-------|--------|------|------------|---------------|-------------|',
  ...results.map(r=> `| ${r.query} | ${r.intent} | ${r.page} | ${r.importance} | ${r.brandMention===true?'✅':r.brandMention===false?'❌':'–'} | ${r.presentInAIOverview===true?'✅':r.presentInAIOverview===false?'❌':'–'} |`),
  '',
  '_Automatisch generiert – Platzhalter ohne echte SERP/AI API_'
];
fs.writeFileSync(SUMMARY_MD, lines.join('\n'));

console.log('[gaio-check] Snapshot geschrieben:', REPORT_FILE, SUMMARY_MD);
