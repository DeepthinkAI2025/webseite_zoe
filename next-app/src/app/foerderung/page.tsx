import { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Leichter Shared Cache (nicht strikt erforderlich, aber konsistent mit Detailseite)
interface FoerderCacheEntry { meta: { slug:string; title:string; updated?:string }; ts: number }
const LIST_CACHE: { entries: FoerderCacheEntry[]; ts: number } = { entries: [], ts: 0 };
const LIST_TTL_MS = 5 * 60 * 1000;
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, howToJsonLd, faqJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = buildMetadata({
  title: 'Förderung & EEG Überblick',
  description: 'Aktuelle Photovoltaik Förderungen, EEG Vergütung, steuerliche Aspekte & Beantragungsprozesse – strukturiert & aktualisierbar.',
  canonicalPath: '/foerderung'
});

function loadGeneratedFoerderung(){
  const now = Date.now();
  if((now - LIST_CACHE.ts) < LIST_TTL_MS && LIST_CACHE.entries.length){
    return LIST_CACHE.entries.map(e=>e.meta);
  }
  const dir = path.join(process.cwd(),'content','generated','foerderung');
  if(!fs.existsSync(dir)) return [] as { slug:string; title:string; updated?:string }[];
  const list = fs.readdirSync(dir)
    .filter(f=>f.endsWith('.mdx'))
    .map(f=>{
      const raw = fs.readFileSync(path.join(dir,f),'utf8');
      const { data } = matter(raw);
      return { slug: f.replace(/\.mdx$/,''), title: data.title as string, updated: data.updated as string|undefined };
    })
    .sort((a,b)=> (b.updated||'').localeCompare(a.updated||''));
  LIST_CACHE.entries = list.map(meta => ({ meta, ts: now }));
  LIST_CACHE.ts = now;
  return list;
}

export default function FoerderungPage(){
  const foerderungen = loadGeneratedFoerderung();
  const itemList = foerderungen.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Photovoltaik Förderprogramme Übersicht',
    itemListElement: foerderungen.map((f,i)=> ({
      '@type': 'ListItem',
      position: i+1,
      url: `https://www.zoe-solar.de/foerderung/${f.slug}`,
      name: f.title
    }))
  } : null;
  const collectionPage = foerderungen.length ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Förderprogramme Photovoltaik Deutschland 2025',
    description: 'Bundesweite Übersicht PV & Speicher Förderprogramme (manuell + automatisch angereichert).',
    hasPart: foerderungen.map(f=> ({
      '@type': 'WebPage',
      name: f.title,
      url: `https://www.zoe-solar.de/foerderung/${f.slug}`
    }))
  } : null;
  const howTo = howToJsonLd({
    name: 'PV Förderung beantragen',
    description: 'Schrittfolge von Bedarfsermittlung über Antrag bis Bewilligung.',
    steps: [
      { name: 'Fördertopf identifizieren', text: 'Bundes-/Landesprogramme, KfW, regionale Netzbetreiber prüfen.' },
      { name: 'Unterlagen vorbereiten', text: 'Lastprofil, Angebot, technische Datenblätter, ggf. Steuer-ID.' },
      { name: 'Antrag Einreichen', text: 'Fristen & Budgetfenster beachten – Eingang bestätigen lassen.' },
      { name: 'Bewilligung & Umsetzung', text: 'Nach Zusage Projekt umsetzen, Nachweise fristgerecht liefern.' }
    ]
  });
  const faq = faqJsonLd([
    { q: 'Wann gilt Nullsteuer (0% USt)?', a: 'Für Lieferung & Installation definierter PV Komponenten bis 30 kWp (privat) unter geltenden Voraussetzungen.' },
    { q: 'Wie lange dauert eine Förderbewilligung?', a: 'Je nach Programm 2–12 Wochen. Engpass sind oft Budgetfenster & Vollständigkeit.' }
  ]);
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
  <JsonLd id="ld-breadcrumb-foerderung" data={breadcrumbJsonLd([{ name:'Start', url:'/' }, { name:'Förderung', url:'/foerderung' }])} />
  {itemList && <JsonLd id="ld-itemlist-foerderung" data={itemList} />}
      {collectionPage && <JsonLd id="ld-collectionpage-foerderung" data={collectionPage} />}
      <JsonLd id="ld-howto-foerderung" data={howTo} />
      <JsonLd id="ld-faq-foerderung" data={faq} />
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Förderung & EEG Überblick</h1>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Zentrale Orientierung über Zuschüsse, EEG Vergütung, steuerliche Vorteile & Ablauf von Förderanträgen.</p>
      </header>
  <section className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-semibold text-lg mb-3">Vergütung</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>EEG Einspeisevergütung</li>
            <li>Marktwert Solar</li>
            <li>Autarkie vs. Einspeisequote</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Programme</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>KfW Kredit / Zuschuss</li>
            <li>Landesförderungen</li>
            <li>Kommunale Boni</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-3">Steuer & Recht</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>0% Umsatzsteuer</li>
            <li>Gewerbesteuerliche Einordnung</li>
            <li>Anlagenabschreibung</li>
          </ul>
        </div>
      </section>
      {foerderungen.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Aktuelle Förderprogramme (Generiert)</h2>
          <ul className="space-y-3 text-sm text-neutral-700">
            {foerderungen.map(f=> (
              <li key={f.slug} className="flex items-start justify-between gap-4 border-b pb-2">
                <a className="text-blue-600 underline" href={`/foerderung/${f.slug}`}>{f.title}</a>
                {f.updated && <span className="text-xs text-neutral-500">{new Date(f.updated).toISOString().slice(0,10)}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
