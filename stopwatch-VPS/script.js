function showView(view) {
  document.querySelector('.menu').classList.add('hidden');
  document.querySelector('.stopwatch').classList.add('hidden');
  document.querySelector('.timer').classList.add('hidden');
  document.querySelector('.' + view).classList.remove('hidden');

  if (view === 'stopwatch' && document.querySelectorAll('.stopwatch-instance').length === 0) {
    addStopwatch();
  } else if (view === 'timer' && document.querySelectorAll('.timer-instance').length === 0) {
    addTimer();
  }
}

// ========== STOPWATCH ==========

let stopwatchCount = 0;
function addStopwatch() {
  const container = document.getElementById('stopwatchContainer');
  const id = `stopwatch-${++stopwatchCount}`;
  const div = document.createElement('div');
  div.className = 'instance stopwatch-instance';
  div.id = id;

  let time = 0, running = false, interval;

  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'time-display';
  timeDisplay.innerText = "00:00:00:000";

  const startBtn = document.createElement('button');
  startBtn.className = 'button green';
  startBtn.textContent = 'Start';
  startBtn.onclick = () => {
    if (running) {
      clearInterval(interval);
      startBtn.textContent = 'Start';
    } else {
      const startTime = Date.now() - time;
      interval = setInterval(() => {
        time = Date.now() - startTime;
        timeDisplay.innerText = formatTime(time);
      }, 10);
      startBtn.textContent = 'Pause';
    }
    running = !running;
  };

  const resetBtn = document.createElement('button');
  resetBtn.className = 'button red';
  resetBtn.textContent = 'Clear';
  resetBtn.onclick = () => {
    clearInterval(interval);
    time = 0;
    running = false;
    startBtn.textContent = 'Start';
    timeDisplay.innerText = "00:00:00:000";
  };

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.innerText = '×';
  delBtn.onclick = () => {
    div.remove();
    updateDeleteButtons('stopwatch-instance');
  };

  div.append(timeDisplay, startBtn, resetBtn);
  if (container.children.length > 0) div.appendChild(delBtn);
  container.appendChild(div);
  updateDeleteButtons('stopwatch-instance');
}

// ========== TIMER ==========

let timerCount = 0;
function addTimer() {
  const container = document.getElementById('timerContainer');
  const id = `timer-${++timerCount}`;
  const div = document.createElement('div');
  div.className = 'instance timer-instance';
  div.id = id;

  let input = "", duration = 0, remaining = 0;
  let interval, running = false, paused = false;

  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'time-display';
  timeDisplay.innerText = "00:00:00:000";

  const keypad = document.createElement('div');
  keypad.className = 'keypad';
  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.onclick = () => {
      if (input.length < 6) {
        input += i.toString();
        updateInputDisplay();
      }
    };
    keypad.appendChild(btn);
  }

  function updateInputDisplay() {
    const padded = input.padStart(6, '0');
    const h = padded.slice(0, 2), m = padded.slice(2, 4), s = padded.slice(4, 6);
    timeDisplay.innerText = `${h}:${m}:${s}:000`;
  }

  const setBtn = document.createElement('button');
  setBtn.className = 'button green';
  setBtn.innerText = 'Set';
  setBtn.onclick = () => {
    const padded = input.padStart(6, '0');
    const h = +padded.slice(0, 2), m = +padded.slice(2, 4), s = +padded.slice(4, 6);
    duration = ((h * 3600) + (m * 60) + s) * 1000;
    remaining = duration;
    updateInputDisplay();
  };

  const startBtn = document.createElement('button');
  startBtn.className = 'button green';
  startBtn.innerText = 'Start';
  startBtn.onclick = () => {
    if (!running && paused && remaining > 0) {
      startCountdown(Date.now() + remaining);
      paused = false;
      running = true;
      startBtn.innerText = 'Pause';
    } else if (running) {
      clearInterval(interval);
      running = false;
      paused = true;
      startBtn.innerText = 'Start';
    } else if (remaining > 0) {
      startCountdown(Date.now() + remaining);
      running = true;
      paused = false;
      startBtn.innerText = 'Pause';
    }
  };

  function startCountdown(endTime) {
    clearInterval(interval);
    interval = setInterval(() => {
      remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        running = false;
        paused = false;
        remaining = 0;
        timeDisplay.innerText = "00:00:00:000";
        startBtn.innerText = "Start";
        document.getElementById('alarmSound').play();
        alert("¡Temporizador finalizado!");
      } else {
        timeDisplay.innerText = formatTime(remaining);
      }
    }, 10);
  }

  const clearBtn = document.createElement('button');
  clearBtn.className = 'button gray';
  clearBtn.innerText = 'Clear';
  clearBtn.onclick = () => {
    clearInterval(interval);
    input = "";
    duration = 0;
    remaining = 0;
    running = false;
    paused = false;
    startBtn.innerText = 'Start';
    timeDisplay.innerText = "00:00:00:000";
  };

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.innerText = '×';
  delBtn.onclick = () => {
    div.remove();
    updateDeleteButtons('timer-instance');
  };

  div.append(timeDisplay, keypad, setBtn, startBtn, clearBtn);
  if (container.children.length > 0) div.appendChild(delBtn);
  container.appendChild(div);
  updateDeleteButtons('timer-instance');
}

// ========== UTILS ==========

function updateDeleteButtons(className) {
  const instances = document.querySelectorAll(`.${className}`);
  instances.forEach(div => {
    const btn = div.querySelector('.delete-btn');
    if (instances.length <= 1 && btn) {
      btn.remove();
    } else if (instances.length > 1 && !btn) {
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.innerText = '×';
      delBtn.onclick = () => {
        div.remove();
        updateDeleteButtons(className);
      };
      div.appendChild(delBtn);
    }
  });
}

function formatTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msDisplay = ms % 1000;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${msDisplay.toString().padStart(3, '0')}`;
}
