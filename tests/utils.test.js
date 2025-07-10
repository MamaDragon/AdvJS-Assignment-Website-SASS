/**
 * @fileoverview Tests for utility functions and type definitions
 * Tests common utilities, validators, and helper functions
 */

// Use CommonJS for Jest compatibility

describe('Utility Functions and Types', () => {
  
  describe('Type Definitions and Interfaces', () => {
    test('should validate QuizQuestion interface', () => {
      const validQuestion = {
        id: 1,
        question: "What is JavaScript?",
        choices: ["Language", "Framework", "Library", "Database"],
        correctAnswer: "Language"
      };
      
      // Type validation function
      const isValidQuizQuestion = (obj) => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.id === 'number' &&
          typeof obj.question === 'string' &&
          Array.isArray(obj.choices) &&
          obj.choices.length > 0 &&
          typeof obj.correctAnswer === 'string' &&
          obj.choices.includes(obj.correctAnswer)
        );
      };
      
      expect(isValidQuizQuestion(validQuestion)).toBe(true);
      
      // Test invalid questions
      expect(isValidQuizQuestion({})).toBe(false);
      expect(isValidQuizQuestion(null)).toBe(false);
      expect(isValidQuizQuestion({ id: 'string' })).toBe(false);
    });

    test('should validate FormValidationMeta interface', () => {
      const validMeta = {
        validated: true,
        timestamp: Date.now(),
        errors: []
      };
      
      const isValidFormMeta = (obj) => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.validated === 'boolean' &&
          (obj.timestamp === undefined || typeof obj.timestamp === 'number') &&
          (obj.errors === undefined || Array.isArray(obj.errors))
        );
      };
      
      expect(isValidFormMeta(validMeta)).toBe(true);
      expect(isValidFormMeta({ validated: true })).toBe(true);
      expect(isValidFormMeta({ validated: 'true' })).toBe(false);
    });
  });

  describe('Validation Utilities', () => {
    const validators = {
      isValidEmail: (email) => {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
      },

      isValidPhone: (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
      },

      isValidZip: (zip) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zip);
      },

      sanitizeInput: (input) => {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      },

      validateQuizAnswer: (answer, correctAnswer) => {
        if (typeof answer !== 'string' || typeof correctAnswer !== 'string') {
          return false;
        }
        return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      }
    };

    test('should validate email addresses correctly', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first.last+tag@subdomain.example.org'
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
        'test@com',
        ''
      ];

      validEmails.forEach(email => {
        expect(validators.isValidEmail(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(validators.isValidEmail(email)).toBe(false);
      });
    });

    test('should validate phone numbers correctly', () => {
      const validPhones = ['1234567890', '9876543210'];
      const invalidPhones = [
        '123456789',    // too short
        '12345678901',  // too long
        'abcdefghij',   // non-numeric
        '123-456-7890', // with dashes
        '(123) 456-7890', // with parentheses
        ''
      ];

      validPhones.forEach(phone => {
        expect(validators.isValidPhone(phone)).toBe(true);
      });

      invalidPhones.forEach(phone => {
        expect(validators.isValidPhone(phone)).toBe(false);
      });
    });

    test('should validate zip codes correctly', () => {
      const validZips = ['12345', '90210', '00001'];
      const invalidZips = [
        '1234',      // too short
        '123456',    // too long
        'abcde',     // non-numeric
        '12-345',    // with dash
        ''
      ];

      validZips.forEach(zip => {
        expect(validators.isValidZip(zip)).toBe(true);
      });

      invalidZips.forEach(zip => {
        expect(validators.isValidZip(zip)).toBe(false);
      });
    });

    test('should sanitize input correctly', () => {
      const testCases = [
        { input: 'Hello World', expected: 'Hello World' },
        { input: '  spaced  ', expected: 'spaced' },
        { input: '<script>alert("xss")</script>Clean text', expected: 'Clean text' },
        { input: '', expected: '' },
        { input: 123, expected: '' },
        { input: null, expected: '' },
        { input: undefined, expected: '' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(validators.sanitizeInput(input)).toBe(expected);
      });
    });

    test('should validate quiz answers correctly', () => {
      expect(validators.validateQuizAnswer('JavaScript', 'JavaScript')).toBe(true);
      expect(validators.validateQuizAnswer('javascript', 'JavaScript')).toBe(true);
      expect(validators.validateQuizAnswer(' JavaScript ', 'JavaScript')).toBe(true);
      expect(validators.validateQuizAnswer('Java', 'JavaScript')).toBe(false);
      expect(validators.validateQuizAnswer('', 'JavaScript')).toBe(false);
      expect(validators.validateQuizAnswer(null, 'JavaScript')).toBe(false);
    });
  });

  describe('DOM Utilities', () => {
    const domUtils = {
      createElement: (tag, attributes = {}, textContent = '') => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
          if (key === 'className') {
            element.className = value;
          } else {
            element.setAttribute(key, value);
          }
        });
        
        if (textContent) {
          element.textContent = textContent;
        }
        
        return element;
      },

      findElement: (selector, context = document) => {
        return context.querySelector(selector);
      },

      findElements: (selector, context = document) => {
        return Array.from(context.querySelectorAll(selector));
      },

      addEventListenerSafe: (element, event, handler) => {
        if (element && typeof element.addEventListener === 'function') {
          element.addEventListener(event, handler);
          return true;
        }
        return false;
      },

      removeAllChildren: (element) => {
        if (element) {
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        }
      }
    };

    beforeEach(() => {
      document.body.innerHTML = `
        <div id="test-container">
          <p class="test-paragraph">Test content</p>
          <button class="test-button">Click me</button>
        </div>
      `;
    });

    test('should create elements with attributes', () => {
      const button = domUtils.createElement('button', {
        id: 'test-btn',
        className: 'btn btn-primary',
        type: 'button'
      }, 'Click me');

      expect(button.tagName).toBe('BUTTON');
      expect(button.id).toBe('test-btn');
      expect(button.className).toBe('btn btn-primary');
      expect(button.type).toBe('button');
      expect(button.textContent).toBe('Click me');
    });

    test('should find single element', () => {
      const container = domUtils.findElement('#test-container');
      const paragraph = domUtils.findElement('.test-paragraph');

      expect(container).toBeTruthy();
      expect(container.id).toBe('test-container');
      expect(paragraph).toBeTruthy();
      expect(paragraph.textContent).toBe('Test content');
    });

    test('should find multiple elements', () => {
      const allElements = domUtils.findElements('*', document.getElementById('test-container'));
      
      expect(Array.isArray(allElements)).toBe(true);
      expect(allElements.length).toBeGreaterThan(0);
    });

    test('should safely add event listeners', () => {
      const button = document.querySelector('.test-button');
      const handler = jest.fn();

      const result = domUtils.addEventListenerSafe(button, 'click', handler);
      expect(result).toBe(true);

      // Test with null element
      const nullResult = domUtils.addEventListenerSafe(null, 'click', handler);
      expect(nullResult).toBe(false);
    });

    test('should remove all children', () => {
      const container = document.getElementById('test-container');
      expect(container.children.length).toBeGreaterThan(0);

      domUtils.removeAllChildren(container);
      expect(container.children.length).toBe(0);
    });
  });

  describe('Array and Object Utilities', () => {
    const arrayUtils = {
      shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      },

      groupBy: (array, keyFn) => {
        return array.reduce((groups, item) => {
          const key = keyFn(item);
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(item);
          return groups;
        }, {});
      },

      deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') {
          return obj;
        }
        
        if (obj instanceof Date) {
          return new Date(obj.getTime());
        }
        
        if (Array.isArray(obj)) {
          return obj.map(item => arrayUtils.deepClone(item));
        }
        
        const cloned = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            cloned[key] = arrayUtils.deepClone(obj[key]);
          }
        }
        return cloned;
      },

      isEqual: (a, b) => {
        if (a === b) return true;
        
        if (a == null || b == null) return false;
        
        if (typeof a !== typeof b) return false;
        
        if (typeof a !== 'object') return false;
        
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        
        if (keysA.length !== keysB.length) return false;
        
        for (const key of keysA) {
          if (!keysB.includes(key)) return false;
          if (!arrayUtils.isEqual(a[key], b[key])) return false;
        }
        
        return true;
      }
    };

    test('should shuffle array without modifying original', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = arrayUtils.shuffleArray(original);

      expect(original).toEqual([1, 2, 3, 4, 5]); // Original unchanged
      expect(shuffled.length).toBe(original.length);
      expect(shuffled.sort()).toEqual(original.sort()); // Same elements
    });

    test('should group array by key function', () => {
      const data = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];

      const grouped = arrayUtils.groupBy(data, item => item.category);

      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
      expect(grouped.A[0].value).toBe(1);
      expect(grouped.A[1].value).toBe(3);
    });

    test('should deep clone objects', () => {
      const original = {
        name: 'test',
        nested: {
          array: [1, 2, { deep: 'value' }],
          date: new Date('2023-01-01')
        }
      };

      const cloned = arrayUtils.deepClone(original);

      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.nested.array).not.toBe(original.nested.array);
      expect(cloned.nested.date).not.toBe(original.nested.date);
      
      // But values should be equal
      expect(cloned.name).toBe(original.name);
      expect(cloned.nested.date.getTime()).toBe(original.nested.date.getTime());
    });

    test('should compare objects for deep equality', () => {
      const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
      const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
      const obj3 = { a: 1, b: { c: 2, d: [3, 5] } };

      expect(arrayUtils.isEqual(obj1, obj2)).toBe(true);
      expect(arrayUtils.isEqual(obj1, obj3)).toBe(false);
      expect(arrayUtils.isEqual(null, null)).toBe(true);
      expect(arrayUtils.isEqual(undefined, undefined)).toBe(true);
      expect(arrayUtils.isEqual(null, undefined)).toBe(false);
    });
  });

  describe('Error Handling Utilities', () => {
    const errorUtils = {
      createError: (message, code, details = {}) => {
        const error = new Error(message);
        error.code = code;
        error.details = details;
        return error;
      },

      handleAsyncError: async (asyncFn, defaultValue = null) => {
        try {
          return await asyncFn();
        } catch (error) {
          console.error('Async operation failed:', error);
          return defaultValue;
        }
      },

      retry: async (asyncFn, maxAttempts = 3, delay = 1000) => {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            return await asyncFn();
          } catch (error) {
            lastError = error;
            if (attempt < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
        
        throw lastError;
      }
    };

    test('should create custom errors', () => {
      const error = errorUtils.createError('Test error', 'TEST_ERROR', { field: 'test' });

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details.field).toBe('test');
    });

    test('should handle async errors gracefully', async () => {
      const failingFn = async () => {
        throw new Error('Async error');
      };

      const result = await errorUtils.handleAsyncError(failingFn, 'default');
      expect(result).toBe('default');
    });

    test('should retry failed operations', async () => {
      let attempts = 0;
      const eventuallySucceeds = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Still failing');
        }
        return 'success';
      };

      const result = await errorUtils.retry(eventuallySucceeds, 3, 10);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });
  });
});
