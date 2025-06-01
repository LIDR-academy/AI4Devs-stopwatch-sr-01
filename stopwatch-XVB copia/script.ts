// Domain Entities
abstract class Timer {
  abstract start(): void;
  abstract pause(): void;
  abstract reset(): void;
  abstract render(): HTMLElement;
}

class Stopwatch extends Timer {
  private intervalId: number | null = null;
  private startTime: number = 0;
  private elapsed: number = 0;
  private running: boolean = false;
  private displayEl: HTMLElement | null = null;
  private startBtn: HTMLButtonElement | null = null;
  private clearBtn: HTMLButtonElement | null = null;

  render(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'timer';
    el.innerHTML = `
      <div class="timer-display">00:00:00 <span style="font-size:2rem;vertical-align:super;">000</span></div>
      <div class="timer-controls">
        <button class="start">Start</button>
        <button class="clear">Clear</button>
      </div>
    `;
    this.displayEl = el.querySelector('.timer-display');
    this.startBtn = el.querySelector('.start');
    this.clearBtn = el.querySelector('.clear');
    this.startBtn?.addEventListener('click', () => {
      if (!this.running) {
        this.start();
      } else {
        this.pause();
      }
    });
    this.clearBtn?.addEventListener('click', () => this.reset());
    return el;
  }

  private updateDisplay() {
    if (!this.displayEl) return;
    const total = this.elapsed + (this.running ? Date.now() - this.startTime : 0);
    const ms = total % 1000;
    const s = Math.floor(total / 1000) % 60;
    const m = Math.floor(total / 60000) % 60;
    const h = Math.floor(total / 3600000);
    this.displayEl.innerHTML =
      `${h.toString().padStart(2, '0')}:` +
      `${m.toString().padStart(2, '0')}:` +
      `${s.toString().padStart(2, '0')} ` +
      `<span style="font-size:2rem;vertical-align:super;">${ms.toString().padStart(3, '0')}</span>`;
  }

  start() {
    try {
      if (this.running) return;
      this.running = true;
      this.startTime = Date.now();
      this.intervalId = window.setInterval(() => this.updateDisplay(), 16);
      this.startBtn!.textContent = 'Pause';
      console.log('Stopwatch started');
    } catch (e) {
      console.error('Error starting stopwatch:', e);
    }
  }

  pause() {
    try {
      if (!this.running) return;
      this.running = false;
      this.elapsed += Date.now() - this.startTime;
      if (this.intervalId) clearInterval(this.intervalId);
      this.startBtn!.textContent = 'Start';
      this.updateDisplay();
      console.log('Stopwatch paused');
    } catch (e) {
      console.error('Error pausing stopwatch:', e);
    }
  }

  reset() {
    try {
      this.running = false;
      this.elapsed = 0;
      if (this.intervalId) clearInterval(this.intervalId);
      this.updateDisplay();
      this.startBtn!.textContent = 'Start';
      console.log('Stopwatch reset');
    } catch (e) {
      console.error('Error resetting stopwatch:', e);
    }
  }
}

class CountdownTimer extends Timer {
  render(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'timer';
    el.innerHTML = `
      <div class="timer-display">00:00:00 <span style="font-size:2rem;vertical-align:super;">000</span></div>
      <div class="timer-controls">
        <button class="start">Start</button>
        <button class="clear">Clear</button>
      </div>
    `;
    return el;
  }
  start() {}
  pause() {}
  reset() {}
}

// Application Logic
const timersContainer = document.getElementById('timers-container')!;
const addStopwatchBtn = document.getElementById('add-stopwatch')!;
const addCountdownBtn = document.getElementById('add-countdown')!;

addStopwatchBtn.addEventListener('click', () => {
  try {
    const stopwatch = new Stopwatch();
    timersContainer.appendChild(stopwatch.render());
    console.log('Stopwatch instance added');
  } catch (e) {
    console.error('Failed to add stopwatch:', e);
  }
});

addCountdownBtn.addEventListener('click', () => {
  try {
    const countdown = new CountdownTimer();
    timersContainer.appendChild(countdown.render());
    console.log('Countdown timer instance added');
  } catch (e) {
    console.error('Failed to add countdown timer:', e);
  }
}); 