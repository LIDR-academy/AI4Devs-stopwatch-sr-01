import { TimerManager } from './components/timer.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = document.getElementById('app');
    const timerManager = new TimerManager(app);
    timerManager.init();
    console.log('Application initialized successfully.');
  } catch (error) {
    console.error('Error initializing the application:', error);
  }
});