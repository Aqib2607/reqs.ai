import { test, expect } from '@playwright/test';

test('auth flow', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');
    await expect(page).toHaveTitle(/Reqs.ai/);

    // 2. Go to login
    await page.getByRole('link', { name: /log in/i }).click();
    await expect(page).toHaveURL(/.*\/login/);

    // 3. Fill login form (assuming test user exists or we mock api)
    await page.getByPlaceholderText(/email/i).fill('test@example.com');
    await page.getByPlaceholderText(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // 4. Verify redirect to dashboard
    // await expect(page).toHaveURL(/.*\/dashboard/);
});
