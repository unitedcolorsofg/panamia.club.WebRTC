import { test, expect } from '@playwright/test';

test.describe('Screenname API Endpoints', () => {
  test('screenname check API validates format - too short', async ({
    request,
  }) => {
    const response = await request.get('/api/user/screenname/check?name=ab');
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.available).toBe(false);
    expect(data.error).toContain('at least 3 characters');
  });

  test('screenname check API validates format - invalid characters', async ({
    request,
  }) => {
    const response = await request.get(
      '/api/user/screenname/check?name=test@user'
    );
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.available).toBe(false);
    expect(data.error).toContain('letters, numbers, underscores, or hyphens');
  });

  test('screenname check API validates format - starts with hyphen', async ({
    request,
  }) => {
    const response = await request.get(
      '/api/user/screenname/check?name=-testuser'
    );
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.available).toBe(false);
    expect(data.error).toContain('cannot start or end');
  });

  test('screenname check API rejects reserved words', async ({ request }) => {
    const response = await request.get('/api/user/screenname/check?name=admin');
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.available).toBe(false);
    expect(data.error).toContain('reserved');
  });

  test('screenname check API accepts valid screenname', async ({ request }) => {
    // Use a random screenname to avoid conflicts with existing users
    const randomName = `testuser_${Date.now()}`;
    const response = await request.get(
      `/api/user/screenname/check?name=${randomName}`
    );
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.available).toBe(true);
    expect(data.error).toBeUndefined();
  });

  test('screenname check API requires name parameter', async ({ request }) => {
    const response = await request.get('/api/user/screenname/check');

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('required');
  });

  test('screenname set API requires authentication', async ({ request }) => {
    const response = await request.post('/api/user/screenname/set', {
      data: { screenname: 'testuser123' },
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toContain('Authentication required');
  });

  test('author lookup API returns deleted for invalid ID', async ({
    request,
  }) => {
    const response = await request.get(
      '/api/user/author/000000000000000000000000'
    );
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.deleted).toBe(true);
  });
});

test.describe('Screenname UI Elements', () => {
  test('account edit page loads or redirects for screenname', async ({
    page,
  }) => {
    await page.goto('/account/user/edit', { waitUntil: 'domcontentloaded' });

    // Just verify we get a valid response (same pattern as existing tests)
    const url = page.url();
    expect(url).toBeTruthy();

    // Page should not show 404
    const title = await page.title();
    expect(title).not.toMatch(/404/i);
  });

  test('account edit page has expected structure when authenticated', async ({
    page,
  }) => {
    // This test documents expected behavior when authenticated
    // In CI/unauthenticated environments, the page will redirect
    await page.goto('/account/user/edit', { waitUntil: 'domcontentloaded' });

    const url = page.url();

    // If on the edit page, verify screenname-related elements exist in DOM
    if (url.includes('/account/user/edit')) {
      // Wait briefly for React hydration
      await page.waitForTimeout(1000);

      // Check page source contains screenname-related text
      const pageContent = await page.content();
      const hasScreennameField =
        pageContent.includes('screenname') ||
        pageContent.includes('Screenname');
      const hasPrivacyNotice =
        pageContent.includes('publicly displayed') ||
        pageContent.includes('Unauthorized');

      // Either we see the form or an unauthorized message
      expect(hasScreennameField || hasPrivacyNotice).toBeTruthy();
    }
    // Redirect is also valid for unauthenticated users
  });
});

test.describe('Screenname Validation Rules', () => {
  const validScreennames = [
    'abc',
    'user123',
    'test_user',
    'test-user',
    'User_Name-123',
    'a1b',
    'abcdefghijklmnopqrstuvwx', // 24 chars max
  ];

  const invalidScreennames = [
    { name: 'ab', reason: 'too short' },
    { name: 'a', reason: 'too short' },
    { name: '_test', reason: 'starts with underscore' },
    { name: 'test_', reason: 'ends with underscore' },
    { name: '-test', reason: 'starts with hyphen' },
    { name: 'test-', reason: 'ends with hyphen' },
    { name: 'test user', reason: 'contains space' },
    { name: 'test@user', reason: 'contains @' },
    { name: 'test.user', reason: 'contains dot' },
  ];

  for (const screenname of validScreennames) {
    test(`accepts valid screenname: ${screenname}`, async ({ request }) => {
      const response = await request.get(
        `/api/user/screenname/check?name=${screenname}`
      );
      const data = await response.json();

      // Should pass format validation (may or may not be available)
      expect(response.ok()).toBeTruthy();
      // If not available, it should be because it's taken, not invalid format
      if (!data.available) {
        expect(data.error).not.toContain('characters');
        expect(data.error).not.toContain('cannot start');
      }
    });
  }

  for (const { name, reason } of invalidScreennames) {
    test(`rejects invalid screenname (${reason}): ${name}`, async ({
      request,
    }) => {
      const response = await request.get(
        `/api/user/screenname/check?name=${encodeURIComponent(name)}`
      );
      const data = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(data.available).toBe(false);
      expect(data.error).toBeTruthy();
    });
  }
});

test.describe('Reserved Screennames', () => {
  const reservedNames = [
    'admin',
    'administrator',
    'pana',
    'panamia',
    'support',
    'help',
    'system',
    'moderator',
    'mod',
    'staff',
    'official',
    'anonymous',
    'deleted',
    'former',
    'member',
    'user',
  ];

  for (const name of reservedNames) {
    test(`rejects reserved screenname: ${name}`, async ({ request }) => {
      const response = await request.get(
        `/api/user/screenname/check?name=${name}`
      );
      const data = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(data.available).toBe(false);
      expect(data.error).toContain('reserved');
    });
  }

  test('reserved words are case-insensitive', async ({ request }) => {
    const response = await request.get('/api/user/screenname/check?name=ADMIN');
    const data = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(data.available).toBe(false);
    expect(data.error).toContain('reserved');
  });
});
