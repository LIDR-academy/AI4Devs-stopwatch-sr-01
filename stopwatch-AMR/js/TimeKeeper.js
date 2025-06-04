/**
 * Base TimeKeeper class following SOLID principles
 * Single Responsibility: Manages time tracking and formatting
 */
export class TimeKeeper {
    constructor() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.isRunning = false;
        this.intervalId = null;
    }

    /**
     * Format time to HH:MM:SS string
     * @returns {string} Formatted time string
     */
    formatTime() {
        const h = this.hours.toString().padStart(2, '0');
        const m = this.minutes.toString().padStart(2, '0');
        const s = this.seconds.toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    /**
     * Reset time to 00:00:00
     */
    reset() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.stop();
    }

    /**
     * Start the time keeper
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this.tick();
            }, 1000);
        }
    }

    /**
     * Stop the time keeper
     */
    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }

    /**
     * Toggle between start and stop
     */
    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Check if time keeper has any time set
     * @returns {boolean}
     */
    hasTime() {
        return this.hours > 0 || this.minutes > 0 || this.seconds > 0;
    }

    /**
     * Get current state
     * @returns {string} 'initial', 'running', or 'paused'
     */
    getState() {
        if (!this.hasTime()) {
            return 'initial';
        }
        return this.isRunning ? 'running' : 'paused';
    }

    /**
     * Abstract method to be implemented by subclasses
     * Defines how time progresses (forward for stopwatch, backward for timer)
     */
    tick() {
        throw new Error('tick() method must be implemented by subclass');
    }
} 