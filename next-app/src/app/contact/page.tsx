import type { Metadata } from 'next';
import React from 'react';
import { breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
// Der JSON Content liegt im Projekt-Root unter content/, nicht unter src/ → daher relativer Import.
import localBiz from '../../../content/geo/localbusiness.json';
import { buildMetadata } from '@/lib/seo/metadata';
import { QA } from '@/components/gaio/QA';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = buildMetadata({
  title: 'Kontakt',
  description: 'Nehmen Sie Kontakt mit ZOE Solar auf – Beratung zu Photovoltaik, Speicher und Wallbox. Schnelle und unverbindliche Anfrage.',
  canonicalPath: '/contact'
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd
        id="ld-breadcrumb-contact"
        data={breadcrumbJsonLd([
          { name: 'Start', url: '/' },
          { name: 'Kontakt', url: '/contact' }
        ])}
      />
      <JsonLd
        id="ld-localbusiness-contact"
        data={localBusinessJsonLd({
          name: localBiz.name,
          url: 'https://www.zoe-solar.de',
          email: localBiz.email,
          phone: localBiz.phone,
          street: localBiz.street,
          postalCode: localBiz.postalCode,
          city: localBiz.city,
          country: localBiz.country,
          openingHours: localBiz.openingHours,
          latitude: localBiz.latitude,
          longitude: localBiz.longitude,
          priceRange: localBiz.priceRange,
          sameAs: localBiz.sameAs,
          areaServed: ['Berlin','Brandenburg','Sachsen']
        })}
      />
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Kontakt</h1>
        <p className="mt-3 text-muted-foreground text-base md:text-lg">Wir beantworten Ihre Fragen zu Planung, Installation und Förderung von PV-Anlagen.</p>
      </header>

      <section className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Schnelle Anfrage</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Direkter Kontakt</h2>
          <ul className="space-y-3 text-sm" aria-label="Kontaktinformationen">
            <li><strong>E-Mail:</strong> <a className="text-emerald-700 underline" href="mailto:service@zoe-solar.de">service@zoe-solar.de</a></li>
            <li><strong>Telefon:</strong> <a className="text-emerald-700" href="tel:+49000000000">+49 (0) XXX / XXXXXXX</a></li>
            <li><strong>Standort:</strong> Musterstraße 12, 12345 Musterstadt</li>
          </ul>
          <div className="mt-8">
            <h3 className="font-medium mb-2">Hinweis zur Reaktionszeit</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">Wir melden uns in der Regel innerhalb von 24 Stunden mit einer qualifizierten Erstbewertung Ihres Projekts.</p>
          </div>
          <div className="mt-6 border-l-4 pl-4 border-emerald-500 bg-emerald-50 py-2 rounded">
            <p className="text-xs text-emerald-900">Datenschutz: Ihre Angaben werden vertraulich behandelt und ausschließlich zur Beantwortung Ihrer Anfrage verwendet.</p>
          </div>
        </div>
      </section>
      <section className="mt-16 border-t pt-10" data-gaio-block="qa-group" aria-label="Kontakt FAQ Kurz">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Kontakt Fragen</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <QA headingLevel={3} question="Wie schnell erhalte ich eine Antwort?" answer="In der Regel innerhalb von 24 Stunden an Werktagen mit einer ersten Einordnung." />
          <QA headingLevel={3} question="Welche Basisinfos helfen?" answer="Postleitzahl, Dachform, ungefähre Stromrechnung & gewünschte Speichergröße." />
          <QA headingLevel={3} question="Sind Vor-Ort Termine nötig?" answer="Erstbewertung meist remote – Vor-Ort nach technischer Präzisierung oder Besonderheiten." />
          <QA headingLevel={3} question="Welche Daten speichert ihr?" answer="Nur zweckgebundene Anfragedaten – keine Weitergabe an Dritte ohne Zustimmung." />
        </div>
      </section>
    </main>
  );
}

// ContactForm jetzt ausgelagert in separater Client Komponente
