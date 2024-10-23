let form = document.getElementById("quizOptions");
let categoryMenu = document.getElementById("categoryMenu");
let difficultyOptions = document.getElementById("difficultyOptions");
let questionsNumber = document.getElementById("questionsNumber");
let startQuiz = document.getElementById("startQuiz");
let displatData = document.getElementById("displat-data");

let questions;
let quiz;
startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let numbers = questionsNumber.value;
  quiz = new Quiz(category, difficulty, numbers);
  questions = await quiz.getAllQuestions();
  console.log(questions);
  
  let myAnswer = new Questions(0);
  form.classList.replace("d-flex", "d-none");
  myAnswer.display();
});

class Quiz {
  constructor(category, difficulty, numbers) {
    this.category = category;
    this.difficulty = difficulty;
    this.numbers = numbers;
    this.score = 0;
  }

  getApi() {
    return `https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllQuestions() {
    let response = await fetch(this.getApi());
    let data = await response.json();
    return data.results;
  }

  showResult() {
    return `
  
  <div class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0">
        ${
          this.score == this.numbers
            ? `Congratulations 🎉`
            : `Your Score Is ${this.score}`
        }
        </h2>
        <button class="again btn btn-primary rounded-pill"> Try Again </button>
      </div>
  
  
  
  `;
  }
}

class Questions {
  constructor(index) {
    this.index = index;
    this.category = questions[index].category;
    this.correct_answer = questions[index].correct_answer;
    this.difficulty = questions[index].difficulty;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.question = questions[index].question;
    this.allAnswers = this.getAllAnswers();
    this.isAnswer = false;
  }

  getAllAnswers() {
    let allAnswers = [...this.incorrect_answers, this.correct_answer];
    return allAnswers.sort();
  }

  display() {
    const questionMarkUp = `
  
    <div class="question shadow-lg col-lg-9 offset-lg-2   p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
            <div class="w-100 d-flex justify-content-around">
              <span class="btn btn-category">${this.category}</span>
              <span class="btn btn-category">${this.difficulty}</span>
              <span class="fs-6 btn btn-questions">${this.index + 1} of ${
      questions.length
    }</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.allAnswers
              .map((answer) => `<li>${answer}</li>`)
              .toString()
              .replaceAll(",", "")}
            
            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold">Score:${
              quiz.score
            }</h2>        
          </div>
  
  
  `;
    displatData.innerHTML = questionMarkUp;

    let choices = document.querySelectorAll(".choices li");

    choices.forEach((li) =>
      li.addEventListener("click", () => {
        this.checkAnswer(li);
        this.nextQuestion();
      })
    );
  }

  checkAnswer(choice) {
    if (!this.isAnswer) {
      this.isAnswer = true;
      if (choice.innerHTML === this.correct_answer) {
        choice.classList.add("correct", "animate__animated", "animate__pulse");
        quiz.score++;
      } else {
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextQuestion() {
    this.index++;
    setTimeout(() => {
      if (this.index < questions.length) {
        let myNextQuestion = new Questions(this.index);
        myNextQuestion.display();
      } else {
        let result = quiz.showResult();
        displatData.innerHTML = result;
        document
          .querySelector(".question .again")
          .addEventListener("click", function () {
            window.location.reload();
          });
      }
    }, 2000);
  }
}
