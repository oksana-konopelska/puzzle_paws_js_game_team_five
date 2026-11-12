const IMAGE_PATH = "assets/animals";
const FLIP_BACK_DELAY_MS = 600;
const CORRECT_DELAY_MS = 1400;
const BEST_RECORDS_KEY = "memoryBest";
const PLAYER_KEY = "memoryPlayerName";

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

const gameState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  time: 0,
  startTime: null,
  timerId: null,
  flipBackTimeoutId: null,
  hideTimeoutIds: [],
  finishTimeoutId: null,
};

const bestRecords = {
  moves: null,
  time: null,
};

let playerName = "";

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const restartButton = document.getElementById("restart-button");
const playerNewName = document.getElementById("player-name");

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

function startGame() {
  stopTimer();

  clearTimeout(gameState.flipBackTimeoutId);
  gameState.flipBackTimeoutId = null;

  gameState.hideTimeoutIds.forEach((id) => clearTimeout(id));
  gameState.hideTimeoutIds = [];

  clearTimeout(gameState.finishTimeoutId);
  gameState.finishTimeoutId = null;

  gameState.flippedCards = [];
  gameState.matchedPairs = 0;
  gameState.moves = 0;
  gameState.time = 0;
  gameState.startTime = null;

  updateMoves();
  updateTime();

  gameState.cards = createDeck(CARD_NAMES);
  shuffle(gameState.cards);
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

function updateCardElement(cardEl, card) {
  cardEl.classList.toggle("flipped", card.isFlipped);
  cardEl.classList.toggle("correct", card.isMatched && !card.isHidden);
  cardEl.classList.toggle("hidden", card.isHidden);
}

function refreshCard(card) {
  const cardEl = document.querySelector(`#board [data-id="${card.id}"]`);
  updateCardElement(cardEl, card);
}

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
  clearTimeout(gameState.flipBackTimeoutId);
  gameState.flipBackTimeoutId = null;
  gameState.flippedCards.forEach(function (card) {
    card.isFlipped = true;
    refreshCard(card);
  });
  gameState.flippedCards = [];
}

function updateMoves() {
  movesEl.textContent = gameState.moves;
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
      stopTimer();
      gameState.finishTimeoutId = setTimeout(function () {
        finishGame();
      }, CORRECT_DELAY_MS);
    }

    const timeOut = setTimeout(function () {
      firstCard.isHidden = true;
      secondCard.isHidden = true;

      refreshCard(firstCard);
      refreshCard(secondCard);
    }, CORRECT_DELAY_MS);

    gameState.hideTimeoutIds.push(timeOut);
  } else {
    gameState.flipBackTimeoutId = setTimeout(
      flipBackWrongCards,
      FLIP_BACK_DELAY_MS
    );
  }
}

function padStart(value) {
  return String(value).padStart(2, "0");
}

function startTimer() {
  gameState.startTime = Date.now();
  gameState.timerId = setInterval(function () {
    gameState.time = Math.floor((Date.now() - gameState.startTime) / 1000);

    updateTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(gameState.timerId);
  gameState.timerId = null;
  gameState.startTime = null;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${padStart(minutes)}:${padStart(seconds)}`;
}

function updateTime() {
  timeEl.textContent = formatTime(gameState.time);
}

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

function loadPlayerName() {
  return localStorage.getItem(PLAYER_KEY);
}

function savePlayerName(name) {
  localStorage.setItem(PLAYER_KEY, name);
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

function showWelcomeModal() {
  if (welcomeInput) welcomeInput.value = playerName;
  openModal(welcomeModal);
  if (welcomeInput) welcomeInput.focus();
}

function showSuccessModal() {
  const successHeader = document.getElementById("success-modal-header-p");

  if (successHeader)
    successHeader.textContent = `Congratulations ${playerName}!`;

  if (successMovesEl) successMovesEl.textContent = gameState.moves;
  if (successTimeEl) successTimeEl.textContent = formatTime(gameState.time);

  openModal(successModal);
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
  loadBest();
  handleNewRecord();
  showSuccessModal();
}

function initEventListeners() {
  if (playerNewName) {
    playerNewName.addEventListener("click", handlePlayerNameClick);
  }

  if (restartButton) {
    restartButton.addEventListener("click", startGame);
  }

  if (closeWelcomeButton) {
    closeWelcomeButton.addEventListener("click", () => {
      closeModal(welcomeModal);
    });
  }

  if (welcomeModal) {
    welcomeModal.addEventListener("click", (event) => {
      if (event.target === welcomeModal) {
        closeModal(welcomeModal);
      }
    });
  }

  if (welcomeForm) {
    welcomeForm.addEventListener("submit", handleWelcomeSubmit);
  }

  if (closeSuccessButton) {
    closeSuccessButton.addEventListener("click", () => {
      closeModal(successModal);
    });
  }

  if (playAgainButton) {
    playAgainButton.addEventListener("click", () => {
      closeModal(successModal);
    });
  }

  if (successModal) {
    successModal.addEventListener("click", (event) => {
      if (event.target === successModal) {
        closeModal(successModal);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(welcomeModal);
      closeModal(successModal);
    }
  });

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
