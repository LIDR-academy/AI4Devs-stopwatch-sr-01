// --- VARIABLES GLOBALES ---
let timers = [], countdowns = [];
let timerPage = 0, countdownPage = 0;
const pageSize = 5;

// --- UTILIDADES ---
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}.${centiseconds}`;
}

function formatCountdownTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function playAlert() {
  const alertSound = document.getElementById("alertSound");
  alertSound.currentTime = 0;
  alertSound.play();
  if (Notification.permission === "granted") {
    new Notification("⏰ Cuenta regresiva finalizada");
  }
}

// --- CRONÓMETROS ---
function addTimer() {
  const timer = {
    id: Date.now(),
    start: null,
    elapsed: 0,
    interval: null,
    laps: []
  };
  timers.push(timer);
  renderTimers();
}

function renderTimers() {
  const container = document.getElementById("timersContainer");
  container.innerHTML = "";
  const pageItems = timers.slice(timerPage * pageSize, (timerPage + 1) * pageSize);

  pageItems.forEach(timer => {
    const el = document.createElement("div");
    el.className = "border p-3 rounded shadow";
    const timeText = formatTime(timer.elapsed);

    el.innerHTML = `
      <div class="text-2xl font-mono mb-2">${timeText}</div>
      <div class="space-x-2 mb-2">
        <button onclick="startTimer(${timer.id})" class="px-2 py-1 rounded bg-gray-100">▶️</button>
        <button onclick="stopTimer(${timer.id})" class="px-2 py-1 rounded bg-gray-100">⏸️</button>
        <button onclick="lapTimer(${timer.id})" class="px-2 py-1 rounded bg-gray-100">🏁</button>
        <button onclick="deleteTimer(${timer.id})" class="px-2 py-1 rounded bg-red-100">❌</button>
      </div>
      <ul class="text-sm text-gray-600 space-y-1">
        ${timer.laps.map((lap, i) => `<li>Vuelta ${i + 1}: ${formatTime(lap)}</li>`).join("")}
      </ul>
    `;

    container.appendChild(el);
  });
  renderPagination("timer");
}

function startTimer(id) {
  const timer = timers.find(t => t.id === id);
  if (!timer.interval) {
    timer.start = Date.now() - timer.elapsed;
    timer.interval = setInterval(() => {
      timer.elapsed = Date.now() - timer.start;
      renderTimers();
    }, 100);
  }
}

function stopTimer(id) {
  const timer = timers.find(t => t.id === id);
  if (timer.interval) {
    clearInterval(timer.interval);
    timer.interval = null;
  }
}

function lapTimer(id) {
  const timer = timers.find(t => t.id === id);
  if (timer) {
    timer.laps.push(timer.elapsed);
    renderTimers();
  }
}

function deleteTimer(id) {
  timers = timers.filter(t => t.id !== id);
  renderTimers();
}

function clearTimers() {
  timers = [];
  renderTimers();
}

// --- CUENTAS REGRESIVAS ---
function openCountdownModal() {
  document.getElementById("countdownModal").classList.remove("hidden");
  document.getElementById("countdownModal").classList.add("flex");
}

function closeCountdownModal() {
  document.getElementById("countdownModal").classList.add("hidden");
}

function addCountdownFromModal() {
  const h = parseInt(document.getElementById("modalHours").value) || 0;
  const m = parseInt(document.getElementById("modalMinutes").value) || 0;
  const s = parseInt(document.getElementById("modalSeconds").value) || 0;
  const total = (h * 3600 + m * 60 + s) * 1000;

  if (total > 0) {
    const countdown = {
      id: Date.now(),
      duration: total,
      remaining: total,
      running: false,
      endTime: null
    };
    countdowns.push(countdown);
    renderCountdowns();
    closeCountdownModal();
  }
}

function renderCountdowns() {
  const container = document.getElementById("countdownsContainer");
  container.innerHTML = "";
  const now = Date.now();
  const pageItems = countdowns.slice(countdownPage * pageSize, (countdownPage + 1) * pageSize);

  pageItems.forEach(cd => {
    if (cd.running && cd.endTime) {
      cd.remaining = Math.max(0, cd.endTime - now);
    }

    const el = document.createElement("div");
    el.className = "border p-3 rounded shadow relative";
    const display = formatCountdownTime(cd.remaining);
    const finished = cd.remaining <= 0;

    el.innerHTML = `
      <div class="text-2xl font-mono mb-2 ${finished ? 'text-red-600 font-bold' : ''}">${display}</div>
      <div class="space-x-2">
        <button onclick="startCountdown(${cd.id})" class="px-2 py-1 rounded bg-gray-100">▶️</button>
        <button onclick="pauseCountdown(${cd.id})" class="px-2 py-1 rounded bg-gray-100">⏸️</button>
        <button onclick="deleteCountdown(${cd.id})" class="px-2 py-1 rounded bg-red-100">❌</button>
      </div>
      ${finished ? '<div class="absolute top-1 right-1 text-red-600 font-bold">⚠️</div>' : ''}
    `;

    container.appendChild(el);
  });
  renderPagination("countdown");
}

function startCountdown(id) {
  const cd = countdowns.find(c => c.id === id);
  if (cd && !cd.running && cd.remaining > 0) {
    cd.endTime = Date.now() + cd.remaining;
    cd.running = true;
    cd.interval = setInterval(() => {
      if (cd.running) {
        cd.remaining = Math.max(0, cd.endTime - Date.now());
        if (cd.remaining <= 0) {
          clearInterval(cd.interval);
          cd.running = false;
          playAlert();
        }
        renderCountdowns();
      }
    }, 200);
  }
}

function pauseCountdown(id) {
  const cd = countdowns.find(c => c.id === id);
  if (cd.running) {
    clearInterval(cd.interval);
    cd.running = false;
    cd.remaining = Math.max(0, cd.endTime - Date.now());
  }
  renderCountdowns();
}

function deleteCountdown(id) {
  countdowns = countdowns.filter(c => c.id !== id);
  renderCountdowns();
}

function clearCountdowns() {
  countdowns = [];
  renderCountdowns();
}

// --- Paginación ---
function renderPagination(type) {
  const totalItems = type === "timer" ? timers.length : countdowns.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = type === "timer" ? timerPage : countdownPage;
  const container = document.getElementById(type + "Pagination");
  container.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.className = `px-2 py-1 rounded ${i === currentPage ? 'bg-blue-200' : 'bg-gray-100'}`;
    btn.onclick = () => {
      if (type === "timer") timerPage = i;
      else countdownPage = i;
      type === "timer" ? renderTimers() : renderCountdowns();
    };
    container.appendChild(btn);
  }
}

function nextPage(type) {
  if (type === "timer" && (timerPage + 1) * pageSize < timers.length) {
    timerPage++;
    renderTimers();
  } else if (type === "countdown" && (countdownPage + 1) * pageSize < countdowns.length) {
    countdownPage++;
    renderCountdowns();
  }
}

function prevPage(type) {
  if (type === "timer" && timerPage > 0) {
    timerPage--;
    renderTimers();
  } else if (type === "countdown" && countdownPage > 0) {
    countdownPage--;
    renderCountdowns();
  }
}