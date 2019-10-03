class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.userName = '';
        this.selectedNumberOfQuestions = 0;
        this.currentQuestionIdx = 0;
        this.parentElement = document.getElementById('root');
        this.renderMenu();
    }

    toggleAnswerSelected(answer) {
        const curQuestIdx = this.currentQuestionIdx;
        this.questions[curQuestIdx].answers[answer].selected = !this.questions[curQuestIdx].answers[answer].selected;
    }

    incrementQuestion(inc) {
        this.currentQuestionIdx += inc;
        this.renderQuestion();
    }

    startQuiz(menuDivid) {
        // Slice questions array to user desired length
        this.questions = this.questions.slice(this.selectedNumberOfQuestions - 1);

        // Remove menu
        const menu = document.getElementById(menuDivid);
        menu.parentElement.removeChild(menu);

        this.renderQuestion();
    }

    correctQuiz() {
        // Loop through questions and accumulate score
        const quizScore = this.questions.reduce((quizScore, question) => {

            // Loop through answers and accumulate score
            const questionScore = question.answers.reduce((questionScore, answer) => {
                const { correct, selected } = answer;
                if (correct && selected) return questionScore + 1; // Correct answer selected
                if (!correct && !selected) return questionScore; // Wrong answer not selected 
                if (correct !== selected) return questionScore - 1; // Wrong answer selected or correct answer not selected
            }, 0);

            return quizScore + questionScore;
        }, 0);

        alert(`Score: ${quizScore}`);
        return quizScore
    }

    handleMenuInput(e) {
        const { name, value } = e.target;
        this[name] = value;
        console.log(this[name]);
    }

    renderMenu() {

        const parentElement = this.parentElement;

        // Create menu div
        const menuContainerId = 'quizMenu';
        let menuDiv = document.createElement('div');
        menuDiv.id = menuContainerId;

        // Name field label
        const nameFieldId = 'userName';
        let nameFieldLabel = document.createElement('label');
        nameFieldLabel.textContent = 'Name';
        nameFieldLabel.for = nameFieldId;
        menuDiv.appendChild(nameFieldLabel);

        // Name field
        let nameField = document.createElement('input');
        nameField.name = 'userName';
        nameField.id = nameFieldId;
        nameField.addEventListener('change', this.handleMenuInput.bind(this));
        menuDiv.appendChild(nameField);

        // Question range input and label
        {
            const noOfQuestions = 10; // To be set dynamicaly from question api
            const rangeDefault = noOfQuestions/2;
            const questionRangeId = 'questionRange';

            let questionRange = document.createElement('input');
            questionRange.type = 'range';
            questionRange.id = questionRangeId;
            questionRange.name = 'selectedNumberOfQuestions';

            // Value parameters
            questionRange.min = 1;
            questionRange.max = noOfQuestions;
            questionRange.value = rangeDefault;

            // Label updating
            questionRange.addEventListener('input', function() {
                this.nextSibling.children[0].textContent = this.value;
            });

            // State update
            questionRange.addEventListener('change', this.handleMenuInput.bind(this))

            // Label 
            let questionRangeLabel = document.createElement('label');
            questionRangeLabel.for = questionRangeId;
            questionRangeLabel.textContent = ' Questions';

            // Range value holder
            let rangeValueHolder = document.createElement('span');
            rangeValueHolder.textContent = rangeDefault;
            questionRangeLabel.prepend(rangeValueHolder);

            // Start quiz button
            let startButton = document.createElement('button');
            startButton.addEventListener('click', this.startQuiz.bind(this, menuContainerId));
            startButton.textContent = 'Start quiz';

            menuDiv.appendChild(questionRange);
            menuDiv.appendChild(questionRangeLabel);
            menuDiv.appendChild(startButton);

        }

        // Append menu div
        parentElement.appendChild(menuDiv);
    }

    renderQuestion() {

        // Get current question and answers
        const { question, answers } = this.questions[this.currentQuestionIdx]; 

        const parentElement = this.parentElement;

        // Create question div
        const questionContainerId = 'question';
        let questionDiv = document.getElementById(questionContainerId) || document.createElement('div'); // Create new container if one does not exist
        questionDiv.id = questionContainerId;

        // Clear any existing question
        while (questionDiv.firstChild){
            questionDiv.removeChild(questionDiv.firstChild);
        }        

        // Create question paragraph
        let questionEl = document.createElement('p');
        questionEl.textContent = question;
        questionDiv.appendChild(questionEl);

        // Create answer elements
        answers.forEach((answer, idx) => {
            //Answer container
            let answerContainer = document.createElement('div');

            // AnswerId (For label binding)
            const answerId = `q${this.currentQuestionIdx}a${idx}`

            // Answer checkbox
            let answerCheckbox = document.createElement('input');
            answerCheckbox.type = 'checkbox';
            answerCheckbox.id = answerId;
            answerCheckbox.checked = answer.selected;
            answerCheckbox.addEventListener('change', this.toggleAnswerSelected.bind(this, idx)); // Add event listener to toggle selected propery of answer

            // Answer label
            let answerLabel = document.createElement('label');
            answerLabel.setAttribute('for', answerId);
            answerLabel.textContent = answer.answer;

            // Appending children
            answerContainer.appendChild(answerCheckbox);
            answerContainer.appendChild(answerLabel);
            questionDiv.appendChild(answerContainer);
            
        });

        // Previous question button
        let prevQuestionBtn = document.createElement('button');
        prevQuestionBtn.textContent = '<- Prev question';
        prevQuestionBtn.addEventListener('click', this.incrementQuestion.bind(this, -1));
        prevQuestionBtn.disabled = !this.currentQuestionIdx; // Disable button if current question index is 0
        questionDiv.appendChild(prevQuestionBtn);

        // Create next question button or correct quiz button
        if (this.currentQuestionIdx === this.questions.length - 1){
            // Correct quiz button
            let correctQuizBtn = document.createElement('button');
            correctQuizBtn.textContent = 'Correct quiz';
            correctQuizBtn.addEventListener('click', this.correctQuiz.bind(this));
            questionDiv.appendChild(correctQuizBtn);
        }
        else{
            // Next question button
            let nextQuestionBtn = document.createElement('button');
            nextQuestionBtn.textContent = 'Next question ->';
            nextQuestionBtn.addEventListener('click', this.incrementQuestion.bind(this, 1));
            questionDiv.appendChild(nextQuestionBtn);
        }

        // Append question and answers
        parentElement.appendChild(questionDiv);

    }
}

const questions = [
    {
        question: "Question 1",
        answers: [
            {
                answer: "Answer 1",
                correct: false
            },
            {
                answer: "Answer 2",
                correct: true

            },
            {
                answer: "Answer 3",
                correct: false
            }
        ]
    },
    {
        question: "Question 2",
        answers: [
            {
                answer: "Answer 1",
                correct: false
            },
            {
                answer: "Answer 2",
                correct: true

            },
            {
                answer: "Answer 3",
                correct: true
            }
        ]
    }
]

document.addEventListener('DOMContentLoaded', () => {
    
    let game = new Quiz(questions);
});