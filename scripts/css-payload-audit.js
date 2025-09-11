#!/usr/bin/env node
// Einfache CSS Payload & Redundanz Übersicht
// 1) Liest gebaute CSS Datei aus dist (falls vorhanden) sonst aus src/styles
// 2) Meldet: Gesamtgröße, Anzahl Regeln, Häufigkeit ausgewählter Utilities
// 3) Optional: JSON Report für spätere Diff-Vergleiche
import fs from 'fs';
import path from 'path';

function findBuiltCSS(){
	// Prüfe mehrere potenzielle Build-Pfade (Ausführung kann aus Root oder Unterordner erfolgen)
	const candidates = [
		path.resolve('Arbeitsverzeichnis/dist/assets'),
		path.resolve('dist/assets'),
		path.join(path.dirname(new URL(import.meta.url).pathname), '../Arbeitsverzeichnis/dist/assets')
	];
	for(const dir of candidates){
		try {
			if(fs.existsSync(dir)){
				const css = fs.readdirSync(dir).find(f=>/^index-.*\.css$/.test(f));
				if(css) return path.join(dir, css);
			}
		} catch {/* ignore */}
	}
	return null;
}

const cssFile = findBuiltCSS() || path.resolve('Arbeitsverzeichnis/src/styles/index.css');
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

if(!fs.existsSync('Arbeitsverzeichnis/docs')) fs.mkdirSync('Arbeitsverzeichnis/docs', { recursive: true });
fs.writeFileSync('Arbeitsverzeichnis/docs/css-payload-report.json', JSON.stringify(report,null,2));

console.log('[css-payload-audit] Report erstellt:', report);
