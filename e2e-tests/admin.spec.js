const { test, expect } = require('@playwright/test');

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin.html');
  });

  test('should display admin panel correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Admin Panel/);
    await expect(page.locator('h1')).toContainText('Quiz Administration Panel');
    
    // Check back to home button
    await expect(page.locator('text=← Back to Home')).toBeVisible();
    
    // Check admin controls section
    await expect(page.locator('.admin-controls')).toBeVisible();
    
    // Check buttons that actually exist
    await expect(page.locator('#add-question')).toBeVisible();
    await expect(page.locator('#save-all')).toBeVisible();
    
    // Check question count display
    await expect(page.locator('#question-count')).toBeVisible();
  });

  test('should load existing quiz questions', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('.question-item', { timeout: 10000 });
    
    // Check if questions are displayed
    const questionsList = page.locator('#quiz-admin-list');
    await expect(questionsList).toBeVisible();
    
    // Should show at least one question
    const questionItems = await page.locator('.question-item').count();
    expect(questionItems).toBeGreaterThan(0);
    
    // Should show question count
    await page.waitForFunction(() => {
      const countElement = document.getElementById('question-count');
      return countElement && countElement.textContent !== 'Loading...';
    });
    
    const questionCount = await page.locator('#question-count').textContent();
    expect(parseInt(questionCount)).toBeGreaterThan(0);
  });

  test('should add new question', async ({ page }) => {
    // Wait for initial questions to load
    await page.waitForSelector('.question-item');
    const initialQuestions = await page.locator('.question-item').count();
    
    // Click add new question button
    await page.click('#add-question');
    
    // Wait for the new question to appear
    await page.waitForFunction((expectedCount) => {
      return document.querySelectorAll('.question-item').length === expectedCount;
    }, initialQuestions + 1);
    
    // Check that a new question form was added
    const newQuestionCount = await page.locator('.question-item').count();
    expect(newQuestionCount).toBe(initialQuestions + 1);
    
    const lastQuestion = page.locator('.question-item').last();
    await expect(lastQuestion.locator('.question-input')).toBeVisible();
    await expect(lastQuestion.locator('.choices-input')).toBeVisible();
    await expect(lastQuestion.locator('.answer-input')).toBeVisible();
    
    // Fill out the new question
    await lastQuestion.locator('.question-input').fill('What is a closure in JavaScript?');
    await lastQuestion.locator('.choices-input').fill('A function inside another function, A variable, A loop, An object');
    await lastQuestion.locator('.answer-input').fill('A function inside another function');
    
    // Check that form was filled
    await expect(lastQuestion.locator('.question-input')).toHaveValue('What is a closure in JavaScript?');
  });

  test('should edit existing question', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('.question-item');
    
    const firstQuestion = page.locator('.question-item').first();
    const questionInput = firstQuestion.locator('.question-input');
    
    // Get original value
    const originalValue = await questionInput.inputValue();
    
    // Clear and fill new question text
    await questionInput.clear();
    await questionInput.fill('Updated test question');
    
    // Verify the input was updated
    await expect(questionInput).toHaveValue('Updated test question');
  });

  test('should delete questions', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('.question-item');
    const initialQuestions = await page.locator('.question-item').count();
    
    // Only test deletion if there's more than one question
    if (initialQuestions > 1) {
      // Set up dialog handler to confirm deletion
      page.once('dialog', dialog => {
        expect(dialog.message()).toContain('Are you sure you want to delete this question?');
        dialog.accept();
      });
      
      // Click delete button on first question
      await page.locator('.question-item').first().locator('button:has-text("🗑️ Delete")').click();
      
      // Wait for question to be removed
      await page.waitForFunction((expectedCount) => {
        return document.querySelectorAll('.question-item').length === expectedCount;
      }, initialQuestions - 1);
      
      const newQuestionCount = await page.locator('.question-item').count();
      expect(newQuestionCount).toBe(initialQuestions - 1);
    }
  });

  test('should preview questions', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('.question-item');
    
    // Click preview button on first question
    await page.locator('.question-item').first().locator('button:has-text("👁️ Preview")').click();
    
    // Check that preview appears - use more specific selector to avoid the info alert at top
    await expect(page.locator('.alert-info:has-text("Preview Question")')).toBeVisible();
  });

  test('should save questions and show success message', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('.question-item');
    
    // Click save button
    await page.click('#save-all');
    
    // Should show save confirmation or success message
    await page.waitForSelector('.alert-success', { timeout: 5000 });
    await expect(page.locator('.alert-success')).toContainText('Saved!');
    await expect(page.locator('.alert-success')).toContainText('Quiz data has been updated successfully');
  });

  test('should update question count when adding questions', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('.question-item');
    await page.waitForFunction(() => {
      const countElement = document.getElementById('question-count');
      return countElement && countElement.textContent !== 'Loading...';
    });
    
    // Get initial count
    const initialCount = await page.locator('#question-count').textContent();
    const initialNum = parseInt(initialCount);
    
    // Add a new question
    await page.click('#add-question');
    
    // Wait for count to update
    await page.waitForFunction((expectedCount) => {
      const countElement = document.getElementById('question-count');
      return countElement && parseInt(countElement.textContent) === expectedCount;
    }, initialNum + 1);
    
    // Count should be updated
    const newCount = await page.locator('#question-count').textContent();
    expect(parseInt(newCount)).toBe(initialNum + 1);
  });

  test('should navigate back to home', async ({ page }) => {
    await page.click('text=← Back to Home');
    // Accept either / or /index.html as valid home URLs
    await expect(page).toHaveURL(/\/(index\.html)?$/);
    await expect(page.locator('h1')).toContainText('Advanced JavaScript Assignment');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that admin panel is usable on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#add-question')).toBeVisible();
    await expect(page.locator('#save-all')).toBeVisible();
    
    // Wait for questions to load
    await page.waitForSelector('.question-item');
    
    // Form fields should be accessible
    const questionInput = page.locator('.question-input').first();
    await expect(questionInput).toBeVisible();
    await questionInput.fill('Mobile test');
    await expect(questionInput).toHaveValue('Mobile test');
  });

  test('should show features and architecture information', async ({ page }) => {
    // Check that the feature explanation sections are visible
    await expect(page.locator('.alert-warning')).toContainText('JavaScript Features Demonstrated');
    await expect(page.locator('.alert-info')).toContainText('How to Update Quiz Questions');
    await expect(page.locator('.features-demo')).toContainText('Admin Module Architecture');
  });
});
