import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, offersJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Solar Pricing 2025 – Transparent Packages',
  description: 'Package-based solar system pricing 2025: includes installation, long-term warranty & modular scalability.',
  canonicalPath: '/en/pricing'
});

export default function PricingEn(){
  const bundles = [
    { id:'pv-basic', title:'Solar Basic', price:'€18,900' },
    { id:'pv-storage', title:'Solar Complete', price:'€24,900' },
    { id:'pv-premium', title:'Solar Premium', price:'€32,900' }
  ];
  return (
    <div className="px-6 py-16 max-w-4xl mx-auto">
      <JsonLd id="ld-offers-en-pricing" data={offersJsonLd(bundles as any)} />
      <JsonLd id="ld-breadcrumb-en-pricing" data={breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Pricing', url: '/pricing' }])} />
      <h1 className="text-4xl font-bold tracking-tight mb-6">Solar Pricing – 2025</h1>
      <p className="text-neutral-700 leading-relaxed mb-10">Indicative package prices (incl. installation). Detailed feature parity with German version will follow.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {bundles.map(b => (
          <div key={b.id} className="border rounded-md p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{b.title}</h2>
            <div className="text-neutral-900 font-bold">{b.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
