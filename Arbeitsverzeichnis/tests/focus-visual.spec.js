import { test, expect } from '@playwright/test';

const COMPONENTS = [
  { name: 'Primary Button', html: '<button class="bg-blue-600 text-white px-4 py-2 rounded focus-visible:focus-ring">Aktion</button>' },
  { name: 'Icon Button', html: '<button class="p-2 rounded hover:bg-neutral-100 focus-visible:focus-ring" aria-label="Schließen">✕</button>' },
  { name: 'Link', html: '<a href="#" class="underline underline-offset-4 focus-visible:focus-ring">Link</a>' }
];

test.describe('Focus Visual Regression', () => {
  for (const c of COMPONENTS) {
    test(c.name, async ({ page }) => {
      await page.setContent(`<div style='padding:40px'>${c.html}</div>`);
      await page.locator('body :focusable').first().focus();
      // Emulation: falls nicht automatisch fokussiert
      await page.keyboard.press('Tab');
      const el = page.locator(':focus');
      await expect(el).toBeVisible();
      // Screenshot zur späteren manuellen Kontrolle (kein Gate, Artefakt Upload in CI optional)
      await page.screenshot({ path: `focus-${c.name.replace(/\s+/g,'-').toLowerCase()}.png`, fullPage: false });
    });
  }
});
