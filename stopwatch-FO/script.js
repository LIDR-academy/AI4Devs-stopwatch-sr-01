// Contenedor principal
const timersContainer = document.getElementById('timersContainer');

// Función para reproducir un sonido de alerta generado dinámicamente
function playBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1000, context.currentTime); // Frecuencia en Hz
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
  oscillator.stop(context.currentTime + 1);
}

// Función para mostrar una notificación tipo "bubble" en la propia página
function showInPageNotification(message, container) {
  const notification = container.querySelector('.notification');
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

// Función para formatear el tiempo en formato hh:mm:ss
function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Clase para Cronómetro
class Stopwatch {
  constructor(container) {
    this.container = container;
    this.display = container.querySelector('.display');
    this.startBtn = container.querySelector('.start');
    this.resetBtn = container.querySelector('.reset');
    this.lapBtn = container.querySelector('.lap');
    this.lapsList = container.querySelector('.laps');
    this.interval = null;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.lastLapTime = 0;

    this.startBtn.addEventListener('click', () => this.toggle());
    this.resetBtn.addEventListener('click', () => this.reset());
    this.lapBtn.addEventListener('click', () => this.lap());
  }

  toggle() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.elapsedTime += Date.now() - this.startTime;
      this.startBtn.textContent = 'Iniciar';
    } else {
      this.startTime = Date.now();
      this.interval = setInterval(() => this.update(), 10);
      this.startBtn.textContent = 'Pausar';
    }
  }

  reset() {
    clearInterval(this.interval);
    this.interval = null;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.lastLapTime = 0;
    this.display.textContent = '00:00:00.000';
    this.startBtn.textContent = 'Iniciar';
    this.lapsList.innerHTML = '';
  }

  lap() {
    if (!this.interval) return;
    const now = Date.now();
    const totalElapsed = this.elapsedTime + (now - this.startTime);
    const lapTime = totalElapsed - this.lastLapTime;
    this.lastLapTime = totalElapsed;

    const li = document.createElement('li');
    li.textContent = `Vuelta ${this.lapsList.children.length + 1} — ${this.formatMilliseconds(lapTime)} (Total: ${this.formatMilliseconds(totalElapsed)})`;
    this.lapsList.appendChild(li);
  }

  update() {
    const now = Date.now();
    const totalElapsed = this.elapsedTime + (now - this.startTime);
    this.display.textContent = this.formatMilliseconds(totalElapsed);
  }

  formatMilliseconds(ms) {
    const date = new Date(ms);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}

// Clase para Temporizador
class Countdown {
  constructor(container) {
    this.container = container;
    this.display = container.querySelector('.display');
    this.startBtn = container.querySelector('.start');
    this.resetBtn = container.querySelector('.reset');
    this.inputs = container.querySelectorAll('input');
    this.notification = container.querySelector('.notification');
    this.interval = null;
    this.remainingTime = 0;

    this.startBtn.addEventListener('click', () => this.toggle());
    this.resetBtn.addEventListener('click', () => this.reset());
  }

  toggle() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.startBtn.textContent = 'Iniciar';
    } else {
      const h = parseInt(this.inputs[0].value) || 0;
      const m = parseInt(this.inputs[1].value) || 0;
      const s = parseInt(this.inputs[2].value) || 0;
      this.remainingTime = h * 3600 + m * 60 + s;
      if (this.remainingTime <= 0) return;
      this.updateDisplay();
      this.interval = setInterval(() => this.update(), 1000);
      this.startBtn.textContent = 'Pausar';
    }
  }

  reset() {
    clearInterval(this.interval);
    this.interval = null;
    this.remainingTime = 0;
    this.updateDisplay();
    this.startBtn.textContent = 'Iniciar';
    this.notification.style.display = 'none';
  }

  update() {
    if (this.remainingTime <= 0) {
      clearInterval(this.interval);
      this.interval = null;
      this.startBtn.textContent = 'Iniciar';
      this.updateDisplay();
      playBeep();
      showInPageNotification('⏰ ¡Temporizador finalizado!', this.container);
      return;
    }
    this.remainingTime--;
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.textContent = formatTime(this.remainingTime);
  }
}

// Función para añadir un nuevo cronómetro
function addStopwatch() {
  const card = document.createElement('div');
  card.className = 'timer-card';
  card.innerHTML = `
    <h2>Cronómetro</h2>
    <div class="display">00:00:00.000</div>
    <div class="buttons">
      <button class="start">Iniciar</button>
      <button class="reset">Reiniciar</button>
      <button class="lap">Vuelta</button>
    </div>
    <ul class="laps"></ul>
    <div class="notification"></div>
  `;
  timersContainer.appendChild(card);
  new Stopwatch(card);
}

// Función para añadir un nuevo temporizador
function addCountdown() {
  const card = document.createElement('div');
  card.className = 'timer-card';
  card.innerHTML = `
    <h2>Temporizador</h2>
    <div class="countdown-inputs">
      <input type="number" min="0" placeholder="Horas" />
      <input type="number" min="0" placeholder="Minutos" />
      <input type="number" min="0" placeholder="Segundos" />
    </div>
    <div class="display">00:00:00</div>
    <div class="buttons">
      <button class="start">Iniciar</button>
      <button class="reset">Reiniciar</button>
    </div>
    <div class="notification"></div>
  `;
  timersContainer.appendChild(card);
  new Countdown(card);
}