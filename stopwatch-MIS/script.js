// script.js

let swInterval, cdInterval;
let swStartTime, swElapsedTime = 0;
let cdTime = 0, cdRemaining = 0, cdPaused = false;
let cdInput = "";
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

function showScreen(screenId) {
  document.querySelectorAll('.screen, .main-screen').forEach(sec => sec.style.display = 'none');
  document.getElementById(screenId).style.display = 'flex';
  if (screenId === 'stopwatch') resetStopwatchUI();
  if (screenId === 'countdown') resetCountdownUI();
}

// --------- STOPWATCH ---------
function formatTime(ms) {
  const date = new Date(ms);
  return {
    h: String(date.getUTCHours()).padStart(2, '0'),
    m: String(date.getUTCMinutes()).padStart(2, '0'),
    s: String(date.getUTCSeconds()).padStart(2, '0'),
    ms: String(date.getUTCMilliseconds()).padStart(3, '0')
  };
}

function updateStopwatch() {
  const now = Date.now();
  swElapsedTime = now - swStartTime;
  displayStopwatch();
}

function displayStopwatch() {
  const t = formatTime(swElapsedTime);
  document.getElementById("swDisplay").innerHTML = `${t.h}:${t.m}:${t.s} <span class="millis">${t.ms}</span>`;
}

function resetStopwatchUI() {
  clearInterval(swInterval);
  swElapsedTime = 0;
  displayStopwatch();
  const swControls = document.getElementById("swControls");
  swControls.innerHTML = `
    <button class="green-btn" onclick="startStopwatch()">Start</button>
    <button class="gray-btn" onclick="clearStopwatch()">Clear</button>
  `;
}

function startStopwatch() {
  swStartTime = Date.now() - swElapsedTime;
  swInterval = setInterval(updateStopwatch, 10);
  document.getElementById("swControls").innerHTML = `
    <button class="green-btn" onclick="pauseStopwatch()">Pause</button>
    <button class="gray-btn" onclick="clearStopwatch()">Clear</button>
  `;
}

function pauseStopwatch() {
  clearInterval(swInterval);
  document.getElementById("swControls").innerHTML = `
    <button class="green-btn" onclick="startStopwatch()">Continue</button>
    <button class="gray-btn" onclick="clearStopwatch()">Clear</button>
  `;
}

function clearStopwatch() {
  clearInterval(swInterval);
  swElapsedTime = 0;
  resetStopwatchUI();
}


// --------- COUNTDOWN ---------
function appendDigit(digit) {
  if (cdInput.length >= 6) return;
  cdInput += digit.toString();
  updateCountdownDisplay(cdInput);
}

function updateCountdownDisplay(input) {
  const padded = input.padStart(6, '0');
  const h = padded.substring(0,2);
  const m = padded.substring(2,4);
  const s = padded.substring(4,6);
  document.getElementById("cdDisplay").innerHTML = `${h}:${m}:${s} <span class="millis">000</span>`;
}

function setCountdownUI() {
  if (!cdInput) return;
  const padded = cdInput.padStart(6, '0');
  const h = parseInt(padded.substring(0,2));
  const m = parseInt(padded.substring(2,4));
  const s = parseInt(padded.substring(4,6));
  cdTime = ((h * 60 * 60) + (m * 60) + s) * 1000;
  cdRemaining = cdTime;
  document.getElementById("keypad").classList.add("hidden");
  document.getElementById("postSetControls").classList.remove("hidden");
  updateCountdownDisplay(cdInput);
}

function startCountdown() {
  cdPaused = false;
  cdInterval = setInterval(() => {
    if (cdRemaining <= 0) {
      clearInterval(cdInterval);
      document.getElementById("cdDisplay").innerHTML += `<div style="color: red; font-size: 1.2em; animation: blink 1s step-end infinite">TIME'S UP</div>`;
      beep.play();
      return;
    }
    cdRemaining -= 10;
    const h = String(Math.floor(cdRemaining / 3600000)).padStart(2, '0');
    const m = String(Math.floor((cdRemaining % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((cdRemaining % 60000) / 1000)).padStart(2, '0');
    const ms = String(cdRemaining % 1000).padStart(3, '0');
    document.getElementById("cdDisplay").innerHTML = `${h}:${m}:${s} <span class="millis">${ms}</span>`;
  }, 10);
  document.getElementById("postSetControls").innerHTML = `
    <button class="green-btn" onclick="pauseCountdown()">Pause</button>
    <button class="gray-btn" onclick="clearCountdown()">Clear</button>
  `;
}

function pauseCountdown() {
  clearInterval(cdInterval);
  cdPaused = true;
  document.getElementById("postSetControls").innerHTML = `
    <button class="green-btn" onclick="startCountdown()">Continue</button>
    <button class="gray-btn" onclick="clearCountdown()">Clear</button>
  `;
}

function clearCountdown() {
  clearInterval(cdInterval);
  cdInput = "";
  cdTime = 0;
  cdRemaining = 0;
  document.getElementById("keypad").classList.remove("hidden");
  document.getElementById("postSetControls").classList.add("hidden");
  document.getElementById("postSetControls").innerHTML = `
    <button class="green-btn" onclick="startCountdown()">Start</button>
    <button class="gray-btn" onclick="clearCountdown()">Clear</button>
  `;
  updateCountdownDisplay("000000");
}

function resetCountdownUI() {
  clearCountdown();
}

// --------- ALERT STYLE ---------
document.head.insertAdjacentHTML("beforeend", `
  <style>
    @keyframes blink {
      50% { opacity: 0; }
    }
  </style>
`);
