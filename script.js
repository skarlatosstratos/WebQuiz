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

async function fetchQuestionData() {
    const apiUrl = 'https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function handleQuestionData() {
    const response = await fetchQuestionData();

    // Check if the response and results array are valid
    if (!response || !response.results || response.results.length === 0) {
        console.error("No results returned from API");
        return; // Exit the function if no results
    }

    const result = response.results[0];
    const correctAnswer = result.correct_answer;
    const incorrectAnswers = result.incorrect_answers;

    // Update global question object
    question[0].questionText = result.question;

    // Insert the correct answer
    question[0].answers[0].text = correctAnswer;
    question[0].answers[0].correct = true;

    // Insert the incorrect answers
    for (let i = 0; i < incorrectAnswers.length; i++) {
        question[0].answers[i + 1].text = incorrectAnswers[i];
        question[0].answers[i + 1].correct = false;
    }

    shuffle(question[0].answers); // Shuffle answers for randomness
}

async function showQuestion() {
    resetState();
    await handleQuestionData(); // Wait for the question data to be fetched

    // Display the question and answers
    let currentQuestion = question[0];
    
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.questionText;

    // Create buttons for the answers
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
        selectedBtn.classList.add("wrong");
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
    if (currentQuestionIndex < 10) { // Assuming 10 questions
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of 10!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < 10) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

// Utility function to shuffle answers
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startQuiz();
