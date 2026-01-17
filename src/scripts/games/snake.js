// Mini Snake Game
function initSnake(container) {
  const targetScore = 5; // The "Proof of Work" requirement
  let score = 0;
  let gameActive = true;

  // Game Configuration
  const gridSize = 20;
  const tileCount = 15; // 15x15 grid
  let snake = [{ x: 7, y: 7 }];
  let food = { x: 5, y: 5 };
  let dx = 0;
  let dy = 0;

  container.innerHTML = `
    <div class="snake-game">
      <h2>Snake Challenge</h2>
      <p class="game-subtitle">Reach ${targetScore} points to unlock your content</p>

      <div class="snake-board-wrapper">
        <canvas id="snake-canvas" width="${tileCount * gridSize}" height="${tileCount * gridSize}"></canvas>
      </div>

      <div class="game-status-bar">
        <span>Score: <strong id="snake-score">0</strong> / ${targetScore}</span>
      </div>

      <p class="game-message" id="snake-message">Press an Arrow Key to Start</p>
    </div>
  `;

  const canvas = container.querySelector("#snake-canvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = container.querySelector("#snake-score");
  const message = container.querySelector("#snake-message");

  // Input Handling
  function handleKeyPress(e) {
    if (!gameActive) return;

    const key = e.key;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (key === "ArrowLeft" && !goingRight) {
      dx = -1;
      dy = 0;
    }
    if (key === "ArrowUp" && !goingDown) {
      dx = 0;
      dy = -1;
    }
    if (key === "ArrowRight" && !goingLeft) {
      dx = 1;
      dy = 0;
    }
    if (key === "ArrowDown" && !goingUp) {
      dx = 0;
      dy = 1;
    }

    if (dx !== 0 || dy !== 0) {
      message.textContent = "Keep going!";
    }
  }

  document.addEventListener("keydown", handleKeyPress);

  function main() {
    if (didGameEnd()) {
      message.textContent = "💥 Crashed! Restarting...";
      setTimeout(resetGame, 1000);
      return;
    }

    setTimeout(function onTick() {
      if (!gameActive) return;
      clearCanvas();
      drawFood();
      advanceSnake();
      drawSnake();
      main();
    }, 100); // Game Speed
  }

  function clearCanvas() {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw subtle grid
    ctx.strokeStyle = "#333";
    for (let i = 0; i < canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  }

  function drawSnake() {
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? "#4CAF50" : "#81C784";
      ctx.fillRect(
        part.x * gridSize,
        part.y * gridSize,
        gridSize - 2,
        gridSize - 2,
      );
    });
  }

  function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
      score++;
      scoreDisplay.textContent = score;
      createFood();
      checkWinCondition();
    } else {
      if (dx !== 0 || dy !== 0) snake.pop();
    }
  }

  function didGameEnd() {
    if (dx === 0 && dy === 0) return false;
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > tileCount - 1;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > tileCount - 1;

    let hitSelf = false;
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
        hitSelf = true;
    }
    return (
      hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitSelf
    );
  }

  function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Make sure food doesn't spawn on snake body
    snake.forEach((part) => {
      if (part.x === food.x && part.y === food.y) createFood();
    });
  }

  function drawFood() {
    ctx.fillStyle = "#ff4757";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2,
    );
  }

  function checkWinCondition() {
    if (score >= targetScore) {
      gameActive = false;
      message.textContent = "🎉 Goal Reached! Content Unlocked.";
      message.style.color = "#4CAF50";
      document.removeEventListener("keydown", handleKeyPress);
      setTimeout(() => closeOverlay("snake"), 1500);
    }
  }

  function resetGame() {
    snake = [{ x: 7, y: 7 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    message.textContent = "Press an Arrow Key to Start";
    createFood();
    main();
  }

  // Start the loop
  createFood();
  main();
}
