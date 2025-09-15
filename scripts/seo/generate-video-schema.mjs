#!/usr/bin/env node
/**
 * Generate VideoObject JSON-LD
 *
 * Beispiel:
 *   node scripts/seo/generate-video-schema.mjs \
 *     --title "PV Speicher Erklärung" \
 *     --description "Kurzer Überblick zur Funktionsweise moderner Batteriespeicher" \
 *     --thumbnail https://example.com/thumbs/pv-speicher.jpg \
 *     --uploadDate 2025-09-13 \
 *     --duration PT2M30S \
 *     --contentUrl https://cdn.example.com/videos/pv-speicher.mp4 \
 *     --embedUrl https://www.example.com/videos/pv-speicher \
 *     --publisher "ZOE Solar" \
 *     --out video-schema.json
 *
 * Optional Clips (Kapitel): --clips clips.json (Array von {name,startOffset,endOffset, url(optional)})
 * Optional Transkript: --transcript transcript.txt (Datei, wird als potentialAction Speakable / oder als Text eingebettet)
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();

const required = ['title','description','thumbnail','uploadDate'];
for(const r of required){ if(!argv[r]){ console.error('Missing --'+r); process.exit(1);} }

const data = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: argv.title,
  description: argv.description,
  thumbnailUrl: Array.isArray(argv.thumbnail) ? argv.thumbnail : [argv.thumbnail],
  uploadDate: argv.uploadDate,
  duration: argv.duration || undefined,
  contentUrl: argv.contentUrl || undefined,
  embedUrl: argv.embedUrl || undefined,
  publisher: argv.publisher ? { '@type': 'Organization', name: argv.publisher } : undefined,
  potentialAction: argv.transcript ? [{ '@type': 'SpeakAction', target: argv.embedUrl || argv.contentUrl || undefined }] : undefined
};

if(argv.clips && fs.existsSync(argv.clips)){
  try {
    const clips = JSON.parse(fs.readFileSync(argv.clips,'utf-8'));
    if(Array.isArray(clips) && clips.length){
      data.hasPart = clips.map(c => ({
        '@type': 'Clip',
        name: c.name,
        startOffset: c.startOffset,
        endOffset: c.endOffset,
        url: c.url || undefined
      }));
    }
  } catch(e){ console.warn('Could not parse clips file', e.message); }
}

if(argv.transcript && fs.existsSync(argv.transcript)){
  try {
    const transcript = fs.readFileSync(argv.transcript,'utf-8').trim();
    if(transcript){
      data.transcript = transcript.slice(0, 20000); // Limit safeguard
    }
  } catch(e){ console.warn('Could not attach transcript', e.message); }
}

// Clean undefined
Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

const outFile = argv.out || 'video-schema.json';
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
console.log('Wrote VideoObject schema to', outFile);
