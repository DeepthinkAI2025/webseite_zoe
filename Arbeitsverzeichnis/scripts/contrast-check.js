#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Basis-Verzeichnisse
// Support execution from repository root or Arbeitsverzeichnis
const CANDIDATE_DIRS = [path.resolve('src'), path.resolve('Arbeitsverzeichnis/src')];
const ROOT = CANDIDATE_DIRS.find(d => fs.existsSync(d)) || path.resolve('Arbeitsverzeichnis/src');
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);

// Heuristik: transparente Weiß-Overlays bergen Kontrastrisiko
const RISKY = /bg-white\/(1[0-9]|[2-9]0)/g; // 10–90% opacity
// Whitelist Muster: rein hover-basierte Transparenzen (werden nicht als dauerhafte Layer gewertet)
const WHITELIST = [ 'hover:bg-white/20' ];

// Map relevanter Tailwind Utility Klassen -> HEX Farben (normalisierte Palette)
// Light Theme Basis
const COLOR_MAP_LIGHT = {
  'text-white': '#ffffff',
  'text-neutral-900': '#111827',
  'text-neutral-800': '#1f2937',
  'text-neutral-700': '#374151',
  'text-neutral-600': '#4b5563',
  'text-amber-800': '#92400e',
  'text-amber-900': '#78350f',
  'bg-white': '#ffffff',
  'bg-amber-800': '#92400e',
  'bg-amber-900': '#78350f',
  'bg-neutral-900': '#111827',
  'bg-neutral-800': '#1f2937'
};

// Dark Theme (aus tokens in index.css abgeleitet, reduzierte Auswahl)
const COLOR_MAP_DARK = {
  'text-white': '#ffffff',
  'text-neutral-900': '#f1f5f7', // in dark als foreground Ersatz (hell)
  'text-neutral-800': '#e2ecef',
  'text-neutral-700': '#c7d4d9',
  'text-neutral-600': '#b2c0c6',
  'text-amber-800': '#1494a1', // primär helle Akzentfarbe
  'text-amber-900': '#0f7782',
  'bg-white': '#0d1b21', // Basis dunkel
  'bg-amber-800': '#14272f',
  'bg-amber-900': '#19323a',
  'bg-neutral-900': '#0d1b21',
  'bg-neutral-800': '#14272f'
};

// Default Erwartungswerte (Design Policy) – können per JSON Mapping überschrieben / erweitert werden
const DEFAULT_EXPECTED_RATIOS = {
  'text-neutral-900|bg-white': 7.0,
  'text-neutral-700|bg-white': 5.0,
  'text-neutral-600|bg-white': 4.0,
  'text-amber-800|bg-white': 4.5,
  'text-amber-900|bg-white': 5.0
};

// Versuche externe Mapping-Datei einzulesen
let EXPECTED_RATIOS = {};
const mappingPath = path.join(SCRIPT_DIR, 'contrast-expected-ratios.json');
try {
  if (fs.existsSync(mappingPath)) {
    const raw = fs.readFileSync(mappingPath, 'utf-8').trim();
    if (raw) {
      EXPECTED_RATIOS = JSON.parse(raw);
    }
  }
} catch (e) {
  console.warn('contrast-check: Konnte Mapping nicht parsen – Fallback auf Default.', e.message);
}
if (!Object.keys(EXPECTED_RATIOS).length) {
  EXPECTED_RATIOS = DEFAULT_EXPECTED_RATIOS;
}

// Regex für einfache Paar-Erkennung <element className="... text-amber-800 ... bg-white ...">
const CLASS_BLOCK = /className=\"([^\"]+)\"/g;

function luminance(hex){
  const c = hex.replace('#','');
  const rgb = [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)].map(v=>{
    const s=v/255; return s<=0.03928? s/12.92 : Math.pow((s+0.055)/1.055,2.4);
  });
  return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
}
function contrast(a,b){
  const L1 = luminance(a); const L2 = luminance(b); const light=Math.max(L1,L2); const dark=Math.min(L1,L2); return (light+0.05)/(dark+0.05);
}

const issues = [];
const evaluatedPairs = { light: new Set(), dark: new Set() };

function analyzeClasses(file, classList, theme){
  const COLOR_MAP = theme === 'dark' ? COLOR_MAP_DARK : COLOR_MAP_LIGHT;
  const classes = classList.split(/\s+/).filter(Boolean);
  const fg = classes.find(c=>c.startsWith('text-') && COLOR_MAP[c]);
  const bg = classes.find(c=>c.startsWith('bg-') && COLOR_MAP[c]);
  if(fg && bg){
    const ratio = contrast(COLOR_MAP[fg], COLOR_MAP[bg]);
    const key = `${fg}|${bg}`;
    evaluatedPairs[theme].add(key);
    const expected = EXPECTED_RATIOS[key] ?? 4.5; // Default konservativ 4.5
    if(ratio < expected){
      issues.push({ theme, file, match:`${fg} on ${bg}`, ratio: +ratio.toFixed(2), expected, note: `Kontrast unter erwartetem Minimum (${expected}:1)` });
    }
  }
}

function scan(file, theme){
  const rel = file.replace(process.cwd()+"/", '');
  const txt = fs.readFileSync(file,'utf-8');
  // transparente Weiß-Overlays
  const matches = txt.match(RISKY) || [];
  matches.forEach(m=> {
    // Skip, wenn ausschließlich innerhalb eines Hover Tokens whitelisted
    if(WHITELIST.some(w => txt.includes(w) && w.includes(m))) return;
    if(theme==='light') { // nur einmal reporten
      issues.push({ theme, file: rel, match: m, note: 'Transparenter weißer Hintergrund – Kontrast prüfen oder opaken Layer verwenden.' });
    }
  });
  let m; while((m=CLASS_BLOCK.exec(txt))!==null){ analyzeClasses(rel, m[1], theme); }
}

function walk(dir, theme){
  for(const e of fs.readdirSync(dir)){
    const p = path.join(dir,e); const s = fs.statSync(p);
    if(s.isDirectory()) walk(p, theme); else if(/\.(jsx|tsx)$/.test(e)) scan(p, theme);
  }
}
walk(ROOT, 'light');
walk(ROOT, 'dark');

// Hinweise zu fehlenden Mapping-Einträgen (nur informativ, kein Fail)
const missingMappings = {
  light: Array.from(evaluatedPairs.light).filter(k => !(k in EXPECTED_RATIOS) && !(k in DEFAULT_EXPECTED_RATIOS)),
  dark: Array.from(evaluatedPairs.dark).filter(k => !(k in EXPECTED_RATIOS) && !(k in DEFAULT_EXPECTED_RATIOS))
};

const output = { issues, missingMappings, usedMappings: { light: Array.from(evaluatedPairs.light).sort(), dark: Array.from(evaluatedPairs.dark).sort() } };
// Report auch in docs persistieren für Guard/Finalize
try {
  if(!fs.existsSync('docs')) fs.mkdirSync('docs');
  fs.writeFileSync('docs/contrast-report.json', JSON.stringify(output, null, 2));
} catch(e){ /* ignore */ }
if(!issues.length){
  const anyMissing = missingMappings.light.length || missingMappings.dark.length;
  console.log(anyMissing ? 'contrast-check: OK (Mappings fehlen – siehe Report)' : 'contrast-check: OK');
  process.exit(0);
}
console.log(JSON.stringify(output, null, 2)); process.exit(1);
