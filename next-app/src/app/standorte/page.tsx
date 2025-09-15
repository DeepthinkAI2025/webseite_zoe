import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import localBiz from '@/content/geo/localbusiness.json';
import citiesData from '@/content/geo/cities.json';

export const metadata: Metadata = buildMetadata({
  title: 'Standorte & Regionen – Photovoltaik Service',
  description: 'Regionale Schwerpunkte: Berlin, Brandenburg, Sachsen – Planung, Installation & Service für PV-Anlagen mit Fokus auf Qualität & Amortisation.',
  canonicalPath: '/standorte'
});

export default function StandortePage(){
  const cities = (citiesData as any[] ) as { slug: string; name: string }[];
  const areaRegions = Array.from(new Set(cities.map(c => c.name)));
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Photovoltaik Standorte & Servicegebiete',
    itemListElement: cities.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.zoe-solar.de/standorte/${c.slug}`,
      name: c.name
    }))
  };
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <JsonLd
        id="ld-breadcrumb-standorte"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Standorte', url: '/standorte' }
        ])}
      />
      <JsonLd id="ld-itemlist-standorte" data={itemList} />
      <h1 className="text-4xl font-bold tracking-tight mb-6">Regionale Standorte & Servicegebiete</h1>
      <p className="text-neutral-700 leading-relaxed max-w-3xl mb-10">Unser Kernfokus liegt aktuell auf dem Nordost-Markt: urbane Dachflächen in Berlin, Einfamilien- und Bestandsobjekte in Brandenburg sowie wachsende PV-Cluster in Sachsen. Diese Konzentration erlaubt hohe Prozess-Tiefe, kurze Reaktionszeiten und optimierte Logistik.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
  {cities.map(c => (
          <a key={c.slug} href={`/standorte/${c.slug}`} className="group border rounded-md p-5 bg-white shadow-sm hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500">
            <h2 className="text-lg font-semibold mb-1 group-hover:underline">{c.name}</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">Individuelle Auslegung, Wirtschaftlichkeits- & Speicher-Szenarien, dokumentierte Qualitätsprozesse.</p>
          </a>
        ))}
      </div>
      <section className="space-y-6" aria-labelledby="faq-standorte-heading">
        <h2 id="faq-standorte-heading" className="text-2xl font-bold tracking-tight">Regionale Kurzfragen</h2>
        <dl className="divide-y divide-neutral-200 border rounded-md bg-white">
          <div className="p-5">
            <dt className="font-medium text-neutral-800">Fahrtkosten / Anfahrt?</dt>
            <dd className="mt-2 text-sm text-neutral-700">In den Kernregionen enthalten – außerhalb nach transparenter Staffelung. Bündelung mehrerer Projekte reduziert Aufwand.</dd>
          </div>
          <div className="p-5">
            <dt className="font-medium text-neutral-800">Lokale Partner?</dt>
            <dd className="mt-2 text-sm text-neutral-700">Zertifizierte Elektro- und Dachteams mit dokumentierten Qualitäts-Checklisten & Abnahmeprotokoll.</dd>
          </div>
          <div className="p-5">
            <dt className="font-medium text-neutral-800">Netzbetreiber Erfahrung?</dt>
            <dd className="mt-2 text-sm text-neutral-700">Strukturierter Prozess inkl. notwendiger Formulare & Fristen – reduzierte Wartezeiten bis Inbetriebnahme.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
