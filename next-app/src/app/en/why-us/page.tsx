import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Why Us',
  description: 'Value propositions: quality assurance, transparent economics, rapid execution.',
  canonicalPath: '/en/why-us'
});

const values = [
  { title: 'Efficiency First', text: 'Structured engineering process & yield optimization from the first layout.' },
  { title: 'Transparent Pricing', text: 'Clear bill of materials and payback guidance.' },
  { title: 'Quality Assurance', text: 'Checklist-driven install & commissioning protocols.' },
  { title: 'Scalable Monitoring', text: 'Foundations for performance tracking & anomaly detection.' }
];

export default function WhyUsEn(){
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-en-whyus" data={breadcrumbJsonLd([{ name: 'Home', url: '/en' }, { name: 'Why Us', url: '/en/why-us' }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Why Us</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
        {values.map(v=> (
          <div key={v.title} className="rounded border p-5 bg-white/40 dark:bg-neutral-900/40">
            <h2 className="font-semibold tracking-tight mb-2">{v.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
