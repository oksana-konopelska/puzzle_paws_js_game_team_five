

const IMAGE_PATH = "assets/animals";
const FLIP_BACK_DELAY_MS = 600;
const CORRECT_DELAY_MS = 1000;
const STORAGE_KEY = "memoryBest";
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

console.log(gameState.cards)

const bestRecords = {
  moves: null,
  time: null,
};

let playerName = "";

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");

const bestMovesEl = document.getElementById("best-moves");
const bestTimeEl = document.getElementById("best-time");

// modal variable
const welcomeModal = document.getElementById("welcome-modal");

const closeWelcomeButton = document.getElementById("close-welcome-btn");

// ## Game setup

function startGame() {
  // Start a new game or restart the current one.
  // Reset game state and cancel pending timers.
  // Create, shuffle and render a new deck.
  // Keep the saved best records.
  gameState.cards = shuffle(CARD_NAMES);

}


function createDeck(names) {
  const cards = [];
  let id = 1;
  for(let i = 0; i < names.length; i++){
   
    for (let j = 0; j < 2; j++){
      cards.push({id: id++, name: names[i], isMatched: false, isFlipped: false, isHidden: false });
    }
  }
  return cards;
}

function shuffle(array) {
  // Randomize the array in place.
}

// ## Cards and rendering

function renderCards(cards) {
  // Render the cards on the board.
}

function createCard(card) {
  // Create a card element with its image and back.
  // Set its ID and initial appearance.
  // Return the element.
}

function updateCardElement(cardEl, card) {
  // Update the card's CSS classes based on its state.
}

function refreshCard(card) {
  // Find the corresponding DOM element and update it.
}

// ## Game logic

function handleCardClick(cardEl) {
  // Handle a player's click on a card.
  // Follow the game rules and check pairs when appropriate.
}

function flipBackWrongCards() {
  // Turn the unmatched cards face down.
  // Clear the relevant timeout and update the state.
}

function checkPairs() {
  // Count the move and compare the selected cards.
  // Handle matching and nonmatching pairs.
  // Hide matched pairs after a delay.
  // Finish the game when all pairs are found.
}

function updateMoves() {
  // Update the moves display.
}

// ## Timer

function startTimer() {
  // Start tracking elapsed time from the first move.
  // Update the displayed time periodically.
}

function stopTimer() {
  // Stop the timer.
}

function formatTime(totalSeconds) {
  // Return the time in mm:ss format.
}

function updateTime() {
  // Update the time display.
}

// ## Best records

function loadBest() {
  // Load saved records from localStorage.
  // Handle missing or invalid saved data.
}

function handleNewRecord() {
  // Update and save records when a better result is achieved.
}

function updateBest() {
  // Display the best moves and time, or "-" if no record exists.
}

// ## Game completion and initialization

function finishGame() {
  // Stop the timer and finalize elapsed time.
  // Display the success message and handle the final records.
}

function init() {
  // show this modal when the window loads for the first time
  showWelcomeModal();
  startGame(); 
  welcomeModal.addEventListener('click', closeWelcomeModal);
  document.addEventListener('keydown', closeWelcomeModal);

  // Load saved records.
  // Register event listeners.
  // Start the game.
  
}

init();

// Build loadPlayerName(), savePlayerName(name), showWelcomeModal(), closeWelcomeModal(), handleWelcomeSubmit(event)

// loadPlayerName();

// savePlayerName(name);

function showWelcomeModal() {
  // show welcome
  // grab the modal by id
  // change the visibility to visible
  welcomeModal.classList.add("open-modal");
}

function closeWelcomeModal(event) {
  // change the welcome modal visibility to hidden
  console.log(event.key);
  if (event.target === welcomeModal || event.target === closeWelcomeButton || event.key === 'Escape') {
    welcomeModal.classList.remove("open-modal");
  }

}



// showStatsModal();

// closeStatsModal();

// handleWelcomeSubmit(event) {

// };
