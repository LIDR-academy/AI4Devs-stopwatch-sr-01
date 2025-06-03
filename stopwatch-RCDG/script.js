// Pide permiso de notificación al primer clic en cualquier botón relevante
function ensureNotificationPermission() {
  if ('Notification' in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", ensureNotificationPermission, { once: true });
});

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
  if (alertSound) {
    alertSound.currentTime = 0;
    alertSound.play().catch(() => {
      // Mostrar aviso si no se puede reproducir sonido
      // alert("Activa el sonido en tu navegador para la alarma.");
    });
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
    // Usar un span para solo actualizar el contador
    el.innerHTML = `
      <div class="text-3xl font-mono mb-2"><span id="timer-time-${timer.id}">${formatTime(timer.elapsed)}</span></div>
      <div class="space-x-2 mb-2">
        <button data-action="start" data-id="${timer.id}" class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring transition font-semibold">▶️</button>
        <button data-action="stop" data-id="${timer.id}" class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring transition font-semibold">⏸️</button>
        <button data-action="lap" data-id="${timer.id}" class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring transition font-semibold">🏁</button>
        <button data-action="delete" data-id="${timer.id}" class="px-3 py-2 rounded bg-red-100 hover:bg-red-200 active:scale-95 focus:ring transition font-semibold">❌</button>
      </div>
      <ul class="text-sm text-gray-600 space-y-1">
        ${timer.laps.map((lap, i) => `<li>Vuelta ${i + 1}: ${formatTime(lap)}</li>`).join("")}
      </ul>
    `;
    container.appendChild(el);
  });

  renderPagination("timer");
}

// Delegación de eventos para botones de cronómetros
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("timersContainer").onclick = function(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = parseInt(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");
    if (action === "start") startTimer(id);
    else if (action === "stop") stopTimer(id);
    else if (action === "lap") lapTimer(id);
    else if (action === "delete") deleteTimer(id);
  };
});

// Actualización solo del display de tiempo
function tickTimers() {
  timers.forEach(timer => {
    if (timer.interval) {
      timer.elapsed = Date.now() - timer.start;
      const timeSpan = document.getElementById(`timer-time-${timer.id}`);
      if (timeSpan) timeSpan.textContent = formatTime(timer.elapsed);
    }
  });
}
setInterval(tickTimers, 100);

// Acciones
function startTimer(id) {
  const timer = timers.find(t => t.id === id);
  if (!timer.interval) {
    timer.start = Date.now() - timer.elapsed;
    timer.interval = true; // solo para marcar que está corriendo
  }
}
function stopTimer(id) {
  const timer = timers.find(t => t.id === id);
  if (timer.interval) {
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
      endTime: null,
      interval: null
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
    // span para el tiempo
    el.innerHTML = `
      <div class="text-3xl font-mono mb-2 ${cd.remaining <= 0 ? 'text-red-600 font-bold' : ''}">
        <span id="cd-time-${cd.id}">${formatCountdownTime(cd.remaining)}</span>
      </div>
      <div class="space-x-2">
        <button data-action="cd-start" data-id="${cd.id}" class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring transition font-semibold">▶️</button>
        <button data-action="cd-pause" data-id="${cd.id}" class="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 active:scale-95 focus:ring transition font-semibold">⏸️</button>
        <button data-action="cd-delete" data-id="${cd.id}" class="px-3 py-2 rounded bg-red-100 hover:bg-red-200 active:scale-95 focus:ring transition font-semibold">❌</button>
      </div>
      ${cd.remaining <= 0 ? '<div class="absolute top-1 right-1 text-red-600 font-bold">⚠️</div>' : ''}
    `;
    container.appendChild(el);
  });
  renderPagination("countdown");
}

// Delegación de eventos para botones de cuentas regresivas
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("countdownsContainer").onclick = function(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = parseInt(btn.getAttribute("data-id"));
    const action = btn.getAttribute("data-action");
    if (action === "cd-start") startCountdown(id);
    else if (action === "cd-pause") pauseCountdown(id);
    else if (action === "cd-delete") deleteCountdown(id);
  };
});

// Actualización solo del display de tiempo
function tickCountdowns() {
  const now = Date.now();
  countdowns.forEach(cd => {
    if (cd.running && cd.endTime) {
      cd.remaining = Math.max(0, cd.endTime - now);
      const timeSpan = document.getElementById(`cd-time-${cd.id}`);
      if (timeSpan) timeSpan.textContent = formatCountdownTime(cd.remaining);
      if (cd.remaining <= 0) {
        cd.running = false;
        playAlert();
        renderCountdowns();
      }
    }
  });
}
setInterval(tickCountdowns, 200);

// Acciones
function startCountdown(id) {
  const cd = countdowns.find(c => c.id === id);
  if (cd && !cd.running && cd.remaining > 0) {
    cd.endTime = Date.now() + cd.remaining;
    cd.running = true;
  }
}
function pauseCountdown(id) {
  const cd = countdowns.find(c => c.id === id);
  if (cd.running) {
    cd.running = false;
    cd.remaining = Math.max(0, cd.endTime - Date.now());
  }
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
    btn.className = `px-2 py-1 rounded transition ${i === currentPage ? 'bg-blue-200' : 'bg-gray-100'} active:bg-blue-300`;
    btn.addEventListener('click', () => {
      if (type === "timer") timerPage = i;
      else countdownPage = i;
      type === "timer" ? renderTimers() : renderCountdowns();
    });
    container.appendChild(btn);
  }
}

// --- Botones globales y modal ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addTimerBtn').onclick = addTimer;
  document.getElementById('clearTimersBtn').onclick = clearTimers;
  document.getElementById('openCountdownBtn').onclick = openCountdownModal;
  document.getElementById('clearCountdownsBtn').onclick = clearCountdowns;
  document.getElementById('closeCountdownModalBtn').onclick = closeCountdownModal;
  document.getElementById('addCountdownModalBtn').onclick = addCountdownFromModal;
});

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('testAlarmBtn').onclick = () => {
    const alertSound = document.getElementById("alertSound");
    alertSound.currentTime = 0;
    alertSound.play().catch(()=>{alert("El navegador ha bloqueado el audio.\nHaz clic aquí y asegúrate de que no esté silenciado.");});
  };
});