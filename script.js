// Pages
const countdownPage = document.querySelector('#countdown-page');
const splashPage = document.querySelector('#splash-page');

// Splash page
const startForm = document.querySelector('#start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');

// Countdown page
const countdown = document.querySelector('.countdown');

let questionAmount = 0;

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
}

// Displays 3, 2, 1, go!
function countdownStart() {
  const countdownItems = ['3', '2', '1', 'Go!'];
  countdown.textContent = '3';
  let index = 1;
  let x = setInterval(() => {
    countdown.textContent = countdownItems[index];
    index++;
    if (index >= countdownItems.length) {
      clearInterval(x);
    }
  }, 1000);
}