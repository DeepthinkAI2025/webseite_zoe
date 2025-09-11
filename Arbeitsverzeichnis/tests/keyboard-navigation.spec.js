import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/whyus', name: 'WhyUs' },
  { path: '/technology', name: 'Technology' },
  { path: '/contact', name: 'Contact' },
  { path: '/projects', name: 'Projects' },
  { path: '/blog', name: 'Blog Listing' },
];

async function resolveBlogPostSlug(page){
  await page.goto('http://localhost:4173/blog');
  const first = await page.$('a[href^="/blog/"]');
  if(!first) return null;
  const href = await first.getAttribute('href');
  return href && href.startsWith('/blog/') ? href : null;
}

test.describe('Keyboard Navigation Core Pages', () => {
  for (const p of PAGES) {
    test(p.name, async ({ page }) => {
      await page.goto(`http://localhost:4173${p.path}`);
      // initial Tab -> Skip Link
      await page.keyboard.press('Tab');
      const active1 = await page.evaluate(()=> document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label'));
      expect(active1).toBeTruthy();
      // Press Tab a few times to ensure no keyboard trap
      for(let i=0;i<15;i++){ await page.keyboard.press('Tab'); }
      // Smoke: still on same page URL
      expect(page.url()).toContain(p.path);
    });
  }

  test('Blog Post', async ({ page }) => {
    const slug = await resolveBlogPostSlug(page);
    test.skip(!slug, 'Kein Blog Post verfügbar – Test übersprungen');
    await page.goto(`http://localhost:4173${slug}`);
    await page.keyboard.press('Tab');
    const first = await page.evaluate(()=> document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label'));
    expect(first).toBeTruthy();
    for(let i=0;i<15;i++){ await page.keyboard.press('Tab'); }
    expect(page.url()).toContain(slug);
  });
});
