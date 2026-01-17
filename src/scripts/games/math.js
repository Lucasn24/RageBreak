// Mini Math Game - Timed Hard Mode
function initMath(container) {
  const targetStreak = 5;
  const timeLimit = 10; // Seconds per problem
  let currentStreak = 0;
  let correctAnswer;
  let timerInterval;
  let timeLeft;

  container.innerHTML = `
    <div class="math-game">
      <h2>Timed Mental Hard Mode</h2>
      <p class="game-subtitle">Solve ${targetStreak} in a row. Don't let the timer hit zero!</p>

      <div class="math-stats-row">
        <div class="stat-box">Streak: <strong id="math-streak">0</strong> / ${targetStreak}</div>
        <div class="stat-box timer-box">Time: <strong id="math-timer">${timeLimit}</strong>s</div>
      </div>

      <div class="math-problem-box">
        <span id="math-question">...</span>
      </div>

      <div class="math-input-wrapper">
        <input type="number" id="math-answer" placeholder="?">
        <button id="math-submit">Check</button>
      </div>

      <p class="game-message" id="math-message">Hurry up!</p>
    </div>
  `;

  const questionEl = container.querySelector("#math-question");
  const answerInput = container.querySelector("#math-answer");
  const submitBtn = container.querySelector("#math-submit");
  const streakDisplay = container.querySelector("#math-streak");
  const timerDisplay = container.querySelector("#math-timer");
  const message = container.querySelector("#math-message");

  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = timeLimit;
    timerDisplay.textContent = timeLeft;
    timerDisplay.parentElement.style.color = "#ffffff";

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if (timeLeft <= 5) {
        timerDisplay.parentElement.style.color = "#FF5252"; // Turn red for urgency
      }

      if (timeLeft <= 0) {
        handleTimeout();
      }
    }, 1000);
  }

  function handleTimeout() {
    clearInterval(timerInterval);
    currentStreak = 0;
    streakDisplay.textContent = currentStreak;
    message.textContent = "⏰ Time Out! Streak reset.";
    message.style.color = "#FF5252";
    setTimeout(generateIntermediateProblem, 1000);
  }

  function generateIntermediateProblem() {
    const type = Math.floor(Math.random() * 3);
    let qText = "";

    if (type === 0) {
      // Harder Addition (e.g., 68 + 75) - Requires mental carry-over
      const a = Math.floor(Math.random() * 80) + 20;
      const b = Math.floor(Math.random() * 80) + 20;
      correctAnswer = a + b;
      qText = `${a} + ${b}`;
    } else if (type === 1) {
      // Larger Subtraction (e.g., 145 - 67)
      const a = Math.floor(Math.random() * 150) + 50;
      const b = Math.floor(Math.random() * 40) + 10;
      correctAnswer = a - b;
      qText = `${a} - ${b}`;
    } else {
      // Intermediate Multiplication (e.g., 14 × 6 or 12 × 12)
      const a = Math.floor(Math.random() * 14) + 2;
      const b = Math.floor(Math.random() * 12) + 2;
      correctAnswer = a * b;
      qText = `${a} × ${b}`;
    }

    questionEl.textContent = qText;
    answerInput.value = "";
    answerInput.focus();
    startTimer();
  }

  function checkAnswer() {
    const userValue = parseInt(answerInput.value);

    if (userValue === correctAnswer) {
      clearInterval(timerInterval);
      currentStreak++;
      streakDisplay.textContent = currentStreak;
      message.textContent = "✅ Correct!";
      message.style.color = "#4CAF50";

      if (currentStreak >= targetStreak) {
        message.textContent = "🎉 Brain Verified!";
        setTimeout(() => closeOverlay("math"), 1500);
      } else {
        setTimeout(generateIntermediateProblem, 600);
      }
    } else {
      handleTimeout(); // Treat wrong answer as a reset (Hard Mode)
    }
  }

  submitBtn.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  generateIntermediateProblem();
}
