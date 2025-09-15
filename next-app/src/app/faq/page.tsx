import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import faqData from '@/content/seo/faq.json';
import { faqJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import UpdatedBadge from '@/components/UpdatedBadge';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ – Häufige Fragen Photovoltaik',
  description: 'Antworten zu Kosten, Amortisation, Speicher und Garantien rund um Photovoltaik-Anlagen 2025.',
  canonicalPath: '/faq'
});

export default function FaqPage(){
  const faqs = (faqData as Array<{ q:string; a:string; short?:string }>);
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-faq"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'FAQ', url: '/faq' }
        ])}
      />
      <JsonLd
        id="ld-faq-full"
        data={faqJsonLd(faqs.map(f=> ({ q: f.q, a: f.a })))}
      />
      <JsonLd
        id="ld-faq-speakable"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          speakable: {
            '@type': 'SpeakableSpecification',
            xpath: [
              "//section[@aria-label='Fragen und Antworten']/div[1]/h2",
              "//section[@aria-label='Fragen und Antworten']/div[2]/h2"
            ]
          },
          url: 'https://example.com/faq'
        }}
      />
      <header className="mb-10 text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">FAQ – Photovoltaik 2025</h1>
        <p className="text-muted-foreground text-base md:text-lg">Kompakte Antworten auf die wichtigsten Fragen zu Kosten, Wirtschaftlichkeit und Technik.</p>
        <div className="flex justify-center"><UpdatedBadge date={new Date()} /></div>
      </header>
      <section aria-label="Fragen und Antworten" className="divide-y divide-neutral-200 bg-white border rounded-md">
        {faqs.map((f,i)=> (
          <div key={i} className="p-6">
            <h2 className="text-lg font-semibold mb-2">{f.q}</h2>
            <p className="text-sm leading-relaxed text-neutral-700">{f.a}</p>
            {f.short && (<p className="mt-2 text-xs text-neutral-500" aria-label="Kurzfassung">Kurz: {f.short}</p>)}
          </div>
        ))}
      </section>
    </div>
  );
}
