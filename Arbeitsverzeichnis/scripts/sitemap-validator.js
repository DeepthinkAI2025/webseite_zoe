#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SitemapValidator {
  constructor() {
    this.baseUrl = 'https://zoe-solar.de';
    this.sitemaps = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap-main.xml`,
      `${this.baseUrl}/sitemap-local.xml`
    ];
  }

  async validateSitemap(url) {
    return new Promise((resolve) => {
      console.log(`🔍 Validiere: ${url}`);

      const req = https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const results = {
            url,
            statusCode: res.statusCode,
            isValid: false,
            errors: [],
            warnings: []
          };

          if (res.statusCode !== 200) {
            results.errors.push(`HTTP ${res.statusCode}: ${res.statusMessage}`);
            resolve(results);
            return;
          }

          // XML-Syntax prüfen
          try {
            // Einfache XML-Validierung
            if (!data.includes('<?xml')) {
              results.errors.push('Keine gültige XML-Deklaration gefunden');
            }

            if (url.includes('sitemap.xml') && !url.includes('main') && !url.includes('local')) {
              // Haupt-Sitemap sollte sitemapindex sein
              if (!data.includes('<sitemapindex')) {
                results.errors.push('Haupt-Sitemap sollte sitemapindex-Format haben');
              }
              if (data.includes('<urlset')) {
                results.errors.push('Gemischtes Format: sitemapindex und urlset gefunden');
              }
            } else {
              // Unter-Sitemaps sollten urlset haben
              if (!data.includes('<urlset')) {
                results.errors.push('Sitemap sollte urlset-Format haben');
              }
            }

            // Domain prüfen
            if (data.includes('example.com')) {
              results.errors.push('Veraltete Domain "example.com" gefunden');
            }

            if (!data.includes('zoe-solar.de')) {
              results.warnings.push('Keine zoe-solar.de URLs gefunden');
            }

            // Erfolgreiche URLs zählen
            const urlMatches = data.match(/<loc>(.*?)<\/loc>/g);
            if (urlMatches) {
              results.urlCount = urlMatches.length;
              console.log(`   ✅ ${urlMatches.length} URLs gefunden`);
            }

            results.isValid = results.errors.length === 0;
            results.content = data;

          } catch (error) {
            results.errors.push(`XML-Parse-Fehler: ${error.message}`);
          }

          resolve(results);
        });
      });

      req.on('error', (error) => {
        resolve({
          url,
          statusCode: 0,
          isValid: false,
          errors: [`Netzwerk-Fehler: ${error.message}`],
          warnings: []
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          url,
          statusCode: 0,
          isValid: false,
          errors: ['Timeout nach 10 Sekunden'],
          warnings: []
        });
      });
    });
  }

  async validateAllSitemaps() {
    console.log('🚀 Starte Sitemap-Validierung...\n');

    const results = {
      timestamp: new Date().toISOString(),
      sitemaps: [],
      summary: {
        total: this.sitemaps.length,
        valid: 0,
        errors: 0,
        warnings: 0
      }
    };

    for (const sitemapUrl of this.sitemaps) {
      const result = await this.validateSitemap(sitemapUrl);
      results.sitemaps.push(result);

      if (result.isValid) {
        results.summary.valid++;
      } else {
        results.summary.errors++;
      }

      if (result.warnings && result.warnings.length > 0) {
        results.summary.warnings += result.warnings.length;
      }

      // Kleine Pause zwischen Requests
      await this.delay(500);
    }

    return results;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateValidationReport(results) {
    console.log('\n📊 Sitemap-Validierungs-Report:');
    console.log('================================');

    results.sitemaps.forEach(sitemap => {
      const status = sitemap.isValid ? '✅' : '❌';
      console.log(`\n${status} ${sitemap.url.replace(this.baseUrl, '')}`);

      if (sitemap.urlCount) {
        console.log(`   📄 ${sitemap.urlCount} URLs`);
      }

      if (sitemap.errors && sitemap.errors.length > 0) {
        console.log('   ❌ Fehler:');
        sitemap.errors.forEach(error => console.log(`      • ${error}`));
      }

      if (sitemap.warnings && sitemap.warnings.length > 0) {
        console.log('   ⚠️  Warnungen:');
        sitemap.warnings.forEach(warning => console.log(`      • ${warning}`));
      }
    });

    console.log(`\n🏆 Zusammenfassung:`);
    console.log(`   Gesamt: ${results.summary.total} Sitemaps`);
    console.log(`   Gültig: ${results.summary.valid}`);
    console.log(`   Fehler: ${results.summary.errors}`);
    console.log(`   Warnungen: ${results.summary.warnings}`);

    const successRate = (results.summary.valid / results.summary.total) * 100;
    console.log(`   Erfolgsrate: ${successRate.toFixed(1)}%`);

    return results;
  }

  async saveValidationReport(results) {
    const reportPath = path.join(__dirname, '..', 'docs', 'sitemap-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Validierungs-Report gespeichert: docs/sitemap-validation-report.json`);
  }

  async runValidation() {
    try {
      const results = await this.validateAllSitemaps();
      this.generateValidationReport(results);
      await this.saveValidationReport(results);

      console.log('\n🎯 Empfehlungen:');
      if (results.summary.errors > 0) {
        console.log('   • Fehler beheben bevor Sitemaps eingereicht werden');
        console.log('   • XML-Syntax validieren');
        console.log('   • URLs auf Erreichbarkeit prüfen');
      } else {
        console.log('   • Alle Sitemaps sind gültig!');
        console.log('   • Jetzt in Google Search Console einreichen');
        console.log('   • Regelmäßige Validierung einplanen');
      }

      return results;

    } catch (error) {
      console.error('❌ Fehler bei der Validierung:', error);
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new SitemapValidator();

  const command = process.argv[2];

  switch (command) {
    case 'validate':
      validator.runValidation().catch(console.error);
      break;
    case 'check':
      validator.validateSitemap(validator.sitemaps[0]).then(result => {
        console.log('Validierung Ergebnis:', result);
      });
      break;
    default:
      console.log('Sitemap-Validierung für ZOE Solar');
      console.log('');
      console.log('Verwendung:');
      console.log('  node scripts/sitemap-validator.js validate    # Alle Sitemaps validieren');
      console.log('  node scripts/sitemap-validator.js check       # Haupt-Sitemap prüfen');
      console.log('');
      console.log('Beispiel:');
      console.log('  node scripts/sitemap-validator.js validate');
      break;
  }
}

export default SitemapValidator;