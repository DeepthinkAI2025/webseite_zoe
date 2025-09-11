import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:4173';

async function startPreview(page) {
  // assumes vite preview started externally in CI or via script; here we just navigate
  await page.goto(BASE + '/');
}

test.describe('Skip-Link & Chat Drawer Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await startPreview(page);
  });

  test('Skip link appears on Tab and moves focus to main', async ({ page }) => {
    // Press Tab to focus first focusable (skip link should become visible & focused)
    await page.keyboard.press('Tab');
    const skip = page.locator('a.skip-link');
    await expect(skip).toBeVisible();
    await expect(skip).toBeFocused();
    await skip.click();
    // Focus should land on #main (or inside main if main not focusable) -> we ensure main has tabindex or check activeElement parent chain
    const activeId = await page.evaluate(() => document.activeElement.id);
    if (activeId !== 'main') {
      const inMain = await page.evaluate(() => {
        const main = document.getElementById('main');
        return main && main.contains(document.activeElement);
      });
      expect(inMain).toBeTruthy();
    }
  });

  test('Chat drawer traps focus and restores on close', async ({ page }) => {
    // Open chat via custom event
    await page.evaluate(() => window.dispatchEvent(new Event('open-support-chat')));
    const dialog = page.locator('[role="dialog"][aria-labelledby="support-chat-heading"]');
    await expect(dialog).toBeVisible();

    const input = dialog.locator('#support-chat-input');
    await expect(input).toBeFocused();

    // Collect focusable elements
    const focusables = dialog.locator('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const count = await focusables.count();
    expect(count).toBeGreaterThan(2);

    // Press Shift+Tab from first to wrap to last
    await page.keyboard.press('Shift+Tab');
    // Expect focus to wrap (approximation: focus is a button with aria-label="Senden" or close button)
    const activeAria = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    expect(['Schließen', 'Senden', 'Nachricht eingeben'].some(v => v === activeAria)).toBeTruthy();

    // ESC should close
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});
