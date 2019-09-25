class Quiz {
    constructor(questions) {
        this.questions = questions;
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

document.addEventListener('DOMContentLoaded', () => {
    let hello = document.createElement('p');
    hello.textContent = 'Hello world';
    document.getElementById('root').appendChild(hello);
});