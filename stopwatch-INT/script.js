// Select DOM elements
const timersContainer = document.getElementById("timers-container");
const addStopwatchBtn = document.getElementById("addStopwatch");
const addCountdownBtn = document.getElementById("addCountdown");
const alertSound = document.getElementById("alertSound");

let timerIdCounter = 0; // To assign unique IDs to timers

// Utility: format seconds into HH:MM:SS
function formatTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs]
    .map((val) => val.toString().padStart(2, "0"))
    .join(":");
}

// Timer Class to manage each timer instance
class Timer {
  constructor(mode = "stopwatch") {
    this.id = ++timerIdCounter;
    this.mode = mode; // 'stopwatch' or 'countdown'
    this.isRunning = false;
    this.isPaused = false;
    this.intervalId = null;
    this.timeInSeconds = 0; // current time in seconds
    this.initialCountdown = 0; // for countdown reset

    this.createElements();
    this.updateDisplay();
    this.updateModeUI();
  }

  // Create all required DOM elements for the timer card
  createElements() {
    // Main card
    this.card = document.createElement("article");
    this.card.classList.add("timer-card", "paused");
    this.card.setAttribute("role", "region");
    this.card.setAttribute("aria-label", `Timer ${this.id}`);

    // Header: mode toggle + mode label
    const header = document.createElement("div");
    header.className = "timer-header";

    const modeToggle = document.createElement("label");
    modeToggle.className = "mode-toggle";
    modeToggle.setAttribute("title", "Toggle Stopwatch / Countdown mode");
    modeToggle.setAttribute("aria-live", "polite");

    this.modeCheckbox = document.createElement("input");
    this.modeCheckbox.type = "checkbox";
    this.modeCheckbox.checked = this.mode === "countdown";
    this.modeCheckbox.setAttribute("aria-checked", this.modeCheckbox.checked);
    this.modeCheckbox.setAttribute("aria-label", "Toggle timer mode");

    this.modeText = document.createElement("span");
    this.modeText.textContent = this.modeCheckbox.checked
      ? "Countdown"
      : "Stopwatch";

    modeToggle.appendChild(this.modeCheckbox);
    modeToggle.appendChild(this.modeText);
    header.appendChild(modeToggle);

    // Timer info (icon + time)
    this.timerInfo = document.createElement("div");
    this.timerInfo.className = "timer-info";

    this.icon = document.createElement("i");
    this.icon.className = "fa-solid fa-stopwatch";

    this.timeDisplay = document.createElement("span");
    this.timeDisplay.textContent = "00:00:00";

    this.timerInfo.appendChild(this.icon);
    this.timerInfo.appendChild(this.timeDisplay);

    // Controls: Start/Pause/Clear
    this.controls = document.createElement("div");
    this.controls.className = "controls";

    // Start button
    this.startBtn = document.createElement("button");
    this.startBtn.className = "start";
    this.startBtn.textContent = "Start";
    this.startBtn.setAttribute("aria-label", "Start timer");

    // Pause button (hidden initially)
    this.pauseBtn = document.createElement("button");
    this.pauseBtn.className = "pause";
    this.pauseBtn.textContent = "Pause";
    this.pauseBtn.style.display = "none";
    this.pauseBtn.setAttribute("aria-label", "Pause timer");

    // Continue button (hidden initially)
    this.continueBtn = document.createElement("button");
    this.continueBtn.className = "start";
    this.continueBtn.textContent = "Continue";
    this.continueBtn.style.display = "none";
    this.continueBtn.setAttribute("aria-label", "Continue timer");

    // Clear button
    this.clearBtn = document.createElement("button");
    this.clearBtn.className = "clear";
    this.clearBtn.textContent = "Clear";
    this.clearBtn.setAttribute("aria-label", "Clear timer");

    this.controls.appendChild(this.startBtn);
    this.controls.appendChild(this.pauseBtn);
    this.controls.appendChild(this.continueBtn);
    this.controls.appendChild(this.clearBtn);

    // Countdown selectors container (hidden for Stopwatch)
    this.selectors = document.createElement("div");
    this.selectors.className = "selectors";
    this.selectors.style.display = this.mode === "countdown" ? "flex" : "none";

    // Days select
    this.daySelector = this.createSelector(0, 99, "Days");
    // Minutes select
    this.minuteSelector = this.createSelector(0, 59, "Minutes");
    // Seconds select
    this.secondSelector = this.createSelector(0, 59, "Seconds");

    this.selectors.appendChild(this.daySelector.container);
    this.selectors.appendChild(this.minuteSelector.container);
    this.selectors.appendChild(this.secondSelector.container);

    // Delete timer button (small X top-right)
    this.deleteBtn = document.createElement("button");
    this.deleteBtn.className = "clear";
    this.deleteBtn.textContent = "×";
    this.deleteBtn.style.position = "absolute";
    this.deleteBtn.style.top = "6px";
    this.deleteBtn.style.right = "6px";
    this.deleteBtn.style.width = "26px";
    this.deleteBtn.style.height = "26px";
    this.deleteBtn.style.fontSize = "18px";
    this.deleteBtn.style.padding = "0";
    this.deleteBtn.style.borderRadius = "50%";
    this.deleteBtn.setAttribute("title", "Delete this timer");
    this.deleteBtn.setAttribute("aria-label", "Delete this timer");

    this.card.style.position = "relative";
    this.card.appendChild(this.deleteBtn);
    this.card.appendChild(header);
    this.card.appendChild(this.timerInfo);
    this.card.appendChild(this.selectors);
    this.card.appendChild(this.controls);

    // Event listeners
    this.startBtn.addEventListener("click", () => this.start());
    this.pauseBtn.addEventListener("click", () => this.pause());
    this.continueBtn.addEventListener("click", () => this.continue());
    this.clearBtn.addEventListener("click", () => this.clear());
    this.modeCheckbox.addEventListener("change", () => this.toggleMode());
    this.deleteBtn.addEventListener("click", () => this.delete());

    timersContainer.appendChild(this.card);
  }

  // Helper to create a labeled select for countdown selectors
  createSelector(min, max, label) {
    const container = document.createElement("label");
    container.textContent = label;
    container.setAttribute("aria-label", label);

    const select = document.createElement("select");
    select.setAttribute("aria-label", label + " selector");
    for (let i = min; i <= max; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i.toString().padStart(2, "0");
      select.appendChild(option);
    }
    container.appendChild(select);
    return { container, select };
  }

  // Start timer logic
  start() {
    if (this.isRunning) return; // already running

    // For countdown, read selectors and set initial time
    if (this.mode === "countdown") {
      // If starting for first time or after clear, update timeInSeconds
      if (!this.isPaused && this.timeInSeconds === 0) {
        const days = +this.daySelector.select.value;
        const mins = +this.minuteSelector.select.value;
        const secs = +this.secondSelector.select.value;
        this.timeInSeconds = days * 86400 + mins * 60 + secs;
        this.initialCountdown = this.timeInSeconds;
        if (this.timeInSeconds <= 0) {
          alert("Please set a time greater than zero for Countdown.");
          return;
        }
      }
    }

    if (this.timeInSeconds === 0 && this.mode === "stopwatch") {
      // stopwatch always starts from zero
      this.timeInSeconds = 0;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.updateButtons();
    this.updateModeUI();

    // Hide selectors for countdown when running
    if (this.mode === "countdown") {
      this.selectors.style.display = "none";
    }

    this.intervalId = setInterval(() => {
      if (this.mode === "stopwatch") {
        this.timeInSeconds++;
        this.updateDisplay();
      } else {
        // Countdown mode
        if (this.timeInSeconds > 0) {
          this.timeInSeconds--;
          this.updateDisplay();
          if (this.timeInSeconds === 0) {
            this.finishCountdown();
          }
        }
      }
    }, 1000);
  }

  // Pause timer logic
  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.intervalId);
    this.updateButtons();
    this.updateModeUI();
  }

  // Continue timer after pause
  continue() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.updateButtons();
    this.updateModeUI();

    this.intervalId = setInterval(() => {
      if (this.mode === "stopwatch") {
        this.timeInSeconds++;
        this.updateDisplay();
      } else {
        if (this.timeInSeconds > 0) {
          this.timeInSeconds--;
          this.updateDisplay();
          if (this.timeInSeconds === 0) {
            this.finishCountdown();
          }
        }
      }
    }, 1000);
  }

  // Clear timer logic
  clear() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.timeInSeconds = 0;
    this.initialCountdown = 0;

    // Reset countdown selectors if countdown mode
    if (this.mode === "countdown") {
      this.daySelector.select.value = 0;
      this.minuteSelector.select.value = 0;
      this.secondSelector.select.value = 0;
      this.selectors.style.display = "flex";
    }

    this.updateDisplay();
    this.updateButtons();
    this.updateModeUI();
  }

  // Toggle mode between stopwatch and countdown
  toggleMode() {
    // If running, pause first to avoid bugs
    if (this.isRunning) this.pause();

    this.mode = this.modeCheckbox.checked ? "countdown" : "stopwatch";
    this.modeText.textContent = this.modeCheckbox.checked
      ? "Countdown"
      : "Stopwatch";

    // Clear timer and reset UI for new mode
    this.clear();

    // Show/hide selectors for countdown
    this.selectors.style.display = this.mode === "countdown" ? "flex" : "none";
    this.updateModeUI();
  }

  // Update the time display text
  updateDisplay() {
    this.timeDisplay.textContent = formatTime(this.timeInSeconds);
  }

  // Update buttons visibility depending on state
  updateButtons() {
    if (this.isRunning) {
      this.startBtn.style.display = "none";
      this.pauseBtn.style.display = "inline-block";
      this.continueBtn.style.display = "none";
    } else if (this.isPaused) {
      this.startBtn.style.display = "none";
      this.pauseBtn.style.display = "none";
      this.continueBtn.style.display = "inline-block";
    } else {
      this.startBtn.style.display = "inline-block";
      this.pauseBtn.style.display = "none";
      this.continueBtn.style.display = "none";
    }
  }

  // Update card border color depending on state
  updateModeUI() {
    this.card.classList.remove("active", "paused");
    if (this.isRunning) {
      this.card.classList.add("active");
    } else if (this.isPaused) {
      this.card.classList.add("paused");
    }
  }

  // Called when countdown finishes
  finishCountdown() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.isPaused = false;
    this.updateButtons();
    this.updateModeUI();

    // Play alert sound
    alertSound.currentTime = 0;
    alertSound.play();

    alert(`Countdown timer #${this.id} finished!`);

    // Show selectors again to set new time
    this.selectors.style.display = "flex";
  }

  // Remove timer from DOM
  delete() {
    this.clear();
    this.card.remove();
  }
}

// Add new Stopwatch timer
addStopwatchBtn.addEventListener("click", () => {
  new Timer("stopwatch");
});

// Add new Countdown timer
addCountdownBtn.addEventListener("click", () => {
  new Timer("countdown");
});
