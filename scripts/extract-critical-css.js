#!/usr/bin/env node
/**
 * extract-critical-css.js
 * Sehr einfache Heuristik: Liest gebauten index.css, filtert nur Basis-Blöcke für hero / layout Klassen und schreibt `public/critical.css`.
 * (Für echtes Projekt wäre Penthouse / Critters sinnvoll – hier lightweight.)
 */
import fs from 'fs';
import path from 'path';

const source = path.resolve('dist','assets');
const cssFile = fs.readdirSync(source).find(f=>/^index-.*\.css$/.test(f));
if(!cssFile){
  console.error('kein index-*.css in dist/assets gefunden');
  process.exit(2);
}
const full = fs.readFileSync(path.join(source, cssFile), 'utf8');
// sehr grobe Auswahl relevanter Selektoren
const keepSelectors = [
  '.pro-container', '.section', '.hero-shell', 'h1','h2','h3','body','html','a','p.lead', '.btn-primary', '.btn-outline-primary', '.btn-secondary'
];
const critical = full.split(/}\s*/).filter(block=> keepSelectors.some(sel=> block.includes(sel))).map(b=>b+'}').join('\n');
fs.writeFileSync(path.resolve('public','critical.css'), critical, 'utf8');
console.log('critical.css geschrieben ('+critical.length+' chars)');
