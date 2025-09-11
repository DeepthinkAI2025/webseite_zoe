#!/usr/bin/env node

const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runPerformanceAudit(url = 'http://localhost:4173') {
  console.log('🚀 Starte Performance-Audit mit Lighthouse...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const runnerResult = await lighthouse(url, {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: new URL(browser.wsEndpoint()).port,
    });

    const reportJson = runnerResult.report;
    const report = JSON.parse(reportJson);

    console.log('\n📊 Performance-Report:');
    console.log(`Performance Score: ${Math.round(report.categories.performance.score * 100)}/100`);
    console.log(`SEO Score: ${Math.round(report.categories.seo.score * 100)}/100`);
    console.log(`Accessibility Score: ${Math.round(report.categories.accessibility.score * 100)}/100`);
    console.log(`Best Practices Score: ${Math.round(report.categories['best-practices'].score * 100)}/100`);

    // Core Web Vitals
    const audits = report.audits;
    console.log('\n⚡ Core Web Vitals:');
    console.log(`LCP: ${audits['largest-contentful-paint'].displayValue}`);
    console.log(`FID: ${audits['max-potential-fid'].displayValue}`);
    console.log(`CLS: ${audits['cumulative-layout-shift'].displayValue}`);

    // Speichere Report
    const reportPath = path.join(__dirname, 'reports', 'lighthouse-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, reportJson);

    console.log(`\n💾 Report gespeichert: ${reportPath}`);

    return report;

  } catch (error) {
    console.error('❌ Fehler beim Performance-Audit:', error);
  } finally {
    await browser.close();
  }
}

async function validateSchemas(url = 'http://localhost:4173') {
  console.log('\n🔍 Validiere Schema-Markups...');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle0' });

    const schemas = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map(script => {
        try {
          return JSON.parse(script.textContent);
        } catch (e) {
          return { error: 'Invalid JSON', content: script.textContent };
        }
      });
    });

    console.log(`Gefundene Schema-Markups: ${schemas.length}`);

    schemas.forEach((schema, index) => {
      if (schema.error) {
        console.log(`❌ Schema ${index + 1}: ${schema.error}`);
      } else {
        console.log(`✅ Schema ${index + 1}: @type = ${schema['@type'] || 'Unknown'}`);
      }
    });

    return schemas;

  } catch (error) {
    console.error('❌ Fehler bei Schema-Validierung:', error);
  } finally {
    await browser.close();
  }
}

async function runSEOAudit() {
  console.log('🔍 Starte vollständigen SEO-Audit...\n');

  // Performance Audit
  const performanceReport = await runPerformanceAudit();

  // Schema Validation
  const schemas = await validateSchemas();

  // Zusammenfassung
  console.log('\n📋 Audit-Zusammenfassung:');
  console.log('✅ Performance-Audit abgeschlossen');
  console.log('✅ Schema-Validierung abgeschlossen');
  console.log(`📊 Gefundene Schemas: ${schemas.length}`);

  if (performanceReport) {
    const perfScore = Math.round(performanceReport.categories.performance.score * 100);
    const seoScore = Math.round(performanceReport.categories.seo.score * 100);

    console.log(`🎯 Performance Score: ${perfScore}/100`);
    console.log(`🔍 SEO Score: ${seoScore}/100`);

    if (perfScore < 90) {
      console.log('⚠️  Performance-Optimierung empfohlen!');
    }
    if (seoScore < 90) {
      console.log('⚠️  SEO-Optimierung empfohlen!');
    }
  }

  console.log('\n✨ Audit abgeschlossen!');
}

// Wenn direkt ausgeführt
if (require.main === module) {
  runSEOAudit().catch(console.error);
}

module.exports = { runPerformanceAudit, validateSchemas, runSEOAudit };
