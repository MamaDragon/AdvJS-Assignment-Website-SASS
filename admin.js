/**
 * @fileoverview Admin module for managing quiz questions
 * Provides functionality to view, edit, delete, and add quiz questions
 * @author Advanced JavaScript Assignment
 * @version 1.0.0
 */

/**
 * Admin module for managing quiz questions
 * @namespace AdminModule
 */
var AdminModule;
(function (AdminModule) {
    /** @type {QuizQuestion[]} */
    let quizData = [];
    // Load quiz data from API
    /**
     * Loads quiz data from the API endpoint
     * @async
     * @function loadQuizData
     * @returns {Promise<void>}
     */
    fetch('/api/quiz')
        .then(res => res.json())
        .then((data) => {
        quizData = data;
        renderQuizAdmin();
    })
        .catch(err => {
        console.error('Failed to load quiz:', err);
    });
    /**
     * Renders the quiz administration interface.
     * Creates editable input fields for questions, choices, and answers,
     * along with delete buttons for each question and a save all button.
     * @returns {void}
     */
    function renderQuizAdmin() {
        const listDiv = document.getElementById('quiz-admin-list');
        if (!listDiv)
            return;
        listDiv.innerHTML = '';
        quizData.forEach((q, index) => {
            const div = document.createElement('div');
            div.className = 'border p-3 mb-3';
            // Editable Question
            const questionInput = document.createElement('input');
            questionInput.type = 'text';
            questionInput.className = 'form-control mb-2';
            questionInput.value = q.question;
            questionInput.oninput = () => {
                quizData[index].question = questionInput.value;
            };
            div.appendChild(questionInput);
            // Editable Choices
            const choicesInput = document.createElement('input');
            choicesInput.type = 'text';
            choicesInput.className = 'form-control mb-2';
            choicesInput.value = q.choices.join(', ');
            choicesInput.oninput = () => {
                quizData[index].choices = choicesInput.value
                    .split(',')
                    .map(c => c.trim())
                    .filter(c => c);
            };
            div.appendChild(choicesInput);
            // Editable Answer
            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.className = 'form-control mb-2';
            answerInput.value = q.answer;
            answerInput.oninput = () => {
                quizData[index].answer = answerInput.value.trim();
            };
            div.appendChild(answerInput);
            // Delete Button
            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-danger btn-sm';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => {
                quizData.splice(index, 1);
                renderQuizAdmin();
            };
            div.appendChild(delBtn);
            listDiv.appendChild(div);
        });
        // Save All Button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save All Changes';
        saveBtn.className = 'btn btn-primary mt-3';
        saveBtn.onclick = () => {
            fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quizData)
            })
                .then(res => res.json())
                .then(data => {
                alert(data.message || 'Saved!');
            })
                .catch(err => {
                console.error('Save failed:', err);
                alert('Failed to save changes.');
            });
        };
        listDiv.appendChild(saveBtn);
    }
    /**
     * Gets the form element for adding new questions and sets up event listener.
     * Handles form submission to add new quiz questions to the data array.
     */
    const addForm = document.getElementById('add-question-form');
    /**
     * Event handler for adding new quiz questions.
     * Validates form input and adds new question to the quiz data.
     * @param {Event} e - The form submit event
     * @returns {void}
     */
    addForm === null || addForm === void 0 ? void 0 : addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const questionInput = document.getElementById('new-question');
        const choicesInputEl = document.getElementById('new-choices');
        const answerInput = document.getElementById('new-answer');
        const question = (questionInput === null || questionInput === void 0 ? void 0 : questionInput.value.trim()) || '';
        const choicesRaw = (choicesInputEl === null || choicesInputEl === void 0 ? void 0 : choicesInputEl.value.trim()) || '';
        const answer = (answerInput === null || answerInput === void 0 ? void 0 : answerInput.value.trim()) || '';
        const choices = choicesRaw.split(',').map(c => c.trim()).filter(c => c);
        if (!question || choices.length < 2 || !answer) {
            alert('Please enter a question, at least 2 choices, and an answer.');
            return;
        }
        quizData.push({ question, choices, answer });
        renderQuizAdmin();
        if (addForm && addForm instanceof HTMLFormElement) {
            addForm.reset();
        }
    });
})(AdminModule || (AdminModule = {})); // End AdminModule namespace
