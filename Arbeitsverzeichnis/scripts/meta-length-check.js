#!/usr/bin/env node
/**
 * Prüft Title (52-59 Zeichen) & Meta Description (151-160) Länge in Page Komponenten.
 * Sucht <Helmet> Segmente in src/pages/*.jsx und extrahiert <title>...</title> sowie <meta name="description" content="..." />
 * Unterstützt einfache dynamische Muster (<title>{computedTitle}</title>, content={desc}) und markiert sie als 'dynamic_ok'.
 * Gibt Report JSON + stdout Tabelle.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const PAGES_DIR = path.resolve('src/pages');
const OUT = path.resolve('docs/meta-length-report.json');

function collectFiles(dir){
  return fs.readdirSync(dir).filter(f=>f.endsWith('.jsx')).map(f=>path.join(dir,f));
}

function extract(content){
  const titleStatic = content.match(/<title>([^<{]{0,200})<\/title>/i);
  const titleDynamic = !titleStatic && /<title>\{[^}]+\}<\/title>/.test(content);
  const descStatic = content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,400})["'][^>]*>/i);
  const descDynamic = !descStatic && /<meta[^>]+name=["']description["'][^>]+content=\{[^}]+\}[^>]*>/.test(content);
  return {
    title: titleStatic ? titleStatic[1].trim() : null,
    titleDynamic,
    description: descStatic ? descStatic[1].trim() : null,
    descDynamic
  };
}

function classify(len, min, max){
  if(len == null) return 'missing';
  if(len < min) return 'short';
  if(len > max) return 'long';
  return 'ok';
}

const args = process.argv.slice(2);
const doSuggest = args.includes('--suggest');
const doFix = args.includes('--fix');
if(doFix && !process.env.CI){
  console.log('\n[meta-length-check] WARN: --fix führt direkte Dateianpassungen durch. Bitte vorher committen.');
}

function adjustToRange(text, min, max){
  if(!text) return text;
  let t = text.trim();
  const len = [...t].length;
  if(len >= min && len <= max) return t;
  if(len > max){
    // smarte Kürzung an letztem Space vor max-3
    let cut = [...t].slice(0, max).join('');
    const lastSpace = cut.lastIndexOf(' ');
    if(lastSpace > min + 20) cut = cut.slice(0,lastSpace);
    return cut.trim();
  }
  // Verlängern: generisches neutrales Sprach-Filler Segment
  const filler = ' Effizienz Planung Umsetzung.';
  while([...t].length < min){
    t += filler;
  }
  if([...t].length > max){
    return adjustToRange(t, min, max); // nochmal kürzen falls Überlauf
  }
  return t.trim();
}

const files = collectFiles(PAGES_DIR);
const rows = [];
for(const file of files){
  const raw = fs.readFileSync(file,'utf8');
  const { title, titleDynamic, description, descDynamic } = extract(raw);
  const tLen = title ? [...title].length : null;
  const dLen = description ? [...description].length : null;
  const titleStatus = titleDynamic ? 'dynamic_ok' : classify(tLen,52,59);
  const descStatus = descDynamic ? 'dynamic_ok' : classify(dLen,151,160);
  let titleSuggested = null;
  let descSuggested = null;
  if(doSuggest || doFix){
    if(!titleDynamic && title && titleStatus !== 'ok') titleSuggested = adjustToRange(title,52,59);
    if(!descDynamic && description && descStatus !== 'ok') descSuggested = adjustToRange(description,151,160);
  }
  rows.push({
    page: path.basename(file),
    title: title || (titleDynamic ? '{dynamic}' : null),
    titleLength: tLen,
    titleStatus,
    description: description || (descDynamic ? '{dynamic}' : null),
    descLength: dLen,
    descStatus,
    titleSuggested,
    descSuggested
  });

  if(doFix && (titleSuggested || descSuggested)){
    let updated = raw;
    if(titleSuggested){
      updated = updated.replace(/<title>[^<]{0,200}<\/title>/i, `<title>${titleSuggested}</title>`);
    }
    if(descSuggested){
      updated = updated.replace(/<meta([^>]+)name=["']description["']([^>]+)content=["'][^"']+["']([^>]*)>/i, `<meta$1name="description"$2content="${descSuggested}"$3>`);
    }
    if(updated !== raw){
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`[fix] ${path.basename(file)} angepasst.`);
    }
  }
}

const summary = {
  checked: rows.length,
  titleOk: rows.filter(r=>r.titleStatus==='ok').length,
  descOk: rows.filter(r=>r.descStatus==='ok').length
};

fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), mode:{suggest:doSuggest, fix:doFix}, rows, summary }, null, 2));
console.log('Meta Length Report -> docs/meta-length-report.json');
for(const r of rows){
  const sugT = r.titleSuggested ? ' →T*' : '';
  const sugD = r.descSuggested ? ' →D*' : '';
  console.log(`${r.page.padEnd(28)} | title ${String(r.titleLength).padStart(3)} ${r.titleStatus.padEnd(11)} | desc ${String(r.descLength).padStart(3)} ${r.descStatus}${sugT}${sugD}`);
}
if(doSuggest){
  console.log('\nLegende: →T* / →D* = Vorschlag vorhanden (siehe JSON).');
}