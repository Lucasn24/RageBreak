// Memory Match Game
function initMemoryMatch(container) {
  const emojis = ["🎮", "⏱️", "💪", "🎯", "🔥", "⭐", "🚀", "💡"];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;

  container.innerHTML = `
    <div class="memory-game">
      <h2>Memory Match</h2>
      <p>Find all 8 pairs</p>
      <div class="memory-stats">
        <span>Moves: <strong id="move-count">0</strong></span>
        <span>Pairs: <strong id="pair-count">0/8</strong></span>
      </div>
      <div class="memory-board" id="memory-board"></div>
      <p class="memory-message" id="memory-message"></p>
    </div>
  `;

  const board = container.querySelector("#memory-board");
  const moveCount = container.querySelector("#move-count");
  const pairCount = container.querySelector("#pair-count");
  const message = container.querySelector("#memory-message");

  // Create cards
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-front">?</div>
        <div class="memory-card-back">${emoji}</div>
      </div>
    `;

    card.addEventListener("click", () => handleCardClick(card));
    board.appendChild(card);
  });

  function handleCardClick(card) {
    if (
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    ) {
      return;
    }

    if (flippedCards.length >= 2) {
      return;
    }

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      moveCount.textContent = moves;

      const [card1, card2] = flippedCards;
      const emoji1 = card1.dataset.emoji;
      const emoji2 = card2.dataset.emoji;

      if (emoji1 === emoji2) {
        // Match found
        setTimeout(() => {
          card1.classList.add("matched");
          card2.classList.add("matched");
          matchedPairs++;
          pairCount.textContent = `${matchedPairs}/8`;
          flippedCards = [];

          if (matchedPairs === 8) {
            message.textContent = `🎉 Complete! ${moves} moves`;
            message.style.color = "#4CAF50";
            setTimeout(() => closeOverlay("memory"), 2000);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          flippedCards = [];
        }, 1000);
      }
    }
  }
}
