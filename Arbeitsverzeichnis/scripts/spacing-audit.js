#!/usr/bin/env node
// spacing-audit.js
// Analysiert JSX/TSX Dateien nach:
// 1. Nutzung von Einzelabständen mt-10/12/16
// 2. Sequenzen von direkt aufeinanderfolgenden Container-Divs im selben Eltern-Block mit eigenen mt-* (Kandidaten für space-y-*)
// 3. Häufigkeit aller mt-* Klassen
// Ausgabe: JSON Report unter docs/spacing-audit-report.json

import fs from 'fs';
import path from 'path';

const ROOT_CANDIDATES = [
  path.resolve('Arbeitsverzeichnis/src'),
  path.resolve('src')
];
const SRC = ROOT_CANDIDATES.find(p=>fs.existsSync(p));
if(!SRC){
  console.error('[spacing-audit] Kein src Verzeichnis gefunden.');
  process.exit(1);
}

const FILE_RE = /\.(jsx|tsx)$/;
const MT_RE = /mt-(\d{1,2})\b/g; // einfache Erkennung

const TARGET_BIG = new Set(['10','12','16']);

const files=[];
function walk(d){
  for(const e of fs.readdirSync(d,{withFileTypes:true})){
    if(e.name.startsWith('.')|| e.name==='node_modules') continue;
    const p = path.join(d,e.name);
    if(e.isDirectory()) walk(p); else if(FILE_RE.test(e.name)) files.push(p);
  }
}
walk(SRC);

const usage = {}; // mt value -> count
const bigOccurrences = []; // {file,line,value,snippet}

function lineInfo(content, idx){
  const lines = content.slice(0, idx).split(/\n/).length;
  return lines;
}

// Primitive Heuristik für Sequenzen: Suche aufeinanderfolgende Zeilen mit <div className="... mt-X ...">
function detectSequences(content, file){
  const seq = [];
  const lines = content.split(/\n/);
  let current=[]; let lastWasCandidate=false;
  lines.forEach((l,i)=>{
    const m = l.match(/<div[^>]*className=\"([^\"]*\bmt-(\d{1,2})\b[^\"]*)\"/);
    if(m){
      current.push({ line:i+1, value:m[2], classBlock:m[1] });
      lastWasCandidate=true;
    } else {
      if(lastWasCandidate){ if(current.length>2) seq.push(current); current=[]; }
      lastWasCandidate=false;
    }
  });
  if(lastWasCandidate && current.length>2) seq.push(current);
  return seq.map(s=>({ file, length:s.length, values:s.map(v=>v.value), lines:s.map(v=>v.line) }));
}

const sequences=[];

for(const f of files){
  const txt = fs.readFileSync(f,'utf-8');
  let m; while((m = MT_RE.exec(txt))){
    usage[m[1]] = (usage[m[1]]||0)+1;
    if(TARGET_BIG.has(m[1])){
      const line = lineInfo(txt, m.index);
      bigOccurrences.push({ file: f.replace(process.cwd()+"/",''), line, value:m[1] });
    }
  }
  sequences.push(...detectSequences(txt, f.replace(process.cwd()+"/",'')));
}

const suggestions = [];
// Empfehlung: Wenn Sequenz >=3 und <=2 unterschiedliche Werte -> space-y vereinheitlichen
for(const seq of sequences){
  const distinct = Array.from(new Set(seq.values));
  if(distinct.length<=2){
    // Wahl: häufigster Wert
    const freq = {}; distinct.forEach(v=>freq[v]=seq.values.filter(x=>x===v).length);
    const target = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];
    suggestions.push({
      type:'flow-spacing',
      file: seq.file,
      lines: seq.lines,
      currentValues: seq.values,
      recommended: `Ersetze individuelle mt-* durch parent Wrapper mit space-y-${target}`
    });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  root: SRC.replace(process.cwd()+"/",''),
  totals: { files: files.length, mtClasses: Object.values(usage).reduce((a,b)=>a+b,0) },
  usage: Object.fromEntries(Object.entries(usage).sort((a,b)=>Number(a[0])-Number(b[0]))),
  bigOccurrences,
  sequenceCandidates: suggestions
};

const outDir = path.join(path.dirname(SRC),'docs');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'spacing-audit-report.json'), JSON.stringify(report,null,2));
console.log('[spacing-audit] Report geschrieben:', path.join(outDir,'spacing-audit-report.json'));
if(!suggestions.length) console.log('[spacing-audit] Keine Sequenz-Kandidaten gefunden oder bereits konsolidiert.');
