document.addEventListener('DOMContentLoaded', () => {

  // ── Elements ──
  const tabTimer      = document.getElementById('tab-timer');
  const tabStopwatch  = document.getElementById('tab-stopwatch');
  const sectionTimer  = document.getElementById('section-timer');
  const sectionSW     = document.getElementById('section-stopwatch');

  // ── Tab Switch ──
  tabTimer.addEventListener('click', () => {
    tabTimer.classList.add('active');
    tabStopwatch.classList.remove('active');
    sectionTimer.classList.remove('hidden');
    sectionSW.classList.add('hidden');
  });

  tabStopwatch.addEventListener('click', () => {
    tabStopwatch.classList.add('active');
    tabTimer.classList.remove('active');
    sectionSW.classList.remove('hidden');
    sectionTimer.classList.add('hidden');
  });

  // ════════════════════════════
  // ── TIMER ──
  // ════════════════════════════
  const timerDisplay  = document.getElementById('timer-display');
  const timerProgress = document.getElementById('timer-progress');
  const btnTimerStart = document.getElementById('btn-timer-start');
  const btnTimerReset = document.getElementById('btn-timer-reset');
  const inputHours    = document.getElementById('input-hours');
  const inputMinutes  = document.getElementById('input-minutes');
  const inputSeconds  = document.getElementById('input-seconds');

  let timerInterval   = null;
  let timerTotal      = 0;
  let timerRemaining  = 0;
  let timerRunning    = false;

  function formatTimerTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
  }

  function updateTimerProgress() {
    const pct = timerTotal > 0
      ? (timerRemaining / timerTotal) * 100
      : 100;
    timerProgress.style.width = pct + '%';
  }

  function startTimer() {
    if (!timerRunning) {
      // Fresh start
      if (timerRemaining === 0) {
        const h = parseInt(inputHours.value)   || 0;
        const m = parseInt(inputMinutes.value) || 0;
        const s = parseInt(inputSeconds.value) || 0;
        timerTotal     = h * 3600 + m * 60 + s;
        timerRemaining = timerTotal;
      }
      if (timerRemaining <= 0) return;

      timerRunning = true;
      btnTimerStart.textContent = 'Pause';
      btnTimerStart.classList.add('pause');
      timerDisplay.classList.add('running');

      timerInterval = setInterval(() => {
        timerRemaining--;
        timerDisplay.textContent = formatTimerTime(timerRemaining);
        updateTimerProgress();

        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          timerDisplay.classList.remove('running');
          timerDisplay.classList.add('finished');
          timerDisplay.textContent = '00:00:00';
          btnTimerStart.textContent = 'Start';
          btnTimerStart.classList.remove('pause');
          timerProgress.style.width = '0%';
        }
      }, 1000);

    } else {
      // Pause
      clearInterval(timerInterval);
      timerRunning = false;
      btnTimerStart.textContent = 'Resume';
      btnTimerStart.classList.remove('pause');
      timerDisplay.classList.remove('running');
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning   = false;
    timerRemaining = 0;
    timerTotal     = 0;
    timerDisplay.textContent  = '00:00:00';
    timerProgress.style.width = '100%';
    btnTimerStart.textContent = 'Start';
    btnTimerStart.classList.remove('pause');
    timerDisplay.classList.remove('running', 'finished');
    inputHours.value   = '';
    inputMinutes.value = '';
    inputSeconds.value = '';
  }

  btnTimerStart.addEventListener('click', startTimer);
  btnTimerReset.addEventListener('click', resetTimer);

  // ════════════════════════════
  // ── STOPWATCH ──
  // ════════════════════════════
  const swDisplay  = document.getElementById('stopwatch-display');
  const msDisplay  = document.getElementById('ms-display');
  const btnSwStart = document.getElementById('btn-sw-start');
  const btnSwLap   = document.getElementById('btn-sw-lap');
  const btnSwReset = document.getElementById('btn-sw-reset');
  const lapList    = document.getElementById('lap-list');

  let swInterval  = null;
  let swRunning   = false;
  let swStartTime = 0;
  let swElapsed   = 0;
  let lapCount    = 0;

  function formatSWTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
  }

  function startStopwatch() {
    if (!swRunning) {
      swRunning   = true;
      swStartTime = Date.now() - swElapsed;
      btnSwStart.textContent = 'Pause';
      btnSwStart.classList.add('pause');
      swDisplay.classList.add('running');

      swInterval = setInterval(() => {
        swElapsed = Date.now() - swStartTime;
        swDisplay.textContent = formatSWTime(swElapsed);
        msDisplay.textContent = '.' + String(swElapsed % 1000).padStart(3, '0');
      }, 50);

    } else {
      clearInterval(swInterval);
      swRunning = false;
      btnSwStart.textContent = 'Resume';
      btnSwStart.classList.remove('pause');
      swDisplay.classList.remove('running');
    }
  }

  function lapStopwatch() {
    if (!swRunning) return;
    lapCount++;
    const item = document.createElement('div');
    item.className = 'lap-item';
    item.innerHTML = `
      <span class="lap-label">Lap ${lapCount}</span>
      <span class="lap-time">${formatSWTime(swElapsed)}.${String(swElapsed % 1000).padStart(3,'0')}</span>
    `;
    lapList.prepend(item);
  }

  function resetStopwatch() {
    clearInterval(swInterval);
    swRunning   = false;
    swElapsed   = 0;
    lapCount    = 0;
    swDisplay.textContent = '00:00:00';
    msDisplay.textContent = '.000';
    lapList.innerHTML     = '';
    btnSwStart.textContent = 'Start';
    btnSwStart.classList.remove('pause');
    swDisplay.classList.remove('running');
  }

  btnSwStart.addEventListener('click', startStopwatch);
  btnSwLap.addEventListener('click', lapStopwatch);
  btnSwReset.addEventListener('click', resetStopwatch);

  // ── Back Button ──
  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

});