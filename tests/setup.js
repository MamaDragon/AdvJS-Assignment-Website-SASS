/**
 * Jest setup file for DOM testing
 * This file runs before each test to set up the testing environment
 */

// Mock global objects and functions that might not be available in test environment
global.fetch = jest.fn();

// Create localStorage mock with proper jest mock functions
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

global.localStorage = localStorageMock;
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock console methods to avoid noise in tests (can be overridden in individual tests)
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Set up DOM globals
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});

// Mock matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  
  // Reset fetch mock
  if (global.fetch && typeof global.fetch.mockReset === 'function') {
    global.fetch.mockReset();
  }
  
  // Reset localStorage mock functions
  if (global.localStorage) {
    if (typeof global.localStorage.getItem?.mockReset === 'function') {
      global.localStorage.getItem.mockReset();
    }
    if (typeof global.localStorage.setItem?.mockReset === 'function') {
      global.localStorage.setItem.mockReset();
    }
    if (typeof global.localStorage.removeItem?.mockReset === 'function') {
      global.localStorage.removeItem.mockReset();
    }
    if (typeof global.localStorage.clear?.mockReset === 'function') {
      global.localStorage.clear.mockReset();
    }
  }
});
