#!/usr/bin/env node
// Neutralisiert Tailwind gray-* Utilities (text/bg/border + state variants) -> neutral-* Skala.
// Fokus: Entfernt Abhängigkeit von default gray Palette zugunsten custom Neutral Tokens.
// Ersetzt Muster in allen (t|j)sx? Dateien unter Arbeitsverzeichnis/src.
import fs from 'fs';
import path from 'path';

// Workspace Struktur: Hauptprojektordner /Arbeitsverzeichnis enthält src
// Script kann sowohl aus root als auch aus ./Arbeitsverzeichnis ausgeführt werden.
const candidatePaths = [
  path.resolve(process.cwd(),'Arbeitsverzeichnis','src'),
  path.resolve(process.cwd(),'src')
];
const root = candidatePaths.find(p=>fs.existsSync(p));
if(!root){
  console.error('Kein src Verzeichnis gefunden (erwartet ./Arbeitsverzeichnis/src oder ./src)');
  process.exit(1);
}
const exts = /\.(jsx?|tsx?)$/;
const shades = ['50','100','200','300','400','500','600','700','800','900'];

// Patterns (prefix optional variant like hover:, focus:, md:hover:, disabled:, group-hover:) erhalten
// Wir ersetzen nur den Teil gray-<shade> nach neutral-<shade> in bekannten utility Segmenten
const utilityPrefixes = [
  'text','bg','border','hover:text','hover:bg','hover:border','focus:text','focus:bg','focus:border',
  'active:text','active:bg','active:border','disabled:text','disabled:bg','disabled:border','group-hover:text','group-hover:bg','group-hover:border'
];

let fileCount=0, replaceCount=0;

function buildRegexes(){
  const regs=[];
  for(const pre of utilityPrefixes){
    for(const s of shades){
      // Handle variant chains like md:hover:text-gray-600
      // We just look for `${pre}-gray-${s}` where pre may appear at end of a variant chain (\b ensures boundary)
      const classFragment = pre.replace(/[:]/g,':');
      regs.push({
        shade:s,
        pre,
        re: new RegExp(`${classFragment}-gray-${s}(?=\b)`, 'g')
      });
    }
  }
  return regs;
}

const regs = buildRegexes();

function transform(content){
  let out = regs.reduce((acc,{re,shade,pre})=>acc.replace(re, match => {
    replaceCount++;
    return match.replace(`gray-${shade}`,`neutral-${shade}`);
  }), content);
  // Fallback: einfache Klassen wie bg-gray-100, border-gray-200 die evtl. nicht von obigen Varianten erfasst wurden
  for(const s of shades){
    const plain = new RegExp(`(?<![a-z-])bg-gray-${s}(?=\\b)`,'g');
    const plainBorder = new RegExp(`(?<![a-z-])border-gray-${s}(?=\\b)`,'g');
    const plainText = new RegExp(`(?<![a-z-])text-gray-${s}(?=\\b)`,'g');
    out = out.replace(plain, ()=>{ replaceCount++; return `bg-neutral-${s}`; })
             .replace(plainBorder, ()=>{ replaceCount++; return `border-neutral-${s}`; })
             .replace(plainText, ()=>{ replaceCount++; return `text-neutral-${s}`; });
  }
  return out;
}

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.')) continue;
    const p = path.join(dir,entry.name);
    if(entry.isDirectory()) walk(p); else if(exts.test(entry.name)){
      const orig = fs.readFileSync(p,'utf8');
      const changed = transform(orig);
      if(changed!==orig){ fs.writeFileSync(p,changed); fileCount++; }
    }
  }
}

walk(root);
console.log(`Neutralize Gray: ${fileCount} Dateien geändert, ${replaceCount} Ersetzungen (text/bg/border inkl. states).`);