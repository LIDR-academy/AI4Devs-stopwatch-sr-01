export class TimerManager {
  constructor(container) {
    this.container = container;
    this.timers = [];
    this.maxTimers = 5; // Limit for simultaneous timers
    this.activeTab = 'stopwatch'; // Default active tab
    this.stopwatchContainer = null;
    this.countdownContainer = null;
    this.addButton = null; // Reference to the "Add New" button
  }

  // Initialize the timer manager
  init() {
    this.renderAddButton();
    this.renderTabs();
    this.renderContainers();
    console.log('TimerManager initialized.');
  }

  // Render the "Add New" button
  renderAddButton() {
    this.addButton = document.createElement('button');
    this.addButton.className = 'bg-red-500 text-black rounded-full px-6 py-3 mb-4 shadow-lg hover:bg-red-600 transition-all';
    this.addButton.textContent = 'Add New';
    this.addButton.addEventListener('click', () => this.addTimer(this.activeTab));
    this.container.appendChild(this.addButton);
  }

  // Render tabs for switching between stopwatches and countdown timers
  renderTabs() {
    const tabs = document.createElement('div');
    tabs.className = 'flex justify-center border-b mb-4';

    const stopwatchTab = this.createTab('Stopwatches', 'stopwatch');
    const countdownTab = this.createTab('Countdown Timers', 'countdown');

    tabs.appendChild(stopwatchTab);
    tabs.appendChild(countdownTab);
    this.container.appendChild(tabs);
  }

  // Create a tab element
  createTab(label, tabType) {
    const tab = document.createElement('button');
    tab.className = `px-4 py-2 mx-2 ${
      this.activeTab === tabType ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-500'
    }`;
    tab.textContent = label;
    tab.addEventListener('click', () => this.switchTab(tabType));
    return tab;
  }

  // Switch between tabs
  switchTab(tabType) {
    this.activeTab = tabType;
    this.updateTabVisibility();
    console.log(`Switched to ${tabType} tab.`);
  }

  // Update visibility of containers based on the active tab
  updateTabVisibility() {
    if (this.activeTab === 'stopwatch') {
      this.stopwatchContainer.style.display = 'block';
      this.countdownContainer.style.display = 'none';
    } else {
      this.stopwatchContainer.style.display = 'none';
      this.countdownContainer.style.display = 'block';
    }

    // Update tab styles
    const tabs = this.container.querySelectorAll('button');
    tabs.forEach(tab => {
      if (tab.textContent.toLowerCase().includes(this.activeTab)) {
        tab.className = 'px-4 py-2 mx-2 border-b-2 border-blue-500 text-blue-500 font-bold';
      } else {
        tab.className = 'px-4 py-2 mx-2 text-gray-500';
      }
    });

    // Ensure "Add New" button retains its style
    this.addButton.className = 'bg-red-500 text-black rounded-full px-6 py-3 mb-4 shadow-lg hover:bg-red-600 transition-all';
  }

  // Render separate containers for stopwatches and countdown timers
  renderContainers() {
    const stopwatchContainer = document.createElement('div');
    stopwatchContainer.className = 'w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4';
    const stopwatchTitle = document.createElement('h2');
    stopwatchTitle.className = 'text-xl font-bold text-blue-600 mb-4';
    stopwatchTitle.textContent = 'Stopwatches';
    stopwatchContainer.appendChild(stopwatchTitle);

    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4';
    const countdownTitle = document.createElement('h2');
    countdownTitle.className = 'text-xl font-bold text-blue-600 mb-4';
    countdownTitle.textContent = 'Countdown Timers';
    countdownContainer.appendChild(countdownTitle);

    this.stopwatchContainer = stopwatchContainer;
    this.countdownContainer = countdownContainer;

    this.container.appendChild(stopwatchContainer);
    this.container.appendChild(countdownContainer);

    // Set initial visibility
    this.updateTabVisibility();
  }

  // Create a new timer
  addTimer(type) {
    if (this.timers.length >= this.maxTimers) {
      const allRunning = this.timers.every(timer => timer.isRunning);
      if (allRunning) {
        alert('Maximum limit of 5 timers reached, and all are running.');
        return;
      }
      this.replaceOldestTimer();
    }

    const timer = new Timer(type);
    this.timers.push(timer);

    if (type === 'stopwatch') {
      this.stopwatchContainer.appendChild(timer.render());
    } else if (type === 'countdown') {
      this.countdownContainer.appendChild(timer.render());
    }

    console.log(`${type} timer added.`);
  }

  // Replace the oldest non-running timer
  replaceOldestTimer() {
    const oldestTimer = this.timers.find(timer => !timer.isRunning);
    if (oldestTimer) {
      oldestTimer.remove();
      this.timers = this.timers.filter(timer => timer !== oldestTimer);
      console.log('Oldest non-running timer replaced.');
    }
  }
}

class Timer {
  constructor(type) {
    this.type = type;
    this.isRunning = false;
    this.intervalId = null;
    this.time = type === 'countdown' ? 0 : 0; // Default time for countdown is 0
  }

  // Render the timer UI
  render() {
    const timerElement = document.createElement('div');
    timerElement.className = 'bg-gray-200 rounded-lg p-4 mb-4 shadow-md';

    const title = document.createElement('h2');
    title.className = 'text-lg font-bold';
    title.textContent = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} Timer`;

    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'text-xl font-mono mt-2';
    timeDisplay.textContent = this.formatTime(this.time);

    const controls = document.createElement('div');
    controls.className = 'flex justify-between mt-2';

    const startStopButton = this.createButton('Start/Stop', () => this.toggle(timeDisplay), 'bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition-all');
    const deleteButton = this.createButton('Delete', () => this.remove(), 'bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition-all');

    controls.appendChild(startStopButton);
    controls.appendChild(deleteButton);

    if (this.type === 'countdown') {
      const input = document.createElement('input');
      input.type = 'number';
      input.placeholder = 'Set seconds';
      input.className = 'border rounded px-2 py-1';
      input.addEventListener('change', (e) => {
        this.time = parseInt(e.target.value, 10) || 0;
        timeDisplay.textContent = this.formatTime(this.time);
      });
      timerElement.appendChild(input);
    }

    timerElement.appendChild(title);
    timerElement.appendChild(timeDisplay);
    timerElement.appendChild(controls);

    this.element = timerElement;
    return timerElement;
  }

  // Toggle the timer state
  toggle(timeDisplay) {
    if (this.isRunning) {
      clearInterval(this.intervalId);
      this.isRunning = false;
      console.log(`${this.type} timer stopped.`);
    } else {
      this.isRunning = true;
      console.log(`${this.type} timer started.`);
      this.intervalId = setInterval(() => {
        if (this.type === 'stopwatch') {
          this.time++;
        } else if (this.type === 'countdown') {
          if (this.time > 0) {
            this.time--;
          } else {
            clearInterval(this.intervalId);
            this.isRunning = false;
            alert('Countdown finished!');
          }
        }
        timeDisplay.textContent = this.formatTime(this.time);
      }, 1000);
    }
  }

  // Remove the timer
  remove() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.element.remove();
    console.log(`${this.type} timer removed.`);
  }

  // Format time in HH:MM:SS
  formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Create a button element
  createButton(label, onClick, className) {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }
}