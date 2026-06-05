document.addEventListener('DOMContentLoaded', () => {

  // ── Tab Switch ──
  const tabTimer     = document.getElementById('tab-timer');
  const tabStopwatch = document.getElementById('tab-stopwatch');
  const sectionTimer = document.getElementById('section-timer');
  const sectionSW    = document.getElementById('section-stopwatch');

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

  // ── TIMER ──

  const timerDisplay  = document.getElementById('timer-display');
  const timerProgress = document.getElementById('timer-progress');
  const btnTimerStart = document.getElementById('btn-timer-start');
  const btnTimerReset = document.getElementById('btn-timer-reset');
  const inputHours    = document.getElementById('input-hours');
  const inputMinutes  = document.getElementById('input-minutes');
  const inputSeconds  = document.getElementById('input-seconds');

  let timerInterval  = null;
  let timerTotal     = 0;
  let timerRemaining = 0;
  let timerRunning   = false;

  // ── Format ──
  function formatTimerTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
  }

  // ── Progress ──
  function updateTimerProgress() {
    const pct = timerTotal > 0
      ? (timerRemaining / timerTotal) * 100
      : 100;
    timerProgress.style.width = pct + '%';
  }

  // ── Enable / Disable inputs ──
  function setInputsEditable(editable) {
    inputHours.disabled   = !editable;
    inputMinutes.disabled = !editable;
    inputSeconds.disabled = !editable;

    // visual feedback
    const opacity = editable ? '1' : '0.4';
    inputHours.style.opacity   = opacity;
    inputMinutes.style.opacity = opacity;
    inputSeconds.style.opacity = opacity;
  }

  // ── Input validation ──
  // Clamp values when user leaves input
  inputHours.addEventListener('blur', () => {
    let v = parseInt(inputHours.value) || 0;
    v = Math.min(99, Math.max(0, v));
    inputHours.value = v > 0 ? String(v).padStart(2, '0') : '';
    updateDisplayFromInputs();
  });

  inputMinutes.addEventListener('blur', () => {
    let v = parseInt(inputMinutes.value) || 0;
    v = Math.min(59, Math.max(0, v));
    inputMinutes.value = v > 0 ? String(v).padStart(2, '0') : '';
    updateDisplayFromInputs();
  });

  inputSeconds.addEventListener('blur', () => {
    let v = parseInt(inputSeconds.value) || 0;
    v = Math.min(59, Math.max(0, v));
    inputSeconds.value = v > 0 ? String(v).padStart(2, '0') : '';
    updateDisplayFromInputs();
  });

  // ── Live preview display as user types ──
  inputHours.addEventListener('input', updateDisplayFromInputs);
  inputMinutes.addEventListener('input', updateDisplayFromInputs);
  inputSeconds.addEventListener('input', updateDisplayFromInputs);

  // ── Select all text on focus for easy editing ──
  inputHours.addEventListener('focus', () => inputHours.select());
  inputMinutes.addEventListener('focus', () => inputMinutes.select());
  inputSeconds.addEventListener('focus', () => inputSeconds.select());

  // ── Auto jump to next input ──
  inputHours.addEventListener('keyup', (e) => {
    if (inputHours.value.length >= 2) inputMinutes.focus();
  });

  inputMinutes.addEventListener('keyup', (e) => {
    if (inputMinutes.value.length >= 2) inputSeconds.focus();
  });

  // ── Update display from inputs ──
  function updateDisplayFromInputs() {
    const h = parseInt(inputHours.value)   || 0;
    const m = parseInt(inputMinutes.value) || 0;
    const s = parseInt(inputSeconds.value) || 0;
    timerDisplay.textContent = formatTimerTime(h * 3600 + m * 60 + s);
    timerProgress.style.width = '100%';
  }

  // ── Start / Pause / Resume ──
  function startTimer() {
    if (!timerRunning) {

      // Fresh start — read from inputs
      if (timerRemaining === 0) {
        const h = parseInt(inputHours.value)   || 0;
        const m = parseInt(inputMinutes.value) || 0;
        const s = parseInt(inputSeconds.value) || 0;
        timerTotal     = h * 3600 + m * 60 + s;
        timerRemaining = timerTotal;
      }

      if (timerRemaining <= 0) {
        // Flash inputs to hint user to enter time
        inputHours.style.borderColor   = '#ff4500';
        inputMinutes.style.borderColor = '#ff4500';
        inputSeconds.style.borderColor = '#ff4500';
        setTimeout(() => {
          inputHours.style.borderColor   = '#252528';
          inputMinutes.style.borderColor = '#252528';
          inputSeconds.style.borderColor = '#252528';
        }, 1000);
        return;
      }

      // Disable inputs while running
      setInputsEditable(false);

      timerRunning = true;
      btnTimerStart.textContent = 'Pause';
      btnTimerStart.classList.add('pause');
      timerDisplay.classList.add('running');
      timerDisplay.classList.remove('finished');

      timerInterval = setInterval(() => {
        timerRemaining--;
        timerDisplay.textContent = formatTimerTime(timerRemaining);
        updateTimerProgress();

        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          timerDisplay.classList.remove('running');
          timerDisplay.classList.add('finished');
          timerDisplay.textContent  = '00:00:00';
          timerProgress.style.width = '0%';
          btnTimerStart.textContent = 'Start';
          btnTimerStart.classList.remove('pause');

          // Re-enable inputs after finish
          setInputsEditable(true);
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

  // ── Reset ──
  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning   = false;
    timerRemaining = 0;
    timerTotal     = 0;

    // Clear display
    timerDisplay.textContent  = '00:00:00';
    timerProgress.style.width = '100%';

    // Reset button
    btnTimerStart.textContent = 'Start';
    btnTimerStart.classList.remove('pause');
    timerDisplay.classList.remove('running', 'finished');

    // Clear inputs and re-enable
    inputHours.value   = '';
    inputMinutes.value = '';
    inputSeconds.value = '';
    setInputsEditable(true);

    // Focus hours input for immediate editing
    setTimeout(() => inputHours.focus(), 50);
  }

  btnTimerStart.addEventListener('click', startTimer);
  btnTimerReset.addEventListener('click', resetTimer);

  // ── STOPWATCH ──

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
      <span class="lap-time">
        ${formatSWTime(swElapsed)}.${String(swElapsed % 1000).padStart(3,'0')}
      </span>
    `;
    lapList.prepend(item);
  }

  function resetStopwatch() {
    clearInterval(swInterval);
    swRunning             = false;
    swElapsed             = 0;
    lapCount              = 0;
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

  // ── Init ──
  setInputsEditable(true);
  inputHours.focus();

});