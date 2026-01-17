// 4x4 Sudoku Game
function initSudoku(container) {
  // Generate a simple 4x4 sudoku puzzle
  const solution = generateSudoku4x4();
  const puzzle = createPuzzle(solution);

  container.innerHTML = `
    <div class="sudoku-game">
      <h2>4x4 Sudoku</h2>
      <p>Fill in the numbers 1-4</p>
      <div class="sudoku-board" id="sudoku-board"></div>
      <div class="sudoku-controls">
        <button class="sudoku-btn" id="check-sudoku">Check Solution</button>
      </div>
      <p class="sudoku-message" id="sudoku-message"></p>
    </div>
  `;

  const board = container.querySelector("#sudoku-board");
  const checkBtn = container.querySelector("#check-sudoku");
  const message = container.querySelector("#sudoku-message");

  // Create board
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      cell.className = "sudoku-cell";
      cell.dataset.row = i;
      cell.dataset.col = j;

      if (puzzle[i][j] !== 0) {
        cell.value = puzzle[i][j];
        cell.disabled = true;
        cell.classList.add("sudoku-given");
      }

      // Only allow numbers 1-4
      cell.addEventListener("input", (e) => {
        const value = e.target.value;
        if (!/^[1-4]$/.test(value)) {
          e.target.value = "";
        }
      });

      board.appendChild(cell);
    }
  }

  checkBtn.addEventListener("click", () => {
    const userSolution = [];
    for (let i = 0; i < 4; i++) {
      userSolution[i] = [];
      for (let j = 0; j < 4; j++) {
        const cell = board.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        userSolution[i][j] = parseInt(cell.value) || 0;
      }
    }

    if (JSON.stringify(userSolution) === JSON.stringify(solution)) {
      message.textContent = "🎉 Correct! Break complete!";
      message.style.color = "#4CAF50";
      setTimeout(() => closeOverlay("sudoku"), 1500);
    } else {
      message.textContent = "❌ Not quite right. Keep trying!";
      message.style.color = "#FF5722";
    }
  });
}

// Generate a valid 4x4 sudoku
function generateSudoku4x4() {
  // One of many valid 4x4 sudoku solutions
  const solutions = [
    [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [4, 1, 2, 3],
    ],
    [
      [2, 3, 4, 1],
      [4, 1, 2, 3],
      [1, 4, 3, 2],
      [3, 2, 1, 4],
    ],
    [
      [3, 4, 1, 2],
      [1, 2, 3, 4],
      [4, 1, 2, 3],
      [2, 3, 4, 1],
    ],
    [
      [4, 1, 2, 3],
      [2, 3, 4, 1],
      [3, 2, 1, 4],
      [1, 4, 3, 2],
    ],
  ];
  return solutions[Math.floor(Math.random() * solutions.length)];
}

// Create puzzle by removing some numbers
function createPuzzle(solution) {
  const puzzle = solution.map((row) => [...row]);
  const cellsToRemove = 6; // Remove 6 cells for moderate difficulty

  for (let i = 0; i < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);
    puzzle[row][col] = 0;
  }

  return puzzle;
}
