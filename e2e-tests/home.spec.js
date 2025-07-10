const { test, expect } = require('@playwright/test');

test.describe('Home Page', () => {
  test('should load successfully and display main content', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle('Advanced JavaScript Assignment');
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Advanced JavaScript Assignment');
    
    // Check that all feature cards are present
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(4);
    
    // Check specific feature cards by their unique titles
    await expect(page.locator('h5:has-text("Contact Form")')).toBeVisible();
    await expect(page.locator('h5:has-text("Interactive Quiz")')).toBeVisible();
    await expect(page.locator('h5:has-text("Admin Panel")')).toBeVisible();
    await expect(page.locator('h5:has-text("RxJS Filter")')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test Contact Form link
    await page.click('a:has-text("Try Contact Form")');
    await expect(page).toHaveURL(/contact-assignment-complete\.html/);
    await expect(page.locator('h1')).toContainText('Contact Form');
    
    // Go back home
    await page.goto('/');
    
    // Test Quiz link
    await page.click('a:has-text("Take Quiz")');
    await expect(page).toHaveURL(/quiz\.html/);
    await expect(page.locator('h1')).toContainText('Quiz');
    
    // Go back home
    await page.goto('/');
    
    // Test Admin Panel link
    await page.click('a:has-text("Admin Panel")');
    await expect(page).toHaveURL(/admin\.html/);
    await expect(page.locator('h1')).toContainText('Quiz Administration Panel');
    
    // Go back home
    await page.goto('/');
    
    // Test Filter Demo link
    await page.click('a:has-text("Try Filter")');
    await expect(page).toHaveURL(/filter\.html/);
    await expect(page.locator('h1')).toContainText('Filter');
  });

  test('should display JavaScript features correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that advanced JavaScript features are mentioned in the lead text
    await expect(page.locator('p.lead')).toContainText('WeakMap');
    await expect(page.locator('p.lead')).toContainText('Type Guards');
    await expect(page.locator('p.lead')).toContainText('Proxy');
    await expect(page.locator('p.lead')).toContainText('Reflect');
    await expect(page.locator('p.lead')).toContainText('Set');
    await expect(page.locator('p.lead')).toContainText('Symbol');
    await expect(page.locator('p.lead')).toContainText('Generators');
    await expect(page.locator('p.lead')).toContainText('Iterators');
    
    // Check for RxJS in the filter card
    await expect(page.locator('.code-feature:has-text("RxJS")')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    // Check that content is still visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.feature-card').first()).toBeVisible();
    
    // Check that Bootstrap responsive classes work
    const container = page.locator('.container');
    await expect(container).toBeVisible();
  });
});
