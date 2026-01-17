// Mini Wordle Game
function initWordle(container) {
  const words = [
    "CODE",
    "GAME",
    "PLAY",
    "WORK",
    "REST",
    "MIND",
    "TECH",
    "DATA",
    "LINK",
    "FILE",
    "BYTE",
    "CHIP",
    "DISK",
    "HASH",
    "NODE",
    "PORT",
    "SYNC",
    "USER",
    "WAVE",
    "ZOOM",
    "BLOG",
    "CHAT",
    "DRAW",
    "EDIT",
    "FONT",
    "GRID",
    "ICON",
    "LOAD",
    "MENU",
    "PAGE",
    "READ",
    "SAVE",
    "TEXT",
    "UNDO",
    "VIEW",
    "WIFI",
    "MAIL",
    "PING",
    "SCAN",
    "COPY",
    "MOCK",
    "LOOP",
    "PATH",
    "PUSH",
    "PULL",
    "FORK",
    "TREE",
    "ROOT",
    "BOOT",
    "EXIT",
  ];
  const targetWord = words[Math.floor(Math.random() * words.length)];
  let currentGuess = "";
  let attempts = 0;
  const maxAttempts = 6;

  container.innerHTML = `
    <div class="wordle-game">
      <h2>Mini Wordle</h2>
      <p>Guess the 4-letter word</p>
      <div class="wordle-board" id="wordle-board"></div>
      <div class="wordle-keyboard" id="wordle-keyboard"></div>
      <p class="wordle-message" id="wordle-message"></p>
    </div>
  `;

  const board = container.querySelector("#wordle-board");
  const keyboard = container.querySelector("#wordle-keyboard");
  const message = container.querySelector("#wordle-message");
  const keyButtons = {};

  // Create board
  for (let i = 0; i < maxAttempts; i++) {
    const row = document.createElement("div");
    row.className = "wordle-row";
    for (let j = 0; j < 4; j++) {
      const cell = document.createElement("div");
      cell.className = "wordle-cell";
      row.appendChild(cell);
    }
    board.appendChild(row);
  }

  // Create keyboard
  const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = key;
    btn.className = "wordle-key";
    btn.addEventListener("mousedown", (event) => event.preventDefault());
    btn.addEventListener("click", () => handleWordleInput(key));
    keyboard.appendChild(btn);
    keyButtons[key] = btn;
  });

  // Add backspace and enter
  const backspace = document.createElement("button");
  backspace.type = "button";
  backspace.textContent = "⌫";
  backspace.className = "wordle-key wordle-key-special";
  backspace.addEventListener("mousedown", (event) => event.preventDefault());
  backspace.addEventListener("click", () => handleWordleInput("BACKSPACE"));
  keyboard.appendChild(backspace);

  const enter = document.createElement("button");
  enter.type = "button";
  enter.textContent = "✓";
  enter.className = "wordle-key wordle-key-special";
  enter.addEventListener("mousedown", (event) => event.preventDefault());
  enter.addEventListener("click", () => handleWordleInput("ENTER"));
  keyboard.appendChild(enter);

  // Handle keyboard input
  document.addEventListener("keydown", handleKeyboardInput);

  function handleKeyboardInput(e) {
    if (e.key === "Enter") {
      handleWordleInput("ENTER");
    } else if (e.key === "Backspace") {
      handleWordleInput("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleWordleInput(e.key.toUpperCase());
    }
  }

  function handleWordleInput(key) {
    if (attempts >= maxAttempts) return;

    if (key === "BACKSPACE") {
      currentGuess = currentGuess.slice(0, -1);
      updateBoard();
    } else if (key === "ENTER") {
      if (currentGuess.length === 4) {
        submitGuess();
      } else {
        message.textContent = "Word must be 4 letters!";
      }
    } else if (currentGuess.length < 4) {
      currentGuess += key;
      updateBoard();
    }
  }

  function updateBoard() {
    const row = board.children[attempts];
    for (let i = 0; i < 4; i++) {
      row.children[i].textContent = currentGuess[i] || "";
    }
  }

  function submitGuess() {
    const row = board.children[attempts];
    const guess = currentGuess;

    // Check each letter
    for (let i = 0; i < 4; i++) {
      const cell = row.children[i];
      const letter = guess[i];
      const keyButton = keyButtons[letter];

      if (letter === targetWord[i]) {
        cell.className = "wordle-cell wordle-correct";
        if (keyButton) {
          keyButton.classList.remove("wordle-present", "wordle-absent");
          keyButton.classList.add("wordle-correct");
          keyButton.disabled = false;
        }
      } else if (targetWord.includes(letter)) {
        cell.className = "wordle-cell wordle-present";
        if (keyButton && !keyButton.classList.contains("wordle-correct")) {
          keyButton.classList.remove("wordle-absent");
          keyButton.classList.add("wordle-present");
          keyButton.disabled = false;
        }
      } else {
        cell.className = "wordle-cell wordle-absent";
        if (
          keyButton &&
          !keyButton.classList.contains("wordle-correct") &&
          !keyButton.classList.contains("wordle-present")
        ) {
          keyButton.classList.add("wordle-absent");
          keyButton.disabled = true;
        }
      }
    }

    if (guess === targetWord) {
      message.textContent = "🎉 Correct! Break complete!";
      message.style.color = "#4CAF50";
      setTimeout(() => closeOverlay("wordle"), 1500);
      document.removeEventListener("keydown", handleKeyboardInput);
      return;
    }

    attempts++;
    currentGuess = "";

    if (attempts >= maxAttempts) {
      message.textContent = `Game Over! The word was ${targetWord}`;
      setTimeout(() => closeOverlay("wordle"), 2000);
      document.removeEventListener("keydown", handleKeyboardInput);
    } else {
      message.textContent = "";
    }
  }
}
