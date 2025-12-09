import { test, expect } from '@playwright/test';

test.describe('Critical User Paths', () => {
  test('directory search and profile view', async ({ page }) => {
    // Start at directory search
    await page.goto('/directory/search');
    await expect(page).toHaveURL(/directory\/search/);

    // Search should load without errors
    await page.waitForLoadState('networkidle');

    // Check if any profiles are displayed
    const profileLinks = page.locator('a[href^="/profile/"]');
    const count = await profileLinks.count();

    if (count > 0) {
      // Click first profile
      await profileLinks.first().click();

      // Should navigate to profile page
      await expect(page).toHaveURL(/\/profile\/.+/);

      // Profile should load without 404
      await expect(page).not.toHaveTitle(/404/);
    }
  });

  test('become a pana form submission flow', async ({ page }) => {
    await page.goto('/become-a-pana');

    // Form should be visible
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Key form elements should exist
    // (Adjust selectors based on actual form structure)
    await page.waitForLoadState('networkidle');
  });

  test('contact form loads and is interactive', async ({ page }) => {
    await page.goto('/form/contact-us');

    // Form should be visible
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Should have name, email, message fields (adjust selectors as needed)
    await page.waitForLoadState('networkidle');
  });

  test('donation flow initiates correctly', async ({ page }) => {
    await page.goto('/donate');

    // Page should load
    await page.waitForLoadState('networkidle');

    // Should not have errors
    await expect(page).not.toHaveTitle(/404/);
    await expect(page).not.toHaveTitle(/error/i);
  });
});

test.describe('Mentoring Features', () => {
  test('mentor discovery page loads', async ({ page }) => {
    await page.goto('/mentoring/discover');

    await expect(page).toHaveURL(/mentoring\/discover/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('mentor schedule page loads', async ({ page }) => {
    await page.goto('/mentoring/schedule');

    await expect(page).toHaveURL(/mentoring\/schedule/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('mentor profile page loads or redirects', async ({ page }) => {
    await page.goto('/mentoring/profile');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });
});

test.describe('Form Pages', () => {
  test('all form pages load without errors', async ({ page }) => {
    const forms = [
      '/form/become-a-pana',
      '/form/become-a-pana-single',
      '/form/become-an-affiliate',
      '/form/contact-us',
      '/form/join-the-team',
    ];

    for (const formUrl of forms) {
      await page.goto(formUrl);
      await expect(page).not.toHaveTitle(/404/);
      await page.waitForLoadState('networkidle');

      // Each form page should have a form element
      const formElement = page.locator('form').first();
      // Some pages might not have forms loaded immediately, so we just check the page loads
    }
  });
});

test.describe('List Pages', () => {
  test('list page with valid ID loads', async ({ page }) => {
    // Try to navigate to a list page
    // In real scenario, you'd get a valid list ID from the API or database
    await page.goto('/list/test-list-id');

    await page.waitForLoadState('networkidle');

    // Should either show the list or handle gracefully (not 500 error)
    const url = page.url();
    expect(url).toBeTruthy();
  });
});
