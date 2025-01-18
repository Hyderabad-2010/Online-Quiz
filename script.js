const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

    const progress = (value) => {
        const percentage = (value / time) * 100;
        progressBar.style.width = `${percentage}%`;
        progressText.innerHTML = `${value}`; 
     }; 

     let questions = [],
         time = 30,
         score = 0,
         currentQuestion,
         timer;

         const startBtn = document.querySelector(".start"),
               numQuestions = document.querySelector("#num-questions"),
               category = document.querySelector("#category"),
               difficulty = document.querySelector("#difficulty"),
               timePerQuestion = document.querySelector("#time"),
                quiz = document.querySelector(".quiz"),
                startscreen = document.querySelector(".start-screen");

    const startQuiz = () => {
        const num = numQuestions.value;
        const cat = category.value;
        const diff = difficulty.value;
// apl url
const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    questions = data.results;
    //console.log(`JSONRESOPNSE: ${questions}`);
    startscreen.classList.add("hide");
    quiz.classList.remove("hide");
    currentQuestion = 1;
    //console.log(`individualquestion: ${JSON.stringify(questions[0])}`);
    
    showQuestion(questions[0]);

});
    };
startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
      nextBtn = document.querySelector(".next");

const showQuestion = (myQuestion) => {
    const questionText = document.querySelector(".question"),
          answersWrapper = document.querySelector(".answer-wrapper"),
          questionNumber = document.querySelector(".number");
          questionText.innerHTML = myQuestion.question; // question=only the question

                    // correct a wrong answers are separate lets mix them
     const answers = [
        ...myQuestion.incorrect_answers,
        myQuestion.correct_answer.toString(),
     ];
     //correct answer will be always at last
     //lets shuffle the array
     answers.sort(() => Math.random() - 1);
     answersWrapper.innerHTML = "";
     answers.forEach((answer) => {
        answersWrapper.innerHTML +=
        ` <div class="answer">
         <span class="text">${answer}</span>
         <span class="checkbox">
            <span class="icon">☑️</span>
        </span>
    </div>
`;
     });

questionNumber.innerHTML = `Question <span class="current">${questions.indexOf(myQuestion) + 1}</span>
                             <span class="total">/${questions.length}</span>`;

// let add event listner on answer

const answersDiv = document.querySelectorAll(".answer");
      answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            // if answer not already submited
            if(!answer.classList.contains("checked")) {
                // remove checked from other answer
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });
    // add selected on currently click
            answer.classList.add("selected");
    // after any answer is selected enable submit btn
        submitBtn.disabled = false;
            }
        });
      });

       // after updating question start timer
       time = timePerQuestion.value;
       startTimer(time);
 };
  
 const startTimer = (time) => {
    timer = setInterval(() => {
        if (time >= 0) {
 // if timer more than 0 means time remaining
 // move progress
 progress(time);
 time--;
        } else {
            // if time finishes means less than 0
            checkAnswer();//localStorage
        }
    }, 1000);
 }; 

 submitBtn.addEventListener("click", () => {
    checkAnswer();
 });

 const checkAnswer = () => {
    //firstclear interval when check the answer trigged
    clearInterval(timer);

    const selectedAnswer = document.querySelector(".answer.selected");
    // any answer is selected
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text");
        if (answer === questions[currentQuestion - 1].correct_answer) {
            // if answer matched with current question correct answer
            // increase score
            score++;
            // add correct class on selected
            selectedAnswer.classList.add("correct");
        } else {
            // if wrong selected 
            //add wrong class on selected but then also add correct on correct answer
            // correct added lets add wrong on selected
            selectedAnswer.classList.add("wrong");
            const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
                if (
                    answer.querySelector(".text").innerHTML ===
                    questions[currentQuestion - 1].correct_answer
                ) {
                    // only add correct class to correct answer
                    answer.classList.add("correct");
                }
            });
        }
    }
    // answer check will be also triggered when time reaches 0 
    // what if nothing selected and time finishes
    // lets just add correct class on correct answer
    else {
        document.querySelectorAll(".answer").forEach((answer) => {
            if (
                answer.querySelector(".text").innerHTML ===
                questions[currentQuestion - 1].correct_answer
            ) {
                // only add correct class to correct answer
                answer.classList.add("correct");
            }
        }); 
    }

// lets block user to select further answers
const answerDiv = document.querySelectorAll(".answer");
answerDiv.forEach((answer) => {
    answer.classList.add("checked");
    //add checked class on all answer as we check for it when on click answer if its present do nothing
    // also when checked lets dont add hover effect on checkbox
}); 

// after submit show next btn go to next question
submitBtn.style.display = "none";
nextBtn.style.display = "block";
 };

 // on next click show next question
 nextBtn.addEventListener("click", () => { 
    nextQuestion();
    // also show submit btn on next question and hide next btn
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
 });

const nextQuestion = () => {
    // if there is remaining question 
    if(currentQuestion < questions.length) {
        currentQuestion++;
        // show question
        showQuestion(questions[currentQuestion - 1]);
    }
    else {
        // if question remamaing
        // showScore();
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen"),
      finalScore = document.querySelector(".final-score"),
      totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    //reload page on click
    window.location.reload();
});