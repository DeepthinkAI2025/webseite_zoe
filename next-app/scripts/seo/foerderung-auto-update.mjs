#!/usr/bin/env node
/**
 * Förderprogramme Auto-Update
 * --------------------------------------
 * Verwendet (optionale) Tavily API um aktuelle Förderprogramme Hinweise
 * pro Bundesland zu recherchieren und als strukturierte Auto-YAML abzulegen.
 *
 * Output: content/programmatic/foerderung-auto/<slug>.auto.yml
 * Merge-Strategie (Generator): Programme mit identischem Namen (case-insensitive)
 * werden aktualisiert/überschrieben, neue Programme werden hinzugefügt.
 *
 * Sicherheits-/Qualitätshinweise:
 * - Ohne TAVILY_API_KEY läuft das Skript im NO-OP Modus.
 * - Es werden heuristische Extraktionen durchgeführt – Ergebnisse sind als Rohmaterial zu verstehen.
 * - Manuelle Kuratierung kann Programme verfeinern; Auto-Dateien nie direkt im Frontend gerendert,
 *   sondern erst nach Merge über den Generator.
 */

import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml, dump as toYaml } from 'js-yaml';

const API_KEY = process.env.TAVILY_API_KEY;
const MANUAL_DIR = path.join(process.cwd(), 'content', 'programmatic', 'foerderung');
const AUTO_DIR = path.join(process.cwd(), 'content', 'programmatic', 'foerderung-auto');
fs.mkdirSync(AUTO_DIR, { recursive: true });

const BUNDESLAENDER = [
  { slug: 'baden-wuerttemberg-2025', region: 'Baden-Württemberg' },
  { slug: 'bayern-2025', region: 'Bayern' },
  { slug: 'berlin-2025', region: 'Berlin' },
  { slug: 'brandenburg-2025', region: 'Brandenburg' },
  { slug: 'bremen-2025', region: 'Bremen' },
  { slug: 'hamburg-2025', region: 'Hamburg' },
  { slug: 'hessen-2025', region: 'Hessen' },
  { slug: 'mecklenburg-vorpommern-2025', region: 'Mecklenburg-Vorpommern' },
  { slug: 'niedersachsen-2025', region: 'Niedersachsen' },
  { slug: 'nordrhein-westfalen-2025', region: 'Nordrhein-Westfalen' },
  { slug: 'rheinland-pfalz-2025', region: 'Rheinland-Pfalz' },
  { slug: 'saarland-2025', region: 'Saarland' },
  { slug: 'sachsen-2025', region: 'Sachsen' },
  { slug: 'sachsen-anhalt-2025', region: 'Sachsen-Anhalt' },
  { slug: 'schleswig-holstein-2025', region: 'Schleswig-Holstein' },
  { slug: 'thueringen-2025', region: 'Thüringen' }
];

function log(msg){ console.log('[foerderung-auto]', msg); }
function warn(msg){ console.warn('\x1b[33m[foerderung-auto] ' + msg + '\x1b[0m'); }
function err(msg){ console.error('\x1b[31m[foerderung-auto] ' + msg + '\x1b[0m'); }

async function tavilySearch(query){
  if(!API_KEY){ return null; }
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: API_KEY, query, max_results: 5 })
    });
    if(!res.ok){ warn(`Tavily non-OK ${res.status}`); return null; }
    return await res.json();
  } catch(e){ warn('Fetch Fehler: ' + e.message); return null; }
}

function extractProgrammesFromResult(payload){
  if(!payload || !Array.isArray(payload.results)) return [];
  const progs = [];
  for(const r of payload.results){
    const text = [r.title, r.content].filter(Boolean).join(' \n ');
    // Heuristik: Splits in Zeilen / Sätze, sucht nach Schlüsselwörtern
    const lines = text.split(/\n|\.\s+/).map(l=>l.trim()).filter(Boolean);
    for(const line of lines){
      if(/(Bonus|Zuschuss|Förder|Speicher|PV|Photovoltaik)/i.test(line) && line.length > 25 && line.length < 220){
        // Programme Name: bis zu erstem Doppelpunkt oder –
        let name = line.split(/[:–\-]/)[0].trim();
        if(name.length < 4 || name.split(' ').length > 12) continue;
        // Beschreibung rudimentär (komplette Zeile)
        const description = line;
        // Rate / Cap heuristisch extrahieren
        const rateMatch = line.match(/(\d+\s?€[^\s]*)/);
        const capMatch = line.match(/bis\s+\d+\s?(kWh|kWp|kW)/i);
        const existing = progs.find(p=>p.name.toLowerCase() === name.toLowerCase());
        if(existing){
          // Anreichern falls leer
          if(!existing.description && description) existing.description = description;
          continue;
        }
        progs.push({
          name: name.slice(0,120),
          description: description.slice(0,240),
          rate: rateMatch ? rateMatch[1] : undefined,
          cap: capMatch ? capMatch[0] : undefined
        });
      }
      if(progs.length >= 6) break; // Limit pro Quelle
    }
    if(progs.length >= 10) break; // Global Limit
  }
  return progs;
}

function writeAutoYaml(slug, region, programmes){
  const file = path.join(AUTO_DIR, slug + '.auto.yml');
  const data = {
    slug,
    region,
    updated_auto: new Date().toISOString().slice(0,10),
    programmes
  };
  const yaml = '# AUTO-GENERATED – NICHT MANUELL BEARBEITEN (wird überschrieben)\n' + toYaml(data, { lineWidth: 100 });
  fs.writeFileSync(file, yaml, 'utf8');
  log('Geschrieben: ' + path.relative(process.cwd(), file) + ` (programmes=${programmes.length})`);
}

async function processBundesland(entry){
  const { slug, region } = entry;
  const queries = [
    `Photovoltaik Förderung ${region} 2025 Zuschuss Speicher`,
    `PV Speicher Förderprogramm ${region} 2025 Bonus`,
    `Solar Investitionszuschuss ${region} 2025 Programm`
  ];
  const aggregate = [];
  for(const q of queries){
    if(!API_KEY) break;
    log(`Query: ${q}`);
    const result = await tavilySearch(q);
    const progs = extractProgrammesFromResult(result);
    for(const p of progs){
      if(!aggregate.find(x=>x.name.toLowerCase() === p.name.toLowerCase())){
        aggregate.push(p);
      }
    }
    // Kurz Pause um API Load zu minimieren (falls Key vorhanden)
    if(API_KEY) await new Promise(r=>setTimeout(r, 350));
  }
  if(API_KEY && aggregate.length){
    writeAutoYaml(slug, region, aggregate);
  } else if(!API_KEY){
    warn('Kein TAVILY_API_KEY – skip ' + slug);
  } else {
    warn('Keine Programme extrahiert für ' + slug);
  }
}

async function main(){
  if(!fs.existsSync(MANUAL_DIR)){
    err('Manueller Förderungs-Ordner fehlt: ' + MANUAL_DIR);
    process.exit(1);
  }
  log('Starte Auto-Update – Modus: ' + (API_KEY ? 'LIVE' : 'NO-API (Dry)'));
  for(const b of BUNDESLAENDER){
    await processBundesland(b);
  }
  log('Fertig.');
}

main().catch(e=>{ err(e.stack || e.message); process.exit(1); });
