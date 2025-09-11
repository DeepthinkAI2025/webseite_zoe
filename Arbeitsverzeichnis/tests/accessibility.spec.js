import { test, expect } from '@playwright/test';

// Basic a11y interaction smoke tests (Skip-Link & Chat Drawer focus trap)

test.describe('Accessibility interactions', () => {
  test('Skip-link focuses main', async ({ page }) => {
    await page.goto('/');
    // Trigger skip-link via keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const activeId = await page.evaluate(()=> document.activeElement?.id);
    expect(activeId).toBe('main');
  });

  test('Chat drawer focus trap cycles', async ({ page }) => {
    await page.goto('/');
    // Open chat via custom event
    await page.evaluate(()=> window.dispatchEvent(new Event('open-support-chat')));
    // Wait for input autofocus
    await page.waitForSelector('#support-chat-input');
    const first = await page.evaluate(()=> document.activeElement === document.getElementById('support-chat-input'));
    expect(first).toBeTruthy();
    // Press Shift+Tab to cycle backwards (should wrap to last focusable - close button)
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    const isCloseFocused = await page.evaluate(()=> document.activeElement?.getAttribute('aria-label') === 'Schließen');
    expect(isCloseFocused).toBeTruthy();
    // Press Tab to go forward (wrap)
    await page.keyboard.press('Tab');
    const backToInput = await page.evaluate(()=> document.activeElement?.id === 'support-chat-input');
    expect(backToInput).toBeTruthy();
  });
});
