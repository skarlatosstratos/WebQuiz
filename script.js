

/**const question = [
    {
        question: "Which is the largest animal in the world?",
        answers: [
            { text: "Shark", correct: false },
            { text: "Blue whale", correct: true },
            { text: "Elephant", correct: false },
            { text: "Giraffe", correct: false },
        ]
    }
];**/


const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}
async function makeNewQuestion(){

    const apiUrl = 'https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results; // Return the results array directly
    } catch (error) {
        console.error("Error fetching data:", error);
    }
   
}

function showQuestion() {
    //resetState();


    (async () => {
        const results = await makeNewQuestion(); // Wait for the function to resolve
        console.log(results); // Log the results
    
        // Optional: log each question and answer
        results.forEach(item => {
            console.log(`Question: ${item.question}`);
            console.log(`Correct answer: ${item.correct_answer}`);
            
            item.incorrect_answers.forEach((incorrectAnswer, index) => {
                console.log(`Incorrect answer ${index + 1}: ${incorrectAnswer}`);
            });
        });
    })();



    


    //
    let currentQuestion = question;
    
    let questionNo = currentQuestionIndex + 1; // Fixed index calculation
    

    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    /** 
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", selectAnswer);
    });
    */
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong"); // Use "wrong" class for wrong answer
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < question.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();

