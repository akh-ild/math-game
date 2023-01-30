// Pages
const countdownPage = document.querySelector('#countdown-page');
const splashPage = document.querySelector('#splash-page');
const gamePage = document.querySelector('#game-page');

// Splash page
const startForm = document.querySelector('#start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');

// Countdown page
const countdown = document.querySelector('.countdown');
// Game page
const itemContainer = document.querySelector('.item-container');

// Equations
let questionAmount = 0;
let equations = [];
let playerGuessArray = [];

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
let finalTimeDisplay = '0.0s';

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

// Event listeners
startForm.addEventListener('submit', selectQuestionAmount);

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
  setTimeout(showGamePage, 400);
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
  console.log('player guess array:' , playerGuessArray);
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return playerGuessArray.push(guesstedTrue ? 'true' : 'false'); 
}