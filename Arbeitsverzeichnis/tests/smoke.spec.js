// @ts-check
import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE || 'http://localhost:4173';

const routes = ['/', '/warum-zoe', '/technologie', '/kontakt'];

for (const route of routes) {
  test(`smoke: ${route}`, async ({ page }) => {
    await page.goto(`${BASE}${route}`);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
  });
}
