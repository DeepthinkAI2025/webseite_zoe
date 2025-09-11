#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GoogleMyBusinessSetup {
  constructor() {
    this.businessData = {
      businessName: "ZOE Solar",
      address: {
        street: "Kurfürstenstraße 124",
        city: "Berlin",
        zip: "10785",
        country: "Deutschland"
      },
      phone: "+49-156-78876200",
      website: "https://zoe-solar.de",
      categories: [
        "Solarenergie-Unternehmen", // Primär
        "Elektriker",
        "Energieberatung",
        "Bauunternehmen",
        "Elektroinstallationsdienst"
      ],
      description: "ZOE Solar ist Ihr Experte für Solarenergie und Photovoltaik in Berlin. Wir bieten maßgeschneiderte Solaranlagen, professionelle Installation, Energieberatung und zuverlässigen Wartungsservice für Privat- und Geschäftskunden. Unser erfahrenes Team steht für persönliche Betreuung, innovative Technik und nachhaltige Energielösungen. Seit über 5 Jahren begleiten wir unsere Kunden auf dem Weg zur eigenen Stromerzeugung. Vertrauen Sie auf Qualität, Zuverlässigkeit und regionale Kompetenz für Ihre Energiewende.",
      foundingDate: "2018-06-06",
      social: {
        linkedin: "https://www.linkedin.com/company/91625256/admin/dashboard/",
        tiktok: "https://www.tiktok.com/@zoe_solar",
        x: "https://x.com/_zoe_solar",
        youtube: "https://www.youtube.com/channel/UC8jo_fyVGSPKvRuS2ZWAvyA",
        facebook: "https://www.facebook.com/p/ZOE-Solar-100088899755919/",
        instagram: "https://www.instagram.com/_zoe_solar/",
        pinterest: "https://de.pinterest.com/ZOEsolarDE/?actingBusinessId=1137159112069607884"
      },
      whatsapp: "https://wa.me/4915678876200",
      onlineBusinessHours: {
        monday: "00:00-24:00",
        tuesday: "00:00-24:00",
        wednesday: "00:00-24:00",
        thursday: "00:00-24:00",
        friday: "00:00-24:00",
        saturday: "00:00-24:00",
        sunday: "00:00-24:00"
      },
      attributes: {
        "Elektrische Anlagen": true,
        "Notdienst": true,
        "Kostenlose Beratung": true,
        "Festpreisgarantie": true,
        "Förderungsunterstützung": true
      },
      hours: {
        monday: "08:00-20:00",
        tuesday: "08:00-20:00",
        wednesday: "08:00-20:00",
        thursday: "08:00-20:00",
        friday: "08:00-20:00",
        saturday: "10:00-15:00",
        sunday: "Geschlossen"
      },
      services: [
        "Solaranlagen-Installation",
        "Photovoltaik-Beratung",
        "Stromspeicher-Installation",
        "Förderungsberatung",
        "Wartung und Service",
        "Solarmodul-Reinigung",
        "Monitoring & Fernwartung",
        "Notdienst für Solaranlagen",
        "E-Mobilitäts-Ladelösungen",
        "Energiemanagement & Smart Home"
      ]
    };
  }

  generateGMBSetupGuide() {
    console.log('🏢 Google My Business Setup-Anleitung für ZOE Solar');
    console.log('==================================================\n');

    console.log('📋 Schritt-für-Schritt Anleitung:');
    console.log('1. Gehe zu: https://www.google.com/business/');
    console.log('2. Melde dich mit deinem Google-Konto an');
    console.log('3. Klicke auf "Jetzt starten"\n');

    console.log('🏢 Unternehmensinformationen hinzufügen:');
    console.log(`• Name: ${this.businessData.businessName}`);
    console.log(`• Kategorie: ${this.businessData.categories.join(', ')}`);
    console.log(`• Adresse: ${this.businessData.address.street}, ${this.businessData.address.zip} ${this.businessData.address.city}, ${this.businessData.address.country}`);
    console.log(`• Telefon: ${this.businessData.phone}`);
    console.log(`• Website: ${this.businessData.website}\n`);

    console.log('🕒 Öffnungszeiten festlegen:');
    Object.entries(this.businessData.hours).forEach(([day, hours]) => {
      console.log(`• ${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}`);
    });
    console.log('');

    console.log('🔧 Attribute hinzufügen:');
    Object.entries(this.businessData.attributes).forEach(([attr, value]) => {
      console.log(`• ${attr}: ${value ? 'Ja' : 'Nein'}`);
    });
    console.log('');

    console.log('🛠️ Dienstleistungen hinzufügen:');
    this.businessData.services.forEach(service => {
      console.log(`• ${service}`);
    });
    console.log('');

    console.log('📸 Fotos hinzufügen:');
    console.log('• Logo von ZOE Solar');
    console.log('• Außenaufnahmen der Geschäftsräume');
    console.log('• Innenaufnahmen (Büro, Besprechungsräume)');
    console.log('• Teamfotos');
    console.log('• Solaranlagen-Installationsfotos');
    console.log('• Kundenprojekte (mit Erlaubnis)');
    console.log('• Zertifizierungen und Auszeichnungen\n');

    console.log('✅ Verifizierung abschließen:');
    console.log('1. Wähle Verifizierungsmethode:');
    console.log('   • Postkarte (empfohlen - 2-3 Wochen)');
    console.log('   • Telefon (sofort, aber teurer)');
    console.log('   • E-Mail (falls verfügbar)');
    console.log('2. Gib den Verifizierungscode ein');
    console.log('3. Profil ist live!\n');

    console.log('🚀 Nach der Verifizierung:');
    console.log('• Füge regelmäßig neue Fotos hinzu');
    console.log('• Beantworte Kundenbewertungen');
    console.log('• Aktualisiere Öffnungszeiten bei Feiertagen');
    console.log('• Erstelle Beiträge über neue Projekte');
    console.log('• Nutze Google Ads für lokale Kampagnen\n');

    console.log('📊 Wichtige KPIs überwachen:');
    console.log('• Profilaufrufe');
    console.log('• Website-Klicks');
    console.log('• Anrufe');
    console.log('• Wegbeschreibungen');
    console.log('• Bewertungen und Sterne\n');

    console.log('🔗 Integration mit Website:');
    console.log('• Stelle sicher, dass die Adresse auf der Website mit GMB übereinstimmt');
    console.log('• Verwende strukturierte Daten (LocalBusiness Schema)');
    console.log('• Optimiere lokale Keywords in der Nähe-Beschreibung');
    console.log('• Erstelle eine "Standorte"-Seite mit allen lokalen Landing-Pages\n');
  }

  generateGMBDataFiles() {
    console.log('📄 Erstelle GMB-Daten-Dateien...\n');

    // Vollständige GMB-Daten als JSON
    const gmbDataPath = path.join(__dirname, '..', 'docs', 'google-my-business-setup.json');
    fs.writeFileSync(gmbDataPath, JSON.stringify(this.businessData, null, 2));
    console.log('✅ docs/google-my-business-setup.json erstellt');

    // CSV für Bulk-Import (falls verfügbar)
    const csvData = this.generateGMBCsv();
    const csvPath = path.join(__dirname, '..', 'docs', 'google-my-business-import.csv');
    fs.writeFileSync(csvPath, csvData);
    console.log('✅ docs/google-my-business-import.csv erstellt');

    // HTML-Anleitung
    const htmlGuide = this.generateGMBHtmlGuide();
    const htmlPath = path.join(__dirname, '..', 'docs', 'google-my-business-guide.html');
    fs.writeFileSync(htmlPath, htmlGuide);
    console.log('✅ docs/google-my-business-guide.html erstellt\n');
  }

  generateGMBCsv() {
    const headers = ['Business Name', 'Address', 'City', 'State', 'ZIP Code', 'Country', 'Phone', 'Website', 'Category'];
    const row = [
      this.businessData.businessName,
      this.businessData.address.street,
      this.businessData.address.city,
      '', // State (nicht relevant für Deutschland)
      this.businessData.address.zip,
      this.businessData.address.country,
      this.businessData.phone,
      this.businessData.website,
      this.businessData.categories[0]
    ];

    return headers.join(',') + '\n' + row.map(field => `"${field}"`).join(',');
  }

  generateGMBHtmlGuide() {
    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google My Business Setup - ZOE Solar</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #12b3c7; }
        h2 { color: #18b364; margin-top: 30px; }
        .step { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #12b3c7; }
        .important { background: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; }
        code { background: #f1f3f4; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🚀 Google My Business Setup für ZOE Solar</h1>

    <div class="important">
        <strong>Wichtig:</strong> Diese Anleitung führt dich durch die Einrichtung deines Google My Business Profils.
        Folge jedem Schritt sorgfältig für maximale lokale Sichtbarkeit.
    </div>

    <h2>1. Account erstellen</h2>
    <div class="step">
        <ol>
            <li>Gehe zu <a href="https://www.google.com/business/" target="_blank">www.google.com/business</a></li>
            <li>Melde dich mit deinem Google-Konto an</li>
            <li>Klicke auf "Jetzt starten"</li>
        </ol>
    </div>

    <h2>2. Unternehmensdetails eingeben</h2>
    <div class="step">
        <p><strong>Unternehmensname:</strong> ${this.businessData.businessName}</p>
        <p><strong>Kategorie:</strong> ${this.businessData.categories.join(', ')}</p>
        <p><strong>Adresse:</strong> ${this.businessData.address.street}, ${this.businessData.address.zip} ${this.businessData.address.city}, ${this.businessData.address.country}</p>
        <p><strong>Telefon:</strong> ${this.businessData.phone}</p>
        <p><strong>Website:</strong> ${this.businessData.website}</p>
    </div>

    <h2>3. Öffnungszeiten festlegen</h2>
    <div class="step">
        ${Object.entries(this.businessData.hours).map(([day, hours]) =>
          `<p><strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> ${hours}</p>`
        ).join('')}
    </div>

    <h2>4. Attribute und Dienstleistungen</h2>
    <div class="step">
        <p><strong>Dienstleistungen:</strong></p>
        <ul>
            ${this.businessData.services.map(service => `<li>${service}</li>`).join('')}
        </ul>
        <p><strong>Attribute:</strong></p>
        <ul>
            ${Object.entries(this.businessData.attributes).map(([attr, value]) =>
              `<li>${attr}: ${value ? 'Ja' : 'Nein'}</li>`
            ).join('')}
        </ul>
    </div>

    <h2>5. Fotos hinzufügen</h2>
    <div class="step">
        <ul>
            <li>Logo von ZOE Solar</li>
            <li>Außen- und Innenaufnahmen</li>
            <li>Teamfotos</li>
            <li>Projektfotos (mit Erlaubnis)</li>
            <li>Zertifizierungen</li>
        </ul>
    </div>

    <h2>6. Verifizierung</h2>
    <div class="step">
        <p>Wähle die Postkarten-Verifizierung (kostenlos, 2-3 Wochen) oder Telefon-Verifizierung (sofort).</p>
    </div>

    <h2>7. Optimierungstipps</h2>
    <div class="step">
        <ul>
            <li>Beantworte alle Bewertungen innerhalb von 24 Stunden</li>
            <li>Erstelle regelmäßig Beiträge über neue Projekte</li>
            <li>Aktualisiere Öffnungszeiten bei Feiertagen</li>
            <li>Nutze Google Ads für lokale Kampagnen</li>
        </ul>
    </div>

    <h2>📊 Erfolgsmessung</h2>
    <div class="step">
        <p>Überwache diese KPIs:</p>
        <ul>
            <li>Profilaufrufe</li>
            <li>Website-Klicks</li>
            <li>Anrufe über Google</li>
            <li>Wegbeschreibungen</li>
            <li>Durchschnittliche Bewertung</li>
        </ul>
    </div>

    <div class="important">
        <strong>Pro-Tipp:</strong> Nach der Einrichtung kannst du über Google Ads lokale Suchkampagnen schalten,
        um noch mehr lokale Kunden zu erreichen.
    </div>
</body>
</html>`;
  }

  generateLocalSEOIntegration() {
    console.log('🔗 Erstelle lokale SEO-Integration...\n');

    const integrationTips = {
      websiteIntegration: [
        'Stelle sicher, dass Adresse und Telefonnummer mit GMB übereinstimmen',
        'Verwende LocalBusiness Schema-Markups auf allen Seiten',
        'Optimiere lokale Keywords in Meta-Beschreibungen',
        'Erstelle eine "Standorte"-Seite mit allen lokalen Landing-Pages',
        'Füge Google Maps Embed auf der Kontakt-Seite hinzu'
      ],
      contentOptimization: [
        'Erwähne lokale Stadtteile und Nachbarorte in Inhalten',
        'Füge lokale Telefonnummern und Adressen hinzu',
        'Erstelle lokale Blog-Inhalte (z.B. "Solaranlagen in Berlin 2025")',
        'Nutze lokale Suchbegriffe in Überschriften und Alt-Tags',
        'Erstelle lokale Fallstudien und Testimonials'
      ],
      backlinkStrategy: [
        'Kontaktiere lokale Partner für Backlinks',
        'Registriere dich bei lokalen Branchenverzeichnissen',
        'Sponsere lokale Events oder Vereine',
        'Kooperiere mit lokalen Energieberatern',
        'Nutze lokale Social-Media-Gruppen'
      ]
    };

    console.log('🌐 Website-Integration:');
    integrationTips.websiteIntegration.forEach(tip => console.log(`• ${tip}`));
    console.log('');

    console.log('📝 Content-Optimierung:');
    integrationTips.contentOptimization.forEach(tip => console.log(`• ${tip}`));
    console.log('');

    console.log('🔗 Backlink-Strategie:');
    integrationTips.backlinkStrategy.forEach(tip => console.log(`• ${tip}`));
    console.log('');
  }

  runGMBSetup() {
    console.log('🚀 Starte Google My Business Setup für ZOE Solar...\n');

    this.generateGMBSetupGuide();
    this.generateGMBDataFiles();
    this.generateLocalSEOIntegration();

    console.log('✅ Google My Business Setup abgeschlossen!');
    console.log('📁 Dateien erstellt:');
    console.log('   • docs/google-my-business-setup.json');
    console.log('   • docs/google-my-business-import.csv');
    console.log('   • docs/google-my-business-guide.html');
    console.log('');
    console.log('🎯 Nächste Schritte:');
    console.log('   1. Öffne docs/google-my-business-guide.html');
    console.log('   2. Folge der Schritt-für-Schritt Anleitung');
    console.log('   3. Reiche Sitemaps in Google Search Console ein');
    console.log('   4. Überwache lokale Suchergebnisse');
    console.log('   5. Sammle erste Kundenbewertungen');
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const gmbSetup = new GoogleMyBusinessSetup();

  const command = process.argv[2];

  switch (command) {
    case 'setup':
      gmbSetup.runGMBSetup();
      break;
    case 'guide':
      gmbSetup.generateGMBSetupGuide();
      break;
    case 'files':
      gmbSetup.generateGMBDataFiles();
      break;
    case 'integration':
      gmbSetup.generateLocalSEOIntegration();
      break;
    default:
      console.log('Google My Business Setup für ZOE Solar');
      console.log('');
      console.log('Verwendung:');
      console.log('  node scripts/google-my-business-setup.js setup      # Vollständiges Setup');
      console.log('  node scripts/google-my-business-setup.js guide      # Setup-Anleitung anzeigen');
      console.log('  node scripts/google-my-business-setup.js files      # Daten-Dateien erstellen');
      console.log('  node scripts/google-my-business-setup.js integration # SEO-Integration-Tipps');
      console.log('');
      console.log('Beispiel:');
      console.log('  node scripts/google-my-business-setup.js setup');
      break;
  }
}

export default GoogleMyBusinessSetup;
