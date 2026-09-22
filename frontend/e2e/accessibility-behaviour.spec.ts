import { expect, test } from '@playwright/test';

test.describe('keyboard and focus', () => {
  test('the skip link is the first tab stop and moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test('focused controls show a 2px outline', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // first header control

    const outlineWidth = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineWidth);
    expect(outlineWidth).toBe('2px');
  });
});

test.describe('reduced motion', () => {
  test('scroll-reveal content is rendered immediately, not hidden awaiting animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // With reduced motion, framer-motion wrappers become plain elements: nothing on the
    // page should be stuck at opacity 0 inline.
    const hidden = await page.evaluate(
      () => Array.from(document.querySelectorAll<HTMLElement>('[style*="opacity: 0"]')).length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe('contact form', () => {
  test('validates on blur, announces errors, and enables submit only when valid', async ({ page }) => {
    await page.goto('/contact-us');

    const submit = page.getByRole('button', { name: /Request Talent Bench Overview/ });
    await expect(submit).toBeDisabled();

    const name = page.getByLabel(/Full name/);
    await name.focus();
    await name.blur();
    await expect(page.getByRole('alert').filter({ hasText: 'Enter your name.' })).toBeVisible();

    await name.fill('Jamie Rivera');
    await page.getByLabel(/Enterprise work email/).fill('jamie@example.com');
    await expect(submit).toBeEnabled();
  });
});
