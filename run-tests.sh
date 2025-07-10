#!/bin/bash

# Test Runner Script for Advanced JavaScript Assignment Website
# This script runs different types of tests and generates reports

echo "🧪 Advanced JavaScript Assignment - Test Suite"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_status $RED "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status $YELLOW "📦 Installing test dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_status $RED "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Function to run specific test suite
run_test_suite() {
    local test_name=$1
    local test_file=$2
    
    print_status $BLUE "🧪 Running $test_name tests..."
    npx jest "$test_file" --verbose
    
    if [ $? -eq 0 ]; then
        print_status $GREEN "✅ $test_name tests passed"
    else
        print_status $RED "❌ $test_name tests failed"
        return 1
    fi
    echo ""
}

# Default to run all tests
TEST_TYPE=${1:-"all"}

case $TEST_TYPE in
    "contact" | "form")
        run_test_suite "Contact Form" "tests/contact-form.test.js"
        ;;
    "admin")
        run_test_suite "Admin Panel" "tests/admin.test.js"
        ;;
    "quiz")
        run_test_suite "Quiz System" "tests/quiz.test.js"
        ;;
    "filter")
        run_test_suite "RxJS Filter" "tests/filter.test.js"
        ;;
    "utils")
        run_test_suite "Utilities" "tests/utils.test.js"
        ;;
    "integration")
        run_test_suite "Integration" "tests/integration.test.js"
        ;;
    "coverage")
        print_status $BLUE "📊 Running tests with coverage report..."
        npm run test:coverage
        ;;
    "watch")
        print_status $BLUE "👀 Running tests in watch mode..."
        npm run test:watch
        ;;
    "all")
        print_status $BLUE "🚀 Running all test suites..."
        echo ""
        
        # Run all test suites
        FAILED=0
        
        run_test_suite "Contact Form" "tests/contact-form.test.js" || FAILED=1
        run_test_suite "Admin Panel" "tests/admin.test.js" || FAILED=1
        run_test_suite "Quiz System" "tests/quiz.test.js" || FAILED=1
        run_test_suite "RxJS Filter" "tests/filter.test.js" || FAILED=1
        run_test_suite "Utilities" "tests/utils.test.js" || FAILED=1
        run_test_suite "Integration" "tests/integration.test.js" || FAILED=1
        
        echo "=============================================="
        if [ $FAILED -eq 0 ]; then
            print_status $GREEN "🎉 All tests passed successfully!"
        else
            print_status $RED "💥 Some tests failed. Check the output above."
            exit 1
        fi
        ;;
    "help" | "-h" | "--help")
        echo "Usage: $0 [test-type]"
        echo ""
        echo "Available test types:"
        echo "  all          - Run all test suites (default)"
        echo "  contact      - Run contact form tests"
        echo "  admin        - Run admin panel tests"
        echo "  quiz         - Run quiz system tests"
        echo "  filter       - Run RxJS filter tests"
        echo "  utils        - Run utility function tests"
        echo "  integration  - Run integration tests"
        echo "  coverage     - Run tests with coverage report"
        echo "  watch        - Run tests in watch mode"
        echo "  help         - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                 # Run all tests"
        echo "  $0 contact         # Run only contact form tests"
        echo "  $0 coverage        # Run tests with coverage report"
        echo "  $0 watch           # Run tests in watch mode"
        ;;
    *)
        print_status $RED "❌ Unknown test type: $TEST_TYPE"
        print_status $YELLOW "Run '$0 help' to see available options"
        exit 1
        ;;
esac

echo ""
print_status $BLUE "🔗 Useful commands:"
print_status $NC "  npm test              - Run all tests"
print_status $NC "  npm run test:coverage - Generate coverage report"
print_status $NC "  npm run test:watch    - Watch mode for development"
print_status $NC "  npm run test:verbose  - Verbose test output"
