#!/usr/bin/env node
/**
 * Focus Audit
 * Scannt alle JSX/TSX Dateien und versucht potenziell interaktive Elemente zu finden,
 * die weder ein eindeutiges Focus Styling (focus:, focus-visible:, data-[state=focus]) noch
 * eine erlaubte Ausnahme Klasse besitzen.
 * Ergebnis: JSON Report + konsolen Output. Exit Code 0 (nur Governance, kein Hard-Fail).
 */
import fs from 'fs';
import path from 'path';

const ROOTS = [
	path.resolve(process.cwd(),'src'),
	path.resolve(process.cwd(),'Arbeitsverzeichnis','src')
].filter(p=>fs.existsSync(p));
if(!ROOTS.length){
	console.error('❌ Kein src Verzeichnis gefunden.');
	process.exit(0);
}

const EXT = /\.(jsx|tsx)$/;
const INTERACTIVE_TAGS = ['button','a','input','select','textarea'];
// Heuristik: role oder tabIndex können Div/Span auch interaktiv machen.
const INTERACTIVE_ROLE_HINT = /role\s*=\s*"(button|link|tab|switch|checkbox|radio)"/;
const INTERACTIVE_TABINDEX = /tabIndex\s*=\s*"?[0-9]+"?/;

// Klassen die Focus-Styling signalisieren.
const FOCUS_CLASS_HINT = /(focus:|focus-visible:|focus-visible|outline-none|focus-ring)/;
// False Positives Whitelist (z.B. rein dekorative Links im Footer?) -> minimal halten.
const CLASS_WHITELIST = [
	'sr-only',
	'pointer-events-none'
];

const findings = [];

function walk(dir){
	for(const e of fs.readdirSync(dir,{withFileTypes:true})){
		if(e.name.startsWith('.')) continue;
		const p = path.join(dir,e.name);
		if(e.isDirectory()) walk(p); else if(EXT.test(e.name)) analyzeFile(p);
	}
}

function analyzeFile(file){
	const src = fs.readFileSync(file,'utf8');
	const lines = src.split(/\n/);
	// Simple multi-line tag buffer
	let buffer = '';
	let bufferStart = 0;
	const flushBuffer = () => { buffer=''; bufferStart=0; };
	lines.forEach((line,idx)=>{
		if(line.includes('data-ignore-focus-audit')) return;
		// Accumulate if we are inside an opening tag without closing '>' (rough heuristic)
		if(/<([a-zA-Z]+)([^>]*)$/.test(line) && !line.trim().endsWith('>')){
			if(!buffer){ bufferStart = idx; }
			buffer += line + '\n';
			return; // wait for closure
		}
		if(buffer){
			buffer += line;
			if(!line.includes('>')) return; // still not closed
			// process buffered multi-line tag as single line
			processLine(buffer, bufferStart);
			flushBuffer();
			return;
		}
		processLine(line, idx);
	});

	function processLine(line, idx){
		for(const tag of INTERACTIVE_TAGS){
			// ensure we don't match longer tag names starting with same letter (e.g. <a vs <article>)
			const tagRegex = new RegExp(`<${tag}(?![a-zA-Z0-9_-])([^>]*)>`,'g');
			let m; while((m = tagRegex.exec(line))){
				const attrs = m[1];
				const classValMatch = attrs.match(/className=\{?"([^"]+)"/) || attrs.match(/className=\{?`([^`]+)`/);
				const classVal = classValMatch?classValMatch[1]:'';
				const isWhitelisted = CLASS_WHITELIST.some(c=>classVal.includes(c));
				const hasFocus = FOCUS_CLASS_HINT.test(classVal || attrs);
				if(!isWhitelisted && !hasFocus){
					findings.push({ file, line: idx+1, tag, snippet: line.trim().slice(0,180) });
				}
			}
		}
		if(/<(div|span)/.test(line) && (INTERACTIVE_ROLE_HINT.test(line) || INTERACTIVE_TABINDEX.test(line))){
			const hasFocus = FOCUS_CLASS_HINT.test(line);
			if(!hasFocus){
				findings.push({ file, line: idx+1, tag: 'div|span[interactive]', snippet: line.trim().slice(0,180) });
			}
		}
	}
}

ROOTS.forEach(r=>walk(r));

const outDir = path.resolve(process.cwd(),'docs');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});

// Optional: Vorherigen Report laden für Diff
const prevFile = path.join(outDir,'focus-audit-report-prev.json');
let prev = null;
if(fs.existsSync(prevFile)){
	try { prev = JSON.parse(fs.readFileSync(prevFile,'utf8')); } catch {}
}

const report = {
	generated: new Date().toISOString(),
	// Nachbearbeitung: False Positives herausfiltern, wenn in den Folge-/Vorzeilen der gleiche Tag ein focus-visible:focus-ring enthält
};

// False Positive Filter: Für jedes Finding prüfen wir die nächsten und vorherigen 3 Zeilen auf das Vorhandensein
// von focus-visible:focus-ring innerhalb derselben öffnenden Tag-Struktur (primitive Heuristik).
function filterFalsePositives(list){
	return list.filter(f => {
		try {
			const content = fs.readFileSync(f.file,'utf8').split(/\n/);
			const start = Math.max(0, f.line - 4);
			const end = Math.min(content.length, f.line + 3);
			const windowText = content.slice(start,end).join('\n');
			if(/focus-visible:focus-ring/.test(windowText)){
				// Falls der ursprüngliche Klassenwert wirklich keine Focus Klasse hat UND nur durch truncation entstanden ist → ignorieren
				return false;
			}
			return true;
		} catch { return true; }
	});
}

const filteredFindings = filterFalsePositives(findings);
report.totalFindings = filteredFindings.length;
report.findings = filteredFindings;
report.originalFindings = findings.length;
report.filteredOut = findings.length - filteredFindings.length;
report.diff = prev ? {
	previous: prev.totalFindings,
	delta: filteredFindings.length - prev.totalFindings
} : null;
// Ende Nachbearbeitung

const outFile = path.join(outDir,'focus-audit-report.json');
fs.writeFileSync(outFile, JSON.stringify(report,null,2));
// Schreibe neue Version auch als prev für nächsten Run
fs.writeFileSync(prevFile, JSON.stringify(report,null,2));

if(filteredFindings.length){
	console.log(`⚠️  Focus Audit: ${filteredFindings.length} potenziell fehlende Focus Styles (gefiltert ${report.filteredOut} False Positives).`);
	if(report.diff) console.log(`(Delta vs vorher: ${report.diff.delta >=0? '+':''}${report.diff.delta})`);
	filteredFindings.slice(0,20).forEach(f=> console.log(`${f.file}:${f.line} -> ${f.snippet}`));
	if(filteredFindings.length>20) console.log(`… ${filteredFindings.length-20} weitere Einträge.`);
	console.log('Report:', outFile);
} else {
	console.log(`✅ Focus Audit: Keine Probleme gefunden (gefiltert ${report.filteredOut} False Positives).`);
	if(report.diff) console.log(`(Vorher: ${report.diff.previous}, Delta: ${report.diff.delta})`);
	console.log('Report:', outFile);
}
process.exit(0);
