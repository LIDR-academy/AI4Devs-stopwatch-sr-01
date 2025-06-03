import { Timer } from "./Timer.js";

export class TimerManager {
  constructor() {
    this.timers = [];
  }

  addTimer(duration, type) {
    const timer = new Timer(duration, type);
    this.timers.push(timer);
    return timer;
  }

  removeTimer(timer) {
    this.timers = this.timers.filter((t) => t !== timer);
  }
}
