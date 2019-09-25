class Quiz {
    constructor(questions) {
        this.questions = questions;
    }

    toggleAnswerSelected(question, answer) {
        this.questions[question].answers[answer].selected = !this.questions[question].answers[answer].selected;
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

let game = new Quiz(questions);

game.toggleAnswerSelected(0,0);
console.log(game.questions);

document.addEventListener('DOMContentLoaded', () => {
    let hello = document.createElement('p');
    hello.textContent = 'Hello world';
    document.getElementById('root').appendChild(hello);
});