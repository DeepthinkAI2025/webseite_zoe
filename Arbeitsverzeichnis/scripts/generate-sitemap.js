#!/usr/bin/env node
/**
 * Generiert eine einfache sitemap.xml auf Basis definierter Routen + vorhandener Page Files.
 * Erweiterbar: Blog Posts (wenn Slugs verfügbar), Glossar etc.
 */
import fs from 'fs';
import path from 'path';
import { successStories } from '../src/data/successStories.js';

const origin = process.env.SITEMAP_ORIGIN || 'https://example.com';
const staticRoutes = [
  '/', '/warum-zoe','/technologie','/projekte','/ueber-uns','/preise-kosten','/finanzierung-foerderung','/service','/faq','/erfolgsgeschichten','/blog','/guide','/rechner','/angebote','/kontakt','/impressum','/datenschutz','/photovoltaik-kosten','/stromspeicher'
];

// Future hook: blog slugs (scan content directory)
function buildXml(urls){
  const items = urls.map(u=>`  <url>\n    <loc>${origin + u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u==='/'? '1.0':'0.7'}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

// Dynamische Erfolgsgeschichten Detailseiten
const dynamicSuccessStoryRoutes = successStories.map(s => `/erfolgsgeschichten/${s.slug}`);

const allRoutes = [
  ...staticRoutes,
  ...dynamicSuccessStoryRoutes
];

const xml = buildXml(allRoutes);
if(!fs.existsSync('public')) fs.mkdirSync('public');
fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated -> public/sitemap.xml (', allRoutes.length, 'urls; static', staticRoutes.length, 'dynamic', dynamicSuccessStoryRoutes.length, ')');