/**
 * @fileoverview Tests for quiz functionality
 * Tests dynamic question rendering, scoring, and user interactions
 */

// Use CommonJS for Jest compatibility

describe('Quiz Module', () => {
  let mockQuizData;
  let quizFunctions;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="quiz"></div>
      <button id="submit-quiz" style="display: none;">Submit Quiz</button>
      <div id="quiz-results"></div>
    `;

    // Mock quiz data
    mockQuizData = [
      {
        id: 1,
        question: "What is a WeakMap in JavaScript?",
        choices: ["Array type", "Object collection", "String method", "Loop construct"],
        correctAnswer: "Object collection"
      },
      {
        id: 2,
        question: "What does a Proxy do?",
        choices: ["Creates copy", "Intercepts operations", "Deletes objects", "Validates data"],
        correctAnswer: "Intercepts operations"
      },
      {
        id: 3,
        question: "What is the purpose of Reflect?",
        choices: ["Mirror objects", "Interceptable operations", "Reverse strings", "Copy data"],
        correctAnswer: "Interceptable operations"
      }
    ];

    // Mock fetch for loading quiz data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockQuizData)
      })
    );

    // Quiz functions
    quizFunctions = {
      renderQuiz: function(data) {
        const container = document.getElementById('quiz');
        container.innerHTML = '';
        
        data.forEach((q, index) => {
          const questionDiv = document.createElement('div');
          questionDiv.classList.add('question-card');
          
          const questionTitle = document.createElement('h5');
          questionTitle.textContent = `${index + 1}. ${q.question}`;
          questionDiv.appendChild(questionTitle);
          
          q.choices.forEach((choice, choiceIndex) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('form-check');
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${index}`;
            input.value = choice;
            input.classList.add('form-check-input');
            input.id = `q${index}-${choiceIndex}`;
            
            const label = document.createElement('label');
            label.classList.add('form-check-label');
            label.setAttribute('for', input.id);
            label.textContent = choice;
            
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            questionDiv.appendChild(wrapper);
          });
          
          container.appendChild(questionDiv);
        });
        
        // Show submit button
        document.getElementById('submit-quiz').style.display = 'block';
      },

      calculateScore: function(data, userAnswers) {
        let score = 0;
        const results = [];
        
        userAnswers.forEach((answer, index) => {
          const correct = data[index].correctAnswer;
          const isCorrect = answer === correct;
          if (isCorrect) score++;
          
          results.push({
            question: index + 1,
            questionText: data[index].question,
            selected: answer,
            correct: correct,
            isCorrect: isCorrect
          });
        });
        
        return {
          score,
          total: data.length,
          percentage: Math.round((score / data.length) * 100),
          results
        };
      },

      collectAnswers: function() {
        const questions = document.querySelectorAll('.question-card');
        const answers = [];
        
        questions.forEach((question, index) => {
          const selectedOption = question.querySelector('input[type="radio"]:checked');
          if (selectedOption) {
            answers.push(selectedOption.value);
          } else {
            answers.push(null); // No answer selected
          }
        });
        
        return answers;
      },

      loadQuizData: async function() {
        try {
          const response = await fetch('./quiz-data.json');
          return await response.json();
        } catch (error) {
          throw new Error(`Failed to load quiz data: ${error.message}`);
        }
      },

      displayResults: function(scoreData) {
        const resultsDiv = document.getElementById('quiz-results');
        const { score, total, percentage, results } = scoreData;
        
        let scoreClass = 'success';
        if (percentage < 60) scoreClass = 'danger';
        else if (percentage < 80) scoreClass = 'warning';
        
        const resultsHTML = `
          <div class="alert alert-${scoreClass}">
            <h4>Quiz Completed! 🎉</h4>
            <p><strong>Score: ${score}/${total} (${percentage}%)</strong></p>
            <div class="results-details">
              ${results.map((result, i) => `
                <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                  <strong>Q${result.question}:</strong> ${result.questionText}<br>
                  <span>Your answer: ${result.selected || 'No answer'}</span><br>
                  ${!result.isCorrect ? `<span>Correct answer: ${result.correct}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
        resultsDiv.innerHTML = resultsHTML;
        return resultsHTML;
      }
    };
  });

  describe('Quiz Data Loading', () => {
    test('should load quiz data from API', async () => {
      const data = await quizFunctions.loadQuizData();
      
      expect(fetch).toHaveBeenCalledWith('./quiz-data.json');
      expect(data).toEqual(mockQuizData);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
    });

    test('should handle loading errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      await expect(quizFunctions.loadQuizData()).rejects.toThrow('Failed to load quiz data: Network error');
    });

    test('should handle invalid JSON response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.reject(new Error('Invalid JSON'))
        })
      );
      
      await expect(quizFunctions.loadQuizData()).rejects.toThrow('Failed to load quiz data: Invalid JSON');
    });
  });

  describe('Quiz Rendering', () => {
    test('should render all questions', () => {
      quizFunctions.renderQuiz(mockQuizData);
      
      const questions = document.querySelectorAll('.question-card');
      expect(questions).toHaveLength(3);
    });

    test('should render question text correctly', () => {
      quizFunctions.renderQuiz(mockQuizData);
      
      const firstQuestion = document.querySelector('.question-card h5');
      expect(firstQuestion.textContent).toBe('1. What is a WeakMap in JavaScript?');
    });

    test('should render all choices for each question', () => {
      quizFunctions.renderQuiz(mockQuizData);
      
      const firstQuestionChoices = document.querySelectorAll('.question-card:first-child .form-check');
      expect(firstQuestionChoices).toHaveLength(4);
    });

    test('should create radio inputs with correct attributes', () => {
      quizFunctions.renderQuiz(mockQuizData);
      
      const firstRadio = document.querySelector('input[type="radio"]');
      expect(firstRadio.name).toBe('question-0');
      expect(firstRadio.value).toBe('Array type');
      expect(firstRadio.id).toBe('q0-0');
    });

    test('should show submit button after rendering', () => {
      quizFunctions.renderQuiz(mockQuizData);
      
      const submitBtn = document.getElementById('submit-quiz');
      expect(submitBtn.style.display).toBe('block');
    });

    test('should handle empty quiz data', () => {
      quizFunctions.renderQuiz([]);
      
      const questions = document.querySelectorAll('.question-card');
      expect(questions).toHaveLength(0);
    });
  });

  describe('Answer Collection', () => {
    beforeEach(() => {
      quizFunctions.renderQuiz(mockQuizData);
    });

    test('should collect selected answers', () => {
      // Select answers for each question
      document.querySelector('input[name="question-0"][value="Object collection"]').checked = true;
      document.querySelector('input[name="question-1"][value="Intercepts operations"]').checked = true;
      document.querySelector('input[name="question-2"][value="Interceptable operations"]').checked = true;
      
      const answers = quizFunctions.collectAnswers();
      
      expect(answers).toEqual([
        'Object collection',
        'Intercepts operations',
        'Interceptable operations'
      ]);
    });

    test('should handle partially answered quiz', () => {
      // Only select first answer
      document.querySelector('input[name="question-0"][value="Object collection"]').checked = true;
      
      const answers = quizFunctions.collectAnswers();
      
      expect(answers).toEqual([
        'Object collection',
        null,
        null
      ]);
    });

    test('should handle no answers selected', () => {
      const answers = quizFunctions.collectAnswers();
      
      expect(answers).toEqual([null, null, null]);
    });
  });

  describe('Score Calculation', () => {
    test('should calculate perfect score', () => {
      const userAnswers = ['Object collection', 'Intercepts operations', 'Interceptable operations'];
      const scoreData = quizFunctions.calculateScore(mockQuizData, userAnswers);
      
      expect(scoreData.score).toBe(3);
      expect(scoreData.total).toBe(3);
      expect(scoreData.percentage).toBe(100);
      expect(scoreData.results.every(r => r.isCorrect)).toBe(true);
    });

    test('should calculate partial score', () => {
      const userAnswers = ['Object collection', 'Creates copy', 'Interceptable operations'];
      const scoreData = quizFunctions.calculateScore(mockQuizData, userAnswers);
      
      expect(scoreData.score).toBe(2);
      expect(scoreData.total).toBe(3);
      expect(scoreData.percentage).toBe(67);
    });

    test('should calculate zero score', () => {
      const userAnswers = ['Array type', 'Creates copy', 'Mirror objects'];
      const scoreData = quizFunctions.calculateScore(mockQuizData, userAnswers);
      
      expect(scoreData.score).toBe(0);
      expect(scoreData.total).toBe(3);
      expect(scoreData.percentage).toBe(0);
      expect(scoreData.results.every(r => !r.isCorrect)).toBe(true);
    });

    test('should handle missing answers', () => {
      const userAnswers = ['Object collection', null, 'Interceptable operations'];
      const scoreData = quizFunctions.calculateScore(mockQuizData, userAnswers);
      
      expect(scoreData.score).toBe(2);
      expect(scoreData.results[1].selected).toBe(null);
      expect(scoreData.results[1].isCorrect).toBe(false);
    });
  });

  describe('Results Display', () => {
    test('should display results with correct score class', () => {
      const perfectScore = {
        score: 3,
        total: 3,
        percentage: 100,
        results: []
      };
      
      const html = quizFunctions.displayResults(perfectScore);
      expect(html).toContain('alert-success');
      expect(html).toContain('Score: 3/3 (100%)');
    });

    test('should show warning for medium scores', () => {
      const mediumScore = {
        score: 2,
        total: 3,
        percentage: 67,
        results: []
      };
      
      const html = quizFunctions.displayResults(mediumScore);
      expect(html).toContain('alert-warning');
    });

    test('should show danger for low scores', () => {
      const lowScore = {
        score: 1,
        total: 3,
        percentage: 33,
        results: []
      };
      
      const html = quizFunctions.displayResults(lowScore);
      expect(html).toContain('alert-danger');
    });

    test('should display detailed results', () => {
      const scoreData = {
        score: 2,
        total: 3,
        percentage: 67,
        results: [
          {
            question: 1,
            questionText: 'Test question?',
            selected: 'Correct answer',
            correct: 'Correct answer',
            isCorrect: true
          },
          {
            question: 2,
            questionText: 'Another question?',
            selected: 'Wrong answer',
            correct: 'Right answer',
            isCorrect: false
          }
        ]
      };
      
      const html = quizFunctions.displayResults(scoreData);
      expect(html).toContain('Test question?');
      expect(html).toContain('Correct answer');
      expect(html).toContain('Wrong answer');
      expect(html).toContain('Right answer');
    });
  });

  describe('Integration Tests', () => {
    test('should complete full quiz workflow', async () => {
      // Load data
      const data = await quizFunctions.loadQuizData();
      
      // Render quiz
      quizFunctions.renderQuiz(data);
      
      // Select answers
      document.querySelector('input[name="question-0"][value="Object collection"]').checked = true;
      document.querySelector('input[name="question-1"][value="Intercepts operations"]').checked = true;
      
      // Collect answers
      const answers = quizFunctions.collectAnswers();
      
      // Calculate score
      const scoreData = quizFunctions.calculateScore(data, answers);
      
      // Display results
      const resultsHTML = quizFunctions.displayResults(scoreData);
      
      expect(scoreData.score).toBe(2);
      expect(resultsHTML).toContain('Score: 2/3');
    });

    test('should handle errors gracefully', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      try {
        await quizFunctions.loadQuizData();
      } catch (error) {
        expect(error.message).toContain('Failed to load quiz data');
      }
    });
  });
});
