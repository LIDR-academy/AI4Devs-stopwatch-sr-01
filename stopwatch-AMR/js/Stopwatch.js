import { TimeKeeper } from './TimeKeeper.js';

/**
 * Stopwatch class extending TimeKeeper
 * Single Responsibility: Manages stopwatch functionality (counting up)
 */
export class Stopwatch extends TimeKeeper {
    constructor() {
        super();
    }

    /**
     * Implement tick method for stopwatch (counting up)
     * Liskov Substitution Principle: Can be used wherever TimeKeeper is expected
     */
    tick() {
        this.seconds++;
        
        if (this.seconds >= 60) {
            this.seconds = 0;
            this.minutes++;
            
            if (this.minutes >= 60) {
                this.minutes = 0;
                this.hours++;
                
                // Prevent overflow at 24 hours
                if (this.hours >= 24) {
                    this.hours = 0;
                }
            }
        }
    }

    /**
     * Get button text based on current state
     * @returns {string} Button text
     */
    getButtonText() {
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
} 