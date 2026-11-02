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

const IMAGE_PATH = "assets/animals";
const FLIP_BACK_DELAY_MS = 600;
const CORRECT_DELAY_MS = 1000;
const STORAGE_KEY = "memoryBest";
const PLAYER_KEY = "memoryPlayerName";

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
};

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


function startGame() {
  // (this is also the Restart action, so it resets everything except the records)
  // 1. stop every waiting timer of the old game:
  //      clearTimeout(gameState.flipBackTimeoutId), then flipBackTimeoutId = null
  //      for each id in gameState.hideTimeoutIds -> clearTimeout(id)
  //      hideTimeoutIds = []
  // 2. stopTimer() stop the stopwatch
  // 3. reset: flippedCards = [], matchedPairs = 0, moves = 0, time = 0, startTime = null
  // 4. gameState.cards = createDeck(CARD_NAMES), then shuffle(gameState.cards)
  // 5. hide the success block: successBlock.classList.add("hidden")
  // 6. renderCards(gameState.cards), updateBest()
}

function createDeck(names) {
  // deck = [], nextId = 1
  // for each name in names, do it 2 times:
  //   push { id: nextId, name, isFaceUp: false, isMatched: false, isHidden: false }
  //   nextId goes up by 1
  // return deck
}

function shuffle(array) {
  // Fisher-Yates, changes the array itself)
  // loop i from the last index down to 1:
  //   j = random whole number from 0 to i
  //   swap array[i] and array[j]
}

function renderCards(cards) {
  // empty the board (board.innerHTML = "")
  // for each card -> board.append( createCard(card) )
}

function createCard(card) {
  // create a <div class="card">, set dataset.id = card.id
  // inside it: .card-inner > .card-front (an <img> src IMAGE_PATH/name.webp, alt = name)
  //                        > .card-back
  // updateCardElement(cardEl, card)
  // return cardEl
}

function updateCardElement(cardEl, card) {
  // (classList.toggle(className, trueOrFalse))
  // "flipped" is ON when the card is NOT face up      (in the CSS: .flipped = back is showing)
  // "correct" is ON when isMatched AND NOT isHidden
  // "hidden"  is ON when isHidden
}

function refreshCard(card) {
  // cardEl = the element in the board with data-id equal to card.id
  //          careful: the id needs quotes in the selector:  [data-id="3"]
  // updateCardElement(cardEl, card)
}

function handleCardClick(cardEl) {
  // card = the card in gameState.cards whose id equals Number(cardEl.dataset.id)   (use find)
  // if card.isFaceUp -> return        (already open; matched and hidden cards are always face up)
  // if gameState.flippedCards.length === 2 -> flipBackWrongCards()     (the 3rd click)
  // if gameState.startTime === null -> startTimer()                    (first click of the game)
  // card.isFaceUp = true
  // add card to gameState.flippedCards
  // refreshCard(card)
  // if gameState.flippedCards.length === 2 -> checkPairs()
}

function flipBackWrongCards() {
  // (called by the waiting timer AND by a click on a 3rd card)
  // clearTimeout(gameState.flipBackTimeoutId), then flipBackTimeoutId = null
  // for each card in gameState.flippedCards: isFaceUp = false, refreshCard(card)
  // gameState.flippedCards = []
}

function checkPairs() {
  // moves goes up by 1, updateMoves()
  // first = gameState.flippedCards[0], second = gameState.flippedCards[1]
  //
  // IF first.name === second.name   (a right pair)
  //   for both cards: isMatched = true, refreshCard(card)      ("correct" shows now)
  //   matchedPairs goes up by 1
  //   gameState.flippedCards = []                              (the player can keep playing)
  //   id = setTimeout(function, CORRECT_DELAY_MS), and inside the function:
  //        for both cards: isHidden = true, refreshCard(card)  ("correct" goes, "hidden" comes)
  //        if EVERY card in gameState.cards is hidden -> finishGame()
  //   add id to gameState.hideTimeoutIds
  //
  // ELSE   (a wrong pair)
  //   leave the 2 cards in flippedCards (that blocks new clicks)
  //   gameState.flipBackTimeoutId = setTimeout(flipBackWrongCards, FLIP_BACK_DELAY_MS)
}

function updateMoves() {
  // movesEl <- gameState.moves
}

function startTimer() {
  // gameState.startTime = Date.now()
  // gameState.timerId = setInterval(function, 250), and inside the function:
  //    gameState.time = whole seconds since startTime   ((Date.now() - startTime) / 1000, rounded down)
  //    updateTime()
}

function stopTimer() {
  // clearInterval(gameState.timerId), then timerId = null
}

function formatTime(totalSeconds) {
  // return "mm:ss", for example 75 -> "01:15"    (padStart(2, "0") helps)
}

function updateTime() {
  // timeEl <- formatTime(gameState.time)
}

function loadBest() {
  // try: text = localStorage.getItem(STORAGE_KEY), saved = JSON.parse(text)
  //      if saved exists -> bestRecords = saved
  // catch: do nothing (keep the empty records)
  // updateBest()
}

function handleNewRecord() {
  // (LOWER is better for both records)
  // if any record was beaten -> localStorage.setItem(STORAGE_KEY, JSON.stringify(bestRecords))
  // updateBest()
}

function updateBest() {
  // bestMovesEl, bestTimeEl <- the records, or "-" when the record is null
}

function finishGame() {
  // 1. stopTimer()                         stop the stopwatch FIRST
  // 2. gameState.time = whole seconds from startTime until now
  // 3. show the success modal: successModal.classList.remove("hidden")
}

function init() {
  loadBest();
  // board.addEventListener("click", function (event) { ... }), and inside:
  //     cardEl = event.target.closest(".card")        (the click may hit a child element)
  //     if there is no cardEl -> return
  //     handleCardClick(cardEl)
  // restartButton.addEventListener("click", startGame)
  // startGame()
}

init();
