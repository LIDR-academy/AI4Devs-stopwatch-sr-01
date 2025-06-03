"use strict";

// Utility to generate unique IDs
const generateId = (() => {
  let id = 0;
  return () => ++id;
})();

// Audio for timer completion
const timerSound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

const cardsContainer = document.getElementById("cardsContainer");
const addStopwatchBtn = document.getElementById("addStopwatch");
const addTimerBtn = document.getElementById("addTimer");
const stopwatchTemplate = document.getElementById("stopwatchTemplate");
const timerTemplate = document.getElementById("timerTemplate");

class Stopwatch {
  constructor(displayElement) {
    this.display = displayElement;
    this.running = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.intervalId = null;
    this.laps = [];
    this.card = displayElement.closest('.card');
    this.lapsList = this.card.querySelector('.laps__list');
    this.updateButtonVisibility();
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.startTime = Date.now() - this.elapsedTime;
      this.intervalId = setInterval(() => this.updateDisplay(), 10);
      this.updateButtonVisibility();
    }
  }

  pause() {
    if (this.running) {
      this.running = false;
      clearInterval(this.intervalId);
      this.elapsedTime = Date.now() - this.startTime;
      this.updateButtonVisibility();
    }
  }

  reset() {
    this.running = false;
    clearInterval(this.intervalId);
    this.elapsedTime = 0;
    this.startTime = 0;
    this.laps = [];
    this.lapsList.innerHTML = ''; // Clear lap list in UI
    this.updateDisplay();
    this.updateButtonVisibility();
  }

  updateButtonVisibility() {
    const startBtn = this.card.querySelector('[data-action="start"]');
    const pauseBtn = this.card.querySelector('[data-action="pause"]');
    const resetBtn = this.card.querySelector('[data-action="reset"]');
    const lapBtn = this.card.querySelector('[data-action="lap"]');

    startBtn.style.display = this.running ? 'none' : 'inline-block';
    pauseBtn.style.display = this.running ? 'inline-block' : 'none';
    resetBtn.style.display = this.running || this.elapsedTime > 0 ? 'inline-block' : 'none';
    lapBtn.style.display = this.running ? 'inline-block' : 'none';
  }

  lap() {
    const currentTime = this.running ? Date.now() - this.startTime : this.elapsedTime;
    const lapTime = this.formatTime(currentTime);
    this.laps.push(lapTime);

    // Create and append new lap item
    const li = document.createElement('li');
    li.className = 'laps__item';
    li.textContent = `Lap ${this.laps.length}: ${lapTime}`;
    this.lapsList.appendChild(li);

    return lapTime;
  }

  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  }

  updateDisplay() {
    const currentTime = this.running ? Date.now() - this.startTime : this.elapsedTime;
    this.display.textContent = this.formatTime(currentTime);
  }
}

// Function to show notifications
function showNotification(message) {
  // Remove any existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification__message">
      <span>🔔</span>
      <span>${message}</span>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(notification);

  // Trigger animation
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

class Timer {
  constructor(displayElement, card) {
    this.display = displayElement;
    this.card = card;
    this.running = false;
    this.remainingTime = 0;
    this.intervalId = null;
    this.setupTimeInput();
    this.updateButtonVisibility();
  }

  setupTimeInput() {
    const input = this.card.querySelector('.input--time');
    input.addEventListener('input', () => {
      const minutes = parseInt(input.value);
      if (minutes > 0) {
        this.remainingTime = minutes * 60 * 1000;
        this.updateDisplay();
        this.updateButtonVisibility();
      }
    });
  }

  start() {
    if (!this.running && this.remainingTime > 0) {
      this.running = true;
      this.endTime = Date.now() + this.remainingTime;
      this.intervalId = setInterval(() => this.updateDisplay(), 100);
      this.updateButtonVisibility();
    }
  }

  pause() {
    if (this.running) {
      this.running = false;
      clearInterval(this.intervalId);
      this.remainingTime = this.endTime - Date.now();
      this.updateButtonVisibility();
    }
  }

  reset() {
    this.running = false;
    clearInterval(this.intervalId);
    this.remainingTime = 0;
    const input = this.card.querySelector('.input--time');
    input.value = '';
    this.updateDisplay();
    this.updateButtonVisibility();
  }

  setTime(minutes) {
    if (!this.running) {
      this.reset();
      this.remainingTime = minutes * 60 * 1000;
      this.updateDisplay();
      this.updateButtonVisibility();
    }
  }

  updateButtonVisibility() {
    const startBtn = this.card.querySelector('[data-action="start"]');
    const pauseBtn = this.card.querySelector('[data-action="pause"]');
    const resetBtn = this.card.querySelector('[data-action="reset"]');
    const input = this.card.querySelector('.input--time');

    startBtn.style.display = this.running ? 'none' : 'inline-block';
    pauseBtn.style.display = this.running ? 'inline-block' : 'none';
    resetBtn.style.display = this.running || this.remainingTime > 0 ? 'inline-block' : 'none';

    // Disable input while timer is running
    input.disabled = this.running;
  }

  formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  updateDisplay() {
    if (this.running) {
      this.remainingTime = Math.max(0, this.endTime - Date.now());
      if (this.remainingTime === 0) {
        this.timeUp();
      }
    }
    this.display.textContent = this.formatTime(this.remainingTime);
  }

  timeUp() {
    this.running = false;
    clearInterval(this.intervalId);
    this.card.classList.add("completed");
    timerSound.play();
    showNotification("Timer finished!");
    setTimeout(() => {
      this.card.classList.remove("completed");
      this.updateButtonVisibility();
    }, 1000);
  }
}

// Add new stopwatch card
addStopwatchBtn.addEventListener("click", () => {
  const card = stopwatchTemplate.content.cloneNode(true).children[0];
  card.dataset.id = generateId();
  const display = card.querySelector(".display__time");
  card.stopwatch = new Stopwatch(display);
  cardsContainer.appendChild(card);
});

// Add new timer card
addTimerBtn.addEventListener("click", () => {
  const card = timerTemplate.content.cloneNode(true).children[0];
  card.dataset.id = generateId();
  const display = card.querySelector(".display__time");
  card.timer = new Timer(display, card);
  cardsContainer.appendChild(card);
});

// Event delegation for card actions
cardsContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  // Delete card
  if (e.target.classList.contains("card__delete")) {
    if (card.dataset.type === "stopwatch" && card.stopwatch) {
      card.stopwatch.reset();
    } else if (card.dataset.type === "timer" && card.timer) {
      card.timer.reset();
    }
    card.remove();
    return;
  }

  // Action buttons
  if (e.target.dataset.action) {
    const action = e.target.dataset.action;
    if (card.dataset.type === "stopwatch" && card.stopwatch) {
      if (card.stopwatch[action]) card.stopwatch[action]();
    } else if (card.dataset.type === "timer" && card.timer) {
      if (card.timer[action]) {
        card.timer[action]();
      }
    }
  }

  // Timer presets
  if (e.target.dataset.minutes) {
    const minutes = parseInt(e.target.dataset.minutes);
    if (card.timer) card.timer.setTime(minutes);
  }
});

// Handle custom timer input
cardsContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn--set")) return;

  const card = e.target.closest(".card");
  if (!card || !card.timer) return;

  const input = card.querySelector(".input--time");
  const minutes = parseInt(input.value);
  if (minutes > 0) {
    card.timer.setTime(minutes);
    input.value = "";
  }
});
