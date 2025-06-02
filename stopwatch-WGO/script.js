// script.js

// =====================================
// Módulo de Utilidades
// =====================================
class Utils {
    static formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;

        return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(seconds, 2)}:${this.pad(milliseconds, 3)}`;
    }

    static formatCountdownTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(seconds, 2)}`;
    }

    static pad(num, size) {
        return num.toString().padStart(size, '0');
    }

    static playSound() {
        const audio = new Audio('./bell.mp3'); // ¡IMPORTANTE! Reemplaza con la ruta de tu archivo de sonido
        audio.play().catch(e => console.error("Error al reproducir el sonido:", e));
    }
}

// =====================================
// Módulo Cronómetro
// =====================================
class Stopwatch {
    constructor(displayElementId) {
        this.display = document.getElementById(displayElementId);
        this.timer = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;

        this.initEventListeners();
        this.updateDisplay();
    }

    initEventListeners() {
        document.getElementById('stopwatch-start').addEventListener('click', () => this.start());
        document.getElementById('stopwatch-pause').addEventListener('click', () => this.pause());
        document.getElementById('stopwatch-clear').addEventListener('click', () => this.clear());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.timer = setInterval(() => this.tick(), 10); // Actualiza cada 10ms para milisegundos
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
        }
    }

    clear() {
        this.pause();
        this.elapsedTime = 0;
        this.updateDisplay();
    }

    tick() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.textContent = Utils.formatTime(this.elapsedTime);
    }
}

// =====================================
// Módulo Cuenta Regresiva
// =====================================
class Countdown {
    constructor(displayElementId, hoursInputId, minutesInputId, secondsInputId, messageElementId) {
        this.display = document.getElementById(displayElementId);
        this.hoursInput = document.getElementById(hoursInputId);
        this.minutesInput = document.getElementById(minutesInputId);
        this.secondsInput = document.getElementById(secondsInputId);
        this.messageDisplay = document.getElementById(messageElementId);

        this.timer = null;
        this.initialTime = 0; // Tiempo total en milisegundos
        this.remainingTime = 0;
        this.isRunning = false;

        this.initEventListeners();
        this.updateDisplay(); // Inicializa el display
    }

    initEventListeners() {
        document.getElementById('countdown-start').addEventListener('click', () => this.start());
        document.getElementById('countdown-pause').addEventListener('click', () => this.pause());
        document.getElementById('countdown-reset').addEventListener('click', () => this.reset());

        document.getElementById('set-5min').addEventListener('click', () => this.setPreset(0, 5, 0));
        document.getElementById('set-10min').addEventListener('click', () => this.setPreset(0, 10, 0));
        document.getElementById('set-1hour').addEventListener('click', () => this.setPreset(1, 0, 0));
    }

    setPreset(h, m, s) {
        this.hoursInput.value = h;
        this.minutesInput.value = m;
        this.secondsInput.value = s;
        this.updateInitialTimeFromInputs();
        this.reset(); // Reinicia al tiempo preestablecido
    }

    updateInitialTimeFromInputs() {
        const h = parseInt(this.hoursInput.value) || 0;
        const m = parseInt(this.minutesInput.value) || 0;
        const s = parseInt(this.secondsInput.value) || 0;
        this.initialTime = (h * 3600 + m * 60 + s) * 1000;
        if (!this.isRunning) { // Solo si no está corriendo, actualiza el remainingTime
            this.remainingTime = this.initialTime;
            this.updateDisplay();
        }
    }

    start() {
        if (!this.isRunning) {
            this.messageDisplay.classList.add('d-none'); // Oculta cualquier mensaje
            if (this.remainingTime <= 0) {
                this.updateInitialTimeFromInputs(); // Si no hay tiempo o ya finalizó, toma de los inputs
            }

            if (this.remainingTime > 0) {
                this.isRunning = true;
                this.timer = setInterval(() => this.tick(), 1000); // Actualiza cada segundo
            } else {
                this.showMessage("Por favor, configure un tiempo para la cuenta regresiva.");
            }
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
        }
    }

    reset() {
        this.pause();
        this.updateInitialTimeFromInputs(); // Vuelve a cargar el tiempo inicial de los inputs
        this.remainingTime = this.initialTime;
        this.updateDisplay();
        this.messageDisplay.classList.add('d-none'); // Oculta el mensaje
    }

    tick() {
        if (this.remainingTime > 0) {
            this.remainingTime -= 1000;
            this.updateDisplay();
        } else {
            this.finish();
        }
    }

    updateDisplay() {
        this.display.textContent = Utils.formatCountdownTime(this.remainingTime);
    }

    finish() {
        this.pause();
        this.showMessage("¡Tiempo Finalizado!");
        Utils.playSound();
        this.remainingTime = 0; // Asegura que el display se vea en 00:00:00
        this.updateDisplay();
    }

    showMessage(msg) {
        this.messageDisplay.textContent = msg;
        this.messageDisplay.classList.remove('d-none');
    }
}

// =====================================
// Inicialización
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch('stopwatch-display');
    new Countdown('countdown-display', 'countdown-hours', 'countdown-minutes', 'countdown-seconds', 'countdown-message');
});