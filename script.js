// Pages
const countdownPage = document.querySelector('#countdown-page');
const splashPage = document.querySelector('#splash-page');
const gamePage = document.querySelector('#game-page');
const scorePage = document.querySelector('#score-page');
// Splash page
const startForm = document.querySelector('#start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown page
const countdown = document.querySelector('.countdown');
// Game page
const itemContainer = document.querySelector('.item-container');
// Score page
const finalTimeEl = document.querySelector('.final-time');
const bestTimeEl = document.querySelector('.best-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
// Equations
let questionAmount = 0;
let equations = [];
let playerGuessArray = [];
let bestScoreArray = [];
// Game page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];
//Scroll
let valueY = 0;
// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('questionAmount', questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

// Navigate from splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
}

// Display game page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Displays 3, 2, 1, go!
function countdownStart() {
  const countdownItems = ['3', '2', '1', 'Go!'];
  countdown.textContent = '3';
  let index = 1;
  let interval = setInterval(() => {
    countdown.textContent = countdownItems[index];
    index++;
    if (index >= countdownItems.length) {
      clearInterval(interval);
      setTimeout(showGamePage, 1000);
    }
  }, 1000);
}

// Get random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create correct/incorrect random equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  //Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('correctEquations', correctEquations);
  console.log('wrongEquations', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = {value: equation, evaluated: 'true'};
    equations.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(wrongFormat.length);
    const equation = wrongFormat[formatChoice];
    equationObject = {value: equation, evaluated: 'false'};
    equations.push(equationObject);
  }
  shuffle(equations);
}

// Add equations to DOM
function equationsToDOM() {
  equations.forEach((equation) => {
    const item = document.createElement('div');
    item.classList.add('item');
    const equationText = document.createElement('h2');
    equationText.textContent = equation.value;
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  //Reset DOM, set blank space above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);
  // Create equations, built elements in DOM
  createEquations();
  equationsToDOM();
  // Set blank space below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Scroll, store user selection in playerGuessArray
function select(guesstedTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return playerGuessArray.push(guesstedTrue ? 'true' : 'false'); 
}

// Start timer when game page is clicked
function startTimer() {
  // Rest times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}
// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}
// Stop timer, process results, go to score page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // Check for wrong guesses, add penalty time
    equations.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct guess, no penalty
      } else {
        // Incorrect guess, add penalty
        penaltyTime += 0.5; 
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }
} 


// Refresh splash page best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    bestScore.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct best score to update
    if (questionAmount == score.questions) {
      // Return best score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update splash page
  bestScoresToDOM();
  // Save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Check local storage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 99, bestScore: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Format and display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  bestTimeEl.textContent = `Base time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: ${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to top, go to score page
  itemContainer.scrollTo({top: 0, behavior: 'instant'});
  showScorePage();
}

// Show score page
function showScorePage() {
  // Show play again button after 1 second delay
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Reset game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equations = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Event listeners
// Switch selected input styling
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove selected label styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input in checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);
itemContainer.addEventListener('scroll', (e) => e.preventDefault());


// On load
getSavedBestScores();