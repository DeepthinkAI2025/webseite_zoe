#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SearchEngineSubmission {
  constructor() {
    this.baseUrl = 'https://zoe-solar.de';
    this.sitemapIndex = `${this.baseUrl}/sitemap.xml`;
    this.mainSitemap = `${this.baseUrl}/sitemap-main.xml`;
    this.localSitemap = `${this.baseUrl}/sitemap-local.xml`;

    // Search Engine Endpoints
    this.endpoints = {
      google: 'https://www.google.com/ping?sitemap=',
      bing: 'https://www.bing.com/ping?sitemap=',
      yandex: 'https://webmaster.yandex.com/ping?sitemap=',
      seznam: 'https://search.seznam.cz/ping?sitemap='
    };
  }

  async submitToSearchEngine(engine, sitemapUrl) {
    const endpoint = this.endpoints[engine] + encodeURIComponent(sitemapUrl);

    return new Promise((resolve, reject) => {
      console.log(`📤 Reiche Sitemap bei ${engine.toUpperCase()} ein: ${sitemapUrl}`);

      const req = https.get(endpoint, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log(`✅ ${engine.toUpperCase()}: Sitemap erfolgreich eingereicht`);
            resolve({ engine, status: 'success', statusCode: res.statusCode });
          } else {
            console.log(`⚠️  ${engine.toUpperCase()}: Status ${res.statusCode} - ${data}`);
            resolve({ engine, status: 'warning', statusCode: res.statusCode, response: data });
          }
        });
      });

      req.on('error', (error) => {
        console.log(`❌ ${engine.toUpperCase()}: Fehler - ${error.message}`);
        resolve({ engine, status: 'error', error: error.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.log(`⏰ ${engine.toUpperCase()}: Timeout nach 10 Sekunden`);
        resolve({ engine, status: 'timeout' });
      });
    });
  }

  async submitAllSitemaps() {
    console.log('🚀 Starte Sitemap-Einreichung bei Suchmaschinen...\n');

    const results = {
      sitemaps: [],
      timestamp: new Date().toISOString()
    };

    // Sitemaps definieren
    const sitemaps = [
      { name: 'Sitemap-Index', url: this.sitemapIndex },
      { name: 'Haupt-Sitemap', url: this.mainSitemap },
      { name: 'Lokale Sitemap', url: this.localSitemap }
    ];

    for (const sitemap of sitemaps) {
      console.log(`\n📋 Bearbeite: ${sitemap.name}`);
      const sitemapResults = {
        name: sitemap.name,
        url: sitemap.url,
        engines: {}
      };

      // Bei jeder Suchmaschine einreichen
      for (const [engine, endpoint] of Object.entries(this.endpoints)) {
        const result = await this.submitToSearchEngine(engine, sitemap.url);
        sitemapResults.engines[engine] = result;
        await this.delay(1000); // 1 Sekunde Pause zwischen Requests
      }

      results.sitemaps.push(sitemapResults);
    }

    return results;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateSubmissionReport(results) {
    console.log('\n📊 Sitemap-Einreichungs-Report:');
    console.log('=====================================');

    results.sitemaps.forEach(sitemap => {
      console.log(`\n🗺️ ${sitemap.name}:`);
      console.log(`   URL: ${sitemap.url}`);

      Object.entries(sitemap.engines).forEach(([engine, result]) => {
        const status = result.status === 'success' ? '✅' :
                      result.status === 'warning' ? '⚠️' : '❌';
        console.log(`   ${status} ${engine.toUpperCase()}: ${result.status}`);

        if (result.statusCode && result.statusCode !== 200) {
          console.log(`      Status Code: ${result.statusCode}`);
        }
        if (result.error) {
          console.log(`      Fehler: ${result.error}`);
        }
      });
    });

    // Zusammenfassung
    const totalSubmissions = results.sitemaps.length * Object.keys(this.endpoints).length;
    const successful = results.sitemaps.flatMap(s => Object.values(s.engines))
                                      .filter(r => r.status === 'success').length;
    const warnings = results.sitemaps.flatMap(s => Object.values(s.engines))
                                    .filter(r => r.status === 'warning').length;
    const errors = results.sitemaps.flatMap(s => Object.values(s.engines))
                                  .filter(r => r.status === 'error' || r.status === 'timeout').length;

    console.log(`\n🏆 Zusammenfassung:`);
    console.log(`   Gesamt: ${totalSubmissions} Einreichungen`);
    console.log(`   Erfolgreich: ${successful}`);
    console.log(`   Warnungen: ${warnings}`);
    console.log(`   Fehler: ${errors}`);

    const successRate = (successful / totalSubmissions) * 100;
    console.log(`   Erfolgsrate: ${successRate.toFixed(1)}%`);

    return results;
  }

  async saveReport(results) {
    const reportPath = path.join(__dirname, '..', 'docs', 'sitemap-submission-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Report gespeichert: docs/sitemap-submission-report.json`);
  }

  async runSubmission() {
    try {
      const results = await this.submitAllSitemaps();
      this.generateSubmissionReport(results);
      await this.saveReport(results);

      console.log('\n🎯 Nächste Schritte:');
      console.log('   1. Google Search Console: Sitemaps manuell verifizieren');
      console.log('   2. Bing Webmaster Tools: Indexierungsstatus prüfen');
      console.log('   3. Yandex Webmaster: Sitemap-Status überwachen');
      console.log('   4. Regelmäßige Überprüfung alle 24-48 Stunden');

    } catch (error) {
      console.error('❌ Fehler bei der Sitemap-Einreichung:', error);
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const submitter = new SearchEngineSubmission();

  const command = process.argv[2];

  switch (command) {
    case 'submit':
      submitter.runSubmission().catch(console.error);
      break;
    case 'google':
      submitter.submitToSearchEngine('google', submitter.sitemapIndex).then(result => {
        console.log('Google Ergebnis:', result);
      });
      break;
    case 'bing':
      submitter.submitToSearchEngine('bing', submitter.sitemapIndex).then(result => {
        console.log('Bing Ergebnis:', result);
      });
      break;
    case 'all':
      submitter.runSubmission().catch(console.error);
      break;
    default:
      console.log('Sitemap-Einreichung bei Suchmaschinen');
      console.log('');
      console.log('Verwendung:');
      console.log('  node scripts/search-engine-submission.js submit    # Alle Sitemaps einreichen');
      console.log('  node scripts/search-engine-submission.js google    # Nur bei Google einreichen');
      console.log('  node scripts/search-engine-submission.js bing      # Nur bei Bing einreichen');
      console.log('  node scripts/search-engine-submission.js all       # Alle Suchmaschinen');
      console.log('');
      console.log('Beispiel:');
      console.log('  node scripts/search-engine-submission.js submit');
      break;
  }
}

export default SearchEngineSubmission;
