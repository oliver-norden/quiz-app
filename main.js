class Quiz {
    constructor(questions) {
        this.questions = questions;
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

game.toggleAnswerSelected(0,1);
game.toggleAnswerSelected(1,1);
game.toggleAnswerSelected(1,2);
console.log(game.questions);
alert(`Score: ${game.correctQuiz()}`);

document.addEventListener('DOMContentLoaded', () => {
    let hello = document.createElement('p');
    hello.textContent = 'Hello world';
    document.getElementById('root').appendChild(hello);
});