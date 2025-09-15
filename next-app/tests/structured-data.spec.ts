import { test, expect } from '@playwright/test';

/**
 * Structured Data Regression Test
 * Prüft Kern-Schema.org Typen auf ausgewählten Seiten.
 *  - /              : Organization, WebSite, BreadcrumbList
 *  - /pricing       : OfferCatalog, BreadcrumbList
 *  - /faq           : FAQPage, BreadcrumbList
 *  - /contact       : BreadcrumbList (kein LocalBusiness mehr nach Refactor)
 *  - /standorte/berlin : Service, ServiceAreaBusiness, BreadcrumbList
 *  - /expert/marie-schneider : Person, BreadcrumbList
 */

import type { Page } from '@playwright/test';

async function extractTypes(page: Page){
  const blocks = await page.locator('script[type="application/ld+json"]').all();
  const types = new Set<string>();
  for(const b of blocks){
    const txt = await b.textContent();
    if(!txt) continue;
    try {
      const json = JSON.parse(txt);
      const collect = (obj: any) => {
        if(Array.isArray(obj)) return obj.forEach(collect);
        if(obj && typeof obj === 'object') {
          if(obj['@type']) {
            if(Array.isArray(obj['@type'])) obj['@type'].forEach((t: string)=> types.add(t));
            else types.add(String(obj['@type']));
          }
          Object.values(obj).forEach(v=> collect(v));
        }
      };
      collect(json);
    } catch { /* ignore parse errors */ }
  }
  return [...types];
}

interface Expectation { path: string; required: string[]; forbid?: string[] }
const pages: Expectation[] = [
  { path: '/', required: ['Organization','WebSite','BreadcrumbList','Service','Product'] },
  { path: '/pricing', required: ['OfferCatalog'] },
  { path: '/faq', required: ['FAQPage','BreadcrumbList'] },
  { path: '/contact', required: ['BreadcrumbList'] },
  { path: '/wissen', required: ['FAQPage','BreadcrumbList'] },
  { path: '/foerderung', required: ['HowTo','BreadcrumbList','FAQPage','ItemList'] },
  { path: '/wirtschaftlichkeit', required: ['FAQPage','BreadcrumbList'] },
  { path: '/standorte/berlin', required: ['Service','ServiceAreaBusiness','BreadcrumbList'], forbid:['LocalBusiness'] },
  { path: '/expert/marie-schneider', required: ['Person','BreadcrumbList'] }
  ,{ path: '/foerderung/bayern-2025', required: ['FAQPage','BreadcrumbList'], forbid:['LocalBusiness'] }
  ,{ path: '/foerderung/baden-wuerttemberg-2025', required: ['FAQPage','BreadcrumbList'], forbid:['LocalBusiness'] }
];

for (const p of pages) {
  test(`Structured Data ${p.path} enthält: ${p.required.join(', ')}${p.forbid ? ' und verbietet: ' + p.forbid.join(', ') : ''}` , async ({ page }) => {
    await page.goto(p.path);
    const types = await extractTypes(page);
    for(const req of p.required){
      expect(types).toContain(req);
    }
    if(p.forbid){
      for(const f of p.forbid){
        expect(types).not.toContain(f);
      }
    }
  });
}
