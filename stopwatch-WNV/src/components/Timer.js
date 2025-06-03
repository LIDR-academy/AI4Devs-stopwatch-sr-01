export class Timer {
  constructor(duration = 0, type = "stopwatch") {
    this.duration = duration;
    this.remaining = duration;
    this.running = false;
    this.intervalId = null;
    this.type = type;
    this.onFinish = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pause() {
    this.running = false;
    clearInterval(this.intervalId);
  }

  reset() {
    this.pause();
    this.remaining = this.type === "countdown" ? this.duration : 0;
  }

  tick() {
    if (this.type === "countdown") {
      this.remaining--;
      if (this.remaining <= 0) {
        this.remaining = 0;
        this.pause();
        if (this.onFinish) this.onFinish();
      }
    } else {
      this.remaining++;
    }
  }

  formatTime() {
    const hours = Math.floor(this.remaining / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((this.remaining % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (this.remaining % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}
