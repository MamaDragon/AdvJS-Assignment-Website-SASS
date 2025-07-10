const { test, expect } = require('@playwright/test');

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact-assignment-complete.html');
  });

  test('should display contact form correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Contact Assignment/);
    await expect(page.locator('h1')).toContainText('Contact Form Assignment');
    
    // Check back to home button
    await expect(page.locator('text=← Back to Home')).toBeVisible();
    
    // Check form fields are present
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#zip')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check feature descriptions
    await expect(page.locator('text=WeakMap')).toBeVisible();
    await expect(page.locator('text=Type Guards')).toBeVisible();
    await expect(page.locator('text=Proxy')).toBeVisible();
  });

  test('should validate form fields correctly', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // Try to submit empty form
    await submitButton.click();
    
    // Should show validation errors (we'll check for form validation)
    // The form should not submit with empty fields
    await expect(page.locator('#response')).toBeEmpty();
    
    // Test invalid phone number
    await page.fill('#phone', '123');
    await page.fill('#email', 'test@example.com');
    await page.fill('#zip', '12345');
    await submitButton.click();
    
    // Should show phone validation error
    await expect(page.locator('#response')).toContainText('Phone must be 10 digits');
    
    // Test invalid email
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'invalid-email');
    await page.fill('#zip', '12345');
    await submitButton.click();
    
    // Should show email validation error
    await expect(page.locator('#response')).toContainText('Invalid email format');
    
    // Test invalid zip
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'test@example.com');
    await page.fill('#zip', '123');
    await submitButton.click();
    
    // Should show zip validation error
    await expect(page.locator('#response')).toContainText('Zip must be 5 digits');
  });

  test('should submit valid form successfully', async ({ page }) => {
    // Fill form with valid data
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'test@example.com');
    await page.fill('#zip', '12345');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('#response')).toContainText('Form submitted successfully');
    await expect(page.locator('#response')).toContainText('Data has been saved');
    
    // Should show download button
    await expect(page.locator('text=Download My Submission')).toBeVisible();
  });

  test('should show and manage saved submissions', async ({ page }) => {
    // First submit a form to have data to show
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'test@example.com');
    await page.fill('#zip', '12345');
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('#response')).toContainText('Form submitted successfully');
    
    // Click "View Saved Data" button
    await page.click('text=View Saved Data');
    
    // Should show saved submissions
    await expect(page.locator('#savedSubmissions')).toContainText('Saved Submissions');
    await expect(page.locator('#savedSubmissions')).toContainText('1234567890');
    await expect(page.locator('#savedSubmissions')).toContainText('test@example.com');
    await expect(page.locator('#savedSubmissions')).toContainText('12345');
    
    // Should show clear button
    await expect(page.locator('text=Clear All Data')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL(/\/(index\.html)?$/);
    await expect(page.locator('h1')).toContainText('Advanced JavaScript Assignment');
  });

  test('should have working download buttons', async ({ page }) => {
    // Check that download buttons are present
    await expect(page.locator('text=Download contacts.json')).toBeVisible();
    await expect(page.locator('text=Download All Individual')).toBeVisible();
    
    // Note: We can't easily test actual file downloads in Playwright without 
    // additional setup, but we can verify the buttons exist and are clickable
    const downloadButton = page.locator('text=Download contacts.json');
    await expect(downloadButton).toBeEnabled();
  });
});
