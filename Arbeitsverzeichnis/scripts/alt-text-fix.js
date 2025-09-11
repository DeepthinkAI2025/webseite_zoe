#!/usr/bin/env node
/**
 * Versucht fehlende ALT Attribute automatisch zu ergänzen.
 * Heuristik: nimmt vorhandene Variablen alt=..., title=..., oder generiert aus Dateiname.
 * Schreibt modifizierte Dateien (in-place) und erstellt diff report.
 */
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const patterns = ['src/pages/**/*.jsx','src/components/**/*.jsx'];
const changes = [];

function deriveAltFromSrc(src){
  try {
    const base = src.split('?')[0].split('/').pop();
    if(!base) return 'Bild';
    return base.replace(/[-_]/g,' ').replace(/\.[a-z0-9]+$/i,'').replace(/\s+/g,' ').trim().slice(0,60);
  } catch { return 'Bild'; }
}

(async () => {
  const files = await globby(patterns);
  for(const file of files){
    let code = fs.readFileSync(file,'utf-8');
    const original = code;
    // match <img ...> without alt attr
    code = code.replace(/<img(?![^>]*\balt=)([^>]*?)>/g,(m,attrs)=>{
      // try extract candidate from title or aria-label or src
      const title = attrs.match(/title=\"([^\"]+)\"/);
      const aria = attrs.match(/aria-label=\"([^\"]+)\"/);
      const src = attrs.match(/src=\"([^\"]+)\"/);
      const candidate = (title?.[1] || aria?.[1] || deriveAltFromSrc(src?.[1]||''));
      const alt = candidate.replace(/"/g,'').trim() || 'Bild';
      return `<img alt="${alt}" ${attrs}>`;
    });
    if(code!==original){
      fs.writeFileSync(file, code);
      changes.push({ file, diff: 'alt attributes added' });
    }
  }
  fs.writeFileSync('docs/alt-text-fix-report.json', JSON.stringify({ generated: new Date().toISOString(), changes }, null,2));
  console.log('ALT auto-fix complete. Changes:', changes.length);
})();
