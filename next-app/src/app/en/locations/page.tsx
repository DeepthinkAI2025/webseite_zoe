import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Service Areas',
  description: 'Regional focus areas and expansion roadmap for ZOE Solar.',
  canonicalPath: '/en/locations'
});

const regions = [
  { name: 'Berlin', focus: 'Urban rooftop optimization' },
  { name: 'Brandenburg', focus: 'Suburban + agrivoltaic feasibility' },
  { name: 'Saxony', focus: 'Expansion / partner network build-up' }
];

export default function LocationsEn(){
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-en-locations"
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/en' },
          { name: 'Service Areas', url: '/en/locations' }
        ])}
      />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Service Areas</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">Overview of current primary regions and strategic expansion zones.</p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {regions.map(r=> (
          <div key={r.name} className="rounded border p-4 bg-white/50 dark:bg-neutral-900/40">
            <h2 className="font-medium mb-1">{r.name}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.focus}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
