// script.js
// Estructura base para cronómetro y cuenta regresiva

// Clase Chronometer
class Chronometer {
    constructor(display) {
        this.display = display;
        this.reset();
        this.interval = null;
    }

    start() {
        if (this.interval) return;
        this.lastTime = Date.now();
        this.interval = setInterval(() => this.update(), 10);
    }

    pause() {
        clearInterval(this.interval);
        this.interval = null;
    }

    reset() {
        this.time = 0;
        this.updateDisplay();
        this.pause();
    }

    update() {
        const now = Date.now();
        this.time += now - this.lastTime;
        this.lastTime = now;
        this.updateDisplay();
    }

    updateDisplay() {
        const ms = this.time % 1000;
        const totalSeconds = Math.floor(this.time / 1000);
        const s = totalSeconds % 60;
        const m = Math.floor(totalSeconds / 60);
        this.display.innerHTML =
            `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:00 <span class="ms">${String(Math.floor(ms)).padStart(3, '0')}</span>`;
    }
}

// Clase Countdown
class Countdown {
    constructor(display, minInput, secInput) {
        this.display = display;
        this.minInput = minInput;
        this.secInput = secInput;
        this.reset();
        this.interval = null;
    }

    start() {
        if (this.interval) return;
        if (!this.running) {
            const mins = parseInt(this.minInput.value) || 0;
            const secs = parseInt(this.secInput.value) || 0;
            this.time = (mins * 60 + secs) * 1000;
            this.running = true;
        }
        this.lastTime = Date.now();
        this.interval = setInterval(() => this.update(), 10);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
        this.running = false;
    }

    reset() {
        this.stop();
        this.time = 0;
        this.updateDisplay();
    }

    update() {
        const now = Date.now();
        this.time -= now - this.lastTime;
        this.lastTime = now;
        if (this.time <= 0) {
            this.time = 0;
            this.updateDisplay();
            this.stop();
            return;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        const ms = this.time % 1000;
        const totalSeconds = Math.floor(this.time / 1000);
        const s = totalSeconds % 60;
        const m = Math.floor(totalSeconds / 60);
        this.display.innerHTML =
            `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} <span class="ms">${String(Math.floor(ms)).padStart(3, '0')}</span>`;
    }
}

// Instanciar y conectar controles
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');

const chronometer = new Chronometer(display);
let running = false;

startBtn.addEventListener('click', () => {
    if (!running) {
        chronometer.start();
        startBtn.textContent = 'Pause';
    } else {
        chronometer.pause();
        startBtn.textContent = 'Start';
    }
    running = !running;
});

clearBtn.addEventListener('click', () => {
    chronometer.reset();
    startBtn.textContent = 'Start';
    running = false;
});

// Cuenta regresiva
const cdDisplay = document.getElementById('cd-display');
const cdStartBtn = document.getElementById('cd-startBtn');
const cdClearBtn = document.getElementById('cd-clearBtn');
const cdMinutes = document.getElementById('cd-minutes');
const cdSeconds = document.getElementById('cd-seconds');

const countdown = new Countdown(cdDisplay, cdMinutes, cdSeconds);
let cdRunning = false;

cdStartBtn.addEventListener('click', () => {
    if (!cdRunning) {
        countdown.start();
        cdStartBtn.textContent = 'Stop';
    } else {
        countdown.stop();
        cdStartBtn.textContent = 'Start Countdown';
    }
    cdRunning = !cdRunning;
});

cdClearBtn.addEventListener('click', () => {
    countdown.reset();
    cdStartBtn.textContent = 'Start Countdown';
    cdRunning = false;
});
