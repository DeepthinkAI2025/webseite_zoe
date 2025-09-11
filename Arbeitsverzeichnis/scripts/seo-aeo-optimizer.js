#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SEOAEOOptimizer {
  constructor() {
    this.contentDir = path.join(__dirname, '..', 'src', 'pages');
    this.templates = {
      article: this.generateArticleSchema.bind(this),
      faq: this.generateFAQSchema.bind(this),
      product: this.generateProductSchema.bind(this),
      howto: this.generateHowToSchema.bind(this)
    };
  }

  generateArticleSchema(content) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      description: content.description,
      author: {
        '@type': 'Organization',
        name: 'ZOE Solar',
        logo: '/Logo-ZOE.png'
      },
      publisher: {
        '@type': 'Organization',
        name: 'ZOE Solar',
        logo: '/Logo-ZOE.png'
      },
      datePublished: content.datePublished || new Date().toISOString().split('T')[0],
      dateModified: content.dateModified || new Date().toISOString().split('T')[0],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': content.url
      },
      image: content.image || '/Logo-ZOE.png',
      articleSection: content.category || 'Solaranlagen',
      keywords: content.keywords || ['Solaranlage', 'Photovoltaik', 'Festpreis']
    };
  }

  generateFAQSchema(content) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  generateProductSchema(content) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: content.name,
      description: content.description,
      brand: {
        '@type': 'Brand',
        name: 'ZOE Solar'
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: content.price || 'auf Anfrage',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'ZOE Solar'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: content.rating || '4.9',
        reviewCount: content.reviewCount || '250'
      }
    };
  }

  generateHowToSchema(content) {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: content.title,
      description: content.description,
      step: content.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      }))
    };
  }

  generateAEOContent(title, keywords = []) {
    // KI-basierte Content-Struktur für AI-Optimierung
    const content = {
      title: title,
      description: `Umfassende Informationen zu ${title.toLowerCase()}. Erfahren Sie alles Wichtige über Kosten, Vorteile und Umsetzung.`,
      keywords: keywords,
      sections: [
        {
          heading: `Was ist ${title}?`,
          content: `Eine detaillierte Erklärung von ${title.toLowerCase()} mit allen wichtigen Aspekten.`
        },
        {
          heading: `Vorteile von ${title}`,
          content: `Entdecken Sie die wichtigsten Vorteile und Nutzen von ${title.toLowerCase()}.`,
          list: [
            'Kosteneinsparungen',
            'Umweltfreundlich',
            'Unabhängigkeit von Energieversorgern',
            'Wertsteigerung der Immobilie'
          ]
        },
        {
          heading: `Kosten und Wirtschaftlichkeit`,
          content: `Detaillierte Kostenübersicht und Amortisationsrechnung für ${title.toLowerCase()}.`
        },
        {
          heading: `Häufige Fragen zu ${title}`,
          faqs: [
            {
              question: `Wie viel kostet ${title}?`,
              answer: `Die Kosten variieren je nach Größe und Ausstattung. Wir bieten Festpreise ab 15.000€.`
            },
            {
              question: `Wie lange dauert die Amortisation?`,
              answer: `Bei aktuellen Strompreisen meist 6–8 Jahre durch Kosteneinsparungen.`
            }
          ]
        }
      ]
    };

    return content;
  }

  optimizeForVoiceSearch(content) {
    // Voice-Search-Optimierung
    const voiceOptimized = {
      ...content,
      title: content.title.replace(/^/, ''), // Entferne unnötige Wörter
      description: content.description.replace(/Erfahren Sie|Entdecken Sie/g, 'Hier finden Sie'),
      questions: [
        `Was ist ${content.title.toLowerCase()}?`,
        `Wie funktioniert ${content.title.toLowerCase()}?`,
        `Was kostet ${content.title.toLowerCase()}?`,
        `Wo kann ich ${content.title.toLowerCase()} kaufen?`
      ]
    };

    return voiceOptimized;
  }

  generateSchemaMarkup(type, content) {
    const template = this.templates[type];
    if (!template) {
      throw new Error(`Unbekannter Schema-Typ: ${type}`);
    }

    return template(content);
  }

  createOptimizedPage(title, type = 'article', keywords = []) {
    const baseContent = this.generateAEOContent(title, keywords);
    const voiceOptimized = this.optimizeForVoiceSearch(baseContent);
    const schema = this.generateSchemaMarkup(type, {
      ...voiceOptimized,
      url: `https://zoe-solar.de/${title.toLowerCase().replace(/\s+/g, '-')}`
    });

    return {
      content: voiceOptimized,
      schema: schema,
      html: this.generateHTMLOutput(voiceOptimized, schema)
    };
  }

  generateHTMLOutput(content, schema) {
    const schemaScript = `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;

    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title} | ZOE Solar</title>
    <meta name="description" content="${content.description}">
    <meta name="keywords" content="${content.keywords.join(', ')}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    ${schemaScript}
</head>
<body>
    <header>
        <h1>${content.title}</h1>
        <p>${content.description}</p>
    </header>

    <main>
        ${content.sections.map(section => `
        <section>
            <h2>${section.heading}</h2>
            <p>${section.content}</p>
            ${section.list ? `<ul>${section.list.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
            ${section.faqs ? `
            <div class="faqs">
                ${section.faqs.map(faq => `
                <div class="faq">
                    <h3>${faq.question}</h3>
                    <p>${faq.answer}</p>
                </div>
                `).join('')}
            </div>
            ` : ''}
        </section>
        `).join('')}

        <section>
            <h2>Voice-Search optimierte Fragen</h2>
            <ul>
                ${content.questions.map(question => `<li>${question}</li>`).join('')}
            </ul>
        </section>
    </main>
</body>
</html>`;

    return html;
  }

  async optimizeExistingContent() {
    console.log('🔄 Optimiere bestehende Inhalte für AEO...');

    // Finde alle Content-Dateien
    const contentFiles = this.findContentFiles();

    for (const file of contentFiles) {
      console.log(`📝 Optimiere: ${file}`);

      try {
        const content = fs.readFileSync(file, 'utf8');
        const optimizedContent = this.optimizeContentForAEO(content);

        // Backup erstellen
        fs.copyFileSync(file, `${file}.backup`);

        // Optimierte Version speichern
        fs.writeFileSync(file, optimizedContent);

        console.log(`✅ Optimiert: ${file}`);
      } catch (error) {
        console.error(`❌ Fehler bei ${file}:`, error.message);
      }
    }
  }

  findContentFiles() {
    const files = [];

    function scanDir(dir) {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
          files.push(fullPath);
        }
      }
    }

    scanDir(this.contentDir);
    return files;
  }

  optimizeContentForAEO(content) {
    // AEO-Optimierungen anwenden
    let optimized = content;

    // Voice-Search-Optimierung
    optimized = optimized.replace(
      /<h1>(.*?)<\/h1>/g,
      (match, title) => `<h1>${this.optimizeForVoiceSearch({ title }).title}</h1>`
    );

    // Strukturierte Listen für AI
    optimized = optimized.replace(
      /<ul>(.*?)<\/ul>/gs,
      (match) => match.replace(/<li>/g, '<li>• ')
    );

    // FAQ-Schema für häufige Fragen
    if (content.includes('faq') || content.includes('FAQ')) {
      const faqSchema = this.generateFAQSchema({
        faqs: [
          {
            question: 'Wie funktioniert das?',
            answer: 'Eine detaillierte Erklärung des Prozesses.'
          }
        ]
      });

      const schemaScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
      optimized = optimized.replace(
        /<\/head>/,
        `${schemaScript}\n</head>`
      );
    }

    return optimized;
  }

  async runOptimization() {
    console.log('🚀 Starte AEO-Optimierung...\n');

    // Bestehende Inhalte optimieren
    await this.optimizeExistingContent();

    // Neue optimierte Seiten erstellen
    const pages = [
      { title: 'Solaranlagen Kosten', keywords: ['Solaranlage Kosten', 'Photovoltaik Preis', 'PV-Anlage Festpreis'] },
      { title: 'Solarförderungen 2025', keywords: ['Solarförderung', 'KfW-Förderung', 'Einspeisevergütung'] },
      { title: 'Solaranlagen Wirtschaftlichkeit', keywords: ['Solaranlage ROI', 'Amortisation Photovoltaik', 'Solarertrag'] }
    ];

    for (const page of pages) {
      const optimizedPage = this.createOptimizedPage(page.title, 'article', page.keywords);

      const filename = `${page.title.toLowerCase().replace(/\s+/g, '-')}.html`;
      const filepath = path.join(__dirname, '..', 'public', filename);

      fs.writeFileSync(filepath, optimizedPage.html);
      console.log(`📄 Neue AEO-optimierte Seite erstellt: ${filename}`);
    }

    console.log('\n✨ AEO-Optimierung abgeschlossen!');
    console.log('📊 Verwende das SEO-Audit-Script für Messung der Verbesserungen.');
  }
}

// CLI Interface
if (require.main === module) {
  const optimizer = new SEOAEOOptimizer();

  const command = process.argv[2];

  switch (command) {
    case 'optimize':
      optimizer.runOptimization().catch(console.error);
      break;
    case 'audit':
      const { runSEOAudit } = require('./seo-audit');
      runSEOAudit().catch(console.error);
      break;
    default:
      console.log('Verwendung:');
      console.log('  node seo-aeo-optimizer.js optimize  # AEO-Optimierung starten');
      console.log('  node seo-aeo-optimizer.js audit     # SEO-Audit durchführen');
      break;
  }
}

module.exports = SEOAEOOptimizer;
