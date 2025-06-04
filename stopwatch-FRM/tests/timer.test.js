import { TimerManager } from '../components/timer.js';

describe('TimerManager', () => {
  let container;
  let timerManager;

  beforeEach(() => {
    container = document.createElement('div');
    timerManager = new TimerManager(container);
  });

  test('should initialize TimerManager', () => {
    timerManager.init();
    expect(container.children.length).toBeGreaterThan(0);
  });

  test('should add a new timer', () => {
    timerManager.addTimer('stopwatch');
    expect(timerManager.timers.length).toBe(1);
  });

  test('should replace the oldest non-running timer when max limit is reached', () => {
    for (let i = 0; i < timerManager.maxTimers; i++) {
      timerManager.addTimer('stopwatch');
    }
    timerManager.timers[0].isRunning = false;
    timerManager.addTimer('countdown');
    expect(timerManager.timers.length).toBe(timerManager.maxTimers);
  });
});