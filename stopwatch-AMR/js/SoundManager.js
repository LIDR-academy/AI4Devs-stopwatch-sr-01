/**
 * SoundManager class
 * Single Responsibility: Manages audio playback
 * Interface Segregation: Only provides sound-related functionality
 */
export class SoundManager {
    constructor() {
        this.audioElement = document.getElementById('timer-sound');
        this.isEnabled = true;
    }

    /**
     * Play the timer completion sound (fart sound)
     */
    playTimerComplete() {
        if (!this.isEnabled) {
            return;
        }

        // Try to play the audio file first
        if (this.audioElement) {
            try {
                this.audioElement.currentTime = 0;
                const playPromise = this.audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn('Could not play timer sound:', error);
                        this.playFartSound();
                    });
                }
                return;
            } catch (error) {
                console.warn('Error playing timer sound:', error);
            }
        }
        
        // Fallback to generated fart sound
        this.playFartSound();
    }

    /**
     * Create a realistic fart sound using Web Audio API
     */
    playFartSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const duration = 1.2; // 1.2 seconds
            
            // Create multiple oscillators for a more realistic fart sound
            const oscillators = [];
            const gainNodes = [];
            
            // Low frequency rumble (main fart sound)
            const lowOsc = audioContext.createOscillator();
            const lowGain = audioContext.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(80, audioContext.currentTime);
            lowOsc.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + duration);
            lowGain.gain.setValueAtTime(0.3, audioContext.currentTime);
            lowGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            // Mid frequency for texture
            const midOsc = audioContext.createOscillator();
            const midGain = audioContext.createGain();
            midOsc.type = 'square';
            midOsc.frequency.setValueAtTime(150, audioContext.currentTime);
            midOsc.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + duration);
            midGain.gain.setValueAtTime(0.2, audioContext.currentTime);
            midGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            // High frequency for the "pffft" sound
            const highOsc = audioContext.createOscillator();
            const highGain = audioContext.createGain();
            highOsc.type = 'triangle';
            highOsc.frequency.setValueAtTime(300, audioContext.currentTime);
            highOsc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
            highGain.gain.setValueAtTime(0.15, audioContext.currentTime);
            highGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            // Create noise for texture
            const bufferSize = audioContext.sampleRate * duration;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const noiseSource = audioContext.createBufferSource();
            const noiseGain = audioContext.createGain();
            noiseSource.buffer = noiseBuffer;
            noiseGain.gain.setValueAtTime(0.1, audioContext.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            // Connect all sources
            lowOsc.connect(lowGain);
            midOsc.connect(midGain);
            highOsc.connect(highGain);
            noiseSource.connect(noiseGain);
            
            lowGain.connect(audioContext.destination);
            midGain.connect(audioContext.destination);
            highGain.connect(audioContext.destination);
            noiseGain.connect(audioContext.destination);
            
            // Start all sources
            const startTime = audioContext.currentTime;
            lowOsc.start(startTime);
            midOsc.start(startTime);
            highOsc.start(startTime);
            noiseSource.start(startTime);
            
            // Stop all sources
            lowOsc.stop(startTime + duration);
            midOsc.stop(startTime + duration);
            highOsc.stop(startTime + 0.3); // High frequency stops earlier
            noiseSource.stop(startTime + duration);
            
        } catch (error) {
            console.warn('Could not create fart sound:', error);
            // Ultimate fallback - simple beep
            this.playSimpleBeep();
        }
    }

    /**
     * Create a simple beep sound as ultimate fallback
     */
    playSimpleBeep() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Could not create any sound:', error);
        }
    }

    /**
     * Enable sound playback
     */
    enable() {
        this.isEnabled = true;
    }

    /**
     * Disable sound playback
     */
    disable() {
        this.isEnabled = false;
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
    }

    /**
     * Check if sound is enabled
     * @returns {boolean}
     */
    isAudioEnabled() {
        return this.isEnabled;
    }

    /**
     * Set volume (0.0 to 1.0)
     * @param {number} volume 
     */
    setVolume(volume) {
        if (this.audioElement) {
            this.audioElement.volume = Math.max(0, Math.min(1, volume));
        }
    }
} 