#!/usr/bin/env node
/**
 * City Content Similarity Audit
 *
 * Ziel: Verhindern von Duplicate / Near-Duplicate Content zwischen City Landing Pages.
 * Metrik: Cosine Similarity auf TF-IDF Basis (vereinfachtes lokales Modell).
 *
 * Output:
 *  - docs/city-content-similarity.json
 *  - docs/city-content-similarity.md (Tabelle + Risikoliste)
 *  - optional Diff gegen vorherige JSON via --prev <datei>
 *
 * Heuristik Flags:
 *  similarity >= 0.90 => HIGH (kritisch, fast identisch)
 *  0.85 <= similarity < 0.90 => MED (Überarbeiten empfohlen)
 *  0.80 <= similarity < 0.85 => LOW (Beobachten / leichte Anpassung)
 *
 * Nutzung:
 *   node scripts/seo/city-content-audit.mjs [--threshold 0.80] [--prev docs/alte.json]
 *
 * Optional:
 *   --top N  (nur Top N höchste Similarities ausgeben)
 *   --markdown-only  (nur Markdown Report schreiben)
 */
import fs from 'fs';
import path from 'path';

// Bestimme Projektwurzel relativ zu diesem Skript (robuster als process.cwd())
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
// Skript liegt in <root>/next-app/scripts/seo => wir wollen <root>/next-app
const projectRoot = path.resolve(scriptDir, '..', '..');
const cityDir = path.join(projectRoot, 'src', 'app', 'standorte');
const docsDir = path.join(projectRoot, 'docs');
const outJson = path.join(docsDir, 'city-content-similarity.json');
const outMd = path.join(docsDir, 'city-content-similarity.md');

if(!fs.existsSync(cityDir)){
  console.error('City Verzeichnis nicht gefunden:', cityDir);
  process.exit(1);
}
if(!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

// --- CLI Args ---
const args = process.argv.slice(2);
function getArg(name, def){
  const i = args.indexOf(name);
  if(i === -1) return def;
  const val = args[i+1];
  if(!val || val.startsWith('--')) return true; // boolean flag
  return val;
}
const threshold = parseFloat(getArg('--threshold', '0.80'));
const topN = parseInt(getArg('--top', '0'), 10);
const markdownOnly = args.includes('--markdown-only');
const prevPath = getArg('--prev', null);
// Optional Weighted Terms Datei (Term → Faktor >1 verstärkt Relevanz)
import url from 'url';
const defaultWeightsPath = path.join(projectRoot, 'src', 'content', 'geo', 'similarity-weighted-terms.json');
const weightsArg = getArg('--weights', defaultWeightsPath);
let termWeights = new Map();
if(weightsArg && fs.existsSync(weightsArg)){
  try {
    const raw = JSON.parse(fs.readFileSync(weightsArg,'utf-8'));
    Object.entries(raw).forEach(([k,v]) => {
      const key = k.toLowerCase();
      const num = typeof v === 'number' ? v : parseFloat(v);
      if(!isNaN(num) && num > 0) termWeights.set(key, num);
    });
    if(termWeights.size) {
      console.log(`Weighted Terms geladen (${termWeights.size}) aus`, weightsArg);
    }
  } catch(e){
    console.warn('Konnte Weighted Terms Datei nicht parsen:', weightsArg, e.message);
  }
}

// --- Hilfsfunktionen ---
function listCityPages(){
  return fs.readdirSync(cityDir)
    .filter(name => !name.startsWith('.') && fs.statSync(path.join(cityDir,name)).isDirectory())
    .map(slug => ({ slug, file: path.join(cityDir, slug, 'page.tsx') }))
    .filter(entry => fs.existsSync(entry.file));
}

function extractText(file){
  const raw = fs.readFileSync(file,'utf-8');
  // Sehr einfache Extraktion: entferne Code/JSX Tags & JSON-LD Skript Blöcke
  return raw
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/[`'$\{\}\(\);]/g,' ')
    .replace(/<[^>]+>/g,' ') // JSX Tags
    .replace(/import [^\n]+/g,' ')
    .replace(/export (const|default) [^\n]+/g,' ')
    .replace(/\s+/g,' ')
    .toLowerCase();
}

function tokenize(text){
  return text
    .normalize('NFKD')
    .replace(/[^a-z0-9äöüß\s]/g,' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !stop.has(t));
}

const stop = new Set([
  'und','der','die','das','mit','ein','eine','oder','für','von','den','im','in','auf','zur','zum','ist','sind','bei','auch','aus','dem','wie','wir','sie','er','es','dass','nicht','nur','aber','noch','mehr','einfach','durch','kann','werden'
]);

function buildTf(tokens){
  const tf = new Map();
  tokens.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
  return tf;
}

function computeIdf(docs){
  const df = new Map();
  docs.forEach(doc => {
    const unique = new Set(doc.tokens);
    unique.forEach(t => df.set(t, (df.get(t)||0)+1));
  });
  const N = docs.length;
  const idf = new Map();
  df.forEach((v,k) => {
    idf.set(k, Math.log((N + 1) / (v + 1)) + 1); // smooth
  });
  return idf;
}

function vectorize(tf, idf){
  const vec = new Map();
  tf.forEach((count, term) => {
    const weightFactor = termWeights.get(term) || 1;
    const w = (count * weightFactor) * (idf.get(term) || 0);
    if(w) vec.set(term, w);
  });
  return vec;
}

function cosine(vecA, vecB){
  let dot = 0;
  let normA = 0;
  let normB = 0;
  vecA.forEach((a, term) => {
    normA += a * a;
    const b = vecB.get(term);
    if(b) dot += a * b;
  });
  vecB.forEach(b => { normB += b * b; });
  if(!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function tokenOverlap(tokensA, tokensB){
  const a = new Set(tokensA);
  const b = new Set(tokensB);
  let inter = 0;
  a.forEach(t => { if(b.has(t)) inter++; });
  const union = a.size + b.size - inter;
  if(!union) return 0;
  return inter / union; // Jaccard Overlap
}

function classify(sim){
  if(sim >= 0.90) return 'HIGH';
  if(sim >= 0.85) return 'MED';
  if(sim >= 0.80) return 'LOW';
  return 'OK';
}

// --- Pipeline ---
const pages = listCityPages();
if(pages.length < 2){
  console.error('Nicht genug City Pages für Vergleich. Gefunden:', pages.length);
  process.exit(2);
}

const docsData = pages.map(p => {
  const text = extractText(p.file);
  const tokens = tokenize(text);
  const tf = buildTf(tokens);
  return { ...p, text, tokens, tf };
});

const idf = computeIdf(docsData);
const vectors = docsData.map(d => ({ slug: d.slug, vec: vectorize(d.tf, idf), tokens: d.tokens }));

const pairs = [];
for(let i=0;i<vectors.length;i++){
  for(let j=i+1;j<vectors.length;j++){
    const a = vectors[i];
    const b = vectors[j];
    const sim = cosine(a.vec, b.vec);
    const overlap = tokenOverlap(a.tokens, b.tokens);
    if(sim >= threshold){
      pairs.push({ a: a.slug, b: b.slug, similarity: parseFloat(sim.toFixed(4)), overlap: parseFloat(overlap.toFixed(4)), severity: classify(sim) });
    }
  }
}

pairs.sort((x,y) => y.similarity - x.similarity);
const outputPairs = topN > 0 ? pairs.slice(0, topN) : pairs;

const summary = {
  generatedAt: new Date().toISOString(),
  threshold,
  weightsFile: termWeights.size ? weightsArg : null,
  weightedTerms: termWeights.size,
  pages: pages.map(p => p.slug),
  totalPairsAboveThreshold: outputPairs.length,
  distribution: {
    HIGH: outputPairs.filter(p => p.severity==='HIGH').length,
    MED: outputPairs.filter(p => p.severity==='MED').length,
    LOW: outputPairs.filter(p => p.severity==='LOW').length
  },
  pairs: outputPairs
};

// Diff gegen vorherige Version
let diff = null;
if(prevPath && fs.existsSync(prevPath)){
  try {
    const prev = JSON.parse(fs.readFileSync(prevPath,'utf-8'));
    const prevMap = new Map(prev.pairs?.map(p => [p.a + '||' + p.b, p]));
    diff = outputPairs.map(p => {
      const key = p.a + '||' + p.b;
      const old = prevMap.get(key) || null;
      return {
        ...p,
        prevSimilarity: old?.similarity ?? null,
        deltaSimilarity: old ? parseFloat((p.similarity - old.similarity).toFixed(4)) : null,
        prevOverlap: old?.overlap ?? null,
        deltaOverlap: old && old.overlap != null ? parseFloat((p.overlap - old.overlap).toFixed(4)) : null
      };
    });
    summary.diff = diff;
  } catch(e){
    console.warn('Konnte prev Datei nicht parsen:', prevPath, e.message);
  }
}

if(!markdownOnly){
  fs.writeFileSync(outJson, JSON.stringify(summary, null, 2) + '\n');
  console.log('JSON geschrieben:', outJson);
}

// Markdown Report
let md = `# City Content Similarity Report\n\n`;
md += `Generiert: ${summary.generatedAt}\n\n`;
md += `Threshold: ${threshold}\n\n`;
if(outputPairs.length === 0){
  md += `Keine Paare >= Threshold (${threshold}).\n`;
} else {
  md += `| Rank | City A | City B | Similarity | Overlap | Severity | Δ Sim |\n|------|--------|--------|------------|---------|----------|------|\n`;
  outputPairs.forEach((p,idx) => {
    const diffEntry = diff?.find(d => d.a===p.a && d.b===p.b);
    const deltaSimPct = diffEntry?.deltaSimilarity != null ? (diffEntry.deltaSimilarity*100).toFixed(1)+'%' : '';
    md += `| ${idx+1} | ${p.a} | ${p.b} | ${(p.similarity*100).toFixed(1)}% | ${(p.overlap*100).toFixed(1)}% | ${p.severity} | ${deltaSimPct} |\n`;
  });
  md += `\n## Hinweise & Maßnahmen\n`;
  md += `- HIGH: Unverzüglich substantielle Umtextung (Unique lokale Faktoren einarbeiten).\n`;
  md += `- MED: Abschnitte erweitern (lokale Netzbetreiber, Förderprogramme, typische Dachformen, Verschattung).\n`;
  md += `- LOW: Beobachten; bei weiteren neuen Seiten evtl. differenzieren.\n`;
  md += `- OK: Keine unmittelbare Aktion.\n`;
}

fs.writeFileSync(outMd, md);
console.log('Markdown geschrieben:', outMd);

// Exit Code Policy
if(summary.distribution.HIGH > 0) process.exitCode = 3; // kritisch
else if(summary.distribution.MED > 0) process.exitCode = 2; // moderate
else if(summary.distribution.LOW > 0) process.exitCode = 0; // erlauben aber aufmerksam
else process.exitCode = 0;
