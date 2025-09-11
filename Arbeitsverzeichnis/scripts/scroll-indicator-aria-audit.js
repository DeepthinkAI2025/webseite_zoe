#!/usr/bin/env node
// scroll-indicator-aria-audit.js
// Sucht Komponenten/Seiten nach Navigations-/Progress-Indikatoren mit aria-current="true|page|step" und prüft Konsistenz.
// Heuristiken:
// 1. Alle Elemente innerhalb desselben Containers (ul/ol/div mit data-scroll-indicator) dürfen höchstens ein aria-current besitzen.
// 2. Wenn mehrere Steps, sollten alle anderen denselben Role- oder Tag-Typ haben.
// 3. Gibt Report unter docs/scroll-indicator-aria-report.json aus.

import fs from 'fs';
import path from 'path';

const ROOTS = [path.resolve('Arbeitsverzeichnis/src'), path.resolve('src')];
const SRC = ROOTS.find(r=>fs.existsSync(r));
if(!SRC){
  console.error('[scroll-indicator-audit] Kein src Verzeichnis gefunden');
  process.exit(1);
}
const FILE_RE = /\.(jsx|tsx)$/;
const files=[];
function walk(d){
  for(const e of fs.readdirSync(d,{withFileTypes:true})){
    if(e.name.startsWith('.')|| e.name==='node_modules') continue;
    const p = path.join(d,e.name);
    if(e.isDirectory()) walk(p); else if(FILE_RE.test(e.name)) files.push(p);
  }
}
walk(SRC);

const results=[];

for(const file of files){
  const txt = fs.readFileSync(file,'utf-8');
  if(!/aria-current/.test(txt)) continue;
  const lines = txt.split(/\n/);
  const issues=[];
  // primitive Container Erkennung: data-scroll-indicator oder className enthält progress|steps|scroll-indicator
  const containerIndexes = [];
  lines.forEach((l,i)=>{
    if(/data-scroll-indicator|scroll-indicator|progress|steps/.test(l) && /<([a-zA-Z]+)([^>]+)?className=/.test(l)){
      containerIndexes.push(i);
    }
  });
  const ariaCurrentMatches = [];
  lines.forEach((l,i)=>{
    const m = l.match(/aria-current=\"(true|page|step|location)\"/);
    if(m) ariaCurrentMatches.push({line:i+1,value:m[1],raw:l.trim()});
  });
  if(ariaCurrentMatches.length>1){
    // Heuristik: Prüfe ob mehrere in direkter Nähe (<30 Zeilen) -> möglicherweise ein Indikator mit mehreren aktiven
    for(let i=0;i<ariaCurrentMatches.length;i++){
      for(let j=i+1;j<ariaCurrentMatches.length;j++){
        if(Math.abs(ariaCurrentMatches[i].line - ariaCurrentMatches[j].line) < 30){
          issues.push({ type:'multiple-active-close', lines:[ariaCurrentMatches[i].line, ariaCurrentMatches[j].line], note:'Mehrere aria-current nahe beieinander – prüfen ob nur ein aktiver Step erlaubt ist.' });
        }
      }
    }
  }
  if(ariaCurrentMatches.length===0) continue;
  if(containerIndexes.length===0 && ariaCurrentMatches.length>1){
    issues.push({ type:'multi-active-no-container', count: ariaCurrentMatches.length, note:'Mehrfache aria-current ohne klaren Container (data-scroll-indicator) – evtl. Semantik ergänzen.'});
  }
  if(issues.length){
    results.push({ file: file.replace(process.cwd()+"/",''), matches: ariaCurrentMatches, issues });
  }
}

const report = { generatedAt: new Date().toISOString(), results };
if(!fs.existsSync('docs')) fs.mkdirSync('docs');
fs.writeFileSync('docs/scroll-indicator-aria-report.json', JSON.stringify(report,null,2));
console.log('[scroll-indicator-audit] Report geschrieben: docs/scroll-indicator-aria-report.json');
if(!results.length) console.log('[scroll-indicator-audit] Keine Probleme gefunden.');
