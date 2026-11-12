const IMAGE_PATH = "assets/animals";
const FLIP_BACK_DELAY_MS = 600;
const CORRECT_DELAY_MS = 1400;
const BEST_RECORDS_KEY = "memoryBest";
const PLAYER_KEY = "memoryPlayerName";
const playerNewName = document.getElementById("player-name");

const CARD_NAMES = [
  "bear",
  "dog",
  "fox",
  "leo",
  "monkey",
  "redpanda",
  "sloth",
  "squirrel",
];

const CARD_NAMES_FLOWERS = [
  "sunflower",
  "hortensia",
  "tulip",
  "lilac",
  "camomille",
  "piony",
  "rose",
  "daizy",
];

const gameState = {
  // cards:  createDeck(CARD_NAMES),
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  time: 0,
  startTime: null,
  timerId: null,
  flipBackTimeoutId: null,
  hideTimeoutIds: [],
};

console.log(gameState.cards);

const bestRecords = {
  moves: null,
  time: null,
};

let playerName = "";

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const restartButton = document.getElementById("restart-button");

const bestMovesEl = document.getElementById("best-moves");
const bestTimeEl = document.getElementById("best-time");
const successMovesEl = document.getElementById("success-moves");
const successTimeEl = document.getElementById("success-time");

const welcomeModal = document.getElementById("welcome-modal");
const closeWelcomeButton = document.getElementById("close-welcome-btn");
const welcomeInput = document.getElementById("player-input");
const welcomeForm = document.getElementById("modal-form");

const successModal = document.getElementById("success-modal");
const closeSuccessButton = document.getElementById("close-success-modal");
const playAgainButton = document.getElementById("play-again-btn");

// ## Game setup

function startGame() {
  stopTimer();

  clearTimeout(gameState.flipBackTimeoutId);
  gameState.flipBackTimeoutId = null;

  gameState.hideTimeoutIds.forEach((id) => clearTimeout(id));
  gameState.hideTimeoutIds = [];

  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.moves = 0;
  gameState.time = 0;
  gameState.startTime = null;

  updateMoves();
  updateTime();

  gameState.cards = createDeck(CARD_NAMES);
  // shuffle(gameState.cards);
  renderCards(gameState.cards);
}

function createDeck(names) {
  const cards = [];
  let id = 1;
  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < 2; j++) {
      cards.push({
        id: id++,
        name: names[i],
        isMatched: false,
        isFlipped: true,
        isHidden: false,
      });
    }
  }
  return cards;
}

function shuffle(array) {
  // Randomize the array in place.

  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderCards(cards) {
  board.innerHTML = "";
  cards.forEach((card) => {
    board.appendChild(createCard(card));
  });
}
// <button class="card" data-id="1"
// >
//   <div class="card-inner">
//     <div class="card-front">
//       <img src="assets/animals/bear.svg" />
//     </div>
//     <div class="card-back"></div>
//   </div>
// </button>

function createCard(card) {
  const cardButton = document.createElement("button");
  cardButton.classList.add("card");
  cardButton.setAttribute("data-id", card.id);

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");
  cardButton.appendChild(cardInner);

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");
  cardInner.appendChild(cardFront);

  const cardImage = document.createElement("img");
  cardImage.src = `${IMAGE_PATH}/${card.name}.svg`;
  cardImage.alt = card.name;
  cardFront.appendChild(cardImage);

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  cardInner.appendChild(cardBack);

  updateCardElement(cardButton, card);

  return cardButton;
}

//     card =    {
//   "id": 6,
//   "name": "fox",
//   "isMatched": false,
//   "isFlipped": true,
//   "isHidden": false
// }

function updateCardElement(cardEl, card) {
  cardEl.classList.toggle("flipped", card.isFlipped);
  cardEl.classList.toggle("correct", card.isMatched && !card.isHidden);
  cardEl.classList.toggle("hidden", card.isHidden);
}

function refreshCard(card) {
  // Find the corresponding DOM element and update it.
  const cardEl = document.querySelector(`#board [data-id="${card.id}"]`);

  updateCardElement(cardEl, card);

  console.log(cardEl);
}

// ## Game logic

function handleCardClick(cardEl) {
  const card = gameState.cards.find(function (card) {
    return card.id === parseInt(cardEl.dataset.id);
  });

  if (!card.isFlipped) {
    return;
  }
  if (gameState.flippedCards.length === 2) {
    flipBackWrongCards();
  }
  if (gameState.startTime === null) {
    startTimer();
  }

  card.isFlipped = false;
  updateCardElement(cardEl, card);

  gameState.flippedCards.push(card);

  if (gameState.flippedCards.length === 2) {
    checkPairs();
  }
}

function flipBackWrongCards() {
  // Turn the unmatched cards face down.
  // Clear the relevant timeout and update the state.
  clearTimeout(gameState.flipBackTimeoutId);
  gameState.flipBackTimeoutId = null;
  gameState.flippedCards.forEach(function (card) {
    // card.isFaceUp = false;
    card.isFlipped = true;
    refreshCard(card);
  });
  gameState.flippedCards = [];
}

function updateMoves() {
  movesEl.innerHTML = gameState.moves;
  localStorage.setItem("currentMoves", gameState.moves);
}

function checkPairs() {
  gameState.moves++;
  updateMoves();

  let firstCard = gameState.flippedCards[0];
  let secondCard = gameState.flippedCards[1];

  if (firstCard.name === secondCard.name) {
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    refreshCard(firstCard);
    refreshCard(secondCard);

    gameState.matchedPairs++;
    gameState.flippedCards = [];

    if (gameState.matchedPairs === CARD_NAMES.length) {
      setTimeout(function () {
        finishGame();
      }, CORRECT_DELAY_MS);
    }

    let timeOut = setTimeout(function () {
      firstCard.isHidden = true;
      secondCard.isHidden = true;

      refreshCard(firstCard);
      refreshCard(secondCard);
    }, CORRECT_DELAY_MS);

    gameState.hideTimeoutIds.push(timeOut);
  } else {
    // firstCard.isFlipped = true;
    // secondCard.isFlipped = true;

    gameState.flipBackTimeoutId = setTimeout(
      flipBackWrongCards,
      FLIP_BACK_DELAY_MS
    );
  }

  console.log(firstCard.name, secondCard.name);
  // Count the move and compare the selected cards.
  // Handle matching and nonmatching pairs.
  // Hide matched pairs after a delay.
  // Finish the game when all pairs are found.
}

// function updateMoves() {
//   // let moves = 0;
//   // moves = Math.floor(click / 2);
//   movesEl.innerHTML = gameState.moves;
// }

// Timer

function padStart(value) {
  //Formats numbers to always have at least two digits
  return String(value).padStart(2, "0");
}

function startTimer() {
  // Start tracking elapsed time from the first move.
  // Update the displayed time periodically.

  gameState.startTime = Date.now();
  gameState.timerId = setInterval(function () {
    gameState.time = Math.floor((Date.now() - gameState.startTime) / 1000);

    updateTime();
  }, 1000);

  //I set onclick to the first card, so if you click on it, the timer will begin
  //just for testing purposes
}

function stopTimer() {
  // Stop the timer.

  clearInterval(gameState.timerId);
  gameState.timerId = null;
  //I set onclick to the timer, so if you click on the timer, it will stop.
  //just for testing purposes
  gameState.startTime = null;
}

function formatTime(totalSeconds) {
  // Return the time in mm:ss format.

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${padStart(minutes)}:${padStart(seconds)}`;
}

function updateTime() {
  // Update the time display.
  timeEl.textContent = formatTime(gameState.time);
}

// ## Best records

function loadBest() {
  const savedRecords = localStorage.getItem(BEST_RECORDS_KEY);
  if (savedRecords) {
    const parsedRecords = JSON.parse(savedRecords);
    bestRecords.moves = parsedRecords.moves;
    bestRecords.time = parsedRecords.time;
  }
  updateBest();
}

function handleNewRecord() {
  let recordUpdated = false;

  if (bestRecords.moves === null || gameState.moves < bestRecords.moves) {
    bestRecords.moves = gameState.moves;
    recordUpdated = true;
  }
  if (bestRecords.time === null || gameState.time < bestRecords.time) {
    bestRecords.time = gameState.time;
    recordUpdated = true;
  }
  if (recordUpdated) {
    localStorage.setItem(BEST_RECORDS_KEY, JSON.stringify(bestRecords));
  }
  updateBest();
}

function updateBest() {
  bestMovesEl.textContent =
    bestRecords.moves !== null ? bestRecords.moves : "-";
  bestTimeEl.textContent =
    bestRecords.time !== null ? formatTime(bestRecords.time) : "-";
}

function openModal(modalEl) {
  if (modalEl) modalEl.classList.add("open-modal");
}

function closeModal(modalEl) {
  if (modalEl) {
    modalEl.classList.remove("open-modal");
    if (modalEl === successModal) {
      startGame();
    }
  }
}

function loadPlayerName() {
  return localStorage.getItem(PLAYER_KEY);
}

function savePlayerName(name) {
  localStorage.setItem(PLAYER_KEY, name);
}

function showWelcomeModal() {
  if (welcomeInput) welcomeInput.value = playerName;
  openModal(welcomeModal);
  if (welcomeInput) welcomeInput.focus();
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const name = welcomeInput.value.trim();
  if (name !== playerName) {
    startGame();
    savePlayerName(name);
    playerName = name;
    if (playerNewName) playerNewName.textContent = name;
  }

  closeModal(welcomeModal);
}

function handlePlayerNameClick() {
  showWelcomeModal();
}

function finishGame() {
  stopTimer();
  handleNewRecord();
  showSuccessModal();
}

function showSuccessModal() {
  const successHeader = document.getElementById("success-modal-header-p");

  if (successHeader)
    successHeader.textContent = `Congratulations ${playerName}!`;

  if (successMovesEl) successMovesEl.textContent = gameState.moves;
  if (successTimeEl) successTimeEl.textContent = formatTime(gameState.time);

  openModal(successModal);
}

function initEventListeners() {
  // Welcome modal close button
  if (closeWelcomeButton) {
    closeWelcomeButton.addEventListener("click", () => {
      closeModal(welcomeModal);
    });
  }

  // Welcome form
  if (welcomeForm) {
    welcomeForm.addEventListener("submit", handleWelcomeSubmit);
  }

  // Player name button
  if (playerNewName) {
    playerNewName.addEventListener("click", handlePlayerNameClick);
  }

  // Success modal close button
  if (closeSuccessButton) {
    closeSuccessButton.addEventListener("click", () => {
      closeModal(successModal);
    });
  }

  // Play again button
  if (playAgainButton) {
    playAgainButton.addEventListener("click", () => {
      closeModal(successModal);
    });
  }

  // Restart button
  if (restartButton) {
    restartButton.addEventListener("click", startGame);
  }

  // Click on success modal background
  if (successModal) {
    successModal.addEventListener("click", (event) => {
      if (event.target === successModal) {
        closeModal(successModal);
      }
    });
  }

  // Click on welcome modal background
  if (welcomeModal) {
    welcomeModal.addEventListener("click", (event) => {
      if (event.target === welcomeModal) {
        closeModal(welcomeModal);
      }
    });
  }
  // Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(welcomeModal);
      closeModal(successModal);
    }
  });

  // Memory cards (event delegation)
  if (board) {
    board.addEventListener("click", (event) => {
      const cardEl = event.target.closest(".card");

      if (!cardEl || !board.contains(cardEl)) return;

      handleCardClick(cardEl);
    });
  }
}

function init() {
  startGame();
  loadBest();
  initEventListeners();

  const savedName = loadPlayerName();

  if (!savedName) {
    showWelcomeModal();
  } else {
    playerName = savedName;

    if (playerNewName) {
      playerNewName.textContent = savedName;
    }
  }
}

init();
