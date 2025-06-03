import { TimerManager } from "./components/TimerManager.js";
import { NotificationService } from "../src/services/NotificationService.js";
import { SoundService } from "../src/services/SoundService.js";

const manager = new TimerManager();
NotificationService.requestPermission();

const container = document.getElementById("timers");
const addBtn = document.getElementById("add-timer");
const typeSelect = document.getElementById("timer-type");

addBtn.addEventListener("click", () => {
  const type = typeSelect.value;
  const initialDuration = type === "countdown" ? 300 : 0;
  const timer = manager.addTimer(initialDuration, type);

  const div = document.createElement("div");
  div.className = "timer";

  const display = document.createElement("span");
  display.className = "timer__display";
  display.textContent = timer.formatTime();

  const startBtn = document.createElement("button");
  startBtn.className = "timer__button";
  startBtn.textContent = "Start";
  startBtn.onclick = () => timer.start();

  const pauseBtn = document.createElement("button");
  pauseBtn.className = "timer__button";
  pauseBtn.textContent = "Pause";
  pauseBtn.onclick = () => timer.pause();

  const resetBtn = document.createElement("button");
  resetBtn.className = "timer__button";
  resetBtn.textContent = "Reset";
  resetBtn.onclick = () => {
    timer.reset();
    display.textContent = timer.formatTime();
  };

  const delBtn = document.createElement("button");
  delBtn.className = "timer__button";
  delBtn.textContent = "Delete";
  delBtn.onclick = () => {
    manager.removeTimer(timer);
    container.removeChild(div);
  };

  timer.onFinish = () => {
    NotificationService.notify("Timer done!");
    SoundService.playAlert();
  };

  setInterval(() => {
    display.textContent = timer.formatTime();
  }, 1000);

  div.append(display, startBtn, pauseBtn, resetBtn, delBtn);
  container.appendChild(div);
});
