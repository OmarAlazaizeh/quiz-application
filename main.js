// Select elements
let quizApp = document.querySelector(".quiz-app");
let questionsCountSpan = document.querySelector(".questions-count span");
let bulletsSpansContainer = document.querySelector(".bullets .spans");
let questonTitleHolder = document.querySelector(".question-title");
let questionAnswersHolder = document.querySelector(".question-answers");
let SubmitBtn = document.querySelector(".submit-btn");
let timerHolder = document.querySelector(".timer");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // Create bullets and set questions count
      createBullets(qCount);

      // Add quesiton data
      addQuestionData(questionsObject[currentIndex], qCount);

      countDown(60, qCount);

      // Click on submit
      SubmitBtn.onclick = () => {
        // get the right answer
        let rightAnswer = questionsObject[currentIndex].right_answer;

        currentIndex++;

        checkAnswer(rightAnswer, qCount);

        questonTitleHolder.innerHTML = "";
        questionAnswersHolder.innerHTML = "";

        // Add quesiton data
        addQuestionData(questionsObject[currentIndex], qCount);

        handleBullets();

        clearInterval(countDownInterval);
        countDown(60, qCount);

        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

// Create bullets function
function createBullets(num) {
  questionsCountSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bulletSpan = document.createElement("span");

    if (i === 0) {
      bulletSpan.className = "on";
    }

    bulletsSpansContainer.appendChild(bulletSpan);
  }
}

function addQuestionData(obj, qNum) {
  if (currentIndex < qNum) {
    // Add question title
    let questionTitle = document.createElement("h3");
    let questionText = document.createTextNode(obj["title"]);

    questionTitle.appendChild(questionText);
    questonTitleHolder.appendChild(questionTitle);

    // Add quesition answers
    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      let radioInbut = document.createElement("input");
      let label = document.createElement("label");
      let labelText = document.createTextNode(obj[`answer_${i}`]);

      answerDiv.className = "answer";

      radioInbut.type = "radio";
      radioInbut.name = "answer";
      radioInbut.id = `answer_${i}`;
      radioInbut.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInbut.checked = true;
      }

      label.htmlFor = `answer_${i}`;
      label.appendChild(labelText);

      answerDiv.appendChild(radioInbut);
      answerDiv.appendChild(label);
      questionAnswersHolder.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let chosenAnswer;

  let answers = document.getElementsByName("answer");

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (chosenAnswer === rAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let spanBullets = document.querySelectorAll(".bullets .spans span");
  bulletsArray = Array.from(spanBullets);

  bulletsArray.forEach((bullet, index) => {
    if (index === currentIndex) {
      bullet.className = "on";
    }
  });
}

function showResults(count) {
  if (currentIndex === count) {
    let resDiv = document.createElement("div");
    resDiv.classList = "result";
    let theResult;
    // console.log("good");
    document.querySelector(".quiz-area").remove();
    document.querySelector(".submit-btn").remove();
    document.querySelector(".bullets").remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good">Good</span>, ${rightAnswers} out of ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span>, ${rightAnswers} out of ${count}`;
    } else {
      theResult = `<span class="bad">Bad</span>, ${rightAnswers} out of ${count}`;
    }
    resDiv.innerHTML = theResult;
    quizApp.appendChild(resDiv);
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;

    countDownInterval = setInterval(() => {
      minutes = Math.floor(duration / 60);
      seconds = Math.floor(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timerHolder.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);

        SubmitBtn.click();
      }
    }, 1000);
  }
}
