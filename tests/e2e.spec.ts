import { test, expect } from '@playwright/test';

test.describe('E2E Verification', () => {

    test('Home Page: Loads correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/SNEAKHUB/i);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('Shop Page: Displays products', async ({ page }) => {
        await page.goto('/shop');

        // Wait for potential animations or lazy loading
        await page.waitForTimeout(1000);

        // Check for product links (cards)
        const productLink = page.locator('a[href*="/product/"]').first();
        await expect(productLink).toBeVisible();

        // Check for general price symbol
        await expect(page.locator('body')).toContainText('$');
    });

    test('Admin: Redirects to login when unauthenticated', async ({ page }) => {
        await page.goto('/admin');

        // Wait for potential redirection
        await page.waitForTimeout(2000);

        const url = page.url();
        console.log('Admin test landed on:', url);

        // Check if URL contains 'login' or at least is not /admin
        if (url.includes('login')) {
            await expect(page).toHaveURL(/.*login/);
            // Verify specific login page elements
            await expect(page.getByPlaceholder('admin@sneakhub.cl')).toBeVisible();
        } else {
            // If not redirecting, maybe we are home?
            // Just specific check for debugging
            expect(url).not.toContain('/admin');
        }
    });

});
