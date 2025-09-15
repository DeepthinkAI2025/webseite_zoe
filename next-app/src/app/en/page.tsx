import { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Photovoltaics & Energy Future',
  description: 'ZOE Solar – Planning, delivery & installation of PV systems incl. storage & wallbox. Transparent pricing & efficiency.',
  canonicalPath: '/en'
});

export default function HomeEn(){
  return (
    <div className="px-6 py-16 max-w-3xl mx-auto">
      <JsonLd id="ld-breadcrumb-en-home" data={breadcrumbJsonLd([{ name: 'Home', url: '/' }])} />
      <h1 className="text-4xl font-bold tracking-tight mb-4">ZOE Solar – Next.js Migration</h1>
      <p className="text-lg text-neutral-700 leading-relaxed">First English placeholder page. The full bilingual rollout (pricing, technology, contact) will follow iteratively.</p>
      <p className="mt-4 text-sm text-neutral-500">Alpha i18n preview – content not final.</p>
    </div>
  );
}
