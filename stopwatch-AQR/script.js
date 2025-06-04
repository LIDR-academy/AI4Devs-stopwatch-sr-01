// --- Utils ---
function pad(num) {
  return num.toString().padStart(2, "0");
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return (h > 0 ? `${pad(h)}:` : "") + `${pad(m)}:${pad(s)}`;
}

// --- Toast System ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

// --- Beep System ---
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.1;
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 700);
  } catch (e) {
    console.error("Error al reproducir beep:", e);
  }
}

// --- Timer Logic ---
class Timer {
  constructor({id, name, type, duration}) {
    this.id = id;
    this.name = name || '';
    this.type = type;
    this.duration = Number(duration) || 0;
    this.time = this.type === 'stopwatch' ? 0 : this.duration;
    this.running = false;
    this.interval = null;
    this.ended = false;
  }

  start(render) {
    if (this.running) return;
    this.running = true;
    this.ended = false;
    this.interval = setInterval(() => {
      try {
        if (this.type === 'stopwatch') {
          this.time++;
        } else {
          if (this.time > 0) {
            this.time--;
          } else {
            this.running = false;
            this.ended = true;
            clearInterval(this.interval);
            beep();
            render();
            showToast(`¡${this.name ? this.name + ': ' : ''}Tiempo terminado!`);
            this._flash();
            return;
          }
        }
        render();
      } catch (e) {
        console.error("Error en Timer.start interval:", e);
      }
    }, 1000);
  }

  pause() {
    if (this.running) {
      clearInterval(this.interval);
      this.running = false;
    }
  }

  reset(render) {
    this.pause();
    this.time = this.type === 'stopwatch' ? 0 : this.duration;
    this.ended = false;
    if (render) render();
  }

  stop() {
    this.pause();
    this.ended = false;
    this.time = this.type === 'stopwatch' ? 0 : this.duration;
  }

  remove() {
    this.pause();
  }

  _flash() {
    const card = document.getElementById('timer-' + this.id);
    if (!card) return;
    let flashes = 0;
    const flashInterval = setInterval(() => {
      card.classList.toggle('bg-yellow-200');
      flashes++;
      if (flashes > 7) {
        card.classList.remove('bg-yellow-200');
        clearInterval(flashInterval);
      }
    }, 250);
  }
}

// --- App State ---
const timers = [];
let timerId = 1;

// --- DOM Elements ---
const timersList = document.getElementById('timers-list');
const addTimerForm = document.getElementById('add-timer-form');
const typeSelect = addTimerForm.querySelector('[name="type"]');
const durationFields = document.getElementById('duration-fields');
const hoursField = addTimerForm.querySelector('[name="hours"]');
const minutesField = addTimerForm.querySelector('[name="minutes"]');
const secondsField = addTimerForm.querySelector('[name="seconds"]');

// --- Event Listeners ---

typeSelect.addEventListener('change', e => {
  if (typeSelect.value === 'countdown') {
    durationFields.classList.remove('hidden');
    hoursField.required = minutesField.required = secondsField.required = false; // handled in validation, not html5
  } else {
    durationFields.classList.add('hidden');
    hoursField.value = minutesField.value = secondsField.value = '';
  }
});

addTimerForm.addEventListener('submit', e => {
  e.preventDefault();
  try {
    if (timers.length >= 10) {
      showToast("Máximo 10 elementos permitidos.");
      return;
    }
    const name = addTimerForm.name.value.trim();
    const type = addTimerForm.type.value;
    let duration = 0;
    if (type === 'countdown') {
      const hours = Number(hoursField.value) || 0;
      const minutes = Number(minutesField.value) || 0;
      const seconds = Number(secondsField.value) || 0;
      duration = hours * 3600 + minutes * 60 + seconds;
      if (duration < 1 || duration > 359999) {
        showToast("Ingresa una duración válida (al menos 1 segundo y máximo 99:59:59).");
        return;
      }
    }
    const id = timerId++;
    const timer = new Timer({id, name, type, duration});
    timers.push(timer);
    renderTimers();
    addTimerForm.reset();
    durationFields.classList.add('hidden');
  } catch (err) {
    console.error("Error al agregar temporizador:", err);
    showToast("Hubo un error al agregar el temporizador.");
  }
});

// --- Render Logic ---
function renderTimers() {
  timersList.innerHTML = "";
  timers.forEach(timer => {
    const isCountdown = timer.type === 'countdown';
    const card = document.createElement('div');
    card.id = 'timer-' + timer.id;
    card.tabIndex = 0;
    card.className =
      "flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl border-2 border-gray-200 relative transition-all select-none";
    if (timer.ended && isCountdown) card.classList.add("bg-yellow-200");

    // Name/title
    if (timer.name) {
      const nameEl = document.createElement('div');
      nameEl.className = "mb-2 text-lg font-bold text-gray-700 text-center";
      nameEl.textContent = timer.name;
      card.appendChild(nameEl);
    }

    // Display
    const display = document.createElement('div');
    display.className =
      "mb-4 font-mono text-5xl md:text-6xl font-bold text-gray-900 bg-gray-100 rounded-xl px-6 py-3 shadow-inner w-full text-center tracking-wider select-all";
    display.textContent = formatTime(timer.time);
    card.appendChild(display);

    // Controls
    const controls = document.createElement('div');
    controls.className = "flex gap-2 mt-1";

    // Start/Resume
    const startBtn = document.createElement('button');
    startBtn.className =
      "px-5 py-2 rounded-xl font-bold text-lg bg-green-500 text-white shadow hover:bg-green-600 focus:outline-none";
    startBtn.innerHTML = timer.running ? '⏸ Pausar' : (timer.time === 0 && isCountdown) ? '▶️ Iniciar' : (timer.running ? '⏸ Pausar' : '▶️ Iniciar');
    startBtn.onclick = () => {
      if (timer.running) {
        timer.pause();
      } else {
        timer.start(renderTimers);
      }
      renderTimers();
    };
    controls.appendChild(startBtn);

    // Reset
    const resetBtn = document.createElement('button');
    resetBtn.className =
      "px-4 py-2 rounded-xl font-bold text-lg bg-yellow-400 text-white shadow hover:bg-yellow-500 focus:outline-none";
    resetBtn.innerHTML = '🔄 Reiniciar';
    resetBtn.onclick = () => {
      timer.reset(renderTimers);
    };
    controls.appendChild(resetBtn);

    // Delete/Clear
    const delBtn = document.createElement('button');
    delBtn.className =
      "px-4 py-2 rounded-xl font-bold text-lg bg-red-500 text-white shadow hover:bg-red-600 focus:outline-none";
    delBtn.innerHTML = '🗑 Borrar';
    delBtn.onclick = () => {
      timer.remove();
      const idx = timers.findIndex(t => t.id === timer.id);
      if (idx >= 0) timers.splice(idx, 1);
      renderTimers();
    };
    controls.appendChild(delBtn);

    card.appendChild(controls);

    // Accesibilidad: enter/space activa el botón principal (start)
    card.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        startBtn.click();
      }
    });

    timersList.appendChild(card);
  });
}

// --- Init ---
renderTimers();
console.log("TimeMaster app iniciada.");
