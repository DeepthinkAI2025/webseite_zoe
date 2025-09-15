#!/usr/bin/env node
/**
 * CI Guard: Blockt neue Inline JSON-LD Skripte außerhalb erlaubter Dateien.
 * Erlaubt: src/components/seo/JsonLd.tsx (Komponente selbst) & alles unter src/legacy/** (markierter Altbestand) bis Migration.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const ALLOWED_PATH_REGEX = /src\/components\/seo\/JsonLd.tsx|src\/legacy\//;

function grep(pattern){
  try {
    const out = execSync(`grep -R "${pattern}" src`, { encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch(e){
    return []; // kein Treffer
  }
}

const matches = grep('application/ld+json').filter(line => !ALLOWED_PATH_REGEX.test(line.split(':')[0]||''));

if (matches.length){
  console.error('\n[CI][FAIL] Unerlaubte Inline JSON-LD Skripte gefunden:');
  for (const m of matches) console.error('  ->', m);
  console.error('\nBitte durch <JsonLd> Komponente ersetzen.');
  process.exit(1);
}

console.log('[CI][OK] Keine unerlaubten Inline JSON-LD Skripte.');
