# Advanced JavaScript Assignment Website

A comprehensive web application demonstrating advanced JavaScript features, testing methodologies, and modern web development practices.

## 🚀 Features

### Core Modules

1. **📧 Contact Form** (`contact-assignment-complete.html`)
   - Advanced form validation with modern JavaScript features
   - WeakMap for private metadata management
   - Type Guards for data safety
   - Proxy with Reflect for operation logging
   - LocalStorage integration with JSON download capability

2. **🎯 Interactive Quiz** (`quiz.html`)
   - Dynamic quiz system with JSON data integration
   - Real-time scoring and feedback
   - Modern DOM manipulation techniques
   - Responsive design for all devices

3. **⚙️ Admin Panel** (`admin.html`)
   - Quiz administration with full CRUD operations
   - Dynamic form generation
   - Real-time data binding
   - Question management with live preview

4. **🔍 RxJS Filter Demo** (`filter.html`)
   - Reactive programming with RxJS operators
   - Real-time table filtering with debouncing
   - Observable streams and functional programming
   - Advanced search capabilities

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.1.3
- **Reactive Programming**: RxJS 7.x
- **Testing**: Jest (Unit/Integration), Playwright (E2E)
- **Documentation**: JSDoc
- **Build Tools**: npm scripts

## 📋 JavaScript Features Demonstrated

- **WeakMap**: Private metadata storage
- **Type Guards**: Runtime type checking
- **Proxy & Reflect**: Operation interception and logging
- **Set**: Unique value collections
- **Symbol**: Unique identifiers
- **Generators**: Function state management
- **Iterators**: Custom iteration patterns
- **RxJS Observables**: Reactive data streams
- **Modern DOM APIs**: Dynamic content manipulation
- **LocalStorage**: Client-side persistence
- **JSON**: Data serialization and exchange

## 🧪 Testing Infrastructure

### Unit & Integration Tests (Jest)
```bash
npm test                    # Run all Jest tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

**Status**: ✅ 105/105 tests passing

### End-to-End Tests (Playwright)
```bash
npm run test:e2e           # Run all E2E tests
npm run test:e2e:headed    # Run with browser UI
npm run test:e2e:debug     # Run in debug mode
```

**Coverage**: 41 comprehensive E2E tests across all modules

### Documentation (JSDoc)
```bash
npm run docs               # Generate API documentation
```

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MamaDragon/AdvJS-Assignment-Website.git
   cd AdvJS-Assignment-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (for E2E testing)
   ```bash
   npx playwright install
   ```

4. **Start development server**
   ```bash
   npm run serve
   # or
   python3 -m http.server 3000
   ```

5. **Run tests**
   ```bash
   npm test              # Unit tests
   npm run test:e2e      # E2E tests (requires server running)
   npm run docs          # Generate documentation
   ```

## 🌐 Live Demo

Open `index.html` in your browser or serve the files using any HTTP server:

- **Home Page**: `index.html`
- **Contact Form**: `contact-assignment-complete.html`
- **Quiz**: `quiz.html`
- **Admin Panel**: `admin.html`
- **Filter Demo**: `filter.html`

## 📁 Project Structure

```
AdvJS-Assignment-Website/
├── index.html                          # Home page with navigation
├── contact-assignment-complete.html    # Contact form module
├── contact-assignment-complete.js      # Contact form logic
├── quiz.html                          # Interactive quiz module
├── quizquestions.js                   # Quiz logic and questions
├── admin.html                         # Admin panel module
├── admin.js                           # Admin panel functionality
├── filter.html                        # RxJS filter demo
├── filter.js                          # Filter logic
├── quiz-data.json                     # Shared quiz data
├── contacts.json                      # Contact form submissions
├── favicon.ico                        # Site favicon
├── package.json                       # Dependencies and scripts
├── jest.config.json                   # Jest test configuration
├── playwright.config.js               # Playwright E2E configuration
├── jsdoc.json                         # JSDoc documentation config
├── __tests__/                         # Jest test files
├── e2e-tests/                         # Playwright E2E test files
├── TESTING_SUMMARY.md                 # Detailed testing report
└── README.md                          # This file
```

## 🧩 Module Integration

### Data Sharing
- Quiz questions managed via `quiz-data.json`
- Admin panel updates propagate to quiz module
- Contact submissions stored in `contacts.json`
- LocalStorage for client-side persistence

### Navigation
- Consistent "Back to Home" buttons across all modules
- Bootstrap-styled navigation cards on home page
- Responsive design for mobile and desktop

## 📚 Documentation

### API Documentation
Generated with JSDoc, includes:
- Function signatures and parameters
- Class definitions and methods
- Module dependencies and relationships
- Code examples and usage patterns

### Testing Documentation
- Comprehensive test coverage report
- E2E test scenarios and user flows
- Performance and accessibility testing results

## 🔧 Development Scripts

```json
{
  "serve": "python3 -m http.server 3000",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug",
  "docs": "jsdoc -c jsdoc.json"
}
```

## 🌟 Key Achievements

- ✅ **100% Jest test coverage** (105/105 tests passing)
- ✅ **Comprehensive E2E testing** (41 test scenarios)
- ✅ **Modern JavaScript features** demonstrated
- ✅ **Responsive design** across all modules
- ✅ **Professional documentation** with JSDoc
- ✅ **Data persistence** and module integration
- ✅ **Cross-browser compatibility**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes and demonstrates advanced JavaScript concepts and testing methodologies.

## 👩‍💻 Author

**MamaDragon** - [GitHub Profile](https://github.com/MamaDragon)

---

*This project showcases enterprise-level JavaScript development practices, comprehensive testing strategies, and modern web application architecture.*
