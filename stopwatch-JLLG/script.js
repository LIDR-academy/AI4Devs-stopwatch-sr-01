
class Timer {
    constructor(type, hours = 0, minutes = 0) {
        this.type = type;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = 0;
        this.interval = null;
        this.originalHours = hours;
        this.originalMinutes = minutes;
        this.createTimerElement();
    }

    createTimerElement() {
        this.timerElement = document.createElement('div');
        this.timerElement.className = 'timer';

        this.timeDisplay = document.createElement('span');
        this.timeDisplay.className = 'time-display';
        this.updateTimeDisplay();

        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start';
        this.startButton.className = 'start-button';
        this.startButton.onclick = () => this.start();

        this.pauseButton = document.createElement('button');
        this.pauseButton.textContent = 'Pause';
        this.pauseButton.className = 'pause-button';
        this.pauseButton.onclick = () => this.pause();

        this.resetButton = document.createElement('button');
        this.resetButton.textContent = 'Reset';
        this.resetButton.className = 'reset-button';
        this.resetButton.onclick = () => this.reset();

        this.timerElement.appendChild(this.timeDisplay);
        this.timerElement.appendChild(this.startButton);
        this.timerElement.appendChild(this.pauseButton);
        this.timerElement.appendChild(this.resetButton);

        document.getElementById('timers').appendChild(this.timerElement);
    }

    updateTimeDisplay() {
        this.timeDisplay.textContent =
            String(this.hours).padStart(2, '0') + ':' +
            String(this.minutes).padStart(2, '0') + ':' +
            String(this.seconds).padStart(2, '0');
    }


    start() {
        if (this.interval) return;

        this.interval = setInterval(() => {
            if (this.type === 'cronometro') {
                this.incrementTime();
            } else if (this.type === 'cuentaRegresiva') {
                this.decrementTime();
            }
            this.updateTimeDisplay();
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
        this.interval = null;
    }

    reset() {
        this.pause();
        this.hours = this.originalHours;
        this.minutes = this.originalMinutes;
        this.seconds = 0;
        this.updateTimeDisplay();
    }

    incrementTime() {
        this.seconds++;
        if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
            if (this.minutes === 60) {
                this.minutes = 0;
                this.hours++;
            }
        }
    }

    decrementTime() {
        if (this.seconds === 0) {
            if (this.minutes === 0) {
                if (this.hours === 0) {
                    this.pause();
                    this.notifyCompletion();
                    return;
                } else {
                    this.hours--;
                    this.minutes = 59;
                    this.seconds = 59;
                }
            } else {
                this.minutes--;
                this.seconds = 59;
            }
        } else {
            this.seconds--;
        }
    }

    notifyCompletion() {
        alert('Cuenta regresiva completada!');
        const audio = new Audio('bell.mp3');
        audio.play();
    }
}

function createTimer(type) {
    if (type === 'cuentaRegresiva') {
        openCountdownModal();
    } else {
        new Timer(type);
    }
}

function openCountdownModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const title = document.createElement('h2');
    title.textContent = 'Cuenta Regresiva';

    const hoursInput = document.createElement('input');
    hoursInput.type = 'number';
    hoursInput.placeholder = 'Horas (0-23)';
    hoursInput.min = 0;
    hoursInput.max = 23;

    const minutesInput = document.createElement('input');
    minutesInput.type = 'number';
    minutesInput.placeholder = 'Minutos (0-59)';
    minutesInput.min = 0;
    minutesInput.max = 59;

    const createButton = document.createElement('button');
    createButton.textContent = 'Crear';
    createButton.onclick = () => {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        if (hours === 0 && minutes === 0) {
            alert('Por favor, ingrese un tiempo válido.');
            return;
        }
        new Timer('cuentaRegresiva', hours, minutes);
        document.body.removeChild(modal);
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.onclick = () => {
        document.body.removeChild(modal);
    };

    modalContent.appendChild(title);
    modalContent.appendChild(hoursInput);
    modalContent.appendChild(minutesInput);
    modalContent.appendChild(createButton);
    modalContent.appendChild(cancelButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}
