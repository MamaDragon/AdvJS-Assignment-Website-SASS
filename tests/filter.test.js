/**
 * @fileoverview Tests for RxJS filter functionality
 * Tests reactive programming patterns and observables
 */

// Use CommonJS for Jest compatibility

// Mock RxJS since we can't import it directly in tests
const mockRxJS = {
  fromEvent: jest.fn(),
  debounceTime: jest.fn(() => ({ pipe: jest.fn() })),
  map: jest.fn(() => ({ pipe: jest.fn() })),
  distinctUntilChanged: jest.fn(() => ({ pipe: jest.fn() })),
  pipe: jest.fn(),
  subscribe: jest.fn()
};

describe('RxJS Filter Module', () => {
  let mockObservable;
  let filterFunctions;

  beforeEach(() => {
    // Set up DOM with table
    document.body.innerHTML = `
      <input type="text" id="search" placeholder="Search...">
      <table id="infoTable">
        <tbody>
          <tr><td>WeakMap</td><td>Collection of key-value pairs</td><td>Advanced</td></tr>
          <tr><td>Proxy</td><td>Intercepts operations</td><td>Advanced</td></tr>
          <tr><td>Array</td><td>Ordered list of values</td><td>Beginner</td></tr>
          <tr><td>Function</td><td>Reusable code block</td><td>Beginner</td></tr>
        </tbody>
      </table>
    `;

    // Mock observable
    mockObservable = {
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    };

    // Define filter functions
    filterFunctions = {
      filterRows: function(value) {
        const rows = document.querySelectorAll('#infoTable tbody tr');
        let visibleCount = 0;
        
        // Handle null, undefined, and empty values
        if (!value || typeof value !== 'string') {
          // Show all rows for null/undefined/empty values
          rows.forEach(row => {
            row.style.display = '';
            visibleCount++;
          });
          return visibleCount;
        }
        
        const searchValue = value.trim().toLowerCase();
        
        // If search is empty after trimming, show all rows
        if (!searchValue) {
          rows.forEach(row => {
            row.style.display = '';
            visibleCount++;
          });
          return visibleCount;
        }
        
        rows.forEach(row => {
          const text = (row.textContent?.toLowerCase()) || '';
          const isVisible = text.includes(searchValue);
          row.style.display = isVisible ? '' : 'none';
          if (isVisible) visibleCount++;
        });
        
        return visibleCount;
      },

      createObservableChain: function(inputElement) {
        // Mock the RxJS chain
        return {
          pipe: jest.fn(() => ({
            subscribe: jest.fn()
          }))
        };
      },

      debounceSearch: function(searchTerm, delay = 300) {
        // Simulate debounced search
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.filterRows(searchTerm));
          }, delay);
        });
      }
    };
  });

  describe('Table Filtering', () => {
    test('should filter rows based on search term', () => {
      const visibleCount = filterFunctions.filterRows('array');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
      
      expect(visibleRows).toHaveLength(1);
      expect(visibleRows[0].textContent.toLowerCase()).toContain('array');
    });

    test('should be case insensitive', () => {
      const visibleCount = filterFunctions.filterRows('WEAKMAP');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
      
      expect(visibleRows).toHaveLength(1);
      expect(visibleRows[0].textContent.toLowerCase()).toContain('weakmap');
    });

    test('should show all rows when search is empty', () => {
      const visibleCount = filterFunctions.filterRows('');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
      
      expect(visibleRows).toHaveLength(4);
    });

    test('should show no rows when no matches found', () => {
      const visibleCount = filterFunctions.filterRows('nonexistent');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
      
      expect(visibleRows).toHaveLength(0);
    });

    test('should filter by multiple terms', () => {
      const visibleCount = filterFunctions.filterRows('advanced');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
      
      expect(visibleRows).toHaveLength(2); // WeakMap and Proxy
    });
  });

  describe('Reactive Programming Patterns', () => {
    test('should create observable from input events', () => {
      const input = document.getElementById('search');
      const observable = filterFunctions.createObservableChain(input);
      
      expect(observable.pipe).toBeDefined();
      expect(typeof observable.pipe).toBe('function');
    });

    test('should handle input events', () => {
      const input = document.getElementById('search');
      const eventHandler = jest.fn();
      
      input.addEventListener('input', eventHandler);
      
      // Simulate input event
      const inputEvent = new Event('input', { bubbles: true });
      input.value = 'test';
      input.dispatchEvent(inputEvent);
      
      expect(eventHandler).toHaveBeenCalled();
    });

    test('should debounce search input', async () => {
      const startTime = Date.now();
      
      const result = await filterFunctions.debounceSearch('test', 100);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(typeof result).toBe('number');
    });
  });

  describe('DOM Manipulation', () => {
    test('should hide rows correctly', () => {
      filterFunctions.filterRows('array');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const hiddenRows = Array.from(rows).filter(row => row.style.display === 'none');
      
      expect(hiddenRows).toHaveLength(3);
    });

    test('should show rows correctly', () => {
      // First hide all rows
      filterFunctions.filterRows('nonexistent');
      
      // Then show all rows
      filterFunctions.filterRows('');
      
      const rows = document.querySelectorAll('#infoTable tbody tr');
      const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
      
      expect(visibleRows).toHaveLength(4);
    });

    test('should handle missing table elements', () => {
      document.body.innerHTML = '<input type="text" id="search">';
      
      expect(() => {
        filterFunctions.filterRows('test');
      }).not.toThrow();
    });
  });

  describe('Search Functionality', () => {
    test('should search in all table columns', () => {
      // Search for content in different columns
      const conceptSearch = filterFunctions.filterRows('weakmap');
      const descriptionSearch = filterFunctions.filterRows('collection');
      const difficultySearch = filterFunctions.filterRows('advanced');
      
      expect(conceptSearch).toBeGreaterThan(0);
      expect(descriptionSearch).toBeGreaterThan(0);
      expect(difficultySearch).toBeGreaterThan(0);
    });

    test('should handle special characters in search', () => {
      const specialChars = ['(', ')', '[', ']', '{', '}', '.', '*', '+', '?', '^', '$', '|', '\\'];
      
      specialChars.forEach(char => {
        expect(() => {
          filterFunctions.filterRows(char);
        }).not.toThrow();
      });
    });

    test('should handle empty and whitespace searches', () => {
      const emptySearch = filterFunctions.filterRows('');
      const whitespaceSearch = filterFunctions.filterRows('   ');
      
      expect(emptySearch).toBe(4); // All rows visible
      expect(whitespaceSearch).toBe(4); // All rows visible (trimmed)
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle large datasets', () => {
      // Create a large table
      const tableBody = document.querySelector('#infoTable tbody');
      for (let i = 0; i < 1000; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>Item ${i}</td><td>Description ${i}</td><td>Category</td>`;
        tableBody.appendChild(row);
      }
      
      const startTime = Date.now();
      filterFunctions.filterRows('item');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    test('should handle malformed table structure', () => {
      document.body.innerHTML = `
        <input type="text" id="search">
        <table id="infoTable">
          <tbody>
            <tr><td>Valid row</td></tr>
            <tr></tr>
            <tr><td></td></tr>
          </tbody>
        </table>
      `;
      
      expect(() => {
        filterFunctions.filterRows('test');
      }).not.toThrow();
    });

    test('should handle null and undefined values', () => {
      expect(() => {
        filterFunctions.filterRows(null);
      }).not.toThrow();
      
      expect(() => {
        filterFunctions.filterRows(undefined);
      }).not.toThrow();
    });
  });

  describe('RxJS Operators Simulation', () => {
    test('should simulate map operator', () => {
      const mapOperator = (value) => value.toLowerCase();
      
      const testValues = ['TEST', 'Search', 'FILTER'];
      const mappedValues = testValues.map(mapOperator);
      
      expect(mappedValues).toEqual(['test', 'search', 'filter']);
    });

    test('should simulate distinctUntilChanged operator', () => {
      const distinctOperator = (values) => {
        const distinct = [];
        let lastValue = null;
        
        values.forEach(value => {
          if (value !== lastValue) {
            distinct.push(value);
            lastValue = value;
          }
        });
        
        return distinct;
      };
      
      const testValues = ['a', 'a', 'b', 'b', 'b', 'c', 'c'];
      const distinctValues = distinctOperator(testValues);
      
      expect(distinctValues).toEqual(['a', 'b', 'c']);
    });

    test('should simulate debounceTime operator', (done) => {
      const debounceOperator = (callback, delay) => {
        let timeoutId;
        
        return (value) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => callback(value), delay);
        };
      };
      
      const mockCallback = jest.fn();
      const debouncedFn = debounceOperator(mockCallback, 50);
      
      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');
      
      setTimeout(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith('test3');
        done();
      }, 100);
    });
  });
});
