import { Stopwatch } from './Stopwatch.js';
import { Timer } from './Timer.js';
import { NavigationManager } from './NavigationManager.js';
import { SoundManager } from './SoundManager.js';

/**
 * Main Application class
 * Single Responsibility: Coordinates all components and handles user interactions
 * Dependency Inversion: Depends on abstractions (interfaces) rather than concrete classes
 */
class App {
    constructor() {
        // Initialize managers and components
        this.navigationManager = new NavigationManager();
        this.soundManager = new SoundManager();
        
        // Initialize stopwatch and timer with dependency injection
        this.stopwatch = new Stopwatch();
        this.timer = new Timer(() => this.onTimerComplete());
        
        // Get DOM elements
        this.initializeElements();
        
        // Bind event listeners
        this.bindEvents();
        
        // Initialize displays
        this.updateStopwatchDisplay();
        this.updateTimerDisplay();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Navigation buttons
        this.stopwatchBtn = document.getElementById('stopwatch-btn');
        this.timerBtn = document.getElementById('timer-btn');
        this.backFromStopwatch = document.getElementById('back-from-stopwatch');
        this.backFromTimer = document.getElementById('back-from-timer');

        // Stopwatch elements
        this.stopwatchDisplay = document.getElementById('stopwatch-display');
        this.stopwatchStartBtn = document.getElementById('stopwatch-start');
        this.stopwatchClearBtn = document.getElementById('stopwatch-clear');

        // Timer elements
        this.timerDisplay = document.getElementById('timer-display');
        this.hoursInput = document.getElementById('hours-input');
        this.minutesInput = document.getElementById('minutes-input');
        this.secondsInput = document.getElementById('seconds-input');
        this.timerSetBtn = document.getElementById('timer-set');
        this.timerStartBtn = document.getElementById('timer-start');
        this.timerClearBtn = document.getElementById('timer-clear');
        this.timerInputSection = document.getElementById('timer-input-section');
        this.timerControlsSection = document.getElementById('timer-controls-section');
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Navigation events
        this.stopwatchBtn.addEventListener('click', () => this.navigationManager.goToStopwatch());
        this.timerBtn.addEventListener('click', () => this.navigationManager.goToTimer());
        this.backFromStopwatch.addEventListener('click', () => this.navigationManager.goHome());
        this.backFromTimer.addEventListener('click', () => this.navigationManager.goHome());

        // Stopwatch events
        this.stopwatchStartBtn.addEventListener('click', () => this.handleStopwatchStart());
        this.stopwatchClearBtn.addEventListener('click', () => this.handleStopwatchClear());

        // Timer events
        this.timerSetBtn.addEventListener('click', () => this.handleTimerSet());
        this.timerStartBtn.addEventListener('click', () => this.handleTimerStart());
        this.timerClearBtn.addEventListener('click', () => this.handleTimerClear());

        // Input validation events
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', (e) => this.validateTimeInput(e.target));
            input.addEventListener('blur', (e) => this.formatTimeInput(e.target));
        });

        // Update displays periodically (but not buttons to avoid conflicts)
        setInterval(() => {
            this.updateStopwatchDisplay();
            this.updateTimerDisplay();
            // Update buttons only when state might have changed
            if (this.stopwatch.isRunning || this.timer.isRunning) {
                this.updateStopwatchButton();
                this.updateTimerButton();
            }
        }, 100);
    }

    /**
     * Handle stopwatch start/pause/continue button
     */
    handleStopwatchStart() {
        this.stopwatch.toggle();
        this.updateStopwatchButton();
        this.updateStopwatchDisplay();
    }

    /**
     * Handle stopwatch clear button
     */
    handleStopwatchClear() {
        this.stopwatch.reset();
        this.updateStopwatchButton();
        this.updateStopwatchDisplay();
    }

    /**
     * Handle timer set button
     */
    handleTimerSet() {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;

        if (hours === 0 && minutes === 0 && seconds === 0) {
            alert('Please set a time greater than 00:00:00');
            return;
        }

        this.timer.setTime(hours, minutes, seconds);
        this.showTimerControls();
        this.updateTimerDisplay();
        this.updateTimerButton();
    }

    /**
     * Handle timer start/pause/continue button
     */
    handleTimerStart() {
        this.timer.toggle();
        this.updateTimerButton();
        this.updateTimerDisplay();
    }

    /**
     * Handle timer clear button
     */
    handleTimerClear() {
        this.timer.clear();
        this.showTimerInputs();
        this.resetTimerInputs();
        this.updateTimerDisplay();
    }

    /**
     * Handle timer completion
     */
    onTimerComplete() {
        this.soundManager.playTimerComplete();
        this.updateTimerButton();
        this.updateTimerDisplay();
        
        // Show completion message
        setTimeout(() => {
            alert('Time\'s up! 💨');
        }, 100);
    }

    /**
     * Update stopwatch display
     */
    updateStopwatchDisplay() {
        this.stopwatchDisplay.textContent = this.stopwatch.formatTime();
        
        // Add active class when running
        if (this.stopwatch.isRunning) {
            this.stopwatchDisplay.classList.add('active');
        } else {
            this.stopwatchDisplay.classList.remove('active');
        }
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        this.timerDisplay.textContent = this.timer.formatTime();
        
        // Add active class when running
        if (this.timer.isRunning) {
            this.timerDisplay.classList.add('active');
        } else {
            this.timerDisplay.classList.remove('active');
        }
    }

    /**
     * Update stopwatch button text and style
     */
    updateStopwatchButton() {
        const buttonText = this.stopwatch.getButtonText();
        const state = this.stopwatch.getState();
        
        this.stopwatchStartBtn.textContent = buttonText;
        
        // Update button classes
        this.stopwatchStartBtn.classList.remove('running', 'paused');
        if (state === 'running') {
            this.stopwatchStartBtn.classList.add('running');
        } else if (state === 'paused') {
            this.stopwatchStartBtn.classList.add('paused');
        }
    }

    /**
     * Update timer button text and style
     */
    updateTimerButton() {
        const buttonText = this.timer.getButtonText();
        const state = this.timer.getState();
        
        this.timerStartBtn.textContent = buttonText;
        
        // Update button classes
        this.timerStartBtn.classList.remove('running', 'paused');
        if (state === 'running') {
            this.timerStartBtn.classList.add('running');
        } else if (state === 'paused') {
            this.timerStartBtn.classList.add('paused');
        }
    }

    /**
     * Show timer controls and hide inputs
     */
    showTimerControls() {
        this.timerInputSection.style.display = 'none';
        this.timerControlsSection.style.display = 'flex';
    }

    /**
     * Show timer inputs and hide controls
     */
    showTimerInputs() {
        this.timerInputSection.style.display = 'block';
        this.timerControlsSection.style.display = 'none';
    }

    /**
     * Reset timer input fields
     */
    resetTimerInputs() {
        this.hoursInput.value = '0';
        this.minutesInput.value = '0';
        this.secondsInput.value = '0';
    }

    /**
     * Validate time input (ensure within valid ranges)
     * @param {HTMLInputElement} input 
     */
    validateTimeInput(input) {
        let value = parseInt(input.value) || 0;
        const max = input.id === 'hours-input' ? 23 : 59;
        
        if (value < 0) value = 0;
        if (value > max) value = max;
        
        input.value = value;
    }

    /**
     * Format time input (add leading zero if needed)
     * @param {HTMLInputElement} input 
     */
    formatTimeInput(input) {
        const value = parseInt(input.value) || 0;
        input.value = value.toString();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 