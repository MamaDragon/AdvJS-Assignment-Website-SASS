const { test, expect } = require('@playwright/test');

test.describe('Quiz Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz.html');
  });

  test('should display quiz page correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Interactive Quiz/);
    await expect(page.locator('h1')).toContainText('Advanced JavaScript Quiz');
    
    // Check back to home button
    await expect(page.locator('text=← Back to Home')).toBeVisible();
    
    // Check that quiz loads
    await expect(page.locator('#quizContainer')).toBeVisible();
    
    // Wait for quiz to load and check for questions
    await page.waitForSelector('.question-card', { timeout: 10000 });
    
    // Should have multiple choice questions
    const questions = page.locator('.question-card');
    await expect(questions.first()).toBeVisible();
  });

  test('should load questions from quiz data', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('.question-card', { timeout: 10000 });
    
    // Check that questions are displayed
    const questions = page.locator('.question-card');
    const questionCount = await questions.count();
    expect(questionCount).toBeGreaterThan(0);
    
    // Check that first question has choices
    const firstQuestion = questions.first();
    await expect(firstQuestion.locator('input[type="radio"]')).toHaveCount(4);
    
    // Check that submit button appears
    await expect(page.locator('#submitQuiz')).toBeVisible();
  });

  test('should handle quiz submission', async ({ page }) => {
    // Wait for quiz to load
    await page.waitForSelector('.question-card', { timeout: 10000 });
    
    // Select first answer for all questions
    const radioButtons = page.locator('input[type="radio"][value="0"]');
    const count = await radioButtons.count();
    
    for (let i = 0; i < count; i++) {
      await radioButtons.nth(i).click();
    }
    
    // Submit quiz
    await page.click('#submitQuiz');
    
    // Should show results
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#results')).toContainText('Quiz Results');
    
    // Should show score
    await expect(page.locator('#results')).toContainText(/Score:/);
  });

  test('should display results with proper styling', async ({ page }) => {
    // Wait for quiz to load
    await page.waitForSelector('.question-card', { timeout: 10000 });
    
    // Answer all questions (select first option)
    const radioButtons = page.locator('input[type="radio"][value="0"]');
    const count = await radioButtons.count();
    
    for (let i = 0; i < count; i++) {
      await radioButtons.nth(i).click();
    }
    
    // Submit quiz
    await page.click('#submitQuiz');
    
    // Wait for results
    await expect(page.locator('#results')).toBeVisible();
    
    // Check that results have proper Bootstrap styling
    const resultsCard = page.locator('#results .alert');
    await expect(resultsCard).toBeVisible();
    
    // Results should have one of the alert classes (success, warning, danger)
    const hasAlertClass = await resultsCard.evaluate((el) => {
      return el.classList.contains('alert-success') || 
             el.classList.contains('alert-warning') || 
             el.classList.contains('alert-danger');
    });
    expect(hasAlertClass).toBe(true);
  });

  test('should navigate back to home', async ({ page }) => {
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Advanced JavaScript Assignment');
  });

  test('should handle quiz errors gracefully', async ({ page }) => {
    // Try to submit without answering questions
    await page.waitForSelector('#submitQuiz', { timeout: 10000 });
    await page.click('#submitQuiz');
    
    // Should still work (might show 0 score or handle gracefully)
    // The quiz should not crash
    await expect(page.locator('#results')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for quiz to load
    await page.waitForSelector('.question-card', { timeout: 10000 });
    
    // Check that quiz is still usable on mobile
    await expect(page.locator('.question-card').first()).toBeVisible();
    await expect(page.locator('#submitQuiz')).toBeVisible();
    
    // Check that radio buttons are clickable
    const firstRadio = page.locator('input[type="radio"]').first();
    await firstRadio.click();
    await expect(firstRadio).toBeChecked();
  });
});
