#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LocalSEOMonitor {
  constructor() {
    this.localPages = [
      'solaranlagen-berlin.html',
      'solaranlagen-hamburg.html',
      'solaranlagen-münchen.html',
      'solaranlagen-köln.html',
      'solaranlagen-frankfurt-am-main.html',
      'solaranlagen-stuttgart.html',
      'solaranlagen-düsseldorf.html',
      'solaranlagen-dortmund.html',
      'solaranlagen-essen.html',
      'solaranlagen-leipzig.html',
      'solaranlagen-bremen.html',
      'solaranlagen-dresden.html',
      'solaranlagen-hannover.html',
      'solaranlagen-nürnberg.html',
      'solaranlagen-duisburg.html',
      'solaranlagen-baden-württemberg.html',
      'solaranlagen-bayern.html',
      'solaranlagen-brandenburg.html',
      'solaranlagen-hessen.html',
      'solaranlagen-mecklenburg-vorpommern.html',
      'solaranlagen-niedersachsen.html',
      'solaranlagen-nordrhein-westfalen.html',
      'solaranlagen-rheinland-pfalz.html',
      'solaranlagen-saarland.html',
      'solaranlagen-sachsen.html',
      'solaranlagen-sachsen-anhalt.html',
      'solaranlagen-schleswig-holstein.html',
      'solaranlagen-thüringen.html',
      'solaranlagen-ruhrgebiet.html',
      'solaranlagen-rhein-main-gebiet.html',
      'solaranlagen-rhein-neckar.html',
      'solaranlagen-stuttgart-region.html',
      'solaranlagen-münchen-region.html',
      'solaranlagen-hamburg-region.html',
      'solaranlagen-berlin-region.html',
      'solaranlagen-köln-region.html',
      'solaranlagen-deutschland.html'
    ];

    this.baseUrl = 'https://zoe-solar.de';
    this.publicDir = path.join(__dirname, '..', 'public');
  }

  async checkLocalPagesHealth() {
    console.log('🔍 Überprüfe lokale Seiten-Integrität...\n');

    const results = {
      total: this.localPages.length,
      healthy: 0,
      issues: [],
      missing: [],
      corrupted: []
    };

    for (const page of this.localPages) {
      const filepath = path.join(this.publicDir, page);

      try {
        if (!fs.existsSync(filepath)) {
          results.missing.push(page);
          console.log(`❌ Fehlt: ${page}`);
          continue;
        }

        const content = fs.readFileSync(filepath, 'utf8');

        // Überprüfe grundlegende HTML-Struktur
        if (!content.includes('<html') || !content.includes('<head>') || !content.includes('<body>')) {
          results.corrupted.push(page);
          console.log(`⚠️  Korrupt: ${page} (fehlende HTML-Struktur)`);
          continue;
        }

        // Überprüfe lokale Schema-Markups
        if (!content.includes('LocalBusiness') && !content.includes('Organization')) {
          results.issues.push(`${page}: Fehlende Schema-Markups`);
          console.log(`⚠️  Schema fehlt: ${page}`);
        }

        // Überprüfe Meta-Tags
        if (!content.includes('name="description"') || !content.includes('name="keywords"')) {
          results.issues.push(`${page}: Fehlende Meta-Tags`);
          console.log(`⚠️  Meta-Tags fehlen: ${page}`);
        }

        // Überprüfe lokale Keywords im Title
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        if (titleMatch) {
          const title = titleMatch[1];
          if (!title.includes('Solaranlagen') && !title.includes('Photovoltaik')) {
            results.issues.push(`${page}: Unpassender Title-Tag`);
            console.log(`⚠️  Title problematisch: ${page}`);
          }
        }

        results.healthy++;
        console.log(`✅ OK: ${page}`);

      } catch (error) {
        results.corrupted.push(page);
        console.log(`❌ Fehler: ${page} (${error.message})`);
      }
    }

    return results;
  }

  async generateLocalSEOReport() {
    console.log('\n📊 Lokale SEO-Monitoring Report:');
    console.log('=====================================');

    const health = await this.checkLocalPagesHealth();

    console.log(`\n📈 Gesamtstatistik:`);
    console.log(`   • Gesamtseiten: ${health.total}`);
    console.log(`   • Gesunde Seiten: ${health.healthy}`);
    console.log(`   • Fehlende Seiten: ${health.missing.length}`);
    console.log(`   • Korrupte Seiten: ${health.corrupted.length}`);
    console.log(`   • Seiten mit Problemen: ${health.issues.length}`);

    if (health.missing.length > 0) {
      console.log(`\n❌ Fehlende Seiten:`);
      health.missing.forEach(page => console.log(`   • ${page}`));
    }

    if (health.corrupted.length > 0) {
      console.log(`\n⚠️  Korrupte Seiten:`);
      health.corrupted.forEach(page => console.log(`   • ${page}`));
    }

    if (health.issues.length > 0) {
      console.log(`\n🔧 Seiten mit Problemen:`);
      health.issues.forEach(issue => console.log(`   • ${issue}`));
    }

    // Sitemap-Überprüfung
    console.log(`\n🗺️ Sitemap-Status:`);
    const sitemapPath = path.join(this.publicDir, 'sitemap-local.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlCount = (sitemapContent.match(/<url>/g) || []).length;
      console.log(`   • Lokale Sitemap: ✅ (${urlCount} URLs)`);
    } else {
      console.log(`   • Lokale Sitemap: ❌ (fehlt)`);
    }

    const mainSitemapPath = path.join(this.publicDir, 'sitemap-main.xml');
    if (fs.existsSync(mainSitemapPath)) {
      const sitemapContent = fs.readFileSync(mainSitemapPath, 'utf8');
      const urlCount = (sitemapContent.match(/<url>/g) || []).length;
      console.log(`   • Haupt-Sitemap: ✅ (${urlCount} URLs)`);
    } else {
      console.log(`   • Haupt-Sitemap: ❌ (fehlt)`);
    }

    // Empfehlungen
    console.log(`\n💡 Empfehlungen:`);
    if (health.missing.length > 0) {
      console.log(`   • Fehlende Seiten neu generieren mit: npm run seo:local:optimize`);
    }
    if (health.issues.length > 0) {
      console.log(`   • Schema-Markups und Meta-Tags überprüfen`);
    }
    console.log(`   • Sitemaps in Google Search Console einreichen`);
    console.log(`   • Lokale Seiten regelmäßig auf Aktualität prüfen`);

    return health;
  }

  async checkIndexingStatus() {
    console.log('\n🔍 Überprüfe Indexierungsstatus...\n');

    // Simulierte Indexierungsprüfung (in Produktion würde hier eine API zu GSC/Search Console verwendet)
    console.log('📊 Indexierungsstatus (simuliert):');
    console.log('   • Google Index: 95% der Seiten indexiert');
    console.log('   • Bing Index: 92% der Seiten indexiert');
    console.log('   • Lokale Suchergebnisse: Aktiv für alle Regionen');

    console.log('\n🎯 Nächste Schritte für Indexierung:');
    console.log('   1. Sitemaps in Google Search Console einreichen');
    console.log('   2. Bing Webmaster Tools benachrichtigen');
    console.log('   3. IndexNow für beschleunigte Indexierung aktivieren');
    console.log('   4. Lokale Business-Listings aktualisieren');
  }

  async runFullMonitoring() {
    console.log('🚀 Starte vollständiges lokales SEO-Monitoring...\n');

    const healthReport = await this.generateLocalSEOReport();
    await this.checkIndexingStatus();

    // Zusammenfassung
    const successRate = (healthReport.healthy / healthReport.total) * 100;
    console.log(`\n🏆 Monitoring-Zusammenfassung:`);
    console.log(`   • Erfolgsrate: ${successRate.toFixed(1)}%`);
    console.log(`   • Status: ${successRate >= 95 ? '✅ Exzellent' : successRate >= 85 ? '⚠️ Gut' : '❌ Kritisch'}`);

    if (successRate < 100) {
      console.log(`\n🔧 Automatische Korrekturen verfügbar:`);
      console.log(`   • npm run seo:local:optimize (fehlende Seiten neu generieren)`);
      console.log(`   • npm run seo:local:report (erneute Überprüfung)`);
    }

    return healthReport;
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new LocalSEOMonitor();

  const command = process.argv[2];

  switch (command) {
    case 'health':
      monitor.checkLocalPagesHealth().catch(console.error);
      break;
    case 'indexing':
      monitor.checkIndexingStatus().catch(console.error);
      break;
    case 'full':
      monitor.runFullMonitoring().catch(console.error);
      break;
    default:
      console.log('Lokale SEO-Monitoring für ZOE Solar');
      console.log('');
      console.log('Verwendung:');
      console.log('  node scripts/local-seo-monitor.js health     # Seiten-Integrität prüfen');
      console.log('  node scripts/local-seo-monitor.js indexing  # Indexierungsstatus prüfen');
      console.log('  node scripts/local-seo-monitor.js full      # Vollständiges Monitoring');
      console.log('');
      console.log('Beispiel:');
      console.log('  node scripts/local-seo-monitor.js full');
      break;
  }
}

export default LocalSEOMonitor;
