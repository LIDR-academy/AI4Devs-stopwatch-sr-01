let stopwatchCount = 0;

function createStopwatch() {
  stopwatchCount++;

  const container = document.getElementById("timers-container");

  const wrapper = document.createElement("div");
  wrapper.className = "stopwatch";
  wrapper.id = `stopwatch-${stopwatchCount}`;

  wrapper.innerHTML = `
    <h2>Cronómetro ${stopwatchCount}</h2>
    <div class="display-container">
      <span class="display">00:00:00</span>
      <div class="millis">000</div>
    </div>
    <button class="start">Iniciar</button>
    <button class="pause">Pausar</button>
    <button class="reset">Reiniciar</button>
    <hr>
  `;

  container.appendChild(wrapper);

  const display = wrapper.querySelector(".display");
  const startBtn = wrapper.querySelector(".start");
  const pauseBtn = wrapper.querySelector(".pause");
  const resetBtn = wrapper.querySelector(".reset");

  let seconds = 0;
  let interval = null;

  function updateDisplay() {
    let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    display.textContent = `${hrs}:${mins}:${secs}`;
  }

  startBtn.addEventListener("click", () => {
    if (!interval) {
      interval = setInterval(() => {
        seconds++;
        updateDisplay();
      }, 1000);
    }
  });

  pauseBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    updateDisplay();
  });
}

let countdownCount = 0;

function createCountdown() {
  countdownCount++;

  const container = document.getElementById("timers-container");

  const wrapper = document.createElement("div");
  wrapper.className = "stopwatch";
  wrapper.id = `countdown-${countdownCount}`;

  wrapper.innerHTML = `
    <h2>Cuenta Regresiva ${countdownCount}</h2>
    <input type="number" min="0" placeholder="Minutos" class="input-mins" />
    <div class="display-container">
      <span class="display">00:00:00</span>
      <div class="millis">000</div>
    </div>
    <button class="start">Iniciar</button>
    <button class="pause">Pausar</button>
    <button class="reset">Reiniciar</button>
    <hr>
  `;

  container.appendChild(wrapper);

  const display = wrapper.querySelector(".display");
  const inputMins = wrapper.querySelector(".input-mins");
  const startBtn = wrapper.querySelector(".start");
  const pauseBtn = wrapper.querySelector(".pause");
  const resetBtn = wrapper.querySelector(".reset");

  let totalSeconds = 0;
  let interval = null;

  const alarmSound = new Audio("https://www.soundjay.com/button/beep-07.wav");

  function updateDisplay() {
    let hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    let secs = String(totalSeconds % 60).padStart(2, '0');
    display.textContent = `${hrs}:${mins}:${secs}`;
  }

  startBtn.addEventListener("click", () => {
    if (interval) return;

    if (totalSeconds === 0) {
      const mins = parseInt(inputMins.value);
      if (isNaN(mins) || mins <= 0) {
        alert("Ingresa una cantidad válida de minutos");
        return;
      }
      totalSeconds = mins * 60;
      updateDisplay();
    }

    interval = setInterval(() => {
      totalSeconds--;
      updateDisplay();

      if (totalSeconds <= 0) {
        clearInterval(interval);
        interval = null;
        display.textContent = "00:00:00";

        // Intenta reproducir el sonido, si no puede, usa alert
        alarmSound.play().catch(err => {
          console.warn("⚠️ Sonido bloqueado por el navegador:", err);
          alert("⏰ ¡Tiempo finalizado!");
        });

        // Muestra notificación o alerta
        showNotification("⏰ ¡Cuenta regresiva finalizada!");
      }
    }, 1000);
  });

  pauseBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    totalSeconds = 0;
    display.textContent = "00:00:00";
    inputMins.value = '';
  });
}

// ✅ Mostrar notificación o alert si está bloqueado
function showNotification(msg) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(msg);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(msg);
        } else {
          alert(msg);
        }
      });
    } else {
      alert(msg);
    }
  } else {
    alert(msg);
  }
}

// ✅ Solicitar permiso de notificación al cargar la página
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}