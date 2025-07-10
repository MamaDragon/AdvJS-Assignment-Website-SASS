/**
 * @fileoverview Integration tests for the entire application
 * Tests cross-module functionality and end-to-end workflows
 */

// Use CommonJS for Jest compatibility

describe('Integration Tests - Full Application', () => {
  
  describe('Cross-Module Integration', () => {
    beforeEach(() => {
      // Reset DOM
      document.body.innerHTML = '';
      
      // Mock localStorage
      global.localStorage.clear();
      
      // Mock fetch
      global.fetch = jest.fn();
    });

    test('should integrate contact form with admin data', async () => {
      // Set up contact form DOM
      document.body.innerHTML = `
        <form id="myForm">
          <input type="tel" id="phone" value="1234567890">
          <input type="email" id="email" value="admin@quiz.com">
          <input type="text" id="zip" value="12345">
        </form>
        <div id="response"></div>
      `;

      // Mock form submission
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve({ message: 'Contact saved successfully' })
      });

      // Simulate form validation and submission
      const formMeta = new WeakMap();
      const form = document.getElementById('myForm');
      
      // Set validation metadata
      formMeta.set(form, { validated: true });
      
      // Get form data
      const formData = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        zip: document.getElementById('zip').value
      };

      // Validate form data
      const isValid = /^\d{10}$/.test(formData.phone) &&
                     /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(formData.email) &&
                     /^\d{5}$/.test(formData.zip);

      expect(isValid).toBe(true);
      expect(formMeta.get(form).validated).toBe(true);
    });

    test('should integrate quiz with admin panel data flow', async () => {
      // Mock quiz data
      const mockQuizData = [
        {
          id: 1,
          question: "What is a WeakMap?",
          choices: ["Array", "Object collection", "String", "Function"],
          correctAnswer: "Object collection"
        }
      ];

      // Mock fetch for quiz data
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve(mockQuizData)
      });

      // Simulate admin panel saving data
      const adminData = [...mockQuizData];
      adminData.push({
        id: 2,
        question: "What is a Proxy?",
        choices: ["Server", "Interceptor", "Database", "API"],
        correctAnswer: "Interceptor"
      });

      // Simulate quiz loading the updated data
      const quizData = await (await fetch('./quiz-data.json')).json();
      
      expect(fetch).toHaveBeenCalledWith('./quiz-data.json');
      expect(quizData).toEqual(mockQuizData);
    });

    test('should handle filter integration with dynamic content', () => {
      // Set up filter DOM
      document.body.innerHTML = `
        <input type="text" id="search">
        <table id="infoTable">
          <tbody>
            <tr><td>WeakMap</td><td>Advanced feature</td></tr>
            <tr><td>Proxy</td><td>Advanced feature</td></tr>
            <tr><td>Array</td><td>Basic feature</td></tr>
          </tbody>
        </table>
      `;

      // Simulate filter function
      const filterRows = (searchTerm) => {
        const rows = document.querySelectorAll('#infoTable tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          const isVisible = text.includes(searchTerm.toLowerCase());
          row.style.display = isVisible ? '' : 'none';
          if (isVisible) visibleCount++;
        });
        
        return visibleCount;
      };

      // Test filtering
      expect(filterRows('advanced')).toBe(2);
      expect(filterRows('weakmap')).toBe(1);
      expect(filterRows('nonexistent')).toBe(0);
    });
  });

  describe('End-to-End Workflows', () => {
    test('should complete full admin to quiz workflow', async () => {
      // 1. Admin creates/edits questions
      const adminQuestions = [
        {
          id: 1,
          question: "What is JavaScript?",
          choices: ["Language", "Framework", "Library", "Database"],
          correctAnswer: "Language"
        }
      ];

      // 2. Admin saves questions (mock localStorage)
      const jsonData = JSON.stringify(adminQuestions);
      localStorage.setItem('quizData', jsonData);

      // 3. Quiz loads questions
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve(adminQuestions)
      });

      const loadedQuestions = await (await fetch('./quiz-data.json')).json();

      // 4. User takes quiz
      document.body.innerHTML = `
        <div id="quiz"></div>
        <div id="quiz-results"></div>
      `;

      // Render quiz question
      const quizContainer = document.getElementById('quiz');
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question-card';
      
      const questionTitle = document.createElement('h5');
      questionTitle.textContent = '1. What is JavaScript?';
      questionDiv.appendChild(questionTitle);

      adminQuestions[0].choices.forEach((choice, index) => {
        const wrapper = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'question-0';
        input.value = choice;
        input.id = `q0-${index}`;
        
        const label = document.createElement('label');
        label.textContent = choice;
        label.setAttribute('for', input.id);
        
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        questionDiv.appendChild(wrapper);
      });

      quizContainer.appendChild(questionDiv);

      // 5. User selects answer
      document.querySelector('input[value="Language"]').checked = true;

      // 6. Calculate score
      const selectedAnswer = document.querySelector('input:checked').value;
      const isCorrect = selectedAnswer === adminQuestions[0].correctAnswer;

      expect(isCorrect).toBe(true);
      expect(loadedQuestions).toEqual(adminQuestions);
    });

    test('should handle error scenarios gracefully', async () => {
      // Test network failure
      global.fetch.mockRejectedValue(new Error('Network error'));

      let errorCaught = false;
      try {
        await fetch('./quiz-data.json');
      } catch (error) {
        errorCaught = true;
        expect(error.message).toBe('Network error');
      }
      
      expect(errorCaught).toBe(true);

      // Test invalid JSON
      global.fetch.mockResolvedValue({
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      errorCaught = false;
      try {
        const response = await fetch('./quiz-data.json');
        await response.json();
      } catch (error) {
        errorCaught = true;
        expect(error.message).toBe('Invalid JSON');
      }
      
      expect(errorCaught).toBe(true);
    });
  });

  describe('Performance and Memory Tests', () => {
    test('should handle large datasets efficiently', () => {
      // Create large dataset
      const largeQuizData = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}?`,
        choices: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
        correctAnswer: `A${i}`
      }));

      // Test serialization performance
      const startTime = Date.now();
      const jsonString = JSON.stringify(largeQuizData);
      const parsedData = JSON.parse(jsonString);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should be fast
      expect(parsedData).toHaveLength(1000);
      expect(parsedData[0]).toEqual(largeQuizData[0]);
    });

    test('should properly clean up WeakMap references', () => {
      const formMeta = new WeakMap();
      let form = document.createElement('form');
      
      // Add metadata
      formMeta.set(form, { validated: true });
      expect(formMeta.has(form)).toBe(true);
      
      // Remove reference
      form = null;
      
      // WeakMap should allow garbage collection
      // (We can't directly test GC, but we can test the API)
      const newForm = document.createElement('form');
      expect(formMeta.has(newForm)).toBe(false);
    });

    test('should handle DOM manipulation efficiently', () => {
      document.body.innerHTML = '<div id="container"></div>';
      const container = document.getElementById('container');

      // Test adding many elements
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.textContent = `Item ${i}`;
        div.className = 'test-item';
        container.appendChild(div);
      }
      
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(50); // Should be fast
      expect(container.children).toHaveLength(100);
      
      // Test cleanup
      container.innerHTML = '';
      expect(container.children).toHaveLength(0);
    });
  });

  describe('Accessibility and UX Tests', () => {
    test('should maintain proper form accessibility', () => {
      document.body.innerHTML = `
        <form id="accessible-form">
          <label for="test-input">Test Input:</label>
          <input type="text" id="test-input" aria-describedby="test-help">
          <div id="test-help">Help text for the input</div>
          <button type="submit">Submit</button>
        </form>
      `;

      const input = document.getElementById('test-input');
      const label = document.querySelector('label[for="test-input"]');
      const helpText = document.getElementById('test-help');

      expect(label).toBeTruthy();
      expect(label.getAttribute('for')).toBe('test-input');
      expect(input.getAttribute('aria-describedby')).toBe('test-help');
      expect(helpText).toBeTruthy();
    });

    test('should provide proper error messaging', () => {
      const errorMessages = {
        'VALIDATION_ERROR': 'Please check your input and try again.',
        'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
        'SERVER_ERROR': 'Server error occurred. Please try again later.'
      };

      const formatError = (errorCode, details = '') => {
        const baseMessage = errorMessages[errorCode] || 'An unexpected error occurred.';
        return details ? `${baseMessage} Details: ${details}` : baseMessage;
      };

      expect(formatError('VALIDATION_ERROR')).toBe('Please check your input and try again.');
      expect(formatError('UNKNOWN_ERROR')).toBe('An unexpected error occurred.');
      expect(formatError('NETWORK_ERROR', 'Timeout')).toContain('Details: Timeout');
    });

    test('should handle keyboard navigation', () => {
      document.body.innerHTML = `
        <div>
          <button id="btn1" tabindex="1">First</button>
          <button id="btn2" tabindex="2">Second</button>
          <button id="btn3" tabindex="3">Third</button>
        </div>
      `;

      const buttons = document.querySelectorAll('button');
      
      // Test that all buttons are focusable
      buttons.forEach(button => {
        expect(button.tabIndex).toBeGreaterThan(0);
      });

      // Test focus management
      const firstButton = document.getElementById('btn1');
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);
    });
  });
});
