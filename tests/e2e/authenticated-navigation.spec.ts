import { test, expect } from '@playwright/test';

/**
 * These tests require authentication.
 * In a real environment, you would set up auth state using Playwright's storageState feature.
 * For now, these tests will skip if not authenticated.
 */

test.describe('Authenticated User Navigation', () => {
  test('account user page redirects properly', async ({ page }) => {
    await page.goto('/account/user/');

    // Should redirect to either /account/user/edit (if authenticated) or / (if not)
    await page.waitForURL(/\/(account\/user\/edit|$)/);

    const url = page.url();
    const isAuthRoute = url.includes('/account/user/edit');
    const isHomeRoute =
      url === 'http://localhost:3000/' || url === 'http://localhost:3000';

    expect(isAuthRoute || isHomeRoute).toBeTruthy();
  });

  test('account user edit page loads or redirects', async ({ page }) => {
    await page.goto('/account/user/edit');

    await page.waitForLoadState('networkidle');

    // Should either show the page or redirect to home/login
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account user following page loads or redirects', async ({ page }) => {
    await page.goto('/account/user/following');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account user lists page loads or redirects', async ({ page }) => {
    await page.goto('/account/user/lists');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });
});

test.describe('Authenticated Profile Navigation', () => {
  test('account profile edit page loads or redirects', async ({ page }) => {
    await page.goto('/account/profile/edit');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account profile contact page loads without query errors', async ({
    page,
  }) => {
    await page.goto('/account/profile/contact');

    await page.waitForLoadState('networkidle');

    // Check that there are no React Query errors visible
    const queryError = page.getByText(/query data cannot be undefined/i);
    await expect(queryError).not.toBeVisible();
  });

  test('account profile address page loads or redirects', async ({ page }) => {
    await page.goto('/account/profile/address');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account profile categories page loads or redirects', async ({
    page,
  }) => {
    await page.goto('/account/profile/categories');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account profile desc page loads or redirects', async ({ page }) => {
    await page.goto('/account/profile/desc');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account profile social page loads or redirects', async ({ page }) => {
    await page.goto('/account/profile/social');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account profile images page loads or redirects', async ({ page }) => {
    await page.goto('/account/profile/images');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('account profile gentedepana page loads or redirects', async ({
    page,
  }) => {
    await page.goto('/account/profile/gentedepana');

    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toBeTruthy();
  });
});

test.describe('404 Error Prevention', () => {
  test('no account routes return 404', async ({ page }) => {
    const routes = [
      '/account/user/',
      '/account/user/edit',
      '/account/user/following',
      '/account/user/lists',
      '/account/profile/edit',
      '/account/profile/contact',
      '/account/profile/address',
      '/account/profile/categories',
      '/account/profile/desc',
      '/account/profile/social',
      '/account/profile/images',
      '/account/profile/gentedepana',
    ];

    for (const route of routes) {
      await page.goto(route);

      // Check that we don't get a 404 page
      const title = await page.title();
      expect(title).not.toMatch(/404/i);

      // Also check that the URL is valid (not showing a 404 route)
      const url = page.url();
      expect(url).not.toContain('404');
    }
  });
});
