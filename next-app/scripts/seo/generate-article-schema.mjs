#!/usr/bin/env node
/**
 * Generate Article Schema (optional Gemini assist)
 * Usage:
 *  node scripts/seo/generate-article-schema.mjs --title "Mein Artikel" --description "Kurze Beschreibung" --url https://example.com/blog/mein-artikel --date 2025-09-13 [--gemini]
 *  ENV: GEMINI_API_KEY (wenn --gemini gesetzt)
 */
import fs from 'fs';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();

const title = argv.title || 'Unbenannter Artikel';
const description = argv.description || 'Beschreibung folgt.';
const url = argv.url || 'https://example.com/';
const datePublished = argv.date || new Date().toISOString().slice(0,10);
const author = argv.author || 'ZOE Solar';

async function maybeEnhance(desc){
  if(!argv.gemini) return desc;
  const key = process.env.GEMINI_API_KEY;
  if(!key){
    console.warn('GEMINI_API_KEY missing, skipping enhancement'); return desc;
  }
  try {
    // Gemini REST (generative language) - using minimal JSON spec for text generation
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Formuliere eine prägnante, faktenorientierte Kurzbeschreibung (max 30 Wörter) für folgenden Artikel:\n${desc}` }] }],
        generationConfig: { temperature: 0.3 }
      })
    });
    if(!res.ok){ console.warn('Gemini response not ok', res.status); return desc; }
    const data = await res.json();
    const improved = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if(improved) return improved;
  } catch(e){ console.warn('Gemini enhancement failed', e); }
  return desc;
}

(async () => {
  const finalDesc = await maybeEnhance(description);
  const schema = {
    '@context':'https://schema.org',
    '@type':'Article',
    headline: title,
    description: finalDesc,
    author: { '@type':'Person', name: author },
    datePublished,
    mainEntityOfPage: { '@type':'WebPage', '@id': url },
    url
  };
  const out = argv.out || 'stdout';
  const json = JSON.stringify(schema, null, 2);
  if(out === 'stdout'){
    process.stdout.write(json + '\n');
  } else {
    fs.writeFileSync(out, json);
    console.log('Wrote schema', out);
  }
})();
