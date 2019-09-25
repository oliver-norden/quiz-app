class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIdx = 0;
        this.renderQuestion();
    }

    toggleAnswerSelected(question, answer) {
        this.questions[question].answers[answer].selected = !this.questions[question].answers[answer].selected;
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

        return quizScore
    }

    renderQuestion() {

        // Get current question and answers
        const { question, answers } = this.questions[this.currentQuestionIdx]; 

        const parentElement = document.getElementById('root');

        // Create question div
        let questionDiv = document.createElement('div');
        questionDiv.id = 'question';

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
            answerCheckbox.setAttribute('questionIdx', idx);

            // Answer label
            let answerLabel = document.createElement('label');
            answerLabel.setAttribute('for', answerId);
            answerLabel.textContent = answer.answer;

            // Appending children
            answerContainer.appendChild(answerCheckbox);
            answerContainer.appendChild(answerLabel);
            questionDiv.appendChild(answerContainer);
            
        });

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