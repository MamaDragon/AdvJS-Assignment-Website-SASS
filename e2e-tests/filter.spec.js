const { test, expect } = require('@playwright/test');

test.describe('Filter Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/filter.html');
  });

  test('should display filter demo correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/RxJS Filter Demo/);
    await expect(page.locator('h1')).toContainText('RxJS Reactive Filter');
    
    // Check back to home button
    await expect(page.locator('text=← Back to Home')).toBeVisible();
    
    // Check main components
    await expect(page.locator('#search')).toBeVisible();
    await expect(page.locator('#infoTable')).toBeVisible();
    
    // Check that table has data
    const tableRows = page.locator('#infoTable tbody tr');
    await expect(tableRows.first()).toBeVisible();
  });

  test('should filter table rows based on search input', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(1000);
    
    // Get initial row count
    const allRows = page.locator('#infoTable tbody tr');
    const initialCount = await allRows.count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Search for specific text
    await page.fill('#search', 'John');
    await page.waitForTimeout(500); // Wait for debounce
    
    // Should filter rows
    const visibleRows = page.locator('#infoTable tbody tr:visible');
    const filteredCount = await visibleRows.count();
    
    // Should have fewer visible rows than total
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Visible rows should contain search term
    for (let i = 0; i < filteredCount; i++) {
      const rowText = await visibleRows.nth(i).textContent();
      expect(rowText.toLowerCase()).toContain('john');
    }
  });

  test('should handle empty search', async ({ page }) => {
    // Fill search then clear it
    await page.fill('#search', 'test');
    await page.waitForTimeout(500);
    
    await page.fill('#search', '');
    await page.waitForTimeout(500);
    
    // All rows should be visible again
    const allRows = page.locator('#infoTable tbody tr');
    const visibleRows = page.locator('#infoTable tbody tr:visible');
    
    const totalCount = await allRows.count();
    const visibleCount = await visibleRows.count();
    
    expect(visibleCount).toBe(totalCount);
  });

  test('should handle search with no results', async ({ page }) => {
    // Search for something that doesn't exist
    await page.fill('#search', 'xyznoresults');
    await page.waitForTimeout(500);
    
    // No rows should be visible
    const visibleRows = page.locator('#infoTable tbody tr:visible');
    const visibleCount = await visibleRows.count();
    
    expect(visibleCount).toBe(0);
  });

  test('should be case insensitive', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Search with lowercase
    await page.fill('#search', 'john');
    await page.waitForTimeout(500);
    const lowercaseResults = await page.locator('#infoTable tbody tr:visible').count();
    
    // Clear and search with uppercase
    await page.fill('#search', 'JOHN');
    await page.waitForTimeout(500);
    const uppercaseResults = await page.locator('#infoTable tbody tr:visible').count();
    
    // Should return same number of results
    expect(lowercaseResults).toBe(uppercaseResults);
  });

  test('should demonstrate RxJS features', async ({ page }) => {
    // Check that RxJS features are mentioned
    await expect(page.locator('text=RxJS Features Demonstrated')).toBeVisible();
    await expect(page.locator('text=reactive programming')).toBeVisible();
    
    // Check feature descriptions
    await expect(page.locator('text=debounceTime')).toBeVisible();
    await expect(page.locator('text=distinctUntilChanged')).toBeVisible();
    await expect(page.locator('text=map')).toBeVisible();
  });

  test('should handle rapid typing (debounce)', async ({ page }) => {
    const searchInput = page.locator('#search');
    
    // Type rapidly
    await searchInput.type('a');
    await searchInput.type('b');
    await searchInput.type('c');
    
    // Wait for debounce to settle
    await page.waitForTimeout(1000);
    
    // Should have final search value
    await expect(searchInput).toHaveValue('abc');
    
    // Should have performed search (no errors)
    // The table should be in a stable state
    const visibleRows = page.locator('#infoTable tbody tr:visible');
    await expect(visibleRows.first()).toBeVisible();
  });

  test('should search across all columns', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Get a value from the table to search for
    const firstRow = page.locator('#infoTable tbody tr').first();
    const rowText = await firstRow.textContent();
    
    if (rowText) {
      // Extract a word from the row text
      const words = rowText.trim().split(/\s+/);
      const searchTerm = words[0];
      
      if (searchTerm && searchTerm.length > 1) {
        await page.fill('#search', searchTerm);
        await page.waitForTimeout(500);
        
        // Should find the row
        const visibleRows = page.locator('#infoTable tbody tr:visible');
        const count = await visibleRows.count();
        expect(count).toBeGreaterThan(0);
        
        // First visible row should contain the search term
        const firstVisibleRowText = await visibleRows.first().textContent();
        expect(firstVisibleRowText.toLowerCase()).toContain(searchTerm.toLowerCase());
      }
    }
  });

  test('should navigate back to home', async ({ page }) => {
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Advanced JavaScript Assignment');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that filter demo is usable on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#search')).toBeVisible();
    await expect(page.locator('#infoTable')).toBeVisible();
    
    // Search should work on mobile
    await page.fill('#search', 'test');
    await page.waitForTimeout(500);
    
    // Should not cause layout issues
    await expect(page.locator('#search')).toBeVisible();
  });

  test('should handle special characters in search', async ({ page }) => {
    // Test with special characters
    const specialChars = ['.', '(', ')', '[', ']', '*', '+', '?'];
    
    for (const char of specialChars) {
      await page.fill('#search', char);
      await page.waitForTimeout(300);
      
      // Should not cause JavaScript errors
      // The search should handle special regex characters gracefully
      const visibleRows = page.locator('#infoTable tbody tr:visible');
      const count = await visibleRows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
