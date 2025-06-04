import { TimeKeeper } from './TimeKeeper.js';

/**
 * Timer class extending TimeKeeper
 * Single Responsibility: Manages timer functionality (counting down)
 */
export class Timer extends TimeKeeper {
    constructor(onComplete = null) {
        super();
        this.initialHours = 0;
        this.initialMinutes = 0;
        this.initialSeconds = 0;
        this.onComplete = onComplete;
        this.hasBeenStarted = false; // Track if timer has been started
    }

    /**
     * Set timer with specific time
     * @param {number} hours 
     * @param {number} minutes 
     * @param {number} seconds 
     */
    setTime(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.initialHours = hours;
        this.initialMinutes = minutes;
        this.initialSeconds = seconds;
        this.hasBeenStarted = false; // Reset when setting new time
    }

    /**
     * Start the timer
     */
    start() {
        super.start();
        this.hasBeenStarted = true;
    }

    /**
     * Implement tick method for timer (counting down)
     * Liskov Substitution Principle: Can be used wherever TimeKeeper is expected
     */
    tick() {
        if (this.seconds > 0) {
            this.seconds--;
        } else if (this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        } else if (this.hours > 0) {
            this.hours--;
            this.minutes = 59;
            this.seconds = 59;
        } else {
            // Timer completed
            this.stop();
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }

    /**
     * Check if timer is completed (reached 00:00:00)
     * @returns {boolean}
     */
    isCompleted() {
        return this.hours === 0 && this.minutes === 0 && this.seconds === 0;
    }

    /**
     * Check if timer has been set with initial time
     * @returns {boolean}
     */
    isSet() {
        return this.initialHours > 0 || this.initialMinutes > 0 || this.initialSeconds > 0;
    }

    /**
     * Reset timer to initial set time
     */
    resetToInitial() {
        this.hours = this.initialHours;
        this.minutes = this.initialMinutes;
        this.seconds = this.initialSeconds;
        this.stop();
        this.hasBeenStarted = false;
    }

    /**
     * Clear timer completely (reset to 00:00:00 and clear initial time)
     */
    clear() {
        this.reset();
        this.initialHours = 0;
        this.initialMinutes = 0;
        this.initialSeconds = 0;
        this.hasBeenStarted = false;
    }

    /**
     * Get button text based on current state
     * @returns {string} Button text
     */
    getButtonText() {
        if (!this.isSet()) {
            return 'Set Timer';
        }
        
        // If timer is set but never started, show "Start"
        if (!this.hasBeenStarted) {
            return 'Start';
        }
        
        const state = this.getState();
        switch (state) {
            case 'initial':
                return 'Start';
            case 'running':
                return 'Pause';
            case 'paused':
                return 'Continue';
            default:
                return 'Start';
        }
    }

    /**
     * Get current state for timer (includes 'unset' state)
     * @returns {string} 'unset', 'initial', 'running', or 'paused'
     */
    getState() {
        if (!this.isSet()) {
            return 'unset';
        }
        return super.getState();
    }
} 