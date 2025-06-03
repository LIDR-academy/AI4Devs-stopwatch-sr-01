const state = {
  timers: [],
  nextId: 1,
  view: 'landing', // 'landing' | 'new-stopwatch' | 'new-countdown'
  newCountdownDigits: [],
};

const app = document.getElementById('app');

// --------- TIME FORMATTER ---------
function formatTime(ms) {
  ms = Math.max(0, ms);
  const total = Math.floor(ms / 1000);
  const sec = total % 60;
  const min = Math.floor(total / 60) % 60;
  const hr = Math.floor(total / 3600);
  const ms3 = ms % 1000;
  return {
    hr: hr.toString().padStart(2, '0'),
    min: min.toString().padStart(2, '0'),
    sec: sec.toString().padStart(2, '0'),
    ms: ms3.toString().padStart(3, '0')
  };
}

// --------- ROOT RENDER ---------
function render() {
  app.innerHTML = '';
  if (state.view === 'landing') renderLanding();
  if (state.view === 'new-stopwatch') renderNewStopwatch();
  if (state.view === 'new-countdown') renderNewCountdown();
}

// --------- LANDING PAGE ---------
function renderLanding() {
  const div = document.createElement('div');
  div.className = 'landing';
  div.innerHTML = `
    <div class="title">Adrian's timers</div>
    <div style="display:flex;gap:1rem;justify-content:center;margin-bottom:2rem;">
      <button class="big-btn" id="btnNewStopwatch"><span>&#9654;</span> New Stopwatch</button>
      <button class="big-btn" id="btnNewCountdown"><span>&#9200;</span> New Countdown</button>
    </div>
    <div id="timersList"></div>
  `;
  app.appendChild(div);

  document.getElementById('btnNewStopwatch').onclick = () => {
    state.view = 'new-stopwatch';
    render();
  };
  document.getElementById('btnNewCountdown').onclick = () => {
    state.newCountdownDigits = [];
    state.view = 'new-countdown';
    render();
  };
  renderTimersList();
}

// --------- TIMERS LIST ---------
function renderTimersList() {
  const listDiv = document.getElementById('timersList');
  if (state.timers.length === 0) {
    listDiv.innerHTML = `<div style="text-align:center;color:#888;">No timers yet.<br/>Create a new one above.</div>`;
    return;
  }
  listDiv.innerHTML = '';
  state.timers.forEach(timer => {
    // Timer card
    const card = document.createElement('div');
    card.className = 'display-box';
    card.style.marginBottom = '1.5rem';
    card.id = `timer-card-${timer.id}`;

    let label = (timer.type === 'stopwatch') ? 'Stopwatch' : 'Countdown';

    let timeObj = (timer.type === 'stopwatch')
      ? formatTime(timer.elapsed + (timer.running ? Date.now() - timer.start : 0))
      : formatTime(timer.remaining);

    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:1.3rem;font-weight:bold;">${label} #${timer.id}</span>
        <button class="control-btn red" data-del="${timer.id}">Delete</button>
      </div>
      <div style="margin-top:1.2rem;">
        <span class="time-main" id="main-time-${timer.id}">${timeObj.hr}:${timeObj.min}:${timeObj.sec}</span>
        <span class="time-ms" id="ms-time-${timer.id}">${timeObj.ms}</span>
      </div>
      <div class="control-group" style="margin-top:1.2rem;">
        <button class="control-btn ${getMainBtnClass(timer)}" data-main="${timer.id}" id="main-btn-${timer.id}">${getMainBtnTxt(timer)}</button>
        <button class="control-btn red" data-clear="${timer.id}">Clear</button>
      </div>
    `;
    listDiv.appendChild(card);

    // Button events
    card.querySelector(`[data-main="${timer.id}"]`).onclick = () => {
      if (timer.type === 'stopwatch') {
        if (!timer.running) startStopwatch(timer);
        else pauseStopwatch(timer);
      } else {
        if (!timer.running) startCountdown(timer);
        else pauseCountdown(timer);
      }
      updateTimerDisplay(timer);
    };
    card.querySelector(`[data-clear="${timer.id}"]`).onclick = () => {
      if (timer.type === 'stopwatch') resetStopwatch(timer);
      else resetCountdown(timer);
      updateTimerDisplay(timer);
    };
    card.querySelector(`[data-del="${timer.id}"]`).onclick = () => {
      removeTimer(timer);
      render();
    };

    // Start/stop updater
    if (timer.running && !timer._updater) {
      timer._updater = setInterval(() => updateTimerDisplay(timer), 43);
    }
    if (!timer.running && timer._updater) {
      clearInterval(timer._updater);
      timer._updater = null;
    }
    updateTimerDisplay(timer);
  });
}

// --------- MAIN BUTTON TEXT & CLASS ---------
function getMainBtnTxt(timer) {
  if (timer.type === 'stopwatch') {
    if (!timer.running && timer.elapsed === 0) return 'Start';
    if (timer.running) return 'Pause';
    return 'Continue';
  } else {
    if (!timer.running && timer.remaining === timer.target) return 'Start';
    if (timer.running) return 'Pause';
    return 'Continue';
  }
}
function getMainBtnClass(timer) {
  if (timer.type === 'stopwatch') {
    if (!timer.running && timer.elapsed === 0) return 'green';
    if (timer.running) return 'green';
    return 'blue';
  } else {
    if (!timer.running && timer.remaining === timer.target) return 'green';
    if (timer.running) return 'green';
    return 'blue';
  }
}

// --------- STOPWATCH FUNCTIONS ---------
function startStopwatch(timer) {
  if (!timer.running) {
    timer.running = true;
    timer.start = Date.now() - timer.elapsed;
    timer._updater = setInterval(() => updateTimerDisplay(timer), 43);
  }
}
function pauseStopwatch(timer) {
  if (timer.running) {
    timer.running = false;
    timer.elapsed = Date.now() - timer.start;
    if (timer._updater) clearInterval(timer._updater);
    timer._updater = null;
  }
}
function resetStopwatch(timer) {
  timer.running = false;
  timer.elapsed = 0;
  if (timer._updater) clearInterval(timer._updater);
  timer._updater = null;
}
function updateTimerDisplay(timer) {
  let t = timer.type === 'stopwatch'
    ? formatTime(timer.elapsed + (timer.running ? Date.now() - timer.start : 0))
    : formatTime(timer.remaining);

  let mt = document.getElementById('main-time-' + timer.id);
  let ms = document.getElementById('ms-time-' + timer.id);
  let btn = document.getElementById('main-btn-' + timer.id);
  if (mt) mt.textContent = `${t.hr}:${t.min}:${t.sec}`;
  if (ms) ms.textContent = t.ms;
  if (btn) {
    btn.textContent = getMainBtnTxt(timer);
    btn.className = `control-btn ${getMainBtnClass(timer)}`;
  }
}

// --------- COUNTDOWN FUNCTIONS ---------
function startCountdown(timer) {
  if (!timer.running && timer.remaining > 0) {
    timer.running = true;
    timer.lastTick = Date.now();
    timer.notified = false;
    timer._updater = setInterval(() => {
      let now = Date.now();
      let diff = now - timer.lastTick;
      timer.lastTick = now;
      timer.remaining -= diff;
      if (timer.remaining <= 0) {
        timer.remaining = 0;
        pauseCountdown(timer);
        if (!timer.notified) {
          showCountdownEnd();
          timer.notified = true;
        }
      }
      updateTimerDisplay(timer);
    }, 43);
  }
}
function pauseCountdown(timer) {
  if (timer.running) {
    timer.running = false;
    if (timer._updater) clearInterval(timer._updater);
    timer._updater = null;
  }
}
function resetCountdown(timer) {
  timer.running = false;
  timer.remaining = timer.target;
  timer.notified = false;
  if (timer._updater) clearInterval(timer._updater);
  timer._updater = null;
}

// --------- REMOVE TIMER ---------
function removeTimer(timer) {
  if (timer._updater) clearInterval(timer._updater);
  state.timers = state.timers.filter(t => t.id !== timer.id);
}

// --------- NEW STOPWATCH ---------
function renderNewStopwatch() {
  const div = document.createElement('div');
  div.className = 'stopwatch';
  div.innerHTML = `
    <div class="display-box">
      <span class="time-main">00:00:00</span>
      <span class="time-ms">000</span>
    </div>
    <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;">
      <button class="control-btn green" id="createSw">Create Stopwatch</button>
      <button class="control-btn blue" id="cancelNew">Cancel</button>
    </div>
  `;
  app.appendChild(div);
  document.getElementById('createSw').onclick = () => {
    state.timers.push({
      id: state.nextId++,
      type: 'stopwatch',
      running: false,
      start: null,
      elapsed: 0,
      _updater: null
    });
    state.view = 'landing';
    render();
  };
  document.getElementById('cancelNew').onclick = () => {
    state.view = 'landing';
    render();
  };
}

// --------- NEW COUNTDOWN ---------
function renderNewCountdown() {
  const div = document.createElement('div');
  div.className = 'countdown-setup';
  let digits = state.newCountdownDigits || [];
  let padded = Array(6 - digits.length).fill('0').concat(digits);
  const [h1, h2, m1, m2, s1, s2] = padded;

  div.innerHTML = `
    <div class="display-box">
      <span class="time-main">${h1}${h2}:${m1}${m2}:${s1}${s2}</span>
    </div>
    <div class="digit-keypad">
      ${[1,2,3,4,5,6,7,8,9,0].map(n=>`<button class="key-btn" data-k="${n}">${n}</button>`).join('')}
    </div>
    <div class="control-group">
      <button class="control-btn blue" id="createCd">Create Countdown</button>
      <button class="control-btn red" id="clearCd">Clear</button>
      <button class="control-btn blue" id="cancelNew">Cancel</button>
    </div>
  `;
  app.appendChild(div);

  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.onclick = () => {
      if (!state.newCountdownDigits) state.newCountdownDigits = [];
      if (state.newCountdownDigits.length < 6) {
        state.newCountdownDigits.push(btn.dataset.k);
        render();
      }
    };
  });
  document.getElementById('clearCd').onclick = () => {
    state.newCountdownDigits = [];
    render();
  };
  document.getElementById('cancelNew').onclick = () => {
    state.newCountdownDigits = [];
    state.view = 'landing';
    render();
  };
  document.getElementById('createCd').onclick = () => {
    let [h1, h2, m1, m2, s1, s2] = Array(6 - (state.newCountdownDigits?.length || 0)).fill('0').concat(state.newCountdownDigits || []);
    let h = Number(h1 + h2), m = Number(m1 + m2), s = Number(s1 + s2);
    let total = (h * 3600 + m * 60 + s) * 1000;
    if (total > 0) {
      state.timers.push({
        id: state.nextId++,
        type: 'countdown',
        running: false,
        target: total,
        remaining: total,
        notified: false,
        _updater: null
      });
    }
    state.newCountdownDigits = [];
    state.view = 'landing';
    render();
  };
}

// --------- SOUND AND NOTIFICATION ---------
function showCountdownEnd() {
  // Play sound first
  let audio = new Audio('sounds/alarm-no3-14864.mp3');
  audio.play();
  // Notification
  if (window.Notification && Notification.permission === "granted") {
    new Notification("Countdown finished!");
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") new Notification("Countdown finished!");
    });
  }
  setTimeout(() => {
    alert('The countdown has finished!');
  }, 100);
}

// --------- APP START ---------
window.onload = () => render();
