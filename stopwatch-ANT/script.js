// script.js - Cronómetro y Cuenta Regresiva con múltiples instancias
const timersContainer = document.getElementById('timers');
const alertSound = document.getElementById('alert-sound');

let timerId = 0;
const timers = {};

function addTimer(type) {
  timerId++;
  const id = `timer-${timerId}`;
  timers[id] = { interval: null, type, time: 0, running: false };

  const timerDiv = document.createElement('div');
  timerDiv.className = 'timer';
  timerDiv.id = id;

  timerDiv.innerHTML = `
    <span class="display">00:00:00</span>
    ${type === 'countdown' ? '<input type="number" min="1" placeholder="segundos" class="input-seconds">' : ''}
    <button onclick="startTimer('${id}')">Iniciar</button>
    <button onclick="pauseTimer('${id}')">Pausar</button>
    <button onclick="resetTimer('${id}')">Reiniciar</button>
    <button onclick="removeTimer('${id}')">Eliminar</button>
  `;
  timersContainer.appendChild(timerDiv);
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function startTimer(id) {
  const timer = timers[id];
  const timerDiv = document.getElementById(id);
  const display = timerDiv.querySelector('.display');
  if (timer.type === 'countdown' && !timer.running && timer.time === 0) {
    const input = timerDiv.querySelector('.input-seconds');
    timer.time = parseInt(input.value, 10) * 1000 || 0;
    input.disabled = true;
  }
  if (timer.running) return;
  timer.running = true;
  const start = Date.now() - (timer.elapsed || 0);
  timer.interval = setInterval(() => {
    timer.elapsed = Date.now() - start;
    let showTime;
    if (timer.type === 'stopwatch') {
      showTime = timer.elapsed;
    } else {
      showTime = Math.max(timer.time - timer.elapsed, 0);
      if (showTime === 0) {
        clearInterval(timer.interval);
        timer.running = false;
        displayNotification();
        alertSound.play();
      }
    }
    display.textContent = formatTime(showTime);
  }, 200);
}

function pauseTimer(id) {
  const timer = timers[id];
  if (timer && timer.running) {
    clearInterval(timer.interval);
    timer.running = false;
  }
}

function resetTimer(id) {
  const timer = timers[id];
  const timerDiv = document.getElementById(id);
  const display = timerDiv.querySelector('.display');
  if (timer.type === 'countdown') {
    const input = timerDiv.querySelector('.input-seconds');
    input.disabled = false;
    timer.time = 0;
  }
  timer.elapsed = 0;
  display.textContent = '00:00:00';
  clearInterval(timer.interval);
  timer.running = false;
}

function removeTimer(id) {
  pauseTimer(id);
  delete timers[id];
  const timerDiv = document.getElementById(id);
  if (timerDiv) timerDiv.remove();
}

function displayNotification() {
  if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('¡Cuenta regresiva finalizada!');
      }
    });
  }
}
