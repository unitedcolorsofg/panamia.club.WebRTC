import { test, expect } from '@playwright/test';

test.describe('Public Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pana Mia/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about-us');
    await expect(page).toHaveURL(/about-us/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('directory search loads', async ({ page }) => {
    await page.goto('/directory/search');
    await expect(page).toHaveURL(/directory\/search/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('donate page loads', async ({ page }) => {
    await page.goto('/donate');
    await expect(page).toHaveURL(/donate/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('affiliate page loads', async ({ page }) => {
    await page.goto('/affiliate');
    await expect(page).toHaveURL(/affiliate/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('become a pana form loads', async ({ page }) => {
    await page.goto('/become-a-pana');
    await expect(page).toHaveURL(/become-a-pana/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('contact form loads', async ({ page }) => {
    await page.goto('/form/contact-us');
    await expect(page).toHaveURL(/form\/contact-us/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('links page loads', async ({ page }) => {
    await page.goto('/links');
    await expect(page).toHaveURL(/links/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('podcasts page loads', async ({ page }) => {
    await page.goto('/podcasts');
    await expect(page).toHaveURL(/podcasts/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('terms and conditions loads', async ({ page }) => {
    await page.goto('/doc/terms-and-conditions');
    await expect(page).toHaveURL(/doc\/terms-and-conditions/);
    await expect(page).not.toHaveTitle(/404/);
  });

  test('affiliate terms loads', async ({ page }) => {
    await page.goto('/doc/affiliate-terms-and-conditions');
    await expect(page).toHaveURL(/doc\/affiliate-terms-and-conditions/);
    await expect(page).not.toHaveTitle(/404/);
  });
});

test.describe('Profile Pages', () => {
  test('profile page with valid handle loads', async ({ page }) => {
    // Navigate to directory first to find a valid profile
    await page.goto('/directory/search');

    // Wait for any profile links to appear
    const profileLink = page.locator('a[href^="/profile/"]').first();

    // If a profile exists, test it
    if ((await profileLink.count()) > 0) {
      await profileLink.click();
      await expect(page).toHaveURL(/\/profile\/.+/);
      await expect(page).not.toHaveTitle(/404/);
    } else {
      // Skip if no profiles exist
      test.skip();
    }
  });
});

test.describe('Navigation Links', () => {
  test('homepage has navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check that main navigation exists (adjust selectors as needed)
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });
});
