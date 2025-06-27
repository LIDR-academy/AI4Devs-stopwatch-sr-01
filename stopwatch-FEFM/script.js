// Utility to format time
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const millis = String(ms % 1000).padStart(3, '0');
  return { minutes, seconds, millis };
}

const timersContainer = document.getElementById('timers-container');
const addTimerBtn = document.getElementById('add-timer-btn');
const alertSound = document.getElementById('alert-sound');

let timerIdCounter = 0;

function createTimer() {
  timerIdCounter++;
  const timerId = 'timer-' + timerIdCounter;

  // Timer state
  let mode = 'stopwatch'; // or 'countdown'
  let running = false;
  let interval = null;
  let startTimestamp = null;
  let elapsed = 0;
  let countdownTarget = 0;

  // Timer elements
  const timerDiv = document.createElement('div');
  timerDiv.className = 'timer';
  timerDiv.id = timerId;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Delete Timer';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.onclick = () => {
    if (interval) clearInterval(interval);
    timerDiv.remove();
  };
  timerDiv.appendChild(deleteBtn);

  // Mode select
  const modeSelect = document.createElement('select');
  modeSelect.className = 'mode-select';
  const opt1 = document.createElement('option');
  opt1.value = 'stopwatch';
  opt1.textContent = 'Stopwatch';
  const opt2 = document.createElement('option');
  opt2.value = 'countdown';
  opt2.textContent = 'Countdown';
  modeSelect.appendChild(opt1);
  modeSelect.appendChild(opt2);
  timerDiv.appendChild(modeSelect);

  // Set time input (for countdown)
  const setTimeInput = document.createElement('input');
  setTimeInput.className = 'set-time';
  setTimeInput.type = 'text';
  setTimeInput.placeholder = 'mm:ss or mm:ss:ms';
  setTimeInput.style.display = 'none';
  timerDiv.appendChild(setTimeInput);

  // Display
  const display = document.createElement('div');
  display.className = 'display';
  display.innerHTML = '00:00:00 <span class="millis">000</span>';
  timerDiv.appendChild(display);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'timer-controls';

  const startBtn = document.createElement('button');
  startBtn.className = 'timer-btn start-btn';
  startBtn.textContent = 'Start';

  const clearBtn = document.createElement('button');
  clearBtn.className = 'timer-btn clear-btn';
  clearBtn.textContent = 'Clear';

  controls.appendChild(startBtn);
  controls.appendChild(clearBtn);
  timerDiv.appendChild(controls);

  // Add to DOM
  timersContainer.appendChild(timerDiv);

  // --- Logic ---
  function updateDisplay(ms) {
    const { minutes, seconds, millis } = formatTime(ms);
    display.innerHTML = `00:${minutes}:${seconds} <span class="millis">${millis}</span>`;
  }

  function setToCountdownInput() {
    setTimeInput.style.display = '';
    updateDisplay(countdownTarget);
  }

  function setToStopwatchInput() {
    setTimeInput.style.display = 'none';
    updateDisplay(elapsed);
  }

  function startTimer() {
    if (running) return;
    running = true;
    startBtn.textContent = 'Pause';
    startTimestamp = Date.now();
    if (mode === 'stopwatch') {
      interval = setInterval(() => {
        const now = Date.now();
        updateDisplay(elapsed + (now - startTimestamp));
      }, 31);
    } else {
      interval = setInterval(() => {
        const now = Date.now();
        let remaining = countdownTarget - (now - startTimestamp + elapsed);
        if (remaining < 0) remaining = 0;
        updateDisplay(remaining);
        if (remaining === 0) {
          clearInterval(interval);
          running = false;
          startBtn.textContent = 'Start';
          showNotification('Countdown finished!');
          alertSound.currentTime = 0;
          alertSound.play();
        }
      }, 31);
    }
  }

  function pauseTimer() {
    if (!running) return;
    running = false;
    startBtn.textContent = 'Start';
    clearInterval(interval);
    if (mode === 'stopwatch') {
      elapsed += Date.now() - startTimestamp;
    } else {
      elapsed += Date.now() - startTimestamp;
    }
  }

  function clearTimer() {
    clearInterval(interval);
    running = false;
    startBtn.textContent = 'Start';
    elapsed = 0;
    startTimestamp = null;
    if (mode === 'stopwatch') {
      updateDisplay(0);
    } else {
      updateDisplay(countdownTarget);
    }
  }

  function showNotification(msg) {
    alert(msg);
  }

  // --- Event Listeners ---
  startBtn.onclick = () => {
    if (!running) {
      startTimer();
    } else {
      pauseTimer();
    }
  };

  clearBtn.onclick = () => {
    clearTimer();
  };

  modeSelect.onchange = () => {
    mode = modeSelect.value;
    clearTimer();
    elapsed = 0;
    if (mode === 'countdown') {
      setToCountdownInput();
    } else {
      setToStopwatchInput();
    }
  };

  setTimeInput.onchange = () => {
    // Parse mm:ss or mm:ss:ms
    const val = setTimeInput.value.trim();
    let mm = 0, ss = 0, ms = 0;
    if (/^\d{1,2}:\d{2}:\d{1,3}$/.test(val)) {
      // mm:ss:ms
      [mm, ss, ms] = val.split(':').map(Number);
    } else if (/^\d{1,2}:\d{2}$/.test(val)) {
      // mm:ss
      [mm, ss] = val.split(':').map(Number);
      ms = 0;
    } else {
      setTimeInput.value = '';
      return;
    }
    countdownTarget = mm * 60000 + ss * 1000 + ms;
    elapsed = 0;
    updateDisplay(countdownTarget);
  };

  // Initialize
  updateDisplay(0);
}

addTimerBtn.onclick = () => {
  createTimer();
};

// Create the first timer by default
createTimer();
