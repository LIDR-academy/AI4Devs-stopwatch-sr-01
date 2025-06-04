// === THEME TOGGLE ===
const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// === MODAL ===
const openFormBtn = document.getElementById("openFormBtn");
const fabBtn = document.getElementById("fabBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const counterFormModal = document.getElementById("counterFormModal");
const formBody = document.getElementById("formBody");

function openModal() {
  counterFormModal.classList.remove("hidden");
}
function closeModal() {
  counterFormModal.classList.add("hidden");
}
openFormBtn.addEventListener("click", openModal);
fabBtn.addEventListener("click", openModal);
closeFormBtn.addEventListener("click", closeModal);

// === COUNTER TYPE SWITCH ===
let counterType = "stopwatch";
const stopwatchSelect = document.getElementById("stopwatchSelect");
const countdownSelect = document.getElementById("countdownSelect");

function setCounterType(type) {
  counterType = type;
  if (type === "stopwatch") {
    stopwatchSelect.classList.add("bg-green-100", "dark:bg-green-800");
    countdownSelect.classList.remove("bg-red-100", "dark:bg-red-800");
    renderStopwatchForm();
  } else {
    countdownSelect.classList.add("bg-red-100", "dark:bg-red-800");
    stopwatchSelect.classList.remove("bg-green-100", "dark:bg-green-800");
    renderCountdownForm();
  }
}
stopwatchSelect.addEventListener("click", () => setCounterType("stopwatch"));
countdownSelect.addEventListener("click", () => setCounterType("countdown"));

setCounterType("stopwatch"); // Initial render

// === SHARED UTILS ===
function generateId() {
  return crypto.randomUUID();
}
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const minutes = (Math.floor(totalSeconds / 60) % 60).toString().padStart(2, "0");
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
function showHistoryView() {
  document.getElementById("mainContent").classList.remove("items-center");
  document.getElementById("initialState").classList.add("hidden");
  document.getElementById("historyView").classList.remove("hidden");
}
function checkReturnToInitialView() {
  if (stopwatches.length === 0 && countdowns.length === 0) {
    document.getElementById("mainContent").classList.add("items-center");
    document.getElementById("historyView").classList.add("hidden");
    document.getElementById("initialState").classList.remove("hidden");
  }
}

// --- STOPWATCH LOGIC ---
const stopwatches = [];
let animationFrameId;

function updateStopwatchUI() {
  stopwatches.forEach((entry) => {
    if (!entry.isRunning) return;
    const now = Date.now();
    const elapsed = entry.elapsed + (now - entry.startTime);
    const timeEl = document.getElementById(`sw-time-${entry.id}`);
    if (timeEl) timeEl.textContent = formatTime(elapsed);
  });
  animationFrameId = requestAnimationFrame(updateStopwatchUI);
}

function startAnimation() {
  if (!animationFrameId) animationFrameId = requestAnimationFrame(updateStopwatchUI);
}
function stopAnimationIfNeeded() {
  if (stopwatches.every((e) => !e.isRunning)) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function renderStopwatch(entry) {
  const container = document.createElement("div");
  container.id = `sw-container-${entry.id}`;
  container.className = `flex justify-between items-center p-3 border rounded dark:border-gray-600 bg-white dark:bg-gray-800`;

  const labelLine = entry.label
    ? `<div class="text-sm text-gray-500 dark:text-gray-400">${entry.label} • ${entry.createdAt.toLocaleString()}</div>`
    : `<div class="text-sm text-gray-500 dark:text-gray-400">${entry.createdAt.toLocaleString()}</div>`;

  let actionsHTML = "";

  if (!entry.isRunning) {
    actionsHTML += `
      <button title="Delete" class="p-2 rounded hover:bg-red-100 dark:hover:bg-red-800 text-xl text-red-500" data-action="delete" data-id="${entry.id}">
        <i class="fas fa-trash"></i>
      </button>
      <button title="Restart" class="p-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800 text-xl text-yellow-600" data-action="restart" data-id="${entry.id}">
        <i class="fas fa-rotate-left"></i>
      </button>
    `;
  }

  actionsHTML += `
    <button title="${
      entry.isRunning ? "Pause" : "Resume"
    }" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xl" data-action="toggle" data-id="${entry.id}">
      <i class="fas ${entry.isRunning ? "fa-pause" : "fa-play"}"></i>
    </button>
  `;

  container.innerHTML = `
    <div>
      <div id="sw-time-${entry.id}" class="text-xl font-mono">${formatTime(entry.elapsed)}</div>
      ${labelLine}
    </div>
    <div class="flex gap-2">${actionsHTML}</div>
  `;

  document.getElementById("stopwatchHistory").appendChild(container);
}

// --- COUNTDOWN LOGIC ---
const countdowns = [];
const alertSound = document.getElementById("alertSound");
let countdownDigits = "";
let countdownFrameId = null;

function updateCountdownDisplay() {
  const padded = countdownDigits.padStart(6, "0");
  const hours = padded.slice(0, 2);
  const minutes = padded.slice(2, 4);
  const seconds = padded.slice(4, 6);
  document.getElementById("countdownInput").textContent = `${hours}:${minutes}:${seconds}`;
}
function handleDigitInput(n) {
  if (countdownDigits.length >= 6) return;
  countdownDigits += n;
  updateCountdownDisplay();
}
function clearCountdownDigits() {
  countdownDigits = "";
  updateCountdownDisplay();
}
function attachCountdownListeners() {
  document.querySelectorAll("[data-digit]").forEach((btn) => {
    btn.addEventListener("click", () => handleDigitInput(btn.dataset.digit));
  });
  document.getElementById("clearCountdownBtn").addEventListener("click", clearCountdownDigits);
  document.getElementById("startCountdownBtn").addEventListener("click", () => {
    if (countdownDigits.length === 0) return;
    const padded = countdownDigits.padStart(6, "0");
    const hours = parseInt(padded.slice(0, 2));
    const minutes = parseInt(padded.slice(2, 4));
    const seconds = parseInt(padded.slice(4, 6));
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalMs <= 0) return;
    const now = Date.now();
    const entry = {
      id: generateId(),
      totalMs,
      remainingMs: totalMs,
      endTime: now + totalMs,
      isRunning: true,
      isFinished: false,
      createdAt: new Date(),
    };
    countdowns.push(entry);
    renderCountdown(entry);
    closeModal();
    showHistoryView();
    if (countdowns.length === 1) startCountdownAnimation();
    clearCountdownDigits();
  });
}

function renderCountdown(entry) {
  const container = document.createElement("div");
  container.id = `cd-container-${entry.id}`;
  container.className = `flex justify-between items-center p-3 border rounded dark:border-gray-600 bg-white dark:bg-gray-800`;

  let display = formatTime(entry.remainingMs || entry.totalMs);
  let label = formatTime(entry.totalMs);
  if (entry.isFinished) display = "00:00:00.00";

  const actions = [];
  if (!entry.isRunning && !entry.isFinished) {
    actions.push(
      `<button title="Delete" class="p-2 rounded hover:bg-red-100 dark:hover:bg-red-800 text-xl text-red-500" data-action="cd-delete" data-id="${entry.id}"><i class="fas fa-trash"></i></button>`
    );
    actions.push(
      `<button title="Reset" class="p-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800 text-xl text-yellow-600" data-action="cd-reset" data-id="${entry.id}"><i class="fas fa-rotate-left"></i></button>`
    );
  }
  if (entry.isFinished) {
    actions.push(
      `<button title="Restart" class="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800 text-xl text-blue-600" data-action="cd-reset" data-id="${entry.id}"><i class="fas fa-play"></i></button>`
    );
  }
  if (!entry.isFinished) {
    actions.push(
      `<button title="${
        entry.isRunning ? "Pause" : "Resume"
      }" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xl" data-action="cd-toggle" data-id="${
        entry.id
      }"><i class="fas ${entry.isRunning ? "fa-pause" : "fa-play"}"></i></button>`
    );
  }

  container.innerHTML = `
    <div>
      <div id="cd-time-${entry.id}" class="text-xl font-mono">${display}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">Initial: ${label}</div>
    </div>
    <div class="flex gap-2">${actions.join("")}</div>
  `;

  document.getElementById("countdownHistory").appendChild(container);
}

function updateCountdownUI() {
  const now = Date.now();
  countdowns.forEach((entry) => {
    if (!entry.isRunning || entry.isFinished) return;
    entry.remainingMs = entry.endTime - now;
    if (entry.remainingMs <= 0) {
      entry.remainingMs = 0;
      entry.isRunning = false;
      entry.isFinished = true;
      alertSound.currentTime = 0;
      alertSound.play();
      const el = document.getElementById(`cd-container-${entry.id}`);
      if (el) el.classList.add("animate-pulse", "bg-red-100", "dark:bg-red-900");
    }
    const el = document.getElementById(`cd-time-${entry.id}`);
    if (el) el.textContent = formatTime(entry.remainingMs);
  });
  countdownFrameId = requestAnimationFrame(updateCountdownUI);
}

function startCountdownAnimation() {
  if (!countdownFrameId) countdownFrameId = requestAnimationFrame(updateCountdownUI);
}

function stopCountdownIfNeeded() {
  if (countdowns.every((e) => !e.isRunning)) {
    cancelAnimationFrame(countdownFrameId);
    countdownFrameId = null;
  }
}

document.getElementById("countdownHistory").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const entry = countdowns.find((c) => c.id === id);
  if (!entry) return;

  if (action === "cd-toggle") {
    if (entry.isRunning) {
      entry.remainingMs = entry.endTime - Date.now();
      entry.isRunning = false;
    } else {
      entry.endTime = Date.now() + entry.remainingMs;
      entry.isRunning = true;
    }
    stopCountdownIfNeeded();
    startCountdownAnimation();
    const el = document.getElementById(`cd-container-${entry.id}`);
    if (el) {
      el.remove();
      renderCountdown(entry);
    }
  }

  if (action === "cd-reset") {
    entry.remainingMs = entry.totalMs;
    entry.endTime = Date.now() + entry.totalMs;
    entry.isRunning = true;
    entry.isFinished = false;
    const el = document.getElementById(`cd-container-${entry.id}`);
    if (el) {
      el.classList.remove("animate-pulse", "bg-red-100", "dark:bg-red-900");
      el.remove();
      renderCountdown(entry);
    }
    startCountdownAnimation();
  }

  if (action === "cd-delete") {
    const idx = countdowns.findIndex((e) => e.id === id);
    if (idx !== -1) {
      countdowns.splice(idx, 1);
      const el = document.getElementById(`cd-container-${id}`);
      if (el) el.remove();
      stopCountdownIfNeeded();
      checkReturnToInitialView();
    }
  }
});

function renderCountdownForm() {
  formBody.innerHTML = `
    <div id="countdownInput" class="w-full p-4 border rounded text-center text-2xl mb-4 dark:bg-gray-700 dark:border-gray-600">00:00:00</div>
    <div class="grid grid-cols-3 gap-2 mb-4">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        .map(
          (n) => `
        <button data-digit="${n}" class="bg-gray-300 dark:bg-gray-600 p-2 rounded text-xl font-mono hover:bg-gray-400 dark:hover:bg-gray-500">${n}</button>
      `
        )
        .join("")}
    </div>
    <div class="flex gap-4">
      <button id="startCountdownBtn" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">Start</button>
      <button id="clearCountdownBtn" class="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded">Clear</button>
    </div>
  `;
  clearCountdownDigits();
  attachCountdownListeners();
}

document.getElementById("stopwatchHistory").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const entry = stopwatches.find((e) => e.id === id);
  if (!entry) return;

  if (action === "toggle") {
    const now = Date.now();
    if (entry.isRunning) {
      entry.elapsed += now - entry.startTime;
      entry.isRunning = false;
    } else {
      entry.startTime = now;
      entry.isRunning = true;
    }
    stopAnimationIfNeeded();
    startAnimation();
    const container = document.getElementById(`sw-container-${entry.id}`);
    if (container) {
      container.remove();
      renderStopwatch(entry);
    }
  }

  if (action === "restart") {
    entry.elapsed = 0;
    if (entry.isRunning) {
      entry.startTime = Date.now();
    }
    const container = document.getElementById(`sw-container-${entry.id}`);
    if (container) {
      container.remove();
      renderStopwatch(entry);
    }
  }

  if (action === "delete") {
    const index = stopwatches.findIndex((e) => e.id === id);
    if (index !== -1) {
      stopwatches.splice(index, 1);
      const el = document.getElementById(`sw-container-${id}`);
      if (el) el.remove();
      stopAnimationIfNeeded();
      checkReturnToInitialView();
    }
  }
});

function renderStopwatchForm() {
  formBody.innerHTML = `
    <input id="stopwatchLabel" type="text" placeholder="Label (optional)" class="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600" />
    <button id="startStopwatchBtn" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Start</button>
  `;
  attachStopwatchStartListener();
}

function attachStopwatchStartListener() {
  const startBtn = document.getElementById("startStopwatchBtn");
  const input = document.getElementById("stopwatchLabel");

  startBtn.addEventListener("click", () => {
    const label = input.value.trim();
    const entry = {
      id: generateId(),
      label,
      startTime: Date.now(),
      elapsed: 0,
      isRunning: true,
      createdAt: new Date(),
    };
    stopwatches.push(entry);
    renderStopwatch(entry);
    input.value = ""; // Clear input
    if (stopwatches.length === 1) startAnimation();
    closeModal();
    showHistoryView();
  });
}
