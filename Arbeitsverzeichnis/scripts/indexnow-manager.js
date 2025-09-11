#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class IndexNowManager {
  constructor() {
    this.apiKey = this.generateApiKey();
    this.host = 'zoe-solar.de'; // Ändern Sie dies zu Ihrer Domain
    this.keyLocation = path.join(__dirname, '..', 'public', this.apiKey + '.txt');
  }

  generateApiKey() {
    // Generiere einen sicheren API-Key
    return crypto.randomBytes(32).toString('hex');
  }

  createKeyFile() {
    console.log('🔑 Erstelle IndexNow API-Key Datei...');

    // Erstelle den Key-File im public Ordner
    fs.writeFileSync(this.keyLocation, this.apiKey);

    console.log(`✅ API-Key Datei erstellt: ${this.apiKey}.txt`);
    console.log(`📍 Pfad: ${this.keyLocation}`);
    console.log(`🔗 URL: https://${this.host}/${this.apiKey}.txt`);

    return this.apiKey;
  }

  async submitUrls(urls) {
    console.log('📤 Sende URLs an IndexNow...');

    const payload = {
      host: this.host,
      key: this.apiKey,
      urlList: urls
    };

    try {
      const response = await fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ URLs erfolgreich an IndexNow gesendet!');
        console.log(`📊 Anzahl URLs: ${urls.length}`);
        return true;
      } else {
        console.error('❌ Fehler beim Senden an IndexNow:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Netzwerkfehler bei IndexNow:', error.message);
      return false;
    }
  }

  async submitSitemap(sitemapUrl) {
    console.log('🗺️ Sende Sitemap an IndexNow...');

    const payload = {
      host: this.host,
      key: this.apiKey,
      urlList: [sitemapUrl]
    };

    try {
      const response = await fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Sitemap erfolgreich an IndexNow gesendet!');
        return true;
      } else {
        console.error('❌ Fehler beim Senden der Sitemap:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Netzwerkfehler bei Sitemap-Submit:', error.message);
      return false;
    }
  }

  generateRobotsTxt() {
    console.log('🤖 Aktualisiere robots.txt für IndexNow...');

    const robotsContent = `# Robots.txt für ZOE Solar
# Erstellt für optimale Suchmaschinen-Indexierung

User-agent: *
Allow: /

# IndexNow für Bing
Sitemap: https://${this.host}/sitemap.xml

# Crawl-Verzögerung für bessere Performance
Crawl-delay: 1

# Blockiere sensible Bereiche
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

# Spezielle Regeln für AI-Crawler
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

# Blockiere Entwicklungsdateien
Disallow: *.json$
Disallow: *.md$
`;

    const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);

    console.log(`✅ robots.txt aktualisiert: ${robotsPath}`);
  }

  setupGitHook() {
    console.log('🔗 Richte Git-Hook für automatische IndexNow-Updates ein...');

    const hookContent = `#!/bin/bash

# IndexNow Git Hook für automatische Indexierung
# Wird nach jedem Push ausgeführt

echo "🔄 IndexNow: Sende aktualisierte URLs..."

# Hier können Sie die Logik für das Extrahieren geänderter URLs hinzufügen
# Beispiel: git diff --name-only HEAD~1 | grep ".html$" | sed "s|^|https://${this.host}/|"

# Für jetzt: Sende die Hauptseiten
curl -X POST "https://www.bing.com/indexnow" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"host\\": \\"${this.host}\\",
    \\"key\\": \\"${this.apiKey}\\",
    \\"urlList\\": [
      \\"https://${this.host}/\\",
      \\"https://${this.host}/solaranlagen\\",
      \\"https://${this.host}/kontakt\\"
    ]
  }"

echo "✅ IndexNow-Update abgeschlossen"
`;

    const hookPath = path.join(__dirname, '..', '.git', 'hooks', 'post-commit');
    fs.writeFileSync(hookPath, hookContent);
    fs.chmodSync(hookPath, '755');

    console.log(`✅ Git-Hook erstellt: ${hookPath}`);
  }

  async runSetup() {
    console.log('🚀 Starte IndexNow Setup...\n');

    // 1. API-Key erstellen
    this.createKeyFile();

    // 2. robots.txt aktualisieren
    this.generateRobotsTxt();

    // 3. Git-Hook einrichten
    this.setupGitHook();

    // 4. Test-URLs senden
    const testUrls = [
      `https://${this.host}/`,
      `https://${this.host}/solaranlagen-kosten.html`,
      `https://${this.host}/solarfoerderungen-2025.html`,
      `https://${this.host}/solaranlagen-wirtschaftlichkeit.html`
    ];

    console.log('\n📤 Sende Test-URLs an IndexNow...');
    await this.submitUrls(testUrls);

    console.log('\n✨ IndexNow Setup abgeschlossen!');
    console.log(`🔑 Ihr API-Key: ${this.apiKey}`);
    console.log(`🔗 Key-URL: https://${this.host}/${this.apiKey}.txt`);
    console.log('\n📋 Nächste Schritte:');
    console.log('1. Laden Sie die Key-Datei auf Ihren Server');
    console.log('2. Testen Sie die Indexierung in Bing Webmaster Tools');
    console.log('3. Überwachen Sie die Indexierungsgeschwindigkeit');
  }

  async monitorIndexing() {
    console.log('📊 Überwache Indexierung...');

    // Hier können Sie Logik für die Überwachung hinzufügen
    // Beispiel: Überprüfung der Bing Index Coverage

    console.log('🔍 Bing Index Coverage Report:');
    console.log(`📅 Letzte Überprüfung: ${new Date().toLocaleDateString('de-DE')}`);
    console.log('📈 Empfohlene Aktionen:');
    console.log('- Regelmäßige Sitemap-Updates');
    console.log('- Überwachung der Crawl-Fehler');
    console.log('- Optimierung der Seitenladegeschwindigkeit');
  }
}

// Integration mit Build-Prozess
class BuildIntegration {
  constructor(indexNow) {
    this.indexNow = indexNow;
  }

  async onBuildComplete(buildOutput) {
    console.log('🏗️ Build abgeschlossen, starte IndexNow-Update...');

    // Extrahiere neue/geänderte URLs aus dem Build
    const newUrls = this.extractUrlsFromBuild(buildOutput);

    if (newUrls.length > 0) {
      await this.indexNow.submitUrls(newUrls);
    }

    console.log('✅ IndexNow-Update nach Build abgeschlossen');
  }

  extractUrlsFromBuild(buildOutput) {
    // Hier würden Sie die Logik implementieren, um URLs aus dem Build-Output zu extrahieren
    // Beispiel: Suche nach generierten HTML-Dateien
    const urls = [];

    try {
      const distDir = path.join(__dirname, '..', 'dist');
      if (fs.existsSync(distDir)) {
        const files = fs.readdirSync(distDir);
        files.forEach(file => {
          if (file.endsWith('.html')) {
            urls.push(`https://${this.indexNow.host}/${file}`);
          }
        });
      }
    } catch (error) {
      console.error('Fehler beim Extrahieren der URLs:', error.message);
    }

    return urls;
  }
}

// CLI Interface
if (require.main === module) {
  const indexNow = new IndexNowManager();
  const buildIntegration = new BuildIntegration(indexNow);

  const command = process.argv[2];

  switch (command) {
    case 'setup':
      indexNow.runSetup().catch(console.error);
      break;
    case 'submit':
      const urls = process.argv.slice(3);
      if (urls.length === 0) {
        console.log('Verwendung: node indexnow-manager.js submit <url1> <url2> ...');
      } else {
        indexNow.submitUrls(urls).catch(console.error);
      }
      break;
    case 'sitemap':
      const sitemapUrl = process.argv[3];
      if (!sitemapUrl) {
        console.log('Verwendung: node indexnow-manager.js sitemap <sitemap-url>');
      } else {
        indexNow.submitSitemap(sitemapUrl).catch(console.error);
      }
      break;
    case 'monitor':
      indexNow.monitorIndexing().catch(console.error);
      break;
    default:
      console.log('IndexNow Manager für ZOE Solar');
      console.log('');
      console.log('Verwendung:');
      console.log('  node indexnow-manager.js setup     # Vollständiges Setup');
      console.log('  node indexnow-manager.js submit <urls> # URLs manuell senden');
      console.log('  node indexnow-manager.js sitemap <url> # Sitemap senden');
      console.log('  node indexnow-manager.js monitor   # Indexierung überwachen');
      console.log('');
      console.log('Beispiel:');
      console.log('  node indexnow-manager.js submit https://zoe-solar.de/ https://zoe-solar.de/kontakt');
      break;
  }
}

module.exports = { IndexNowManager, BuildIntegration };
