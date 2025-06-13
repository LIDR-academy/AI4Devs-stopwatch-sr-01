let timerId = 0;

function createTimer(type) {
    timerId++;
    const id = `timer-${timerId}`;
    const container = document.getElementById("timersContainer");

    const timerDiv = document.createElement("div");
    timerDiv.className = "timer";
    timerDiv.id = id;

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Nombre del conteo (máx. 50 caracteres)";
    nameInput.maxLength = 50;
    nameInput.className = "name-input";

    const display = document.createElement("div");
    display.className = "display";
    display.textContent = "00:00:00.000";

    const timeInputs = document.createElement("div");
    timeInputs.className = "time-inputs";

    const inputH = createInput("Hrs");
    const inputM = createInput("Min");
    const inputS = createInput("Sec");
    const inputMs = createInput("Ms");

    if (type === "countdown") {
        timeInputs.append(inputH, inputM, inputS, inputMs);
    }

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.className = "start";

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.className = "clear";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.className = "delete";

    timerDiv.appendChild(nameInput);
    timerDiv.appendChild(display);
    if (type === "countdown") timerDiv.appendChild(timeInputs);
    timerDiv.appendChild(startBtn);
    timerDiv.appendChild(clearBtn);
    timerDiv.appendChild(deleteBtn);
    container.appendChild(timerDiv);

    let interval = null;
    let startTime, elapsed = 0;
    let countdown = 0;
    let running = false;

    const beep = new Audio("beep.wav");

    startBtn.onclick = () => {
        if (running) {
            clearInterval(interval);
            running = false;
            startBtn.textContent = "Start";
        } else {
            if (type === "countdown") {
                if (!countdown) {
                    const h = parseInt(inputH.value) || 0;
                    const m = parseInt(inputM.value) || 0;
                    const s = parseInt(inputS.value) || 0;
                    const ms = parseInt(inputMs.value) || 0;
                    countdown = (h * 3600000) + (m * 60000) + (s * 1000) + ms;
                    if (countdown <= 0) return alert("Set a valid time.");
                    elapsed = 0;
                }
                startTime = Date.now() - elapsed;
                interval = setInterval(() => {
                    elapsed = Date.now() - startTime;
                    let remaining = countdown - elapsed;
                   if (remaining <= 0) {
                            clearInterval(interval);
                            display.textContent = "00:00:00.000";
                            running = false;
                            startBtn.textContent = "Start";
                            beep.play();
                            alert("⏰ ¡Tiempo terminado!");
                            notify();
                        } else {
                        display.textContent = formatTime(remaining);
                    }
                }, 10);
            } else {
                startTime = Date.now() - elapsed;
                interval = setInterval(() => {
                    elapsed = Date.now() - startTime;
                    display.textContent = formatTime(elapsed);
                }, 10);
            }
            running = true;
            startBtn.textContent = "Pause";
        }
    };

    clearBtn.onclick = () => {
        clearInterval(interval);
        elapsed = 0;
        countdown = 0;
        running = false;
        display.textContent = "00:00:00.000";
        startBtn.textContent = "Start";
        inputH.value = "";
        inputM.value = "";
        inputS.value = "";
        inputMs.value = "";
    };

    deleteBtn.onclick = () => {
        clearInterval(interval);
        container.removeChild(timerDiv);
    };
}

function clearAllTimers() {
    document.getElementById("timersContainer").innerHTML = "";
}

function createInput(placeholder) {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = placeholder;
    input.min = 0;
    return input;
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

function notify() {
    if (Notification.permission === "granted") {
        new Notification("⏰ ¡Tiempo terminado!");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") new Notification("⏰ ¡Tiempo terminado!");
        });
    }
}
