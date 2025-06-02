class TimerManager {
    constructor() {
        this.timers = new Map();
        this.nextId = 1;
        this.audioContext = null;
        this.initAudioContext();
    }

    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio context not available:', error);
        }
    }

    playAlertSound() {
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Could not play alert sound:', error);
        }
    }

    showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Alert', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f44336"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="40">⏰</text></svg>'
            });
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    createTimer(type) {
        const id = this.nextId++;
        const timer = {
            id,
            type,
            startTime: 0,
            elapsedTime: 0,
            isRunning: false,
            interval: null,
            targetTime: type === 'countdown' ? 60000 : 0 // Default 1 minute for countdown
        };

        this.timers.set(id, timer);
        this.renderTimer(timer);
        return timer;
    }

    deleteTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            this.stopTimer(id);
            this.timers.delete(id);
            document.getElementById(`timer-${id}`).remove();
        }
    }

    startTimer(id) {
        const timer = this.timers.get(id);
        if (!timer || timer.isRunning) return;

        timer.isRunning = true;
        timer.startTime = Date.now() - timer.elapsedTime;

        timer.interval = setInterval(() => {
            if (timer.type === 'stopwatch') {
                timer.elapsedTime = Date.now() - timer.startTime;
            } else {
                timer.elapsedTime = Date.now() - timer.startTime;
                const remaining = timer.targetTime - timer.elapsedTime;
                
                if (remaining <= 0) {
                    this.stopTimer(id);
                    timer.elapsedTime = timer.targetTime;
                    this.onCountdownFinished(id);
                }
            }
            this.updateDisplay(timer);
        }, 10);

        this.updateButtons(timer);
    }

    pauseTimer(id) {
        const timer = this.timers.get(id);
        if (!timer || !timer.isRunning) return;

        timer.isRunning = false;
        clearInterval(timer.interval);
        this.updateButtons(timer);
    }

    stopTimer(id) {
        const timer = this.timers.get(id);
        if (!timer) return;

        timer.isRunning = false;
        clearInterval(timer.interval);
        this.updateButtons(timer);
    }

    resetTimer(id) {
        const timer = this.timers.get(id);
        if (!timer) return;

        this.stopTimer(id);
        timer.elapsedTime = 0;
        this.updateDisplay(timer);
        
        const card = document.getElementById(`timer-${id}`);
        card.classList.remove('countdown-finished');
    }

    onCountdownFinished(id) {
        const timer = this.timers.get(id);
        const card = document.getElementById(`timer-${id}`);
        
        card.classList.add('countdown-finished');
        this.playAlertSound();
        this.showNotification('Countdown finished!');
    }

    setCountdownTime(id, hours, minutes, seconds) {
        const timer = this.timers.get(id);
        if (!timer || timer.type !== 'countdown') return;

        timer.targetTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        this.updateDisplay(timer);
    }

    formatTime(milliseconds, showMillis = true) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const millis = Math.floor((milliseconds % 1000) / 10);

        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (showMillis) {
            return { timeStr, millis: millis.toString().padStart(2, '0') };
        }
        return { timeStr, millis: '00' };
    }

    updateDisplay(timer) {
        const displayTime = timer.type === 'countdown' 
            ? Math.max(0, timer.targetTime - timer.elapsedTime)
            : timer.elapsedTime;

        const { timeStr, millis } = this.formatTime(displayTime);
        
        const timeDisplay = document.querySelector(`#timer-${timer.id} .time-display`);
        const millisDisplay = document.querySelector(`#timer-${timer.id} .milliseconds`);
        
        if (timeDisplay) timeDisplay.textContent = timeStr;
        if (millisDisplay) millisDisplay.textContent = millis;
    }

    updateButtons(timer) {
        const startBtn = document.querySelector(`#timer-${timer.id} .start-btn`);
        const pauseBtn = document.querySelector(`#timer-${timer.id} .pause-btn`);
        
        if (startBtn) startBtn.style.display = timer.isRunning ? 'none' : 'inline-block';
        if (pauseBtn) pauseBtn.style.display = timer.isRunning ? 'inline-block' : 'none';
    }

    renderTimer(timer) {
        const container = document.getElementById('timersContainer');
        const card = document.createElement('div');
        card.className = 'timer-card';
        card.id = `timer-${timer.id}`;

        const { timeStr, millis } = this.formatTime(
            timer.type === 'countdown' ? timer.targetTime : 0
        );

        card.innerHTML = `
            <div class="timer-header">
                <div class="timer-type">${timer.type === 'stopwatch' ? 'Stopwatch' : 'Countdown'} #${timer.id}</div>
                <button class="delete-btn" onclick="timerManager.deleteTimer(${timer.id})">Delete</button>
            </div>
            
            <div class="display">
                <div class="time-display">${timeStr}</div>
                <div class="milliseconds">${millis}</div>
            </div>

            ${timer.type === 'countdown' ? `
                <div class="countdown-inputs">
                    <input type="number" class="time-input" placeholder="Hours" min="0" max="23" value="0" 
                           onchange="updateCountdownTime(${timer.id})">
                    <input type="number" class="time-input" placeholder="Minutes" min="0" max="59" value="1" 
                           onchange="updateCountdownTime(${timer.id})">
                    <input type="number" class="time-input" placeholder="Seconds" min="0" max="59" value="0" 
                           onchange="updateCountdownTime(${timer.id})">
                </div>
            ` : ''}

            <div class="controls-buttons">
                <button class="control-btn start-btn" onclick="timerManager.startTimer(${timer.id})">Start</button>
                <button class="control-btn pause-btn" onclick="timerManager.pauseTimer(${timer.id})" style="display: none;">Pause</button>
                <button class="control-btn stop-btn" onclick="timerManager.stopTimer(${timer.id})">Stop</button>
                <button class="control-btn reset-btn" onclick="timerManager.resetTimer(${timer.id})">Reset</button>
            </div>
        `;

        container.appendChild(card);

        if (timer.type === 'countdown') {
            updateCountdownTime(timer.id);
        }
    }
}

// Global instance
const timerManager = new TimerManager();

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

function addTimer() {
    timerManager.createTimer('stopwatch');
}

function addCountdown() {
    timerManager.createTimer('countdown');
}

function updateCountdownTime(id) {
    const card = document.getElementById(`timer-${id}`);
    const inputs = card.querySelectorAll('.time-input');
    const hours = parseInt(inputs[0].value) || 0;
    const minutes = parseInt(inputs[1].value) || 0;
    const seconds = parseInt(inputs[2].value) || 0;
    
    timerManager.setCountdownTime(id, hours, minutes, seconds);
}

// Add initial timers
addTimer();
addCountdown();
