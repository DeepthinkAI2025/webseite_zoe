#!/usr/bin/env node
/**
 * City Page Generator
 * Usage: node scripts/generate-city-page.mjs <slug> "CityName" "Optional Title"
 */
import fs from 'fs';
import path from 'path';

// Load optional meta (variation pools) & clusters
function loadJsonSafe(p){
  try { return JSON.parse(fs.readFileSync(p,'utf-8')); } catch { return null; }
}
const variationMeta = loadJsonSafe(path.join(projectRoot,'src','content','geo','cities-meta.json'));
const clusters = loadJsonSafe(path.join(projectRoot,'src','content','geo','city-clusters.json')) || [];
const cityDataList = loadJsonSafe(path.join(projectRoot,'src','content','geo','city-data.json')) || [];

function cityData(slug){
  return cityDataList.find(c => c.slug === slug);
}

function pickRandom(arr, n){
  if(!Array.isArray(arr)) return [];
  const copy = [...arr];
  const out=[]; while(copy.length && out.length<n){ out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); }
  return out;
}

function buildUsp(city){
  if(variationMeta?.uspPool){
    const base = pickRandom(variationMeta.uspPool, 4);
    return base;
  }
  return [
    'Regionale Prozess-Erfahrung',
    'Optimierte Speicher & Hybrid Wechselrichter',
    'Netzbetreiber Abstimmung & Dokumentation',
    'Monitoring & Performance Analyse'
  ];
}

function buildFaqs(city){
  if(variationMeta?.faqPool){
    return pickRandom(variationMeta.faqPool, 3).map(f=>({ q: f.q, a: f.a }));
  }
  return [
    { q: 'Wie lange dauert die Installation?', a: 'Typisch 1–3 Tage Montage, plus Netzbetreiber Freigabe.' },
    { q: 'Welche Dachtypen sind geeignet?', a: 'Flach-, Sattel-, Pult- und weitere – Voraussetzung statische Eignung & geringe Verschattung.' },
    { q: 'Brauche ich eine Baugenehmigung?', a: 'Meist nicht – Ausnahmen bei Denkmalschutz / Sonderfällen.' }
  ];
}

function crossLinks(slug){
  for(const cluster of clusters){
    if(cluster.cities?.includes(slug)){
      const list = cluster.crosslink?.[slug] || [];
      return list.map(s => `/<li><a class=\"text-blue-600 underline\" href=\"/standorte/${s}\">Photovoltaik ${s.charAt(0).toUpperCase()+s.slice(1)}</a></li>`).join('');
    }
  }
  return '';
}

// Resolve project root robustly (script located in <root>/next-app/scripts)
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(scriptDir, '..');

const [,, slug, cityName, titleArg] = process.argv;
if(!slug || !cityName){
  console.error('Usage: node scripts/generate-city-page.mjs <slug> "CityName" [Optional Title]');
  process.exit(1);
}
const title = titleArg || `Photovoltaik Installation ${cityName} – Planung & Montage`;

const baseDir = path.join(projectRoot, 'src', 'app', 'standorte', slug);
if(fs.existsSync(baseDir)){
  console.warn('Directory already exists, skipping page creation:', baseDir);
} else {
  fs.mkdirSync(baseDir, { recursive: true });
}

const usp = buildUsp(slug);
const faqs = buildFaqs(slug);
const cData = cityData(slug);

const template = `import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/seo/jsonld';
import localBiz from '@/content/geo/localbusiness.json';

export const metadata: Metadata = buildMetadata({
  title: '${title}',
  description: 'Regionale Planung, Installation & Wartung von Photovoltaik Anlagen – angepasst an lokale Dach- & Netzbetreiber-Strukturen.',
  canonicalPath: '/standorte/${slug}'
});

export default function ${cityName.replace(/[^A-Za-z0-9]/g,'')}StandortPage(){
  const usp = ${JSON.stringify(usp)};
  const faqs = ${JSON.stringify(faqs)};
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Start', url: '/' },
        { name: 'Standorte', url: '/standorte' },
        { name: '${cityName}', url: '/standorte/${slug}' }
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd({
        name: localBiz.name,
        url: 'https://www.zoe-solar.de/standorte/${slug}',
        email: localBiz.email,
        phone: localBiz.phone,
        street: localBiz.street,
        postalCode: localBiz.postalCode,
        city: '${cityName}',
        country: localBiz.country,
        openingHours: localBiz.openingHours,
        latitude: localBiz.latitude,
        longitude: localBiz.longitude,
        priceRange: localBiz.priceRange,
        sameAs: localBiz.sameAs,
        areaServed: ['${cityName}']
      })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }) }} />
      <header className="text-center mb-10">
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Photovoltaik Installation ${cityName}</h1>
  <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Planung → Installation → Monitoring – wirtschaftlich optimiert für regionale Bedingungen.</p>
      </header>
      <section>
        <h2 className="text-xl font-semibold mb-4">Leistungen</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
          <li>Dachanalyse & Verschattung</li>
          <li>Auslegung Module & Wechselrichter</li>
          <li>Speicher & Hybrid Systeme</li>
          <li>Wallbox Vorbereitung</li>
          <li>Netzbetreiber Anmeldung</li>
          <li>Monitoring & Performance Tracking</li>
        </ul>
      </section>
  ${'`'}${cData ? `<section className=\"mt-12\"><h2 className=\"text-xl font-semibold mb-4\">Regionale Kennzahlen & Kontext</h2><div className=\"grid md:grid-cols-2 gap-6 text-sm text-neutral-700\"><ul className=\"space-y-2\"><li><strong>Globalstrahlung:</strong> ${cData.insolationKwhM2} kWh/m²</li><li><strong>Spezifischer Ertrag:</strong> ${cData.specificYieldRange} kWh/kWp</li><li><strong>Speicher Hinweis:</strong> ${cData.storageAdoptionHint}</li></ul><ul className=\"space-y-2\"><li><strong>Netzanschluss Ablauf:</strong> ${cData.gridProcessNote}</li><li><strong>Verschattungsrisiko:</strong> ${cData.shadingRisk}</li><li><strong>Dachmix:</strong> ${cData.roofMixNote}</li></ul></div></section>`: ''}${'`'}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">USP</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">{usp.map(u => <li key={u}>{u}</li>)}</ul>
      </section>
      <section className="mt-12 bg-neutral-50 border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-2">Netzanschluss & Anmeldung</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">Bearbeitungszeiten, Portal Links & typische Verzögerungsfaktoren findest du im Leitfaden: <a href="/netzanschluss#netzbetreiber-portale" className="text-blue-600 underline">Netzanschluss Übersicht</a>. FAQ zur Zählersetzung & Unterlagen: <a href="/netzanschluss#faq-netzanschluss" className="text-blue-600 underline">FAQ Netzanschluss</a>.</p>
      </section>
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">FAQ</h2>
        <dl className="space-y-6 text-sm text-neutral-700">
          {faqs.map(f => (
            <div key={f.q}>
              <dt className="font-medium">{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      ${'`'}${crossLinks(slug) ? `<section className=\"mt-12\"><h2 className=\"text-xl font-semibold mb-4\">Weitere Standorte (Region)</h2><ul className=\"list-disc pl-5 space-y-1 text-sm\">${crossLinks(slug)}</ul></section>` : ''}${'`'}
    </main>
  );
}
`;

if(!fs.existsSync(path.join(baseDir, 'page.tsx'))){
  fs.writeFileSync(path.join(baseDir, 'page.tsx'), template, 'utf-8');
  console.log('Created city page at', path.join(baseDir, 'page.tsx'));
} else {
  console.log('Page already exists, not overwriting:', path.join(baseDir, 'page.tsx'));
}

// Update cities registry
const citiesFile = path.join(projectRoot, 'src', 'content', 'geo', 'cities.json');
try {
  let list = [];
  if(fs.existsSync(citiesFile)){
    list = JSON.parse(fs.readFileSync(citiesFile,'utf-8'));
  }
  if(!list.find(c => c.slug === slug)){
    list.push({ slug, name: cityName });
    list.sort((a,b) => a.slug.localeCompare(b.slug));
    fs.writeFileSync(citiesFile, JSON.stringify(list, null, 2));
    console.log('Updated cities.json');
  } else {
    console.log('cities.json already contains slug');
  }
} catch(e){
  console.warn('Could not update cities.json', e);
}
