import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: 'Get in touch with ZOE Solar – consultation for PV systems, storage and wallbox solutions.',
  canonicalPath: '/en/contact'
});

export default function ContactEnPage(){
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <JsonLd id="ld-breadcrumb-en-contact" data={breadcrumbJsonLd([{ name: 'Home', url: '/en' }, { name: 'Contact', url: '/en/contact' }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-4">Contact</h1>
      <p className="text-muted-foreground mb-8">We respond within one business day with an initial assessment of your solar project.</p>
      <section className="grid gap-10 md:grid-cols-2" aria-label="Contact form and info">
        <form className="space-y-4" aria-label="Contact form placeholder">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input id="name" className="w-full rounded border px-3 py-2 text-sm" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" className="w-full rounded border px-3 py-2 text-sm" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="msg">Message</label>
            <textarea id="msg" rows={4} className="w-full rounded border px-3 py-2 text-sm" placeholder="Project details"></textarea>
          </div>
          <button type="submit" className="inline-flex items-center rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Send (Demo)</button>
          <p className="text-xs text-muted-foreground">Demo only – submission logic to be added.</p>
        </form>
        <div>
          <h2 className="text-xl font-semibold mb-4">Direct</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>Email:</strong> service@zoe-solar.de</li>
            <li><strong>Phone:</strong> +49 (0) XXX / XXXXXXX</li>
            <li><strong>Location:</strong> Musterstraße 12, 12345 Musterstadt</li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">We process personal data solely to answer your request.</p>
        </div>
      </section>
    </main>
  );
}
