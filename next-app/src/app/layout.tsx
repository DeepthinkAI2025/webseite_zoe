import type { Metadata } from "next";
import { organizationJsonLd, websiteJsonLd, googleBusinessProfileJsonLd, localBusinessJsonLd, serviceJsonLd, productJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
// Client-seitiger Web Vitals Collect wird dynamisch in VitalsListener abgewickelt
import { PersonaProvider } from '../legacy/context/PersonaContext';
import PrimaryNav from '@/components/PrimaryNav';
import VitalsListener from '@/components/VitalsListener';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import localBiz from '../../content/geo/localbusiness.json';
import gbp from '../../content/geo/google-business-profile.json';
import { IdlePrefetch } from '@/components/infra/IdlePrefetch';
import { headers as nextHeaders } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zoe-solar.de'),
  title: {
    default: 'ZOE Solar – Transparente Photovoltaik Komplettlösungen',
    template: '%s | ZOE Solar'
  },
  description: 'Planung, Lieferung & Montage von Photovoltaik-Anlagen inkl. Speicher & Wallbox. Festpreise, Effizienz & Transparenz.',
  applicationName: 'ZOE Solar',
  generator: 'Next.js 15',
  authors: [{ name: 'ZOE Solar' }],
  creator: 'ZOE Solar',
  publisher: 'ZOE Solar',
  alternates: {
    canonical: '/',
    languages: { 'de-DE': '/', 'en-US': '/en' }
  },
  openGraph: {
    type: 'website',
    siteName: 'ZOE Solar',
    title: 'ZOE Solar – Transparente Photovoltaik Komplettlösungen',
    description: 'Planung, Lieferung & Montage von Photovoltaik-Anlagen inkl. Speicher & Wallbox. Festpreise, Effizienz & Transparenz.',
    url: 'https://www.zoe-solar.de',
    locale: 'de_DE'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zoe_solar',
    creator: '@zoe_solar',
    title: 'ZOE Solar – Transparente Photovoltaik Komplettlösungen',
    description: 'Planung, Lieferung & Montage von Photovoltaik-Anlagen inkl. Speicher & Wallbox. Festpreise, Effizienz & Transparenz.'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png'
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // CSP Nonce aus Middleware Header
  const nonce = (nextHeaders() as any).get('x-nonce') || undefined;

  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} antialiased selection:bg-amber-300/70 selection:text-neutral-900`}>
        {/* Aggregierte Structured Data */}
        <JsonLd id="ld-global" data={[
          organizationJsonLd({ foundingDate: '2023-04-01' }),
          websiteJsonLd(),
          serviceJsonLd({
            name: 'Photovoltaik Planung & Installation',
            description: 'Komplette End-to-End Dienstleistung: Standortanalyse, Auslegung, Montage, Netz, Speicher, Monitoring.',
            areaServed: ['Deutschland'],
            serviceType: 'SolarPVInstallation',
            providerMobility: 'dynamic'
          }),
          productJsonLd({
            name: 'PV Komplettpaket Residential 8-12 kWp',
            description: 'Skalierbares PV Bundle inkl. Premium Modulen, Hybrid-Wechselrichter & Speicheroption.',
            sku: 'PV-BASE-8-12',
            capacityKwp: 10,
            image: '/images/pv-bundle.jpg'
          }),
          googleBusinessProfileJsonLd({
            name: gbp.name,
            url: gbp.url,
            mapUrl: gbp.mapUrl,
            placeId: gbp.placeId,
            categories: gbp.categories,
            aggregateRating: gbp.aggregateRating,
            street: localBiz.street,
            postalCode: localBiz.postalCode,
            city: localBiz.city,
            country: localBiz.country,
            phone: localBiz.phone
          }),
          localBusinessJsonLd({
            name: localBiz.name,
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zoe-solar.de',
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
          })
        ]} />
        <a href="#hauptinhalt" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-neutral-900 text-white px-4 py-2 rounded-md">Zum Inhalt springen</a>
        <PersonaProvider>
          <header className="border-b border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40" role="banner">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <div className="font-semibold text-neutral-800">ZOE Solar</div>
              <PrimaryNav />
            </div>
          </header>
          <ScrollProgress />
          <main id="hauptinhalt" className="min-h-[calc(100vh-3.5rem)]" role="main">{children}</main>
          <footer className="border-t border-neutral-200 bg-neutral-50 mt-12 text-sm" aria-labelledby="footer-nap-heading" role="contentinfo">
            <div className="max-w-6xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-3">
              <div>
                <h2 id="footer-nap-heading" className="font-semibold text-neutral-800 mb-3 text-base">{localBiz.name}</h2>
                <address className="not-italic leading-relaxed text-neutral-700" itemScope itemType="https://schema.org/Organization">
                  <div itemProp="name" className="sr-only">{localBiz.legalName || localBiz.name}</div>
                  <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span itemProp="streetAddress">{localBiz.street}</span><br />
                    <span><span itemProp="postalCode">{localBiz.postalCode}</span> <span itemProp="addressLocality">{localBiz.city}</span></span><br />
                    <span itemProp="addressCountry">{localBiz.country}</span>
                  </div>
                  <div className="mt-2">
                    <a href={`tel:${localBiz.phone}`} itemProp="telephone" className="text-emerald-700 hover:underline">{localBiz.phone}</a><br />
                    <a href={`mailto:${localBiz.email}`} itemProp="email" className="text-emerald-700 hover:underline">{localBiz.email}</a>
                  </div>
                </address>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3 text-base">Öffnungszeiten</h3>
                <ul className="space-y-1 text-neutral-700">
                  {localBiz.openingHours.map((oh: string) => <li key={oh}>{oh}</li>)}
                </ul>
                <div className="mt-4">
                  <h4 className="font-medium text-neutral-800 mb-2 text-sm">Regionale Schwerpunkte</h4>
                  <p className="text-neutral-700">Berlin · Brandenburg · Sachsen</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3 text-base">Folgen & Profile</h3>
                <ul className="space-y-2 text-neutral-700" aria-label="Social Links">
                  {localBiz.sameAs.map((url: string) => {
                    const label = url.replace('https://www.', '').replace('https://', '').replace(/\.com|\.de/, '').replace(/\/$/, '');
                    return <li key={url}><a rel="me" href={url} className="hover:underline" target="_blank" referrerPolicy="no-referrer">{label}</a></li>;
                  })}
                </ul>
              </div>
            </div>
            <div className="border-t border-neutral-200 py-4">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="text-xs text-neutral-500">© {new Date().getFullYear()} {localBiz.legalName || localBiz.name}. Alle Rechte vorbehalten.</p>
                <nav aria-label="Rechtliches" className="flex gap-4 text-xs text-neutral-600">
                  <a href="/imprint" className="hover:underline">Impressum</a>
                  <a href="/privacy" className="hover:underline">Datenschutz</a>
                  <a href="/faq" className="hover:underline">FAQ</a>
                </nav>
              </div>
            </div>
          </footer>
          <VitalsListener />
          <IdlePrefetch />
        </PersonaProvider>
      </body>
    </html>
  );
}
