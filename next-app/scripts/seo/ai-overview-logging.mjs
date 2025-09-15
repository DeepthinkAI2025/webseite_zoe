#!/usr/bin/env node
/**
 * AI Overview / Perplexity Logging Skeleton
 * Ziel: Struktur für spätere halb-/automatisierte Abfragen gegen generative Suchsysteme.
 * Aktuell: Liest GAIO Query Set, erstellt leeren Ergebnisrahmen und speichert Snapshot.
 * Später: Integration echter API/Headless-Browser Abfragen + Parsing.
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const queriesPath = path.join(root, 'content/seo/gaio-queries.json');
const outDir = path.join(root, 'docs');
const outFile = path.join(outDir, `ai-overview-log-${Date.now()}.json`);

if (!fs.existsSync(queriesPath)) {
  console.error('Query Set nicht gefunden:', queriesPath);
  process.exit(1);
}

const queries = JSON.parse(fs.readFileSync(queriesPath, 'utf-8'));

const snapshot = {
  generatedAt: new Date().toISOString(),
  system: 'manual-placeholder',
  notes: 'Dieses Skeleton speichert nur Struktur – Ergebnisfelder leer. Später: API/Headless Integration.',
  items: queries.map(q => ({
    intent: q.intent,
    query: q.query,
    targetPage: q.targetPage,
    expectedSignals: q.expectedSignals,
    priority: q.priority,
    // Platzhalter für spätere echte Felder
    appeared: null, // true/false wenn Quelle aufgenommen wurde
    position: null, // Position in Antwort-Blöcken
    citedBrand: null, // ob Markenname genannt
    answerExtract: null, // Auszug aus AI Antwort
    rawCaptureRef: null // Verweis auf extern gespeicherten Raw Dump
  }))
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2));
console.log('AI Overview Snapshot geschrieben →', outFile);