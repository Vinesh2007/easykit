const timerDisplay = document.getElementById('timerDisplay');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let totalSeconds = 0;
let isRunning = false;
let timerInterval = null;

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);

function start() {
  if (isRunning) return;
  
  if (totalSeconds === 0) {
    const h = parseInt(hoursInput.value) || 0;
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;
    totalSeconds = h * 3600 + m * 60 + s;
  }
  
  if (totalSeconds <= 0) {
    alert('Please enter a valid time');
    return;
  }
  
  isRunning = true;
  hoursInput.disabled = true;
  minutesInput.disabled = true;
  secondsInput.disabled = true;
  
  timerInterval = setInterval(() => {
    totalSeconds--;
    updateDisplay();
    
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      alert('Time is up!');
      reset();
    }
  }, 1000);
}

function pause() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
}

function reset() {
  isRunning = false;
  clearInterval(timerInterval);
  totalSeconds = 0;
  hoursInput.disabled = false;
  minutesInput.disabled = false;
  secondsInput.disabled = false;
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  updateDisplay();
}

function updateDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  timerDisplay.textContent = 
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
