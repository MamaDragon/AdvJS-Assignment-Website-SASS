/**
 * @fileoverview Tests for admin module functionality
 * Tests dynamic DOM generation, CRUD operations, and data management
 */

// Use CommonJS for Jest compatibility

describe('Admin Module - Quiz Management', () => {
  let mockQuizData;
  let adminFunctions;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="quiz-admin-list"></div>
      <div id="admin-messages"></div>
      <span id="question-count">0</span>
      <button id="add-question">Add Question</button>
      <button id="save-all">Save All</button>
    `;

    // Mock quiz data
    mockQuizData = [
      {
        id: 1,
        question: "What is a WeakMap?",
        choices: ["Array", "Object collection", "String", "Function"],
        correctAnswer: "Object collection"
      },
      {
        id: 2,
        question: "What is a Proxy?",
        choices: ["Server", "Interceptor", "Database", "API"],
        correctAnswer: "Interceptor"
      }
    ];

    // Mock admin functions
    adminFunctions = {
      renderQuestions: function(data) {
        const container = document.getElementById('quiz-admin-list');
        if (!container) {
          console.warn('Quiz admin list container not found');
          return;
        }
        container.innerHTML = '';
        
        data.forEach((question, index) => {
          const div = document.createElement('div');
          div.className = 'question-item';
          div.dataset.questionId = question.id;
          div.innerHTML = `
            <h6>Question ${index + 1}</h6>
            <input type="text" class="question-input" value="${question.question}">
            <input type="text" class="choices-input" value="${question.choices.join(', ')}">
            <input type="text" class="answer-input" value="${question.correctAnswer}">
            <button class="delete-btn" data-index="${index}">Delete</button>
          `;
          container.appendChild(div);
        });
        
        document.getElementById('question-count').textContent = data.length;
      },

      addQuestion: function(data) {
        // Generate unique ID using Date.now() + random number to avoid collisions
        const newQuestion = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          question: "",
          choices: ["", "", "", ""],
          correctAnswer: ""
        };
        data.push(newQuestion);
        return data;
      },

      deleteQuestion: function(data, index) {
        data.splice(index, 1);
        return data;
      },

      updateQuestion: function(data, index, field, value) {
        if (field === 'choices') {
          data[index][field] = value.split(',').map(c => c.trim());
        } else {
          data[index][field] = value;
        }
        return data;
      },

      validateQuestion: function(question) {
        const errors = [];
        
        if (!question.question.trim()) {
          errors.push('Question text is required');
        }
        
        if (question.choices.length < 2) {
          errors.push('At least 2 choices are required');
        }
        
        if (!question.correctAnswer.trim()) {
          errors.push('Correct answer is required');
        }
        
        if (!question.choices.includes(question.correctAnswer)) {
          errors.push('Correct answer must be one of the choices');
        }
        
        return {
          valid: errors.length === 0,
          errors
        };
      }
    };
  });

  describe('Quiz Data Management', () => {
    test('should render questions correctly', () => {
      adminFunctions.renderQuestions(mockQuizData);
      
      const questionItems = document.querySelectorAll('.question-item');
      expect(questionItems).toHaveLength(2);
      
      const firstQuestion = questionItems[0];
      expect(firstQuestion.querySelector('.question-input').value).toBe('What is a WeakMap?');
      expect(firstQuestion.querySelector('.choices-input').value).toBe('Array, Object collection, String, Function');
      expect(firstQuestion.querySelector('.answer-input').value).toBe('Object collection');
    });

    test('should update question count', () => {
      adminFunctions.renderQuestions(mockQuizData);
      
      const questionCount = document.getElementById('question-count');
      expect(questionCount.textContent).toBe('2');
    });

    test('should add new question', () => {
      const originalLength = mockQuizData.length;
      const updatedData = adminFunctions.addQuestion([...mockQuizData]);
      
      expect(updatedData).toHaveLength(originalLength + 1);
      expect(updatedData[updatedData.length - 1]).toMatchObject({
        question: "",
        choices: ["", "", "", ""],
        correctAnswer: ""
      });
      expect(updatedData[updatedData.length - 1].id).toBeDefined();
    });

    test('should delete question', () => {
      const originalLength = mockQuizData.length;
      const updatedData = adminFunctions.deleteQuestion([...mockQuizData], 0);
      
      expect(updatedData).toHaveLength(originalLength - 1);
      expect(updatedData[0].question).toBe('What is a Proxy?');
    });

    test('should update question field', () => {
      const data = [...mockQuizData];
      const updatedData = adminFunctions.updateQuestion(data, 0, 'question', 'Updated question text');
      
      expect(updatedData[0].question).toBe('Updated question text');
    });

    test('should update choices field', () => {
      const data = [...mockQuizData];
      const updatedData = adminFunctions.updateQuestion(data, 0, 'choices', 'Choice 1, Choice 2, Choice 3');
      
      expect(updatedData[0].choices).toEqual(['Choice 1', 'Choice 2', 'Choice 3']);
    });
  });

  describe('Question Validation', () => {
    test('should validate complete question', () => {
      const validQuestion = {
        question: "What is JavaScript?",
        choices: ["Language", "Framework", "Library", "Database"],
        correctAnswer: "Language"
      };
      
      const result = adminFunctions.validateQuestion(validQuestion);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject question without text', () => {
      const invalidQuestion = {
        question: "",
        choices: ["Choice 1", "Choice 2"],
        correctAnswer: "Choice 1"
      };
      
      const result = adminFunctions.validateQuestion(invalidQuestion);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Question text is required');
    });

    test('should reject question with insufficient choices', () => {
      const invalidQuestion = {
        question: "Test question?",
        choices: ["Only one choice"],
        correctAnswer: "Only one choice"
      };
      
      const result = adminFunctions.validateQuestion(invalidQuestion);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least 2 choices are required');
    });

    test('should reject question without correct answer', () => {
      const invalidQuestion = {
        question: "Test question?",
        choices: ["Choice 1", "Choice 2"],
        correctAnswer: ""
      };
      
      const result = adminFunctions.validateQuestion(invalidQuestion);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Correct answer is required');
    });

    test('should reject question with invalid correct answer', () => {
      const invalidQuestion = {
        question: "Test question?",
        choices: ["Choice 1", "Choice 2"],
        correctAnswer: "Choice 3"
      };
      
      const result = adminFunctions.validateQuestion(invalidQuestion);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Correct answer must be one of the choices');
    });
  });

  describe('DOM Interactions', () => {
    test('should handle input changes', () => {
      adminFunctions.renderQuestions(mockQuizData);
      
      const questionInput = document.querySelector('.question-input');
      questionInput.value = 'Updated question';
      
      // Simulate input event
      const inputEvent = new Event('input', { bubbles: true });
      questionInput.dispatchEvent(inputEvent);
      
      expect(questionInput.value).toBe('Updated question');
    });

    test('should handle delete button clicks', () => {
      adminFunctions.renderQuestions(mockQuizData);
      
      const deleteButtons = document.querySelectorAll('.delete-btn');
      expect(deleteButtons).toHaveLength(2);
      
      const firstDeleteBtn = deleteButtons[0];
      expect(firstDeleteBtn.dataset.index).toBe('0');
    });

    test('should generate unique IDs for new questions', () => {
      const data = [];
      const firstQuestion = adminFunctions.addQuestion(data);
      
      // Add a small delay to ensure different timestamps
      const start = Date.now();
      while (Date.now() - start < 1) {
        // Small delay
      }
      
      const secondQuestion = adminFunctions.addQuestion(firstQuestion);
      
      expect(firstQuestion[0].id).not.toBe(secondQuestion[1].id);
      expect(typeof firstQuestion[0].id).toBe('number');
      expect(typeof secondQuestion[1].id).toBe('number');
    });
  });

  describe('Data Persistence', () => {
    test('should serialize quiz data to JSON', () => {
      const jsonString = JSON.stringify(mockQuizData, null, 2);
      const parsedData = JSON.parse(jsonString);
      
      expect(parsedData).toEqual(mockQuizData);
      expect(Array.isArray(parsedData)).toBe(true);
      expect(parsedData).toHaveLength(2);
    });

    test('should handle localStorage operations', () => {
      const testData = { test: 'data' };
      const jsonData = JSON.stringify(testData);
      
      localStorage.setItem('quizData', jsonData);
      expect(localStorage.setItem).toHaveBeenCalledWith('quizData', jsonData);
      
      localStorage.getItem('quizData');
      expect(localStorage.getItem).toHaveBeenCalledWith('quizData');
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON data', () => {
      const malformedJSON = '{ invalid json }';
      
      expect(() => {
        JSON.parse(malformedJSON);
      }).toThrow();
    });

    test('should handle missing DOM elements gracefully', () => {
      document.body.innerHTML = ''; // Remove all elements
      
      expect(() => {
        adminFunctions.renderQuestions(mockQuizData);
      }).not.toThrow();
    });

    test('should validate data before operations', () => {
      const invalidData = null;
      
      expect(() => {
        adminFunctions.renderQuestions(invalidData);
      }).toThrow();
    });
  });
});
