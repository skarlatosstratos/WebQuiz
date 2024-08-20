

let question = [
    {
        questionText: "",
        answers: [
            { text: "", correct: true },
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: false },
        ]
    }
];


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
    handleQuestionData();
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

async function fetchQuestionData() {
    // Example: Fetching data from an API
    const response = await fetch('https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple');
    const data = await response.json();
    return data;
}

async function handleQuestionData() {
    // Await the asynchronous fetch operation
    const response = await fetchQuestionData();

    // Define your question object
    let question = [
        {
            questionText: "",
            answers: [
                { text: "", correct: true },
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
            ]
        }
    ];

    // Extract the relevant data from the response
    const result = response.results[0];
    const correctAnswer = result.correct_answer;
    const incorrectAnswers = result.incorrect_answers;

    // Insert the question text
    question[0].questionText = result.question;

    // Insert the correct answer
    question[0].answers[0].text = correctAnswer;
    question[0].answers[0].correct = true; // Correct flag is already true

    // Insert the incorrect answers
    for (let i = 0; i < incorrectAnswers.length; i++) {
        question[0].answers[i + 1].text = incorrectAnswers[i];
        question[0].answers[i + 1].correct = false;
    }

    // Log the updated question object
    console.log(JSON.stringify(question, null, 2));
}

// Call the function to execute
