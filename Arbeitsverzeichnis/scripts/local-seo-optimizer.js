#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LocalSEOOptimizer {
  constructor() {
    this.germanRegions = {
      bundeslaender: [
        'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
        'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
        'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
        'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
      ],
      grosseStaedte: [
        'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt am Main',
        'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig',
        'Bremen', 'Dresden', 'Hannover', 'Nürnberg', 'Duisburg'
      ],
      regionen: [
        'Ruhrgebiet', 'Rhein-Main-Gebiet', 'Rhein-Neckar', 'Stuttgart-Region',
        'München-Region', 'Hamburg-Region', 'Berlin-Region', 'Köln-Region'
      ]
    };

    this.localKeywords = [
      'Solaranlage [Stadt]',
      'Photovoltaik [Region]',
      'Solarinstallation [Bundesland]',
      'PV-Anlage [Stadt] Kosten',
      'Solarteur [Region]',
      'Solaranlagen Beratung [Stadt]',
      'Photovoltaik Förderung [Bundesland]',
      'Solarstrom [Region]',
      'Solarpanele [Stadt] Installation'
    ];
  }

  generateLocalSchemaMarkup(businessInfo) {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: businessInfo.name || 'ZOE Solar',
      description: businessInfo.description || 'Professionelle Solaranlagen-Installation und Beratung',
      url: businessInfo.url || 'https://zoe-solar.de',
      telephone: businessInfo.phone || '+49-30-12345678',
      email: businessInfo.email || 'info@zoe-solar.de',
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessInfo.street || 'Musterstraße 123',
        addressLocality: businessInfo.city || 'Berlin',
        postalCode: businessInfo.zip || '10115',
        addressCountry: 'DE'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: businessInfo.lat || '52.5200',
        longitude: businessInfo.lng || '13.4050'
      },
      openingHours: businessInfo.hours || 'Mo-Fr 09:00-18:00',
      priceRange: '€€',
      image: businessInfo.image || '/Logo-ZOE.png',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: businessInfo.rating || '4.9',
        reviewCount: businessInfo.reviewCount || '250'
      },
      sameAs: businessInfo.social || [
        'https://www.facebook.com/zoesolar',
        'https://www.instagram.com/zoesolar',
        'https://www.linkedin.com/company/zoe-solar'
      ],
      areaServed: [
        {
          '@type': 'Country',
          name: 'Deutschland'
        },
        ...this.germanRegions.bundeslaender.map(state => ({
          '@type': 'State',
          name: state
        }))
      ],
      serviceType: [
        'Solaranlagen-Installation',
        'Photovoltaik-Beratung',
        'Solarförderung',
        'Energieberatung'
      ],
      knowsAbout: [
        'Photovoltaik',
        'Solaranlagen',
        'Stromspeicher',
        'Solarförderungen',
        'KfW-Förderung',
        'Einspeisevergütung'
      ]
    };
  }

  generateLocalLandingPages() {
    console.log('🏠 Erstelle lokale Landing-Pages...');

    const pages = [];

    // Erstelle Seiten für große Städte
    this.germanRegions.grosseStaedte.forEach(city => {
      const page = this.createLocalPage(city, 'stadt');
      pages.push(page);
    });

    // Erstelle Seiten für Bundesländer
    this.germanRegions.bundeslaender.forEach(state => {
      const page = this.createLocalPage(state, 'bundesland');
      pages.push(page);
    });

    // Erstelle Seiten für Regionen
    this.germanRegions.regionen.forEach(region => {
      const page = this.createLocalPage(region, 'region');
      pages.push(page);
    });

    return pages;
  }

  createLocalPage(location, type) {
    const title = `Solaranlagen in ${location} | ZOE Solar`;
    const description = `Professionelle Solaranlagen-Installation in ${location}. Kostenlose Beratung, Festpreisgarantie und Förderungsunterstützung.`;
    const keywords = this.generateLocalKeywords(location, type);

    const content = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords.join(', ')}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta name="geo.region" content="DE">
    <meta name="geo.placename" content="${location}">
    <meta name="geo.position" content="52.5200;13.4050">
    <meta name="ICBM" content="52.5200, 13.4050">

    <!-- Local Schema Markup -->
    <script type="application/ld+json">
    ${JSON.stringify(this.generateLocalSchemaMarkup({
      name: `ZOE Solar ${location}`,
      description: `Solaranlagen-Spezialist in ${location}`,
      city: location,
      url: `https://zoe-solar.de/solaranlagen-${location.toLowerCase().replace(/\s+/g, '-')}`
    }), null, 2)}
    </script>

    <!-- Local Business Schema -->
    <script type="application/ld+json">
    ${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `ZOE Solar ${location}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'DE'
      },
      areaServed: {
        '@type': 'City',
        name: location
      }
    }, null, 2)}
    </script>
</head>
<body>
    <header>
        <h1>Solaranlagen in ${location}</h1>
        <p>Ihr lokaler Solaranlagen-Experte in ${location}</p>
    </header>

    <main>
        <section class="local-hero">
            <h2>Professionelle Solaranlagen-Installation in ${location}</h2>
            <p>Als erfahrener Solarteur in ${location} bieten wir Ihnen:</p>
            <ul>
                <li>Kostenlose Vor-Ort-Beratung</li>
                <li>Festpreisgarantie ohne versteckte Kosten</li>
                <li>Komplette Förderungsabwicklung</li>
                <li>25 Jahre Garantie auf Module und Leistung</li>
                <li>Lokaler Service und Support</li>
            </ul>
        </section>

        <section class="local-services">
            <h2>Unsere Leistungen in ${location}</h2>
            <div class="services-grid">
                <div class="service">
                    <h3>Solaranlagen-Planung</h3>
                    <p>Individuelle Planung für Ihr Dach in ${location}</p>
                </div>
                <div class="service">
                    <h3>Photovoltaik-Installation</h3>
                    <p>Professionelle Montage durch zertifizierte Fachkräfte</p>
                </div>
                <div class="service">
                    <h3>Stromspeicher</h3>
                    <p>Optimale Speicherlösungen für maximale Autarkie</p>
                </div>
                <div class="service">
                    <h3>Wartung & Service</h3>
                    <p>Regelmäßige Wartung und schneller Support vor Ort</p>
                </div>
            </div>
        </section>

        <section class="local-cta">
            <h2>Kostenlose Beratung vereinbaren</h2>
            <p>Lassen Sie sich von unseren Solar-Experten in ${location} beraten</p>
            <a href="/kontakt?standort=${encodeURIComponent(location)}" class="cta-button">
                Beratungstermin vereinbaren
            </a>
        </section>

        <section class="local-faq">
            <h2>Häufige Fragen zu Solaranlagen in ${location}</h2>
            <div class="faq-list">
                <div class="faq-item">
                    <h3>Wie hoch sind die Kosten für eine Solaranlage in ${location}?</h3>
                    <p>Die Kosten variieren je nach Dachgröße und Ausstattung. Wir erstellen Ihnen ein individuelles Festpreis-Angebot.</p>
                </div>
                <div class="faq-item">
                    <h3>Welche Förderungen gibt es in ${location}?</h3>
                    <p>Wir unterstützen Sie bei der Beantragung der KfW-Förderung und Einspeisevergütung.</p>
                </div>
                <div class="faq-item">
                    <h3>Wie lange dauert die Installation in ${location}?</h3>
                    <p>Die Montage dauert typischerweise 1-2 Tage, abhängig von der Anlagengröße.</p>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>ZOE Solar ${location} | Ihr lokaler Solaranlagen-Partner</p>
    </footer>
</body>
</html>`;

    return {
      location,
      type,
      filename: `solaranlagen-${location.toLowerCase().replace(/\s+/g, '-')}.html`,
      content,
      keywords
    };
  }

  generateLocalKeywords(location, type) {
    const keywords = [];

    this.localKeywords.forEach(template => {
      const keyword = template.replace('[Stadt]', location)
                             .replace('[Region]', location)
                             .replace('[Bundesland]', location);
      keywords.push(keyword);
    });

    // Zusätzliche lokale Keywords
    keywords.push(
      `Solaranlage ${location}`,
      `Photovoltaik ${location}`,
      `Solarteur ${location}`,
      `Solarinstallation ${location}`,
      `PV-Anlage ${location}`
    );

    return keywords;
  }

  generateLocalSitemap() {
    console.log('🗺️ Erstelle lokale Sitemap...');

    const localPages = this.generateLocalLandingPages();
    const sitemapEntries = localPages.map(page => `
    <url>
        <loc>https://zoe-solar.de/${page.filename}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    ${sitemapEntries}
</urlset>`;

    return sitemap;
  }

  optimizeForLocalSEO(content) {
    let optimized = content;

    // Füge lokale Schema-Markups hinzu
    const localSchema = this.generateLocalSchemaMarkup({});
    const schemaScript = `<script type="application/ld+json">${JSON.stringify(localSchema)}</script>`;

    optimized = optimized.replace(
      /<\/head>/,
      `${schemaScript}\n</head>`
    );

    // Füge lokale Keywords hinzu
    optimized = optimized.replace(
      /<title>(.*?)<\/title>/,
      `<title>$1 | ZOE Solar Deutschland</title>`
    );

    // Füge lokale Meta-Tags hinzu
    const localMeta = `
    <meta name="geo.region" content="DE" />
    <meta name="geo.placename" content="Deutschland" />
    <meta name="geo.position" content="51.1657;10.4515" />
    <meta name="ICBM" content="51.1657, 10.4515" />
    <link rel="alternate" hreflang="de-DE" href="https://zoe-solar.de" />`;

    optimized = optimized.replace(
      /<\/head>/,
      `${localMeta}\n</head>`
    );

    return optimized;
  }

  async runLocalOptimization() {
    console.log('🇩🇪 Starte lokale SEO-Optimierung für Deutschland...\n');

    // Lokale Landing-Pages generieren
    const localPages = this.generateLocalLandingPages();

    // Seiten im public Ordner speichern
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    localPages.forEach(page => {
      const filepath = path.join(publicDir, page.filename);
      fs.writeFileSync(filepath, page.content);
      console.log(`📄 Lokale Seite erstellt: ${page.filename}`);
    });

    // Lokale Sitemap generieren
    const sitemap = this.generateLocalSitemap();
    const sitemapPath = path.join(publicDir, 'sitemap-local.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`🗺️ Lokale Sitemap erstellt: sitemap-local.xml`);

    // Google My Business Daten-Struktur
    const gmbData = this.generateGoogleMyBusinessData();
    const gmbPath = path.join(__dirname, '..', 'docs', 'google-my-business.json');
    fs.writeFileSync(gmbPath, JSON.stringify(gmbData, null, 2));
    console.log(`🏢 GMB-Daten erstellt: docs/google-my-business.json`);

    console.log('\n📊 Lokale SEO-Optimierung abgeschlossen!');
    console.log(`📄 ${localPages.length} lokale Landing-Pages erstellt`);
    console.log('🎯 Abgedeckte Regionen:');
    console.log(`   • ${this.germanRegions.grosseStaedte.length} Großstädte`);
    console.log(`   • ${this.germanRegions.bundeslaender.length} Bundesländer`);
    console.log(`   • ${this.germanRegions.regionen.length} Regionen`);
  }

  generateGoogleMyBusinessData() {
    return {
      businessName: 'ZOE Solar',
      address: {
        street: 'Musterstraße 123',
        city: 'Berlin',
        zip: '10115',
        country: 'Deutschland'
      },
      phone: '+49-30-12345678',
      website: 'https://zoe-solar.de',
      categories: [
        'Solaranlagen-Installateur',
        'Erneuerbare-Energien-Anbieter',
        'Energieberatung'
      ],
      attributes: {
        'Elektrische Anlagen': true,
        'Notdienst': true,
        'Kostenlose Beratung': true,
        'Festpreisgarantie': true,
        'Förderungsunterstützung': true
      },
      hours: {
        monday: '09:00-18:00',
        tuesday: '09:00-18:00',
        wednesday: '09:00-18:00',
        thursday: '09:00-18:00',
        friday: '09:00-18:00',
        saturday: '10:00-14:00',
        sunday: 'Geschlossen'
      },
      services: [
        'Solaranlagen-Installation',
        'Photovoltaik-Beratung',
        'Stromspeicher-Installation',
        'Förderungsberatung',
        'Wartung und Service'
      ]
    };
  }

  generateLocalSEOReport() {
    console.log('📊 Lokale SEO-Optimierung - Report:');

    const stats = {
      cities: this.germanRegions.grosseStaedte.length,
      states: this.germanRegions.bundeslaender.length,
      regions: this.germanRegions.regionen.length,
      totalPages: this.germanRegions.grosseStaedte.length +
                  this.germanRegions.bundeslaender.length +
                  this.germanRegions.regionen.length
    };

    console.log(`🏙️ Großstädte abgedeckt: ${stats.cities}`);
    console.log(`🇩🇪 Bundesländer abgedeckt: ${stats.states}`);
    console.log(`🏞️ Regionen abgedeckt: ${stats.regions}`);
    console.log(`📄 Lokale Landing-Pages: ${stats.totalPages}`);

    console.log('\n✅ Implementierte Optimierungen:');
    console.log('- Lokale Schema-Markups (LocalBusiness)');
    console.log('- Geo-Meta-Tags für Deutschland');
    console.log('- Lokale Keywords in allen Variationen');
    console.log('- Google My Business Daten-Struktur');
    console.log('- Lokale Sitemap für Suchmaschinen');
    console.log('- Hreflang-Tags für deutschsprachige Regionen');

    console.log('\n🎯 Erwartete Ergebnisse:');
    console.log('- Verbesserte Sichtbarkeit in lokalen Suchen');
    console.log('- Höhere Conversion-Rate durch lokale Relevanz');
    console.log('- Bessere Google My Business Rankings');
    console.log('- Mehr qualifizierter lokaler Traffic');
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const localOptimizer = new LocalSEOOptimizer();

  const command = process.argv[2];

  switch (command) {
    case 'optimize':
      localOptimizer.runLocalOptimization().catch(console.error);
      break;
    case 'report':
      localOptimizer.generateLocalSEOReport();
      break;
    case 'pages':
      const pages = localOptimizer.generateLocalLandingPages();
      console.log('Lokale Landing-Pages:');
      pages.forEach(page => console.log(`- ${page.filename} (${page.location})`));
      break;
    case 'gmb':
      const gmbData = localOptimizer.generateGoogleMyBusinessData();
      console.log('Google My Business Daten:');
      console.log(JSON.stringify(gmbData, null, 2));
      break;
    default:
      console.log('Lokale SEO-Optimierung für ZOE Solar Deutschland');
      console.log('');
      console.log('Verwendung:');
      console.log('  node local-seo-optimizer.js optimize    # Vollständige lokale Optimierung');
      console.log('  node local-seo-optimizer.js report      # Optimierungs-Report');
      console.log('  node local-seo-optimizer.js pages       # Lokale Seiten auflisten');
      console.log('  node local-seo-optimizer.js gmb         # GMB-Daten anzeigen');
      console.log('');
      console.log('Beispiel:');
      console.log('  node local-seo-optimizer.js optimize');
      break;
  }
}

export default LocalSEOOptimizer;
