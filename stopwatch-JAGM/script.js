class TimerManager {
  constructor() {
    this.timers = [];
    this.activeTimerId = null;
    this.maxTimers = 3;
    this.timerIdCounter = 1;
    this.audioContext = null;
    this.soundEnabled = true;

    this.initializeAudio();
    this.loadFromStorage();
    this.updateUI();
    this.requestNotificationPermission();
  }

  initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Audio not supported");
    }
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  playBeep() {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (e) {
      console.warn("Could not play beep:", e);
    }
  }

  addTimer(type) {
    if (this.timers.length >= this.maxTimers) {
      alert(`Máximo ${this.maxTimers} temporizadores permitidos`);
      return;
    }

    const timer = new Timer(this.timerIdCounter++, type, this);
    this.timers.push(timer);
    this.activeTimerId = timer.id;
    this.updateUI();
    this.saveToStorage();
  }

  removeTimer(id) {
    const index = this.timers.findIndex(t => t.id === id);
    if (index !== -1) {
      this.timers[index].stop();
      this.timers.splice(index, 1);

      if (this.activeTimerId === id) {
        this.activeTimerId = this.timers.length > 0 ? this.timers[0].id : null;
      }

      this.updateUI();
      this.saveToStorage();
    }
  }

  setActiveTimer(id) {
    this.activeTimerId = id;
    this.updateUI();
  }

  getActiveTimer() {
    return this.timers.find(t => t.id === this.activeTimerId);
  }

  updateUI() {
    this.updateTabs();
    this.updateContent();
    this.updateAddButtons();
  }

  updateTabs() {
    const tabsContainer = document.getElementById("tabsContainer");
    tabsContainer.innerHTML = "";

    this.timers.forEach(timer => {
      const tab = document.createElement("div");
      tab.className = `tab ${timer.id === this.activeTimerId ? "active" : ""}`;
      tab.onclick = () => this.setActiveTimer(timer.id);

      tab.innerHTML = `
                <div class="tab-name">${timer.name}</div>
                <div class="tab-type">${
                  timer.type === "stopwatch" ? "Cronómetro" : "Cuenta Regresiva"
                }</div>
                <button class="close-tab" onclick="event.stopPropagation(); timerManager.removeTimer(${
                  timer.id
                })">×</button>
            `;

      tabsContainer.appendChild(tab);
    });
  }

  updateContent() {
    const content = document.getElementById("timerContent");
    const activeTimer = this.getActiveTimer();

    if (!activeTimer) {
      content.innerHTML = `
                <div class="empty-state">
                    <h3>¡Comienza agregando un temporizador!</h3>
                    <p>Puedes crear hasta 3 cronómetros o cuentas regresivas simultáneamente.</p>
                </div>
            `;
      return;
    }

    content.innerHTML = activeTimer.getHTML();
    activeTimer.bindEvents();
  }

  updateAddButtons() {
    const addStopwatch = document.getElementById("addStopwatch");
    const addCountdown = document.getElementById("addCountdown");
    const disabled = this.timers.length >= this.maxTimers;

    addStopwatch.disabled = disabled;
    addCountdown.disabled = disabled;
  }

  saveToStorage() {
    const data = this.timers.map(timer => ({
      id: timer.id,
      name: timer.name,
      type: timer.type,
      time: timer.time,
      initialTime: timer.initialTime,
      isRunning: timer.isRunning,
      isPaused: timer.isPaused,
    }));
    localStorage.setItem("timers", JSON.stringify(data));
    localStorage.setItem("activeTimerId", this.activeTimerId);
    localStorage.setItem("timerIdCounter", this.timerIdCounter);
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem("timers");
      const activeId = localStorage.getItem("activeTimerId");
      const counter = localStorage.getItem("timerIdCounter");

      if (counter) {
        this.timerIdCounter = parseInt(counter);
      }

      if (data) {
        const timersData = JSON.parse(data);
        timersData.forEach(timerData => {
          const timer = new Timer(timerData.id, timerData.type, this);
          timer.name = timerData.name;
          timer.time = timerData.time;
          timer.initialTime = timerData.initialTime;
          timer.isRunning = false; // Reset running state on load
          timer.isPaused = timerData.isPaused;
          this.timers.push(timer);
        });

        if (activeId && this.timers.find(t => t.id == activeId)) {
          this.activeTimerId = parseInt(activeId);
        } else if (this.timers.length > 0) {
          this.activeTimerId = this.timers[0].id;
        }
      }
    } catch (e) {
      console.warn("Could not load from storage:", e);
    }
  }

  showNotification(message) {
    // Visual notification
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Temporizador", {
        body: message,
        icon: "⏰",
      });
    }
  }
}

class Timer {
  constructor(id, type, manager) {
    this.id = id;
    this.type = type; // 'stopwatch' or 'countdown'
    this.manager = manager;
    this.name = `${type === "stopwatch" ? "Cronómetro" : "Cuenta Regresiva"} ${id}`;
    this.time = 0; // milliseconds
    this.initialTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.lastUpdate = 0;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastUpdate = Date.now();

    this.interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastUpdate;
      this.lastUpdate = now;

      if (this.type === "stopwatch") {
        this.time += elapsed;
      } else {
        this.time -= elapsed;
        if (this.time <= 0) {
          this.time = 0;
          this.finish();
          return;
        }
      }

      this.updateDisplay();
      this.manager.saveToStorage();
    }, 10);
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.interval);
    this.manager.saveToStorage();
  }

  reset() {
    this.stop();
    if (this.type === "stopwatch") {
      this.time = 0;
    } else {
      this.time = this.initialTime;
    }
    this.isPaused = false;
    this.updateDisplay();
    this.manager.saveToStorage();
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  finish() {
    this.stop();
    this.isPaused = false;
    this.manager.playBeep();
    this.manager.showNotification(`${this.name} ha terminado!`);
    this.updateDisplay();
    this.manager.saveToStorage();
  }

  setInitialTime(hours, minutes, seconds) {
    if (this.type !== "countdown") return;

    this.initialTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.time = this.initialTime;
    this.updateDisplay();
    this.manager.saveToStorage();
  }

  formatTime() {
    if (this.type === "stopwatch") {
      const totalMs = Math.floor(this.time);
      const minutes = Math.floor(totalMs / 60000);
      const seconds = Math.floor((totalMs % 60000) / 1000);
      const centiseconds = Math.floor((totalMs % 1000) / 10);

      return {
        main: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        sub: centiseconds.toString().padStart(2, "0"),
      };
    } else {
      const totalMs = Math.max(0, Math.floor(this.time));
      const hours = Math.floor(totalMs / 3600000);
      const minutes = Math.floor((totalMs % 3600000) / 60000);
      const seconds = Math.floor((totalMs % 60000) / 1000);

      return {
        main: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
        sub: "",
      };
    }
  }

  getStatus() {
    if (this.time === 0 && this.type === "countdown") return "finished";
    if (this.isRunning) return "running";
    if (this.isPaused) return "paused";
    return "stopped";
  }

  getStatusText() {
    const status = this.getStatus();
    switch (status) {
      case "running":
        return "Ejecutándose";
      case "paused":
        return "Pausado";
      case "finished":
        return "¡Terminado!";
      default:
        return "Detenido";
    }
  }

  updateDisplay() {
    const timeDisplay = document.getElementById(`time-${this.id}`);
    const millisDisplay = document.getElementById(`millis-${this.id}`);
    const statusDisplay = document.getElementById(`status-${this.id}`);

    if (timeDisplay) {
      const formatted = this.formatTime();
      timeDisplay.textContent = formatted.main;
      if (millisDisplay) {
        millisDisplay.textContent = formatted.sub;
      }
      if (statusDisplay) {
        statusDisplay.textContent = this.getStatusText();
        statusDisplay.className = `status ${this.getStatus()}`;
      }
    }
  }

  getHTML() {
    const formatted = this.formatTime();
    const status = this.getStatus();

    return `
            <div class="timer-setup">
                <label>
                    <input type="text" id="timer-name-${this.id}" value="${this.name}" 
                           onchange="timerManager.getActiveTimer().updateName(this.value)" 
                           placeholder="Nombre del temporizador">
                </label>
                ${
                  this.type === "countdown"
                    ? `
                    <label>Configurar tiempo (HH:MM:SS):</label>
                    <input type="text" id="time-input-${this.id}" placeholder="00:05:00" 
                           onchange="timerManager.getActiveTimer().parseTimeInput(this.value)"
                           pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}">
                `
                    : ""
                }
            </div>
            
            <div class="timer-display">
                <div class="time-display" id="time-${this.id}">${formatted.main}</div>
                ${
                  formatted.sub
                    ? `<div class="milliseconds" id="millis-${this.id}">${formatted.sub}</div>`
                    : ""
                }
                <div class="status ${status}" id="status-${this.id}">${this.getStatusText()}</div>
            </div>
            
            <div class="controls">
                <button class="btn btn-start" onclick="timerManager.getActiveTimer().start()" 
                        ${this.isRunning ? "disabled" : ""}>
                    Start
                </button>
                <button class="btn btn-pause" onclick="timerManager.getActiveTimer().pause()" 
                        ${!this.isRunning ? "disabled" : ""}>
                    Pause
                </button>
                <button class="btn btn-reset" onclick="timerManager.getActiveTimer().reset()">
                    Reset
                </button>
                <button class="btn btn-sound" onclick="timerManager.toggleSound()">
                    ${this.manager.soundEnabled ? "🔊" : "🔇"} Sound
                </button>
            </div>
        `;
  }

  bindEvents() {
    // Events are bound through onclick attributes in HTML
  }

  updateName(newName) {
    this.name =
      newName || `${this.type === "stopwatch" ? "Cronómetro" : "Cuenta Regresiva"} ${this.id}`;
    this.manager.updateTabs();
    this.manager.saveToStorage();
  }

  parseTimeInput(value) {
    if (this.type !== "countdown") return;

    const match = value.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);

      if (hours < 24 && minutes < 60 && seconds < 60) {
        this.setInitialTime(hours, minutes, seconds);
      } else {
        alert("Tiempo inválido. Use formato HH:MM:SS (máx 23:59:59)");
      }
    } else {
      alert("Formato inválido. Use HH:MM:SS (ej: 00:05:30)");
    }
  }
}

// Extend TimerManager with sound toggle
TimerManager.prototype.toggleSound = function () {
  this.soundEnabled = !this.soundEnabled;
  this.updateContent(); // Refresh to update button display
};

// Global instance
const timerManager = new TimerManager();

// Global functions for HTML onclick events
function addTimer(type) {
  timerManager.addTimer(type);
}

// Cleanup intervals when page unloads
window.addEventListener("beforeunload", () => {
  timerManager.timers.forEach(timer => timer.stop());
});
