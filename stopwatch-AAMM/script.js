// scripts.js

let timerCount = 0;
const maxTimers = 5;

const addTimerBtn = document.getElementById("addTimerBtn");
const timersContainer = document.getElementById("timersContainer");
const snackbar = document.getElementById("snackbar");
const alertSound = document.getElementById("alertSound");

addTimerBtn.addEventListener("click", () => {
  if (timerCount >= maxTimers) return;
  createTimer();
});

function createTimer() {
  timerCount++;

  const col = document.createElement("div");
  col.className = "col s12 m6 l4";

  const card = document.createElement("div");
  card.className = "timer-card z-depth-2";

  // Eliminar icono
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "material-icons right red-text";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.textContent = "close";
  deleteIcon.title = "Eliminar cronómetro";
  deleteIcon.onclick = () => {
    clearInterval(timer);
    col.remove();
    timerCount--;
  };

  const header = document.createElement("div");
  header.className = "right-align";
  header.appendChild(deleteIcon);

  const inputRow = document.createElement("div");
  inputRow.className = "row";

  const hourInput = document.createElement("input");
  hourInput.type = "number";
  hourInput.min = 0;
  hourInput.max = 23;
  hourInput.value = 0;
  hourInput.className = "browser-default col s4";

  const minuteInput = document.createElement("input");
  minuteInput.type = "number";
  minuteInput.min = 0;
  minuteInput.max = 59;
  minuteInput.value = 0;
  minuteInput.className = "browser-default col s4";

  const secondInput = document.createElement("input");
  secondInput.type = "number";
  secondInput.min = 0;
  secondInput.max = 59;
  secondInput.value = 5;
  secondInput.className = "browser-default col s4";

  inputRow.appendChild(hourInput);
  inputRow.appendChild(minuteInput);
  inputRow.appendChild(secondInput);

  const display = document.createElement("div");
  display.className = "time-display";
  display.textContent = "00:00:05";

  const btnStart = document.createElement("button");
  btnStart.className = "btn green darken-2 white-text";
  btnStart.textContent = "Start";

  const btnClear = document.createElement("button");
  btnClear.className = "btn red darken-2 white-text";
  btnClear.textContent = "Clear";

  const btnGroup = document.createElement("div");
  btnGroup.className = "control-buttons";
  btnGroup.appendChild(btnStart);
  btnGroup.appendChild(btnClear);

  card.appendChild(header);
  card.appendChild(inputRow);
  card.appendChild(display);
  card.appendChild(btnGroup);
  col.appendChild(card);
  timersContainer.appendChild(col);

  let timer = null;
  let remaining = 5000; // default 5s
  let isRunning = false;

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const min = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const sec = String(totalSec % 60).padStart(2, "0");
    return `${hrs}:${min}:${sec}`;
  }

  function updateDisplay(ms) {
    display.textContent = formatTime(ms);
  }

  function getInputTime() {
    const h = parseInt(hourInput.value) || 0;
    const m = parseInt(minuteInput.value) || 0;
    const s = parseInt(secondInput.value) || 0;
    return (h * 3600 + m * 60 + s) * 1000;
  }

  btnStart.addEventListener("click", () => {
    if (!isRunning) {
      if (remaining <= 0) {
        remaining = getInputTime();
      }

      hourInput.disabled = true;
      minuteInput.disabled = true;
      secondInput.disabled = true;
      btnStart.textContent = "Pause";
      isRunning = true;

      timer = setInterval(() => {
        remaining -= 1000;
        if (remaining <= 0) {
          clearInterval(timer);
          remaining = 0;
          isRunning = false;
          btnStart.textContent = "Start";
          showSnackbar();
          alertSound.play();
        }
        updateDisplay(remaining);
      }, 1000);
    } else {
      clearInterval(timer);
      isRunning = false;
      btnStart.textContent = "Start";
    }
  });

  btnClear.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    remaining = getInputTime();
    hourInput.disabled = false;
    minuteInput.disabled = false;
    secondInput.disabled = false;
    updateDisplay(remaining);
    btnStart.textContent = "Start";
  });

  updateDisplay(remaining);
}

function showSnackbar() {
  snackbar.classList.add("show");
  setTimeout(() => snackbar.classList.remove("show"), 3000);
}