// script.js

// —————————————————————————————————————————————————————
//  CONTADORES DE INSTANCIAS PARA GENERAR IDs ÚNICOS
// —————————————————————————————————————————————————————
let stopwatchCount = 0;
let countdownCount = 0;

// Cuando el DOM esté listo, asociamos los eventos de “+ Cronómetro” y “+ Cuenta regresiva”
document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('add-stopwatch')
    .addEventListener('click', () => insertarComponente('stopwatch'));

  document
    .getElementById('add-countdown')
    .addEventListener('click', () => insertarComponente('countdown'));
});

// —————————————————————————————————————————————————————
//  FUNCIÓN PRINCIPAL: INSERTAR COMPONENTE EN PANTALLA
// —————————————————————————————————————————————————————
function insertarComponente(tipo) {
  const container = document.getElementById('timers-container');

  if (tipo === 'stopwatch') {
    stopwatchCount++;
    const idCard = `stopwatch-${stopwatchCount}`;
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.id = idCard;
    col.innerHTML = generarTemplateStopwatch(idCard);
    container.appendChild(col);

    // Instanciar nuevo cronómetro
    new Stopwatch(idCard);
  } else if (tipo === 'countdown') {
    countdownCount++;
    const idCard = `countdown-${countdownCount}`;
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.id = idCard;
    col.innerHTML = generarTemplateCountdown(idCard);
    container.appendChild(col);

    // Instanciar nuevo temporizador de cuenta atrás
    new CountdownTimer(idCard);
  }
}

// —————————————————————————————————————————————————————
//  PLANTILLAS HTML DINÁMICAS
// —————————————————————————————————————————————————————

// 1) Template para Cronómetro
function generarTemplateStopwatch(id) {
  return `
    <div class="card stopwatch-card shadow-sm">
      <div class="card-body">
        <!-- Pantalla del cronómetro -->
        <div class="time-display mb-3">
          <div class="d-flex justify-content-center align-items-end">
            <span class="hms" id="${id}-hms">00:00:00</span>
            <span class="ms" id="${id}-ms">000</span>
          </div>
        </div>

        <!-- Botones: Start y Clear -->
        <div class="timer-buttons">
          <button class="stopwatch-btn start" id="${id}-start">Start</button>
          <button class="stopwatch-btn clear" id="${id}-clear">Clear</button>
        </div>
      </div>
    </div>
  `;
}

// 2) Template para Cuenta Regresiva
function generarTemplateCountdown(id) {
  return `
    <div class="card countdown-card shadow-sm">
      <div class="card-body">
        <!-- Pantalla HH:MM:SS -->
        <div class="countdown-display mb-3">
          <span class="hms" id="${id}-hms">00:00:00</span>
        </div>

        <!-- FASE 1: TECLADO NUMÉRICO (solo números + Set + Clear) -->
        <div class="keypad" id="${id}-keypad">
          <!-- Primera fila: 5,6,7,8,9, Set -->
          <div class="row">
            <button class="key-btn" data-digit="5">5</button>
            <button class="key-btn" data-digit="6">6</button>
            <button class="key-btn" data-digit="7">7</button>
            <button class="key-btn" data-digit="8">8</button>
            <button class="key-btn" data-digit="9">9</button>
            <button class="set-btn" id="${id}-set">Set</button>
          </div>
          <!-- Segunda fila: 0,1,2,3,4, Clear -->
          <div class="row">
            <button class="key-btn" data-digit="0">0</button>
            <button class="key-btn" data-digit="1">1</button>
            <button class="key-btn" data-digit="2">2</button>
            <button class="key-btn" data-digit="3">3</button>
            <button class="key-btn" data-digit="4">4</button>
            <button class="clear-input-btn" id="${id}-clear-input">Clear</button>
          </div>
        </div>

        <!-- FASE 2: Botones Start/Pause, Reset y Delete (ocultos inicialmente) -->
        <div class="countdown-active-buttons" id="${id}-active-buttons">
          <button class="stopwatch-btn start" id="${id}-start">Start</button>
          <button class="stopwatch-btn reset" id="${id}-reset">Reset</button>
          <button class="stopwatch-btn delete" id="${id}-delete">Delete</button>
        </div>
      </div>
    </div>
  `;
}

// —————————————————————————————————————————————————————
//  CLASE Stopwatch (Cronómetro)
// —————————————————————————————————————————————————————
class Stopwatch {
  constructor(containerId) {
    // Referencias al DOM
    this.container = document.getElementById(containerId);
    this.hmsEl = document.getElementById(`${containerId}-hms`);
    this.msEl = document.getElementById(`${containerId}-ms`);
    this.btnStart = document.getElementById(`${containerId}-start`);
    this.btnClear = document.getElementById(`${containerId}-clear`);

    // Variables internas de tiempo
    this.startTime = 0;     // instante en ms cuando se pulsó Start
    this.elapsed = 0;       // ms transcurridos totales
    this.intervalId = null; // ID de setInterval
    this.running = false;   // true = corriendo, false = pausado

    // Asociar eventos
    this.btnStart.addEventListener('click', () => this.toggle());
    this.btnClear.addEventListener('click', () => this.reset());

    // Iniciar la visualización en 00:00:00.000
    this.updateDisplay(0);
  }

  // Iniciar / Pausar el cronómetro
  toggle() {
    if (!this.running) {
      // Arrancar
      this.startTime = Date.now() - this.elapsed;
      this.intervalId = setInterval(() => {
        this.elapsed = Date.now() - this.startTime;
        this.updateDisplay(this.elapsed);
      }, 10);
      this.btnStart.textContent = 'Pause';
      this.running = true;
    } else {
      // Pausar
      clearInterval(this.intervalId);
      this.running = false;
      this.btnStart.textContent = 'Start';
    }
  }

  // Resetear a 00:00:00.000
  reset() {
    clearInterval(this.intervalId);
    this.elapsed = 0;
    this.running = false;
    this.btnStart.textContent = 'Start';
    this.updateDisplay(0);
  }

  // Formatear milisegundos a hh:mm:ss + ms
  updateDisplay(milliseconds) {
    const totalMs = milliseconds;
    const ms = totalMs % 1000;
    const totalSeconds = Math.floor(totalMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    const pad = (val, digits) => val.toString().padStart(digits, '0');
    this.hmsEl.textContent = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
    this.msEl.textContent = pad(ms, 3);
  }
}

// —————————————————————————————————————————————————————
//  CLASE CountdownTimer (Cuenta Regresiva)
// —————————————————————————————————————————————————————
class CountdownTimer {
  constructor(containerId) {
    // Referencias al DOM
    this.container = document.getElementById(containerId);
    this.hmsEl = document.getElementById(`${containerId}-hms`);
    this.keypad = document.getElementById(`${containerId}-keypad`);
    this.btnSet = document.getElementById(`${containerId}-set`);
    this.btnClearInput = document.getElementById(`${containerId}-clear-input`);
    this.activeButtons = document.getElementById(`${containerId}-active-buttons`);
    this.btnStart = document.getElementById(`${containerId}-start`);
    this.btnReset = document.getElementById(`${containerId}-reset`);
    this.btnDelete = document.getElementById(`${containerId}-delete`);

    // Variables internas
    this.inputDigits = '';      // hasta 6 dígitos (hhmmss)
    this.originalSeconds = 0;   // segundos configurados con Set
    this.remainingSeconds = 0;  // segundos restantes
    this.intervalId = null;
    this.state = 'input';       // 'input' (fase 1), 'ready' (tras Set), 'running', 'paused', 'finished'

    // ===== Inicialmente: mostrar solo teclado (fase 1), ocultar botones fase 2 =====
    this.keypad.style.display = 'block';
    this.activeButtons.style.display = 'none';

    // Asociar eventos fase 1
    this.keypad.querySelectorAll('.key-btn').forEach((btn) => {
      btn.addEventListener('click', (e) =>
        this.inputDigit(e.currentTarget.dataset.digit)
      );
    });
    this.btnClearInput.addEventListener('click', () => this.clearInput());
    this.btnSet.addEventListener('click', () => this.setCountdown());

    // Asociar eventos fase 2 (aunque estén ocultos al principio)
    this.btnStart.addEventListener('click', () => this.toggle());
    this.btnReset.addEventListener('click', () => this.reset());
    this.btnDelete.addEventListener('click', () => this.delete());

    // Mostrar “00:00:00” al crearse
    this.updateDisplay(0);
  }

  // ——————— FASE 1: ENTRADA DE DÍGITOS ———————

  inputDigit(digit) {
    if (this.state !== 'input') return;
    if (this.inputDigits.length >= 6) return; // máximo 6 dígitos (hhmmss)

    // Concatenar dígito
    this.inputDigits += digit.toString();

    // Rellenar con ceros a la izquierda hasta longitud 6
    const padded = this.inputDigits.padStart(6, '0');
    const hh = parseInt(padded.slice(0, 2), 10);
    const mm = parseInt(padded.slice(2, 4), 10);
    const ss = parseInt(padded.slice(4, 6), 10);

    const totalSecs = hh * 3600 + mm * 60 + ss;
    this.updateDisplay(totalSecs);
  }

  clearInput() {
    if (this.state !== 'input') return;
    this.inputDigits = '';
    this.updateDisplay(0);
  }

  setCountdown() {
    if (this.state !== 'input') return;
    const text = this.hmsEl.textContent; // "HH:MM:SS"
    const [hhStr, mmStr, ssStr] = text.split(':');
    const hh = parseInt(hhStr, 10);
    const mm = parseInt(mmStr, 10);
    const ss = parseInt(ssStr, 10);

    const totalSecs = hh * 3600 + mm * 60 + ss;
    if (totalSecs <= 0) {
      // Si es 00:00:00, no pasamos a fase 2
      return;
    }

    this.originalSeconds = totalSecs;
    this.remainingSeconds = totalSecs;
    this.state = 'ready';

    // — Ocultar teclado (fase 1) —
    this.keypad.style.display = 'none';
    // — Mostrar botones fase 2 —
    this.activeButtons.style.display = 'flex';
    this.container.classList.remove('countdown-finished');

    // Asegurar que el botón Start muestre "Start"
    this.btnStart.textContent = 'Start';
  }

  // ——————— FASE 2: EJECUCIÓN DE LA CUENTA ATRÁS ———————

  toggle() {
    if (this.state === 'ready' || this.state === 'paused') {
      this.startCountdown();
    } else if (this.state === 'running') {
      this.pauseCountdown();
    }
  }

  startCountdown() {
    if (this.remainingSeconds <= 0) return;

    this.state = 'running';
    this.btnStart.textContent = 'Pause';
    const startTime = Date.now();
    const endTime = startTime + this.remainingSeconds * 1000;

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const diffMs = endTime - now;
      if (diffMs <= 0) {
        // Termina la cuenta regresiva
        clearInterval(this.intervalId);
        this.remainingSeconds = 0;
        this.updateDisplay(0);
        this.finishCountdown();
      } else {
        // Actualizar segundos restantes (redondeo hacia arriba)
        this.remainingSeconds = Math.ceil(diffMs / 1000);
        this.updateDisplay(this.remainingSeconds);
      }
    }, 250); // cada 250 ms para no sobrecargar
  }

  pauseCountdown() {
    clearInterval(this.intervalId);
    this.state = 'paused';
    this.btnStart.textContent = 'Start';
  }

  reset() {
    clearInterval(this.intervalId);
    this.remainingSeconds = this.originalSeconds;
    this.updateDisplay(this.originalSeconds);
    this.state = 'ready';
    this.btnStart.textContent = 'Start';
    this.container.querySelector('.card').classList.remove('countdown-finished');
  }

  finishCountdown() {
    this.state = 'finished';
    // Reproducir sonido
    const audio = document.getElementById('alarm-audio');
    if (audio) audio.play();

    // Notificación visual
    alert('¡Cuenta regresiva finalizada!');
    // Resaltar la tarjeta
    this.container.querySelector('.card').classList.add('countdown-finished');

    // Dejar Start como “Start” por si se pulsa Reset
    this.btnStart.textContent = 'Start';
  }

  delete() {
    clearInterval(this.intervalId);
    this.container.remove();
  }

  updateDisplay(totalSeconds) {
    const pad = (val) => val.toString().padStart(2, '0');
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;
    this.hmsEl.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }
}
