let timerId = 0;

function pad(n, z=2) {
    return n.toString().padStart(z, '0');
}
function padMs(n) {
    return n.toString().padStart(3, '0');
}

// Crear un nuevo cronómetro o cuenta regresiva
function createTimer(type) {
    const id = `timer-${++timerId}`;
    let timer = {
        id,
        interval: null,
        running: false,
        elapsed: 0, // ms
        target: 0,  // ms (solo para countdown)
        type
    };

    // Contenedor
    const card = document.createElement('div');
    card.className = 'timer-card';
    card.id = id;

    // Si es cuenta regresiva, añadir inputs y labels
    let hInput, mInput, sInput;
    if (type === 'countdown') {
        const inputWrap = document.createElement('div');
        inputWrap.className = 'countdown-inputs';

        // Labels
        const labelsRow = document.createElement('div');
        labelsRow.className = 'countdown-labels';
        const hLabel = document.createElement('label');
        hLabel.textContent = 'Horas';
        hLabel.setAttribute('for', id + '-h');
        hLabel.className = 'countdown-label';
        const mLabel = document.createElement('label');
        mLabel.textContent = 'Minutos';
        mLabel.setAttribute('for', id + '-m');
        mLabel.className = 'countdown-label';
        const sLabel = document.createElement('label');
        sLabel.textContent = 'Segundos';
        sLabel.setAttribute('for', id + '-s');
        sLabel.className = 'countdown-label';
        labelsRow.appendChild(hLabel);
        labelsRow.appendChild(mLabel);
        labelsRow.appendChild(sLabel);

        // Inputs
        const inputRow = document.createElement('div');
        inputRow.className = 'countdown-input-row';
        hInput = document.createElement('input');
        hInput.type = 'number'; hInput.min = 0; hInput.max = 99; hInput.value = 0;
        hInput.id = id + '-h'; hInput.title = "Horas";
        mInput = document.createElement('input');
        mInput.type = 'number'; mInput.min = 0; mInput.max = 59; mInput.value = 0;
        mInput.id = id + '-m'; mInput.title = "Minutos";
        sInput = document.createElement('input');
        sInput.type = 'number'; sInput.min = 0; sInput.max = 59; sInput.value = 10;
        sInput.id = id + '-s'; sInput.title = "Segundos";
        inputRow.appendChild(hInput);
        inputRow.appendChild(document.createTextNode(':'));
        inputRow.appendChild(mInput);
        inputRow.appendChild(document.createTextNode(':'));
        inputRow.appendChild(sInput);

        inputWrap.appendChild(labelsRow);
        inputWrap.appendChild(inputRow);
        card.appendChild(inputWrap);
    }

    // Display principal
    const display = document.createElement('div');
    display.className = 'timer-display';
    // Elemento para hh:mm:ss
    const mainTimeSpan = document.createElement('span');
    mainTimeSpan.className = 'timer-main';
    display.appendChild(mainTimeSpan);
    // Elemento para .ms
    const msSpan = document.createElement('span');
    msSpan.className = 'timer-ms';
    display.appendChild(msSpan);
    card.appendChild(display);

    // Botones
    const actions = document.createElement('div');
    actions.className = 'timer-actions';
    const startBtn = document.createElement('button');
    startBtn.className = 'start';
    startBtn.textContent = 'Start';
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear';
    clearBtn.textContent = 'Clear';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Eliminar';
    actions.append(startBtn, clearBtn, deleteBtn);
    card.appendChild(actions);

    // Añadir al DOM
    document.getElementById('timers-container').appendChild(card);

    // Actualiza el display
    function updateDisplay() {
        let ms = timer.elapsed;
        if (type === 'countdown') ms = Math.max(timer.target - timer.elapsed, 0);
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const msValue = ms % 1000;

        mainTimeSpan.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        msSpan.textContent = `.${padMs(msValue)}`;
    }

    // Acciones principales
    startBtn.onclick = () => {
        // Si countdown parado y finalizado, reiniciar
        if (type === 'countdown') {
            if (!timer.running && timer.elapsed >= timer.target) {
                timer.elapsed = 0;
            }
            // Siempre toma los valores actuales de los inputs al arrancar
            if (timer.elapsed === 0) {
                timer.target = (
                    (+hInput.value) * 3600000 +
                    (+mInput.value) * 60000 +
                    (+sInput.value) * 1000
                );
                if (timer.target <= 0) {
                    alert("Pon un tiempo mayor a 0");
                    return;
                }
            }
        }
        if (!timer.running) {
            timer.running = true;
            let last = Date.now();
            playSound(true); // Unlock audio
            timer.interval = setInterval(() => {
                const now = Date.now();
                timer.elapsed += (now - last);
                last = now;
                updateDisplay();

                if (type === 'countdown' && timer.elapsed >= timer.target) {
                    clearInterval(timer.interval);
                    timer.running = false;
                    timer.elapsed = timer.target;
                    updateDisplay();
                    showCountdownFinished();
                    startBtn.textContent = 'Start';
                }
            }, 15); // más preciso para ms
            startBtn.textContent = 'Pause';
        } else {
            timer.running = false;
            clearInterval(timer.interval);
            startBtn.textContent = 'Start';
        }
    };

    clearBtn.onclick = () => {
        timer.running = false;
        clearInterval(timer.interval);
        timer.elapsed = 0;
        updateDisplay();
        startBtn.textContent = 'Start';
    };

    deleteBtn.onclick = () => {
        timer.running = false;
        clearInterval(timer.interval);
        card.remove();
    };

    if (type === 'countdown') {
        [hInput, mInput, sInput].forEach(inp => {
            inp.onchange = () => {
                timer.elapsed = 0;
                updateDisplay();
            };
        });
    }

    updateDisplay();
}

function addStopwatch() { createTimer('stopwatch'); }
function addCountdown() { createTimer('countdown'); }

// Sonido, alerta y confeti
function playSound(justUnlock = false) {
    const audio = document.getElementById('alert-sound');
    audio.currentTime = 0;
    if (justUnlock) {
        audio.volume = 0;
        audio.play().then(() => { audio.pause(); audio.volume = 1; }).catch(()=>{});
    } else {
        audio.volume = 1;
        audio.play().catch(()=>{});
    }
}

function showCountdownFinished() {
    playSound();
    alert("¡Cuenta regresiva finalizada!");
    launchConfetti();
}

function launchConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 }
    });
}
