// --- Clases base ---
class Timer {
  constructor(id) {
    this.id = id;
    this.interval = null;
    this.running = false;
    this.startTime = 0;
    this.elapsed = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = Date.now() - this.elapsed;
    this.interval = setInterval(() => this.onTick(), 10);
  }

  pause() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.interval);
    this.elapsed = Date.now() - this.startTime;
  }

  reset() {
    this.running = false;
    clearInterval(this.interval);
    this.elapsed = 0;
    this.startTime = 0;
    this.onTick();
  }

  onTick() {
    // Implementado en subclases
  }

  stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }
}

class Cronometro extends Timer {
  constructor(id, onUpdate) {
    super(id);
    this.onUpdate = onUpdate;
  }

  onTick() {
    if (!this.running) return;
    this.elapsed = Date.now() - this.startTime;
    if (this.onUpdate) this.onUpdate(this);
  }

  getTime() {
    let ms = this.elapsed;
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    ms %= 1000;
    return { hours, minutes, seconds, ms };
  }
}

// --- Clase CuentaRegresiva ---
class CuentaRegresiva extends Timer {
  constructor(id, durationMs, onUpdate, onFinish) {
    super(id);
    this.durationMs = durationMs;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
    this.elapsed = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = Date.now() - this.elapsed;
    this.interval = setInterval(() => this.onTick(), 10);
  }

  onTick() {
    if (!this.running) return;
    this.elapsed = Date.now() - this.startTime;
    const remaining = this.durationMs - this.elapsed;
    if (this.onUpdate) this.onUpdate(this);
    if (remaining <= 0) {
      this.running = false;
      clearInterval(this.interval);
      this.elapsed = this.durationMs;
      if (this.onUpdate) this.onUpdate(this);
      if (this.onFinish) this.onFinish(this);
    }
  }

  getTime() {
    let ms = Math.max(0, this.durationMs - this.elapsed);
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    ms %= 1000;
    return { hours, minutes, seconds, ms };
  }
}

// --- Gestión múltiple ---
class TimerManager {
  constructor() {
    this.timers = [];
    this.nextId = 1;
  }

  addCronometro(onUpdate) {
    const timer = new Cronometro(this.nextId++, onUpdate);
    this.timers.push(timer);
    return timer;
  }

  addCuentaRegresiva(durationMs, onUpdate, onFinish) {
    const timer = new CuentaRegresiva(this.nextId++, durationMs, onUpdate, onFinish);
    this.timers.push(timer);
    return timer;
  }

  removeTimer(id) {
    const timer = this.timers.find(t => t.id === id);
    if (timer) timer.stopInterval();
    this.timers = this.timers.filter(t => t.id !== id);
  }
}

const timerManager = new TimerManager();

// --- Renderizado UI ---
document.addEventListener('DOMContentLoaded', () => {
  renderPantallaSeleccion();
});

function renderPantallaSeleccion() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1 class="text-3xl font-bold text-center mb-8">Selecciona una opción</h1>
    <div class="flex justify-center gap-8 mb-8">
      <button id="btn-cronometro" class="px-8 py-4 bg-blue-500 text-white rounded-xl text-xl font-semibold shadow hover:bg-blue-600 transition">Cronómetro</button>
      <button id="btn-cuenta-regresiva" class="px-8 py-4 bg-green-500 text-white rounded-xl text-xl font-semibold shadow hover:bg-green-600 transition">Cuenta regresiva</button>
    </div>
    <div id="timers-container"></div>
  `;

  document.getElementById('btn-cronometro').onclick = () => renderCronometros();
  document.getElementById('btn-cuenta-regresiva').onclick = () => renderCuentaRegresiva();
}

function renderCronometros() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Cronómetros</h2>
      <button id="btn-add-cronometro" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">+ Añadir cronómetro</button>
    </div>
    <div id="cronometros-list"></div>
    <button id="btn-volver" class="mt-8 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Volver</button>
  `;

  document.getElementById('btn-add-cronometro').onclick = () => {
    addCronometroUI();
  };
  document.getElementById('btn-volver').onclick = () => {
    // Detener todos los intervalos activos al volver
    timerManager.timers.forEach(t => t.stopInterval());
    timerManager.timers = [];
    renderPantallaSeleccion();
  };

  renderAllCronometrosUI();
}

function renderAllCronometrosUI() {
  const list = document.getElementById('cronometros-list');
  if (!list) return;
  if (timerManager.timers.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-500">No hay cronómetros activos.</p>`;
    return;
  }
  list.innerHTML = '';
  timerManager.timers.forEach(timer => {
    list.appendChild(createCronometroElement(timer));
  });
}

function addCronometroUI() {
  const timer = timerManager.addCronometro(updateCronometroUI);
  renderAllCronometrosUI();
}

function createCronometroElement(timer) {
  const { hours, minutes, seconds, ms } = timer.getTime();
  const container = document.createElement('div');
  container.className = "flex items-center gap-4 mb-4 p-4 bg-blue-100 rounded-xl shadow";
  container.id = `cronometro-${timer.id}`;
  container.innerHTML = `
    <div class="flex-1 text-4xl font-mono tracking-widest bg-blue-50 rounded-lg px-6 py-2" id="display-${timer.id}">
      ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
      <span class="text-lg align-top">.${ms.toString().padStart(3, '0')}</span>
    </div>
    <div class="flex gap-2">
      <button id="start-${timer.id}" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition" ${timer.running ? 'disabled' : ''}>Start</button>
      <button id="pause-${timer.id}" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" ${!timer.running ? 'disabled' : ''}>Pause</button>
      <button id="reset-${timer.id}" class="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Reset</button>
      <button id="delete-${timer.id}" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Eliminar</button>
    </div>
  `;

  // Asignar eventos SOLO una vez
  container.querySelector(`#start-${timer.id}`).onclick = () => {
    timer.start();
    updateCronometroUI(timer);
  };
  container.querySelector(`#pause-${timer.id}`).onclick = () => {
    timer.pause();
    updateCronometroUI(timer);
  };
  container.querySelector(`#reset-${timer.id}`).onclick = () => {
    timer.reset();
    updateCronometroUI(timer);
  };
  container.querySelector(`#delete-${timer.id}`).onclick = () => {
    timer.pause();
    timerManager.removeTimer(timer.id);
    renderAllCronometrosUI();
  };

  return container;
}

function updateCronometroUI(timer) {
  const display = document.getElementById(`display-${timer.id}`);
  if (!display) return;
  const { hours, minutes, seconds, ms } = timer.getTime();
  display.innerHTML = `
    ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
    <span class="text-lg align-top">.${ms.toString().padStart(3, '0')}</span>
  `;

  // Actualiza el estado de los botones
  const startBtn = document.getElementById(`start-${timer.id}`);
  const pauseBtn = document.getElementById(`pause-${timer.id}`);
  if (startBtn) startBtn.disabled = timer.running;
  if (pauseBtn) pauseBtn.disabled = !timer.running;
}

// --- Renderizado UI para cuenta regresiva ---
function renderCuentaRegresiva() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Cuentas regresivas</h2>
      <button id="btn-volver" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Volver</button>
    </div>
    <form id="form-cuenta" class="flex flex-wrap gap-2 mb-6 items-end">
      <div>
        <label class="block text-sm">Horas</label>
        <input type="number" min="0" max="23" value="0" id="input-horas" class="w-16 p-2 border rounded text-lg" />
      </div>
      <div>
        <label class="block text-sm">Minutos</label>
        <input type="number" min="0" max="59" value="0" id="input-minutos" class="w-16 p-2 border rounded text-lg" />
      </div>
      <div>
        <label class="block text-sm">Segundos</label>
        <input type="number" min="0" max="59" value="0" id="input-segundos" class="w-16 p-2 border rounded text-lg" />
      </div>
      <button type="submit" class="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">+ Añadir</button>
    </form>
    <div id="cuentas-list"></div>
  `;

  document.getElementById('btn-volver').onclick = () => {
    timerManager.timers.forEach(t => t.stopInterval());
    timerManager.timers = [];
    renderPantallaSeleccion();
  };

  document.getElementById('form-cuenta').onsubmit = e => {
    e.preventDefault();
    const horas = parseInt(document.getElementById('input-horas').value) || 0;
    const minutos = parseInt(document.getElementById('input-minutos').value) || 0;
    const segundos = parseInt(document.getElementById('input-segundos').value) || 0;
    const totalMs = ((horas * 3600) + (minutos * 60) + segundos) * 1000;
    if (totalMs > 0) {
      timerManager.addCuentaRegresiva(
        totalMs,
        updateCuentaRegresivaUI,
        cuentaRegresivaFinalizada
      );
      renderAllCuentasRegresivasUI();
    }
  };

  renderAllCuentasRegresivasUI();
}

function renderAllCuentasRegresivasUI() {
  const list = document.getElementById('cuentas-list');
  if (!list) return;
  const cuentas = timerManager.timers.filter(t => t instanceof CuentaRegresiva);
  if (cuentas.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-500">No hay cuentas regresivas activas.</p>`;
    return;
  }
  list.innerHTML = '';
  cuentas.forEach(timer => {
    list.appendChild(createCuentaRegresivaElement(timer));
  });
}

function createCuentaRegresivaElement(timer) {
  const { hours, minutes, seconds, ms } = timer.getTime();
  const container = document.createElement('div');
  container.className = "flex items-center gap-4 mb-4 p-4 bg-green-100 rounded-xl shadow";
  container.id = `cuenta-${timer.id}`;
  container.innerHTML = `
    <div class="flex-1 text-4xl font-mono tracking-widest bg-green-50 rounded-lg px-6 py-2" id="display-cuenta-${timer.id}">
      ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
      <span class="text-lg align-top">.${ms.toString().padStart(3, '0')}</span>
    </div>
    <div class="flex gap-2">
      <button id="start-cuenta-${timer.id}" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition" ${timer.running ? 'disabled' : ''}>Start</button>
      <button id="pause-cuenta-${timer.id}" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" ${!timer.running ? 'disabled' : ''}>Pause</button>
      <button id="reset-cuenta-${timer.id}" class="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Reset</button>
      <button id="delete-cuenta-${timer.id}" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Eliminar</button>
    </div>
  `;

  container.querySelector(`#start-cuenta-${timer.id}`).onclick = () => {
    timer.start();
    updateCuentaRegresivaUI(timer);
  };
  container.querySelector(`#pause-cuenta-${timer.id}`).onclick = () => {
    timer.pause();
    updateCuentaRegresivaUI(timer);
  };
  container.querySelector(`#reset-cuenta-${timer.id}`).onclick = () => {
    timer.reset();
    updateCuentaRegresivaUI(timer);
  };
  container.querySelector(`#delete-cuenta-${timer.id}`).onclick = () => {
    timer.pause();
    timerManager.removeTimer(timer.id);
    renderAllCuentasRegresivasUI();
  };

  return container;
}

function updateCuentaRegresivaUI(timer) {
  const display = document.getElementById(`display-cuenta-${timer.id}`);
  if (!display) return;
  const { hours, minutes, seconds, ms } = timer.getTime();
  display.innerHTML = `
    ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
    <span class="text-lg align-top">.${ms.toString().padStart(3, '0')}</span>
  `;
  const startBtn = document.getElementById(`start-cuenta-${timer.id}`);
  const pauseBtn = document.getElementById(`pause-cuenta-${timer.id}`);
  if (startBtn) startBtn.disabled = timer.running;
  if (pauseBtn) pauseBtn.disabled = !timer.running;
}

function cuentaRegresivaFinalizada(timer) {
  updateCuentaRegresivaUI(timer);
  // Notificación
  if (window.Notification && Notification.permission === "granted") {
    new Notification("¡Cuenta regresiva finalizada!");
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("¡Cuenta regresiva finalizada!");
      }
    });
  }
  // Sonido
  const audio = document.getElementById('alarm-sound');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}