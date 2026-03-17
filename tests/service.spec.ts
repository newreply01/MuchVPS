import { test, expect } from '@playwright/test';

test.describe('Zeabur Service Details', () => {
  test.beforeEach(async ({ page }) => {
    // Go to a specific service page
    await page.goto('/dashboard/1/services/api');
  });

  test('should display live logs', async ({ page }) => {
    await expect(page.locator('text=日誌')).toHaveClass(/text-primary/); // Active tab check
    
    const logContainer = page.locator('.font-mono');
    const initialLogCount = await logContainer.locator('div').count();
    
    // Wait for at least one more log line to appear (simulated every 3s)
    await expect(async () => {
      const currentCount = await logContainer.locator('div').count();
      expect(currentCount).toBeGreaterThan(initialLogCount);
    }).toPass({ timeout: 10000 });
  });

  test('should edit environment variables', async ({ page }) => {
    await page.click('text=環境變量');
    
    const envTable = page.locator('table');
    await expect(envTable).toBeVisible();
    
    // Check visibility toggle
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
    
    await page.locator('button >> .lucide-eye').first().click(); // Click global reveal or row reveal
    // Note: our component has both, let's target the global one
    await page.locator('button:has(.lucide-eye)').click();
    await expect(page.locator('input[type="text"]').filter({ hasText: '' }).nth(2)).toBeVisible(); // Middle one is value
  });

  test('should simulate networking copy', async ({ page }) => {
    await page.click('text=網絡');
    
    await page.click('text=複製網名');
    await expect(page.locator('text=已複製')).toBeVisible();
  });
});
