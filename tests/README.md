# Playwright E2E Tests

This directory contains end-to-end tests for the Panamia application using Playwright.

## Test Structure

- `e2e/public-navigation.spec.ts` - Tests for public pages accessible without authentication
- `e2e/authenticated-navigation.spec.ts` - Tests for authenticated user routes
- `e2e/critical-paths.spec.ts` - Tests for critical user journeys and workflows

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# View test report
npm run test:report
```

## Pre-commit Integration

Tests run automatically on every commit via Husky pre-commit hook. Commits will be blocked if tests fail.

## CI/CD Integration

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

See `.github/workflows/playwright.yml` for CI configuration.

## Test Coverage

### Public Navigation

- Homepage
- About page
- Directory search
- Donate page
- Affiliate page
- Contact forms
- Terms and conditions
- Profile pages

### Authenticated Routes

- Account user pages (edit, following, lists)
- Account profile pages (contact, address, categories, desc, social, images, gentedepana)
- 404 error prevention

### Critical Paths

- Directory search → Profile view
- Become a Pana form
- Contact form
- Donation flow
- Mentoring features
- List pages

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Import Playwright test utilities: `import { test, expect } from '@playwright/test';`
3. Write tests using Playwright's API
4. Tests will automatically run on commit and in CI

## Configuration

See `playwright.config.ts` in the project root for Playwright configuration.
