#!/usr/bin/env node
// Einfache CSS Payload & Redundanz Übersicht
// 1) Liest gebaute CSS Datei aus dist (falls vorhanden) sonst aus src/styles
// 2) Meldet: Gesamtgröße, Anzahl Regeln, Häufigkeit ausgewählter Utilities
// 3) Optional: JSON Report für spätere Diff-Vergleiche
import fs from 'fs';
import path from 'path';

// Migration Hinweis:
// Entfernt Hardcoded "Arbeitsverzeichnis" Pfade. Script funktioniert jetzt für Next.js Build Output
// (.next/static/css) und fällt ansonsten auf Tailwind Quell-CSS unter next-app/src/app/globals.css zurück.
// Ausgabe wandert nach ./next-app/docs anstatt Arbeitsverzeichnis/docs.

function findBuiltCSS(){
  // Next.js build CSS (Turbopack / webpack) kann unterschiedlich heißen – wir suchen nach allen .css unter .next/static/css
  const root = process.cwd();
  const nextCssDir = path.join(root, 'next-app', '.next', 'static', 'css');
  if(fs.existsSync(nextCssDir)){
    const files = fs.readdirSync(nextCssDir).filter(f=>f.endsWith('.css'));
    // Heuristik: größte Datei = aggregierte globale CSS
    if(files.length){
      const sorted = files.map(f=>({f, size: fs.statSync(path.join(nextCssDir,f)).size}))
        .sort((a,b)=>b.size-a.size);
      return path.join(nextCssDir, sorted[0].f);
    }
  }
  return null;
}

// Fallback: globale Tailwind Datei (kann angepasst werden falls Struktur ändert)
const fallback = path.join(process.cwd(), 'next-app','src','app','globals.css');
const cssFile = findBuiltCSS() || fallback;
if(!fs.existsSync(cssFile)){
	console.error('[css-payload-audit] Keine CSS Datei gefunden. Bitte zuerst build ausführen.');
	process.exit(1);
}

const css = fs.readFileSync(cssFile,'utf-8');
const bytes = Buffer.byteLength(css,'utf-8');
const kb = (bytes/1024).toFixed(2);

// Naive Zählung: Regeln via '{' – Kommentare ausklammern
const noComments = css.replace(/\/\*[\s\S]*?\*\//g,'');
const ruleCount = (noComments.match(/{/g)||[]).length;

// Utility Frequenzen (erweiterbar)
const UTILITIES = ['mt-10','mt-12','mt-16','bg-white/','shadow','rounded-2xl'];
const utilityUsage = {};
UTILITIES.forEach(u=>{ utilityUsage[u] = (css.match(new RegExp(u,'g'))||[]).length; });

const report = {
	file: path.relative(process.cwd(), cssFile),
	size: { bytes, kb: +kb },
	ruleCount,
	utilityUsage,
	generatedAt: new Date().toISOString()
};

const outDir = path.join(process.cwd(),'next-app','docs');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
const outFile = path.join(outDir,'css-payload-report.json');
fs.writeFileSync(outFile, JSON.stringify(report,null,2));

console.log('[css-payload-audit] Report erstellt:', { ...report, outFile: path.relative(process.cwd(), outFile) });
