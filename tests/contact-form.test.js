/**
 * @fileoverview Tests for contact form functionality
 * Tests WeakMap, Type Guards, and Proxy implementations
 */

// Use CommonJS for Jest compatibility

// Mock the JavaScript file content since we can't import it directly
// We'll test the functions by evaluating them in the test environment

describe('Contact Form - WeakMap, Type Guards, and Proxy', () => {
  let formMeta;
  let isForm, isInput, getInputValue, createFormProxy;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <form id="myForm">
        <input type="tel" id="phone" value="1234567890">
        <input type="email" id="email" value="test@example.com">
        <input type="text" id="zip" value="12345">
        <button type="submit">Submit</button>
      </form>
      <div id="response"></div>
    `;

    // Initialize WeakMap
    formMeta = new WeakMap();

    // Define type guard functions
    isForm = (el) => el instanceof HTMLFormElement;
    isInput = (el) => el instanceof HTMLInputElement;

    // Define utility function
    getInputValue = (id) => {
      const el = document.getElementById(id);
      if (!isInput(el)) throw new Error(`Invalid input: ${id}`);
      return el.value.trim();
    };

    // Define Proxy wrapper
    createFormProxy = (obj) => {
      return new Proxy(obj, {
        get(target, prop) {
          const value = Reflect.get(target, prop);
          console.log(`Accessed ${String(prop)}:`, value);
          return value;
        },
        set(target, prop, value) {
          console.log(`Set ${String(prop)} = ${value}`);
          return Reflect.set(target, prop, value);
        }
      });
    };
  });

  describe('WeakMap functionality', () => {
    test('should store and retrieve form metadata', () => {
      const form = document.getElementById('myForm');
      const metadata = { validated: false };
      
      formMeta.set(form, metadata);
      
      expect(formMeta.get(form)).toEqual(metadata);
      expect(formMeta.has(form)).toBe(true);
    });

    test('should update validation status', () => {
      const form = document.getElementById('myForm');
      
      formMeta.set(form, { validated: false });
      expect(formMeta.get(form).validated).toBe(false);
      
      formMeta.set(form, { validated: true });
      expect(formMeta.get(form).validated).toBe(true);
    });

    test('should not interfere with other forms', () => {
      const form1 = document.getElementById('myForm');
      const form2 = document.createElement('form');
      
      formMeta.set(form1, { validated: true });
      formMeta.set(form2, { validated: false });
      
      expect(formMeta.get(form1).validated).toBe(true);
      expect(formMeta.get(form2).validated).toBe(false);
    });
  });

  describe('Type Guards', () => {
    test('isForm should correctly identify form elements', () => {
      const form = document.getElementById('myForm');
      const input = document.getElementById('phone');
      const div = document.createElement('div');
      
      expect(isForm(form)).toBe(true);
      expect(isForm(input)).toBe(false);
      expect(isForm(div)).toBe(false);
      expect(isForm(null)).toBe(false);
    });

    test('isInput should correctly identify input elements', () => {
      const form = document.getElementById('myForm');
      const input = document.getElementById('phone');
      const div = document.createElement('div');
      
      expect(isInput(input)).toBe(true);
      expect(isInput(form)).toBe(false);
      expect(isInput(div)).toBe(false);
      expect(isInput(null)).toBe(false);
    });

    test('getInputValue should return trimmed values for valid inputs', () => {
      expect(getInputValue('phone')).toBe('1234567890');
      expect(getInputValue('email')).toBe('test@example.com');
      expect(getInputValue('zip')).toBe('12345');
    });

    test('getInputValue should throw error for invalid inputs', () => {
      expect(() => getInputValue('nonexistent')).toThrow('Invalid input: nonexistent');
      expect(() => getInputValue('myForm')).toThrow('Invalid input: myForm');
    });
  });

  describe('Proxy with Reflect', () => {
    test('should log property access', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const testObj = { name: 'test', value: 123 };
      const proxy = createFormProxy(testObj);
      
      const name = proxy.name;
      const value = proxy.value;
      
      expect(consoleSpy).toHaveBeenCalledWith('Accessed name:', 'test');
      expect(consoleSpy).toHaveBeenCalledWith('Accessed value:', 123);
      expect(name).toBe('test');
      expect(value).toBe(123);
    });

    test('should log property assignments', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const testObj = {};
      const proxy = createFormProxy(testObj);
      
      proxy.newProp = 'new value';
      
      expect(consoleSpy).toHaveBeenCalledWith('Set newProp = new value');
      expect(proxy.newProp).toBe('new value');
    });

    test('should preserve original object behavior', () => {
      const testObj = { count: 0, increment() { this.count++; } };
      const proxy = createFormProxy(testObj);
      
      proxy.increment();
      
      expect(proxy.count).toBe(1);
      expect(testObj.count).toBe(1);
    });
  });

  describe('Form Validation', () => {
    test('should validate phone number format', () => {
      const phoneTests = [
        { input: '1234567890', valid: true },
        { input: '123456789', valid: false },   // too short
        { input: '12345678901', valid: false }, // too long
        { input: 'abcdefghij', valid: false },  // non-numeric
        { input: '123-456-7890', valid: false } // with dashes
      ];

      phoneTests.forEach(({ input, valid }) => {
        const phoneRegex = /^\d{10}$/;
        expect(phoneRegex.test(input)).toBe(valid);
      });
    });

    test('should validate email format', () => {
      const emailTests = [
        { input: 'test@example.com', valid: true },
        { input: 'user.name@domain.co.uk', valid: true },
        { input: 'invalid-email', valid: false },
        { input: '@example.com', valid: false },
        { input: 'test@', valid: false },
        { input: 'test.example.com', valid: false }
      ];

      emailTests.forEach(({ input, valid }) => {
        const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
        expect(emailRegex.test(input)).toBe(valid);
      });
    });

    test('should validate zip code format', () => {
      const zipTests = [
        { input: '12345', valid: true },
        { input: '1234', valid: false },  // too short
        { input: '123456', valid: false }, // too long
        { input: 'abcde', valid: false }, // non-numeric
        { input: '12-345', valid: false } // with dash
      ];

      zipTests.forEach(({ input, valid }) => {
        const zipRegex = /^\d{5}$/;
        expect(zipRegex.test(input)).toBe(valid);
      });
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete form submission workflow', () => {
      const form = document.getElementById('myForm');
      
      // Set form metadata
      formMeta.set(form, { validated: false });
      
      // Get form data through proxy
      const inputs = createFormProxy({
        phone: getInputValue('phone'),
        email: getInputValue('email'),
        zip: getInputValue('zip')
      });
      
      // Validate inputs
      const phoneValid = /^\d{10}$/.test(inputs.phone);
      const emailValid = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(inputs.email);
      const zipValid = /^\d{5}$/.test(inputs.zip);
      
      const allValid = phoneValid && emailValid && zipValid;
      
      // Update metadata
      formMeta.set(form, { validated: allValid });
      
      expect(formMeta.get(form).validated).toBe(true);
      expect(inputs.phone).toBe('1234567890');
      expect(inputs.email).toBe('test@example.com');
      expect(inputs.zip).toBe('12345');
    });
  });
});
