import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import faqData from '../../../../content/seo/faq.json';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description: 'Frequently asked questions about PV, storage, cost structure and payback.',
  canonicalPath: '/en/faq'
});

export default function FaqEn(){
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-en-faq" data={breadcrumbJsonLd([{ name: 'Home', url: '/en' }, { name: 'FAQ', url: '/en/faq' }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">FAQ</h1>
      <div className="space-y-6">
        {(faqData as any[]).slice(0,8).map((f,i)=> (
          <div key={i} className="rounded border p-4 bg-white/40 dark:bg-neutral-900/40">
            <h2 className="font-medium mb-2 text-lg">{f.q}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
