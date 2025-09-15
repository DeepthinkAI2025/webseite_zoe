#!/usr/bin/env node
/**
 * Generate AudioObject / PodcastEpisode JSON-LD
 *
 * Beispiele:
 *  node scripts/seo/generate-audio-schema.mjs \
 *    --title "Interview mit Solar Expertin" \
 *    --description "Diskussion über Eigenverbrauch und Speicheroptimierung" \
 *    --uploadDate 2025-09-13 \
 *    --duration PT18M12S \
 *    --contentUrl https://cdn.example.com/audio/episode1.mp3 \
 *    --embedUrl https://www.example.com/podcast/episode-1 \
 *    --publisher "ZOE Solar" \
 *    --speaker "Dr. Energie" \
 *    --out audio-schema.json
 *
 * Flags:
 *  --podcast true  (nutzt PodcastEpisode statt AudioObject)
 *  --series "Podcast Reihe" (falls PodcastEpisode) 
 *  --episodeNumber 5
 */
import fs from 'fs';
import path from 'path';

function parseArgs(){ const a=process.argv.slice(2); const o={}; for(let i=0;i<a.length;i++){ if(a[i].startsWith('--')){ const k=a[i].replace(/^--/,''); const v=a[i+1] && !a[i+1].startsWith('--') ? a[++i] : 'true'; o[k]=v; } } return o; }
const argv = parseArgs();

const required = ['title','description','uploadDate'];
for(const r of required){ if(!argv[r]){ console.error('Missing --'+r); process.exit(1);} }

const isPodcast = argv.podcast === 'true';

const base = {
  '@context': 'https://schema.org',
  '@type': isPodcast ? 'PodcastEpisode' : 'AudioObject',
  name: argv.title,
  description: argv.description,
  uploadDate: argv.uploadDate,
  duration: argv.duration || undefined,
  contentUrl: argv.contentUrl || undefined,
  embedUrl: argv.embedUrl || undefined,
  publisher: argv.publisher ? { '@type': 'Organization', name: argv.publisher } : undefined,
  actor: argv.speaker ? [{ '@type': 'Person', name: argv.speaker }] : undefined,
  partOfSeries: (isPodcast && argv.series) ? { '@type': 'PodcastSeries', name: argv.series } : undefined,
  episodeNumber: (isPodcast && argv.episodeNumber) ? Number(argv.episodeNumber) : undefined
};

Object.keys(base).forEach(k => base[k] === undefined && delete base[k]);

const outFile = argv.out || 'audio-schema.json';
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(base, null, 2));
console.log('Wrote', base['@type'], 'schema to', outFile);
