class Timer {
    constructor(id, type = 'stopwatch') {
        this.id = id;
        this.type = type; // 'stopwatch' or 'countdown'
        this.time = 0; // milliseconds for stopwatch, initial time for countdown
        this.startTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.lapTimes = [];
        this.initialCountdownTime = 0;
        this.element = null;
        this.isActive = false;
        
        this.createTimerElement();
        this.updateDisplay();
    }

    createTimerElement() {
        const timerHtml = `
            <div class="timer-card ${this.type}" data-timer-id="${this.id}">
                <div class="timer-header">
                    <div class="timer-title">
                        <span class="timer-type-icon">${this.type === 'stopwatch' ? '⏱️' : '⏰'}</span>
                        <span class="timer-name">${this.type === 'stopwatch' ? 'Stopwatch' : 'Countdown'} ${this.id}</span>
                    </div>
                    <div class="timer-actions">
                        <button class="timer-action-btn set-active ${this.isActive ? 'active' : ''}" 
                                title="Set as active timer" aria-label="Set as active timer">
                            <span>★</span>
                        </button>
                        <button class="timer-action-btn duplicate" title="Duplicate timer" aria-label="Duplicate timer">
                            <span>⧉</span>
                        </button>
                        <button class="timer-action-btn delete" title="Delete timer" aria-label="Delete timer">
                            <span>×</span>
                        </button>
                    </div>
                </div>
                
                <div class="timer-display">
                    <div class="time-main" tabindex="0" role="timer" aria-live="polite">
                        ${this.formatTime(this.time)}
                    </div>
                    <div class="timer-status">
                        <span class="status-indicator ${this.getStatusClass()}"></span>
                        <span class="status-text">${this.getStatusText()}</span>
                    </div>
                </div>

                ${this.type === 'countdown' ? `
                    <div class="countdown-input" style="display: ${this.time === 0 ? 'flex' : 'none'}">
                        <div class="time-inputs">
                            <div class="time-input-group">
                                <input type="number" class="time-input hours" min="0" max="23" value="0" aria-label="Hours">
                                <label>H</label>
                            </div>
                            <div class="time-input-group">
                                <input type="number" class="time-input minutes" min="0" max="59" value="5" aria-label="Minutes">
                                <label>M</label>
                            </div>
                            <div class="time-input-group">
                                <input type="number" class="time-input seconds" min="0" max="59" value="0" aria-label="Seconds">
                                <label>S</label>
                            </div>
                        </div>
                        <button class="set-time-btn">Set Time</button>
                    </div>
                ` : ''}

                <div class="timer-progress" style="display: ${this.type === 'countdown' && this.time > 0 ? 'block' : 'none'}">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
                    </div>
                    <div class="progress-text">${this.getProgressText()}</div>
                </div>

                <div class="timer-controls">
                    <button class="control-btn primary start-stop ${this.time === 0 && this.type === 'countdown' ? 'disabled' : ''}" 
                            ${this.time === 0 && this.type === 'countdown' ? 'disabled' : ''}>
                        <span class="btn-icon">${this.isRunning ? '⏸️' : '▶️'}</span>
                        <span class="btn-text">${this.isRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    
                    <button class="control-btn secondary reset">
                        <span class="btn-icon">↻</span>
                        <span class="btn-text">Reset</span>
                    </button>
                    
                    ${this.type === 'stopwatch' ? `
                        <button class="control-btn secondary lap ${!this.isRunning ? 'disabled' : ''}" 
                                ${!this.isRunning ? 'disabled' : ''}>
                            <span class="btn-icon">⏲️</span>
                            <span class="btn-text">Lap</span>
                        </button>
                    ` : ''}
                </div>

                ${this.type === 'stopwatch' ? `
                    <div class="lap-times" style="display: ${this.lapTimes.length > 0 ? 'block' : 'none'}">
                        <div class="lap-times-header">
                            <h4>Lap Times</h4>
                            <button class="clear-laps-btn" title="Clear all laps">Clear</button>
                        </div>
                        <div class="lap-times-list">
                            ${this.renderLapTimes()}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = timerHtml;
        this.element = tempDiv.firstElementChild;
        
        this.bindEvents();
    }

    bindEvents() {
        const startStopBtn = this.element.querySelector('.start-stop');
        const resetBtn = this.element.querySelector('.reset');
        const lapBtn = this.element.querySelector('.lap');
        const deleteBtn = this.element.querySelector('.delete');
        const duplicateBtn = this.element.querySelector('.duplicate');
        const setActiveBtn = this.element.querySelector('.set-active');
        const setTimeBtn = this.element.querySelector('.set-time-btn');
        const clearLapsBtn = this.element.querySelector('.clear-laps-btn');

        startStopBtn?.addEventListener('click', () => this.toggleTimer());
        resetBtn?.addEventListener('click', () => this.reset());
        lapBtn?.addEventListener('click', () => this.addLap());
        deleteBtn?.addEventListener('click', () => timerApp.deleteTimer(this.id));
        duplicateBtn?.addEventListener('click', () => timerApp.duplicateTimer(this.id));
        setActiveBtn?.addEventListener('click', () => timerApp.setActiveTimer(this.id));
        setTimeBtn?.addEventListener('click', () => this.setCountdownTime());
        clearLapsBtn?.addEventListener('click', () => this.clearLaps());

        // Time input validation
        const timeInputs = this.element.querySelectorAll('.time-input');
        timeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                const max = parseInt(e.target.max);
                if (value > max) e.target.value = max;
                if (value < 0) e.target.value = 0;
            });
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (this.type === 'countdown' && this.time <= 0) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - (this.isPaused ? this.time : 0);
        
        this.intervalId = setInterval(() => {
            this.updateTime();
        }, 50); // Update every 50ms for smooth display
        
        this.updateControls();
        this.playSound('start');
        timerApp.setActiveTimer(this.id);
        this.announceToScreenReader(`${this.type} started`);
    }

    pause() {
        this.isRunning = false;
        this.isPaused = true;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.updateControls();
        this.playSound('stop');
        this.announceToScreenReader(`${this.type} paused`);
    }

    reset() {
        this.pause();
        
        if (this.type === 'stopwatch') {
            this.time = 0;
        } else {
            this.time = this.initialCountdownTime;
        }
        
        this.isPaused = false;
        this.updateDisplay();
        this.updateControls();
        this.announceToScreenReader(`${this.type} reset`);
        
        // Show countdown input if countdown is reset to 0
        if (this.type === 'countdown' && this.time === 0) {
            this.element.querySelector('.countdown-input').style.display = 'flex';
        }
    }

    updateTime() {
        if (!this.isRunning) return;
        
        if (this.type === 'stopwatch') {
            this.time = Date.now() - this.startTime;
        } else {
            const elapsed = Date.now() - this.startTime;
            this.time = Math.max(0, this.initialCountdownTime - elapsed);
            
            if (this.time <= 0) {
                this.time = 0;
                this.pause();
                this.onCountdownComplete();
            }
        }
        
        this.updateDisplay();
    }

    onCountdownComplete() {
        this.playSound('alarm');
        this.showNotification();
        this.flashElement();
        this.announceToScreenReader('Countdown completed!');
    }

    addLap() {
        if (this.type !== 'stopwatch' || !this.isRunning) return;
        
        const lapTime = this.time;
        const lapNumber = this.lapTimes.length + 1;
        const previousLap = this.lapTimes.length > 0 ? this.lapTimes[this.lapTimes.length - 1].time : 0;
        const splitTime = lapTime - previousLap;
        
        this.lapTimes.push({
            number: lapNumber,
            time: lapTime,
            splitTime: splitTime,
            timestamp: new Date()
        });
        
        this.updateLapDisplay();
        this.announceToScreenReader(`Lap ${lapNumber} recorded: ${this.formatTime(splitTime)}`);
    }

    clearLaps() {
        this.lapTimes = [];
        this.updateLapDisplay();
        this.announceToScreenReader('All lap times cleared');
    }

    setCountdownTime() {
        const hours = parseInt(this.element.querySelector('.hours').value) || 0;
        const minutes = parseInt(this.element.querySelector('.minutes').value) || 0;
        const seconds = parseInt(this.element.querySelector('.seconds').value) || 0;
        
        this.time = (hours * 3600 + minutes * 60 + seconds) * 1000;
        this.initialCountdownTime = this.time;
        
        if (this.time > 0) {
            this.element.querySelector('.countdown-input').style.display = 'none';
            this.element.querySelector('.timer-progress').style.display = 'block';
            this.element.querySelector('.start-stop').disabled = false;
            this.element.querySelector('.start-stop').classList.remove('disabled');
        }
        
        this.updateDisplay();
        this.updateControls();
        this.announceToScreenReader(`Countdown set to ${this.formatTime(this.time)}`);
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }
    }

    updateDisplay() {
        const timeDisplay = this.element.querySelector('.time-main');
        const statusIndicator = this.element.querySelector('.status-indicator');
        const statusText = this.element.querySelector('.status-text');
        const progressFill = this.element.querySelector('.progress-fill');
        const progressText = this.element.querySelector('.progress-text');
        
        timeDisplay.textContent = this.formatTime(this.time);
        statusIndicator.className = `status-indicator ${this.getStatusClass()}`;
        statusText.textContent = this.getStatusText();
        
        if (this.type === 'countdown' && progressFill) {
            progressFill.style.width = `${this.getProgressPercentage()}%`;
            progressText.textContent = this.getProgressText();
        }
    }

    updateControls() {
        const startStopBtn = this.element.querySelector('.start-stop');
        const lapBtn = this.element.querySelector('.lap');
        const startStopIcon = startStopBtn.querySelector('.btn-icon');
        const startStopText = startStopBtn.querySelector('.btn-text');
        
        startStopIcon.textContent = this.isRunning ? '⏸️' : '▶️';
        startStopText.textContent = this.isRunning ? 'Pause' : 'Start';
        
        if (lapBtn) {
            lapBtn.disabled = !this.isRunning;
            lapBtn.classList.toggle('disabled', !this.isRunning);
        }
    }

    updateLapDisplay() {
        const lapTimesContainer = this.element.querySelector('.lap-times');
        const lapTimesList = this.element.querySelector('.lap-times-list');
        
        if (lapTimesContainer && lapTimesList) {
            lapTimesContainer.style.display = this.lapTimes.length > 0 ? 'block' : 'none';
            lapTimesList.innerHTML = this.renderLapTimes();
        }
    }

    renderLapTimes() {
        return this.lapTimes.slice().reverse().map(lap => `
            <div class="lap-time-item">
                <span class="lap-number">${lap.number}</span>
                <span class="lap-split">${this.formatTime(lap.splitTime)}</span>
                <span class="lap-total">${this.formatTime(lap.time)}</span>
            </div>
        `).join('');
    }

    getStatusClass() {
        if (this.isRunning) return 'running';
        if (this.isPaused) return 'paused';
        return 'stopped';
    }

    getStatusText() {
        if (this.isRunning) return 'Running';
        if (this.isPaused) return 'Paused';
        return 'Stopped';
    }

    getProgressPercentage() {
        if (this.type !== 'countdown' || this.initialCountdownTime === 0) return 0;
        return Math.max(0, (this.time / this.initialCountdownTime) * 100);
    }

    getProgressText() {
        if (this.type !== 'countdown') return '';
        const percentage = this.getProgressPercentage();
        return `${Math.round(percentage)}% remaining`;
    }

    playSound(type) {
        if (!timerApp.settings.soundEnabled) return;
        
        const soundMap = {
            start: 'startSound',
            stop: 'stopSound',
            alarm: 'alarmSound'
        };
        
        const audio = document.getElementById(soundMap[type]);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {}); // Ignore autoplay restrictions
        }
    }

    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: `Countdown timer ${this.id} has finished.`,
                icon: '/favicon.ico'
            });
        }
    }

    flashElement() {
        this.element.classList.add('flash');
        setTimeout(() => {
            this.element.classList.remove('flash');
        }, 3000);
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    setActive(active) {
        this.isActive = active;
        const setActiveBtn = this.element.querySelector('.set-active');
        setActiveBtn.classList.toggle('active', active);
        this.element.classList.toggle('active-timer', active);
    }

    exportData() {
        return {
            id: this.id,
            type: this.type,
            time: this.time,
            initialCountdownTime: this.initialCountdownTime,
            lapTimes: this.lapTimes,
            isRunning: this.isRunning,
            isPaused: this.isPaused
        };
    }

    importData(data) {
        this.time = data.time || 0;
        this.initialCountdownTime = data.initialCountdownTime || 0;
        this.lapTimes = data.lapTimes || [];
        this.isRunning = false; // Don't restore running state
        this.isPaused = data.isPaused || false;
        
        this.updateDisplay();
        this.updateControls();
        this.updateLapDisplay();
    }
}

class TimerApp {
    constructor() {
        this.timers = new Map();
        this.nextId = 1;
        this.activeTimerId = null;
        this.currentMode = 'stopwatch';
        this.settings = {
            soundEnabled: true,
            theme: 'light',
            autoSave: true
        };
        
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.loadSettings();
        this.loadTimers();
        this.requestNotificationPermission();
        
        // Create initial timer if none exist
        if (this.timers.size === 0) {
            this.addTimer();
        }
    }

    bindGlobalEvents() {
        // Mode switching
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Add timer button
        document.getElementById('addTimerBtn').addEventListener('click', () => {
            this.addTimer();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Help toggle
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.toggleHelp();
        });

        document.getElementById('closeHelp').addEventListener('click', () => {
            this.toggleHelp();
        });

        // Fullscreen toggle
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Auto-save
        if (this.settings.autoSave) {
            setInterval(() => {
                this.saveTimers();
            }, 30000); // Save every 30 seconds
        }

        // Visibility change (pause when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveTimers();
            }
        });

        // Before unload
        window.addEventListener('beforeunload', () => {
            this.saveTimers();
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });
        
        // Update add timer button text
        const addBtn = document.getElementById('addTimerBtn');
        const btnText = addBtn.querySelector('.btn-text');
        btnText.textContent = `Add ${mode === 'stopwatch' ? 'Stopwatch' : 'Countdown'}`;
        
        this.saveSettings();
    }

    addTimer(type = null) {
        const timerType = type || this.currentMode;
        const timer = new Timer(this.nextId++, timerType);
        
        this.timers.set(timer.id, timer);
        
        // Add to DOM
        const container = document.getElementById('timersContainer');
        container.appendChild(timer.element);
        
        // Set as active if it's the first timer
        if (this.timers.size === 1) {
            this.setActiveTimer(timer.id);
        }
        
        this.saveTimers();
        return timer;
    }

    deleteTimer(id) {
        const timer = this.timers.get(id);
        if (!timer) return;
        
        // Stop timer if running
        if (timer.isRunning) {
            timer.pause();
        }
        
        // Remove from DOM
        timer.element.remove();
        
        // Remove from map
        this.timers.delete(id);
        
        // Set new active timer if this was active
        if (this.activeTimerId === id) {
            const remainingTimers = Array.from(this.timers.keys());
            if (remainingTimers.length > 0) {
                this.setActiveTimer(remainingTimers[0]);
            } else {
                this.activeTimerId = null;
            }
        }
        
        // Add a new timer if none remain
        if (this.timers.size === 0) {
            this.addTimer();
        }
        
        this.saveTimers();
    }

    duplicateTimer(id) {
        const originalTimer = this.timers.get(id);
        if (!originalTimer) return;
        
        const newTimer = this.addTimer(originalTimer.type);
        
        // Copy settings but not running state
        if (originalTimer.type === 'countdown' && originalTimer.initialCountdownTime > 0) {
            newTimer.time = originalTimer.initialCountdownTime;
            newTimer.initialCountdownTime = originalTimer.initialCountdownTime;
            newTimer.updateDisplay();
            
            // Hide countdown input
            newTimer.element.querySelector('.countdown-input').style.display = 'none';
            newTimer.element.querySelector('.timer-progress').style.display = 'block';
            newTimer.element.querySelector('.start-stop').disabled = false;
            newTimer.element.querySelector('.start-stop').classList.remove('disabled');
        }
        
        return newTimer;
    }

    setActiveTimer(id) {
        // Remove active state from all timers
        this.timers.forEach(timer => {
            timer.setActive(false);
        });
        
        // Set new active timer
        const timer = this.timers.get(id);
        if (timer) {
            timer.setActive(true);
            this.activeTimerId = id;
        }
        
        this.saveSettings();
    }

    getActiveTimer() {
        return this.timers.get(this.activeTimerId);
    }

    handleKeyboardShortcuts(e) {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT') return;
        
        const activeTimer = this.getActiveTimer();
        
        switch (e.key.toLowerCase()) {
            case ' ': // Space - Start/Stop active timer
                e.preventDefault();
                if (activeTimer) {
                    activeTimer.toggleTimer();
                }
                break;
                
            case 'r': // R - Reset active timer
                e.preventDefault();
                if (activeTimer) {
                    activeTimer.reset();
                }
                break;
                
            case 'l': // L - Add lap (stopwatch only)
                e.preventDefault();
                if (activeTimer && activeTimer.type === 'stopwatch') {
                    activeTimer.addLap();
                }
                break;
                
            case 't': // T - Switch modes
                e.preventDefault();
                this.switchMode(this.currentMode === 'stopwatch' ? 'countdown' : 'stopwatch');
                break;
                
            case 'a': // A - Add new timer
                e.preventDefault();
                this.addTimer();
                break;
                
            case 'h': // H - Toggle help
                e.preventDefault();
                this.toggleHelp();
                break;
                
            case 'f': // F - Toggle fullscreen
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', this.settings.theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.settings.theme === 'light' ? '🌙' : '☀️';
        
        this.saveSettings();
    }

    toggleHelp() {
        const helpModal = document.getElementById('shortcutsHelp');
        helpModal.classList.toggle('visible');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    saveSettings() {
        localStorage.setItem('timerApp_settings', JSON.stringify({
            ...this.settings,
            currentMode: this.currentMode,
            activeTimerId: this.activeTimerId
        }));
    }

    loadSettings() {
        const saved = localStorage.getItem('timerApp_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.settings = { ...this.settings, ...settings };
            this.currentMode = settings.currentMode || 'stopwatch';
            this.activeTimerId = settings.activeTimerId;
            
            // Apply theme
            document.body.setAttribute('data-theme', this.settings.theme);
            const themeIcon = document.querySelector('.theme-icon');
            themeIcon.textContent = this.settings.theme === 'light' ? '🌙' : '☀️';
            
            // Apply mode
            this.switchMode(this.currentMode);
        }
    }

    saveTimers() {
        const timersData = Array.from(this.timers.values()).map(timer => timer.exportData());
        localStorage.setItem('timerApp_timers', JSON.stringify(timersData));
    }

    loadTimers() {
        const saved = localStorage.getItem('timerApp_timers');
        if (saved) {
            const timersData = JSON.parse(saved);
            timersData.forEach(data => {
                const timer = this.addTimer(data.type);
                timer.importData(data);
            });
            
            // Set active timer
            if (this.activeTimerId) {
                this.setActiveTimer(this.activeTimerId);
            }
        }
    }

    exportAllData() {
        const data = {
            settings: this.settings,
            currentMode: this.currentMode,
            activeTimerId: this.activeTimerId,
            timers: Array.from(this.timers.values()).map(timer => timer.exportData()),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timer-app-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importAllData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Clear existing timers
            this.timers.forEach(timer => {
                timer.element.remove();
            });
            this.timers.clear();
            
            // Restore settings
            this.settings = { ...this.settings, ...data.settings };
            this.currentMode = data.currentMode || 'stopwatch';
            this.activeTimerId = data.activeTimerId;
            
            // Restore timers
            data.timers.forEach(timerData => {
                const timer = this.addTimer(timerData.type);
                timer.importData(timerData);
            });
            
            // Apply settings
            this.loadSettings();
            
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timerApp = new TimerApp();
});

// Export for testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Timer, TimerApp };
} 