// script.js
// Versión multi relojes: permite agregar múltiples cronómetros y cuentas regresivas independientes

class Chronometer {
    constructor(container) {
        this.time = 0;
        this.interval = null;
        this.lastTime = null;
        this.running = false;
        this.container = container;
        this.createUI();
        this.updateDisplay();
    }
    createUI() {
        this.display = document.createElement('div');
        this.display.className = 'display';
        this.display.innerHTML = '00:00:00 <span class="ms">000</span>';
        this.controls = document.createElement('div');
        this.controls.className = 'controls';
        this.startBtn = document.createElement('button');
        this.startBtn.className = 'btn start';
        this.startBtn.textContent = 'Start';
        this.clearBtn = document.createElement('button');
        this.clearBtn.className = 'btn clear';
        this.clearBtn.textContent = 'Clear';
        this.controls.appendChild(this.startBtn);
        this.controls.appendChild(this.clearBtn);
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'clock-wrapper';
        this.wrapper.appendChild(this.display);
        this.wrapper.appendChild(this.controls);
        this.container.appendChild(this.wrapper);
        this.startBtn.addEventListener('click', () => {
            if (!this.running) {
                this.start();
                this.startBtn.textContent = 'Pause';
            } else {
                this.pause();
                this.startBtn.textContent = 'Start';
            }
            this.running = !this.running;
        });
        this.clearBtn.addEventListener('click', () => {
            this.reset();
            this.startBtn.textContent = 'Start';
            this.running = false;
        });
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

class Countdown {
    constructor(container) {
        this.time = 0;
        this.interval = null;
        this.lastTime = null;
        this.running = false;
        this.container = container;
        this.createUI();
        this.updateDisplay();
    }
    createUI() {
        this.display = document.createElement('div');
        this.display.className = 'display';
        this.display.innerHTML = '00:00 <span class="ms">000</span>';
        this.controls = document.createElement('div');
        this.controls.className = 'controls';
        this.minInput = document.createElement('input');
        this.minInput.type = 'number';
        this.minInput.min = 0;
        this.minInput.max = 99;
        this.minInput.placeholder = 'Minutos';
        this.secInput = document.createElement('input');
        this.secInput.type = 'number';
        this.secInput.min = 0;
        this.secInput.max = 59;
        this.secInput.placeholder = 'Segundos';
        this.startBtn = document.createElement('button');
        this.startBtn.className = 'btn start';
        this.startBtn.textContent = 'Start Countdown';
        this.clearBtn = document.createElement('button');
        this.clearBtn.className = 'btn clear';
        this.clearBtn.textContent = 'Clear Countdown';
        this.controls.appendChild(this.minInput);
        this.controls.appendChild(this.secInput);
        this.controls.appendChild(this.startBtn);
        this.controls.appendChild(this.clearBtn);
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'clock-wrapper';
        this.wrapper.appendChild(this.display);
        this.wrapper.appendChild(this.controls);
        this.container.appendChild(this.wrapper);
        this.startBtn.addEventListener('click', () => {
            if (!this.running) {
                this.start();
                this.startBtn.textContent = 'Stop';
            } else {
                this.stop();
                this.startBtn.textContent = 'Start Countdown';
            }
            this.running = !this.running;
        });
        this.clearBtn.addEventListener('click', () => {
            this.reset();
            this.startBtn.textContent = 'Start Countdown';
            this.running = false;
        });
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

// Lógica para agregar relojes dinámicamente
const clocksContainer = document.getElementById('clocks-container');
document.getElementById('addChrono').addEventListener('click', () => {
    new Chronometer(clocksContainer);
});
document.getElementById('addCountdown').addEventListener('click', () => {
    new Countdown(clocksContainer);
});
