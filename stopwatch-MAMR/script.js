class StopWatchApp {
    constructor() {
        this.currentMode = 'stopwatch';
        this.timers = new Map();
        this.timerIdCounter = 0;
        this.settings = {
            volume: 0.7,
            autoRestart: false,
            theme: 'auto'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateEmptyState();
        this.setupTheme();
        this.setupAudio();
        this.loadSettings();
    }

    setupEventListeners() {
        // Tab switching
        document.getElementById('stopwatch-tab').addEventListener('click', () => this.switchMode('stopwatch'));
        document.getElementById('countdown-tab').addEventListener('click', () => this.switchMode('countdown'));

        // Add timer buttons
        document.getElementById('add-timer').addEventListener('click', () => this.showTimerModal());
        document.getElementById('add-first-timer').addEventListener('click', () => this.showTimerModal());

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => this.hideTimerModal());
        document.getElementById('cancel-timer').addEventListener('click', () => this.hideTimerModal());
        document.getElementById('create-timer').addEventListener('click', () => this.createTimer());

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettingsModal());
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettingsModal());
        document.getElementById('volume-control').addEventListener('input', (e) => this.updateVolume(e.target.value));
        document.getElementById('auto-restart').addEventListener('change', (e) => this.updateAutoRestart(e.target.checked));
        document.getElementById('theme-select').addEventListener('change', (e) => this.updateTheme(e.target.value));
        document.getElementById('test-sound').addEventListener('click', () => this.testSound());

        // Modal click outside to close
        document.getElementById('timer-modal').addEventListener('click', (e) => {
            if (e.target.id === 'timer-modal') this.hideTimerModal();
        });
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') this.hideSettingsModal();
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideTimerModal();
                this.hideSettingsModal();
            }
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update tab appearance
        const stopwatchTab = document.getElementById('stopwatch-tab');
        const countdownTab = document.getElementById('countdown-tab');
        const modeTitle = document.getElementById('mode-title');
        const modalTitle = document.getElementById('modal-title');
        const countdownSettings = document.getElementById('countdown-settings');

        if (mode === 'stopwatch') {
            stopwatchTab.className = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
            countdownTab.className = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
            modeTitle.textContent = 'Active Stopwatches';
            modalTitle.textContent = 'New Stopwatch';
            countdownSettings.classList.add('hidden');
        } else {
            stopwatchTab.className = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
            countdownTab.className = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
            modeTitle.textContent = 'Active Timers';
            modalTitle.textContent = 'New Countdown Timer';
            countdownSettings.classList.remove('hidden');
        }

        this.updateEmptyState();
    }

    showTimerModal() {
        const modal = document.getElementById('timer-modal');
        const nameInput = document.getElementById('timer-name');
        
        // Clear previous input
        nameInput.value = '';
        if (this.currentMode === 'countdown') {
            document.getElementById('hours').value = '0';
            document.getElementById('minutes').value = '5';
            document.getElementById('seconds').value = '0';
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        nameInput.focus();
    }

    hideTimerModal() {
        const modal = document.getElementById('timer-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        this.updateVolumeDisplay();
    }

    hideSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    createTimer() {
        const name = document.getElementById('timer-name').value.trim() || `${this.currentMode === 'stopwatch' ? 'Stopwatch' : 'Timer'} ${this.timers.size + 1}`;
        
        let initialTime = 0;
        if (this.currentMode === 'countdown') {
            const hours = parseInt(document.getElementById('hours').value) || 0;
            const minutes = parseInt(document.getElementById('minutes').value) || 0;
            const seconds = parseInt(document.getElementById('seconds').value) || 0;
            initialTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
            
            if (initialTime <= 0) {
                alert('Please set a valid time for the countdown timer.');
                return;
            }
        }

        const timer = new Timer(++this.timerIdCounter, name, this.currentMode, initialTime);
        this.timers.set(timer.id, timer);
        this.renderTimer(timer);
        this.hideTimerModal();
        this.updateEmptyState();
    }

    renderTimer(timer) {
        const container = document.getElementById('timers-container');
        const timerElement = this.createTimerElement(timer);
        container.appendChild(timerElement);
    }

    createTimerElement(timer) {
        const element = document.createElement('div');
        element.id = `timer-${timer.id}`;
        element.className = `bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-xl ${timer.isFinished ? 'ring-2 ring-red-500 animate-pulse-slow' : ''}`;
        
        element.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${timer.name}</h3>
                    <span class="text-sm text-gray-500 dark:text-gray-400 capitalize">${timer.type}</span>
                </div>
                <button onclick="app.deleteTimer(${timer.id})" class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    🗑️
                </button>
            </div>
            
            <div class="text-center mb-6">
                <div class="text-4xl md:text-5xl font-mono font-bold text-gray-900 dark:text-white ${timer.isFinished ? 'text-red-500' : ''}">
                    ${this.formatTime(timer.getCurrentTime())}
                </div>
                ${timer.type === 'stopwatch' && timer.laps.length > 0 ? `
                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Lap ${timer.laps.length}: ${this.formatTime(timer.laps[timer.laps.length - 1])}
                    </div>
                ` : ''}
            </div>
            
            <div class="flex justify-center space-x-3 mb-4">
                ${timer.isRunning ? `
                    <button onclick="app.pauseTimer(${timer.id})" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                        ⏸️ Pause
                    </button>
                ` : `
                    <button onclick="app.startTimer(${timer.id})" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                        ▶️ Start
                    </button>
                `}
                
                <button onclick="app.resetTimer(${timer.id})" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                    🔄 Reset
                </button>
                
                ${timer.type === 'stopwatch' ? `
                    <button onclick="app.lapTimer(${timer.id})" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium" ${!timer.isRunning ? 'disabled' : ''}>
                        🏁 Lap
                    </button>
                ` : ''}
            </div>
            
            ${timer.type === 'stopwatch' && timer.laps.length > 0 ? `
                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lap History</h4>
                    <div class="max-h-32 overflow-y-auto space-y-1">
                        ${timer.laps.map((lap, index) => `
                            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Lap ${index + 1}</span>
                                <span class="font-mono">${this.formatTime(lap)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        return element;
    }

    updateTimerDisplay(timer) {
        const element = document.getElementById(`timer-${timer.id}`);
        if (!element) return;

        // Use DocumentFragment to batch DOM updates
        const timeDisplay = element.querySelector('.text-4xl');
        const lapDisplay = element.querySelector('.text-sm.text-gray-500:not(.capitalize)');
        
        // Update time display
        if (timeDisplay) {
            const newTime = this.formatTime(timer.getCurrentTime());
            if (timeDisplay.textContent !== newTime) {
                timeDisplay.textContent = newTime;
            }
            
            const newClassName = `text-4xl md:text-5xl font-mono font-bold ${timer.isFinished ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`;
            if (timeDisplay.className !== newClassName) {
                timeDisplay.className = newClassName;
            }
        }
        
        // Update lap display for stopwatch
        if (timer.type === 'stopwatch' && timer.laps.length > 0 && lapDisplay) {
            const newLapText = `Lap ${timer.laps.length}: ${this.formatTime(timer.laps[timer.laps.length - 1])}`;
            if (lapDisplay.textContent !== newLapText) {
                lapDisplay.textContent = newLapText;
            }
        }

        // Update timer card appearance when finished (only if state changed)
        const shouldHaveFinishedClass = timer.isFinished;
        const hasFinishedClass = element.className.includes('ring-2 ring-red-500 animate-pulse-slow');
        
        if (shouldHaveFinishedClass && !hasFinishedClass) {
            element.className += ' ring-2 ring-red-500 animate-pulse-slow';
            // Update controls when state changes to finished
            this.updateTimerControls(timer);
        } else if (!shouldHaveFinishedClass && hasFinishedClass) {
            element.className = element.className.replace(' ring-2 ring-red-500 animate-pulse-slow', '');
        }

        // Only update controls if running state changed
        if (timer.wasRunning !== timer.isRunning) {
            timer.wasRunning = timer.isRunning;
            this.updateTimerControls(timer);
        }
    }

    updateTimerControls(timer) {
        const element = document.getElementById(`timer-${timer.id}`);
        const controlsContainer = element.querySelector('.flex.justify-center.space-x-3');
        
        controlsContainer.innerHTML = `
            ${timer.isRunning ? `
                <button onclick="app.pauseTimer(${timer.id})" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                    ⏸️ Pause
                </button>
            ` : `
                <button onclick="app.startTimer(${timer.id})" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                    ▶️ Start
                </button>
            `}
            
            <button onclick="app.resetTimer(${timer.id})" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium">
                🔄 Reset
            </button>
            
            ${timer.type === 'stopwatch' ? `
                <button onclick="app.lapTimer(${timer.id})" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium" ${!timer.isRunning ? 'disabled' : ''}>
                    🏁 Lap
                </button>
            ` : ''}
        `;
    }

    startTimer(id) {
        const timer = this.timers.get(id);
        if (timer && !timer.isRunning) {
            timer.start();
            // Force immediate control update
            requestAnimationFrame(() => {
                this.updateTimerControls(timer);
            });
        }
    }

    pauseTimer(id) {
        const timer = this.timers.get(id);
        if (timer && timer.isRunning) {
            timer.pause();
            // Force immediate control update
            requestAnimationFrame(() => {
                this.updateTimerControls(timer);
            });
        }
    }

    resetTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            timer.reset();
            // Force immediate display update
            requestAnimationFrame(() => {
                this.updateTimerDisplay(timer);
            });
        }
    }

    lapTimer(id) {
        const timer = this.timers.get(id);
        if (timer && timer.type === 'stopwatch') {
            timer.lap();
            this.updateTimerDisplay(timer);
            // Re-render the entire timer to update lap history
            const element = document.getElementById(`timer-${timer.id}`);
            const newElement = this.createTimerElement(timer);
            element.parentNode.replaceChild(newElement, element);
        }
    }

    deleteTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            timer.stop();
            this.timers.delete(id);
            const element = document.getElementById(`timer-${id}`);
            if (element) {
                element.remove();
            }
            this.updateEmptyState();
        }
    }

    updateEmptyState() {
        const container = document.getElementById('timers-container');
        const emptyState = document.getElementById('empty-state');
        
        if (this.timers.size === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            container.style.display = 'grid';
            emptyState.style.display = 'none';
        }
    }

    formatTime(timeMs) {
        const totalSeconds = Math.floor(Math.abs(timeMs) / 1000);
        const milliseconds = Math.floor((Math.abs(timeMs) % 1000) / 10);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        }
    }

    setupAudio() {
        this.alertSound = document.getElementById('alert-sound');
        this.alertSound.volume = this.settings.volume;
    }

    playAlert() {
        if (this.alertSound && this.settings.volume > 0) {
            this.alertSound.currentTime = 0;
            this.alertSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    testSound() {
        this.playAlert();
    }

    updateVolume(value) {
        this.settings.volume = parseFloat(value);
        this.alertSound.volume = this.settings.volume;
        this.updateVolumeDisplay();
        this.saveSettings();
    }

    updateVolumeDisplay() {
        const volumeValue = document.getElementById('volume-value');
        volumeValue.textContent = `${Math.round(this.settings.volume * 100)}%`;
    }

    updateAutoRestart(checked) {
        this.settings.autoRestart = checked;
        this.saveSettings();
    }

    updateTheme(theme) {
        this.settings.theme = theme;
        this.applyTheme();
        this.saveSettings();
    }

    setupTheme() {
        const themeSelect = document.getElementById('theme-select');
        themeSelect.value = this.settings.theme;
        this.applyTheme();
    }

    applyTheme() {
        const html = document.documentElement;
        const theme = this.settings.theme;
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else if (theme === 'light') {
            html.classList.remove('dark');
        } else {
            // Auto theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    }

    saveSettings() {
        // Since we're using memory-only storage as specified, settings won't persist
        // but we keep the structure for potential future enhancement
    }

    loadSettings() {
        // Load default settings since we're not using localStorage
        document.getElementById('volume-control').value = this.settings.volume;
        document.getElementById('auto-restart').checked = this.settings.autoRestart;
        document.getElementById('theme-select').value = this.settings.theme;
        this.updateVolumeDisplay();
    }

    // Method to handle timer completion
    handleTimerComplete(timer) {
        this.playAlert();
        
        if (timer.type === 'countdown' && this.settings.autoRestart) {
            setTimeout(() => {
                timer.reset();
                timer.start();
                this.updateTimerDisplay(timer);
            }, 1000);
        }
    }
}

class Timer {
    constructor(id, name, type, initialTime = 0) {
        this.id = id;
        this.name = name;
        this.type = type; // 'stopwatch' or 'countdown'
        this.initialTime = initialTime;
        this.currentTime = type === 'countdown' ? initialTime : 0;
        this.isRunning = false;
        this.isFinished = false;
        this.wasRunning = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.laps = [];
        this.animationId = null;
        this.lastUpdateTime = 0;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isFinished = false;
            this.startTime = performance.now() - this.pausedTime;
            this.lastUpdateTime = performance.now();
            this.tick();
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.pausedTime = performance.now() - this.startTime;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
    }

    reset() {
        this.isRunning = false;
        this.isFinished = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.currentTime = this.type === 'countdown' ? this.initialTime : 0;
        this.laps = [];
        this.lastUpdateTime = 0;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    stop() {
        this.pause();
        this.reset();
    }

    lap() {
        if (this.isRunning && this.type === 'stopwatch') {
            this.laps.push(this.currentTime);
        }
    }

    tick() {
        if (!this.isRunning) return;

        const now = performance.now();
        const elapsed = now - this.startTime;
        
        if (this.type === 'stopwatch') {
            this.currentTime = elapsed;
        } else {
            this.currentTime = Math.max(0, this.initialTime - elapsed);
            
            if (this.currentTime <= 0) {
                this.currentTime = 0;
                this.isFinished = true;
                this.isRunning = false;
                
                // Notify app about completion
                if (window.app) {
                    window.app.handleTimerComplete(this);
                }
                return; // Exit early, don't schedule next frame
            }
        }
        
        // Update display only every ~16ms (60fps) to avoid blocking UI
        if (now - this.lastUpdateTime >= 16) {
            if (window.app) {
                window.app.updateTimerDisplay(this);
            }
            this.lastUpdateTime = now;
        }
        
        // Schedule next frame
        this.animationId = requestAnimationFrame(() => this.tick());
    }

    getCurrentTime() {
        return this.currentTime;
    }
}

// Initialize the application
const app = new StopWatchApp();
window.app = app;

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (app.settings.theme === 'auto') {
        app.applyTheme();
    }
});
