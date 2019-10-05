class Quiz {
    constructor() {
        this.questions = [];
        this.userName = '';
        this.selectedNumberOfQuestions = 0;
        this.currentQuestionIdx = 0;
        this.score = 0;
        this.parentElement = document.getElementById('root');
        this.getQuestions()
            .then(this.renderMenu.bind(this))
            .catch(err => alert('Something went wrong...'));
    }

    getQuestions() {
        return fetch('http://quiz.olivernorden.se/questions.php')
            .then(res => res.json())
                .then(questions => {
                    questions.forEach(question => 
                        this.questions.push(new Question(question))
                    )
                });
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
        this.questions = this.questions.slice(0, this.selectedNumberOfQuestions);

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
        this.score = quizScore;
    }

    handleMenuInput(e) {
        const { name, value } = e.target;
        this[name] = value;
    }

    renderMenu() {

        const parentElement = this.parentElement;

        // Create menu div
        const menuContainerId = 'quizMenu';
        let menuDiv = document.createElement('div');
        menuDiv.id = menuContainerId;
        menuDiv.classList.add('container');

        // Name form group
        {
            // Form group
            let nameFormGroup = document.createElement('div');
            nameFormGroup.classList.add('form-group');

            // Name field label
            const nameFieldId = 'userName';
            let nameFieldLabel = document.createElement('label');
            nameFieldLabel.textContent = 'Name';
            nameFieldLabel.for = nameFieldId;
            nameFormGroup.appendChild(nameFieldLabel);

            // Name field
            let nameField = document.createElement('input');
            nameField.name = 'userName';
            nameField.id = nameFieldId;
            nameField.classList.add('form-control');
            nameField.addEventListener('change', this.handleMenuInput.bind(this));
            nameFormGroup.appendChild(nameField);

            menuDiv.appendChild(nameFormGroup);
        }

        // Question range input and label
        {
            const noOfQuestions = this.questions.length; // To be set dynamicaly from question api
            const rangeDefault = noOfQuestions/2;
            this.selectedNumberOfQuestions = rangeDefault; // Default number of questions
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
        questionDiv.classList.add('container');

        // Clear any existing question
        while (questionDiv.firstChild){
            questionDiv.removeChild(questionDiv.firstChild);
        }  
        
        // Create question info (Index etc)
        let questionInfo = document.createElement('h1');
        questionInfo.textContent = `Question ${this.currentQuestionIdx + 1} of ${this.selectedNumberOfQuestions}, ${this.currentQuestionIdx} answered.`;
        questionDiv.appendChild(questionInfo);

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
        prevQuestionBtn.setAttribute('class', 'btn btn-secondary');
        questionDiv.appendChild(prevQuestionBtn);

        // Create next question button or correct quiz button
        if (this.currentQuestionIdx === this.questions.length - 1){
            // Correct quiz button
            let correctQuizBtn = document.createElement('button');
            correctQuizBtn.textContent = 'Correct quiz';
            correctQuizBtn.setAttribute('class', 'btn btn-success');
            correctQuizBtn.addEventListener('click', this.correctQuiz.bind(this));
            questionDiv.appendChild(correctQuizBtn);
        }
        else{
            // Next question button
            let nextQuestionBtn = document.createElement('button');
            nextQuestionBtn.textContent = 'Next question ->';
            nextQuestionBtn.setAttribute('class', 'btn btn-primary');
            nextQuestionBtn.addEventListener('click', this.incrementQuestion.bind(this, 1));
            questionDiv.appendChild(nextQuestionBtn);
        }

        // Append question and answers
        parentElement.appendChild(questionDiv);

    }
}

class Question {
    constructor(questionObj){
        const { question, category, answers } = questionObj;
        this.question = question;
        this.category = category;
        this.answers = answers;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});