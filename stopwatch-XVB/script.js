// Timer base class (not abstract, for JS compatibility)
function Timer() {}
Timer.prototype.start = function() {};
Timer.prototype.pause = function() {};
Timer.prototype.reset = function() {};
Timer.prototype.render = function() { return document.createElement('div'); };

function Stopwatch() {
  Timer.call(this);
  this.intervalId = null;
  this.startTime = 0;
  this.elapsed = 0;
  this.running = false;
  this.displayEl = null;
  this.startBtn = null;
  this.clearBtn = null;
}
Stopwatch.prototype = Object.create(Timer.prototype);
Stopwatch.prototype.constructor = Stopwatch;

Stopwatch.prototype.render = function() {
  var el = document.createElement('div');
  el.className = 'timer';
  el.innerHTML =
    '<div class="timer-display">00:00:00 <span style="font-size:2rem;vertical-align:super;">000</span></div>' +
    '<div class="timer-controls">' +
    '  <button class="start">Start</button>' +
    '  <button class="clear">Clear</button>' +
    '  <button class="close">✕</button>' +
    '</div>';
  this.displayEl = el.querySelector('.timer-display');
  this.startBtn = el.querySelector('.start');
  this.clearBtn = el.querySelector('.clear');
  this.closeBtn = el.querySelector('.close');
  var self = this;
  this.startBtn && this.startBtn.addEventListener('click', function() {
    if (!self.running) {
      self.start();
    } else {
      self.pause();
    }
  });
  this.clearBtn && this.clearBtn.addEventListener('click', function() { self.reset(); });
  this.closeBtn && this.closeBtn.addEventListener('click', function() {
    if (self.intervalId) clearInterval(self.intervalId);
    el.remove();
    console.log('Stopwatch closed');
  });
  return el;
};

Stopwatch.prototype.updateDisplay = function() {
  if (!this.displayEl) return;
  var total = this.elapsed + (this.running ? Date.now() - this.startTime : 0);
  var ms = total % 1000;
  var s = Math.floor(total / 1000) % 60;
  var m = Math.floor(total / 60000) % 60;
  var h = Math.floor(total / 3600000);
  this.displayEl.innerHTML =
    (h < 10 ? '0' : '') + h + ':' +
    (m < 10 ? '0' : '') + m + ':' +
    (s < 10 ? '0' : '') + s + ' ' +
    '<span style="font-size:2rem;vertical-align:super;">' + (ms < 100 ? (ms < 10 ? '00' : '0') : '') + ms + '</span>';
};

Stopwatch.prototype.start = function() {
  try {
    if (this.running) return;
    this.running = true;
    this.startTime = Date.now();
    var self = this;
    this.intervalId = window.setInterval(function() { self.updateDisplay(); }, 16);
    this.startBtn.textContent = 'Pause';
    console.log('Stopwatch started');
  } catch (e) {
    console.error('Error starting stopwatch:', e);
  }
};

Stopwatch.prototype.pause = function() {
  try {
    if (!this.running) return;
    this.running = false;
    this.elapsed += Date.now() - this.startTime;
    if (this.intervalId) clearInterval(this.intervalId);
    this.startBtn.textContent = 'Start';
    this.updateDisplay();
    console.log('Stopwatch paused');
  } catch (e) {
    console.error('Error pausing stopwatch:', e);
  }
};

Stopwatch.prototype.reset = function() {
  try {
    this.running = false;
    this.elapsed = 0;
    if (this.intervalId) clearInterval(this.intervalId);
    this.updateDisplay();
    this.startBtn.textContent = 'Start';
    console.log('Stopwatch reset');
  } catch (e) {
    console.error('Error resetting stopwatch:', e);
  }
};

function CountdownTimer() {
  Timer.call(this);
  this.intervalId = null;
  this.remaining = 0;
  this.running = false;
  this.displayEl = null;
  this.startBtn = null;
  this.clearBtn = null;
  this.inputH = null;
  this.inputM = null;
  this.inputS = null;
  this.inputsDiv = null;
}
CountdownTimer.prototype = Object.create(Timer.prototype);
CountdownTimer.prototype.constructor = CountdownTimer;
CountdownTimer.prototype.render = function() {
  var el = document.createElement('div');
  el.className = 'timer';
  // Inputs for hours, minutes, seconds
  this.inputsDiv = document.createElement('div');
  this.inputsDiv.style.display = 'flex';
  this.inputsDiv.style.gap = '8px';
  this.inputsDiv.style.justifyContent = 'center';
  this.inputsDiv.style.marginBottom = '8px';
  this.inputH = document.createElement('input');
  this.inputH.type = 'number';
  this.inputH.min = 0;
  this.inputH.max = 99;
  this.inputH.value = 0;
  this.inputH.style.width = '3em';
  this.inputM = document.createElement('input');
  this.inputM.type = 'number';
  this.inputM.min = 0;
  this.inputM.max = 59;
  this.inputM.value = 0;
  this.inputM.style.width = '3em';
  this.inputS = document.createElement('input');
  this.inputS.type = 'number';
  this.inputS.min = 0;
  this.inputS.max = 59;
  this.inputS.value = 0;
  this.inputS.style.width = '3em';
  this.inputsDiv.appendChild(this.inputH);
  this.inputsDiv.appendChild(document.createTextNode(':'));
  this.inputsDiv.appendChild(this.inputM);
  this.inputsDiv.appendChild(document.createTextNode(':'));
  this.inputsDiv.appendChild(this.inputS);

  el.innerHTML =
    '<div class="timer-display">00:00:00 <span style="font-size:2rem;vertical-align:super;">000</span></div>' +
    '<div class="timer-controls">' +
    '  <button class="start">Start</button>' +
    '  <button class="clear">Clear</button>' +
    '  <button class="close">✕</button>' +
    '</div>';
  el.insertBefore(this.inputsDiv, el.firstChild);
  this.displayEl = el.querySelector('.timer-display');
  this.startBtn = el.querySelector('.start');
  this.clearBtn = el.querySelector('.clear');
  this.closeBtn = el.querySelector('.close');
  var self = this;
  this.startBtn && this.startBtn.addEventListener('click', function() {
    if (!self.running) {
      self.start();
    } else {
      self.pause();
    }
  });
  this.clearBtn && this.clearBtn.addEventListener('click', function() { self.reset(); });
  this.closeBtn && this.closeBtn.addEventListener('click', function() {
    if (self.intervalId) clearInterval(self.intervalId);
    el.remove();
    console.log('Countdown timer closed');
  });
  return el;
};
CountdownTimer.prototype.updateDisplay = function() {
  if (!this.displayEl) return;
  var total = this.remaining;
  var ms = total % 1000;
  var s = Math.floor(total / 1000) % 60;
  var m = Math.floor(total / 60000) % 60;
  var h = Math.floor(total / 3600000);
  this.displayEl.innerHTML =
    (h < 10 ? '0' : '') + h + ':' +
    (m < 10 ? '0' : '') + m + ':' +
    (s < 10 ? '0' : '') + s + ' ' +
    '<span style="font-size:2rem;vertical-align:super;">' + (ms < 100 ? (ms < 10 ? '00' : '0') : '') + ms + '</span>';
};
CountdownTimer.prototype.start = function() {
  try {
    if (this.running) {
      return;
    }
    // Get values from inputs only if not started yet
    if (!this.remaining || this.remaining <= 0) {
      var h = parseInt(this.inputH.value, 10) || 0;
      var m = parseInt(this.inputM.value, 10) || 0;
      var s = parseInt(this.inputS.value, 10) || 0;
      this.remaining = (h * 3600 + m * 60 + s) * 1000;
      if (this.remaining <= 0) {
        alert('Please set a valid countdown time.');
        return;
      }
    }
    this.disableInputs(true);
    this.running = true;
    var self = this;
    var lastTick = Date.now();
    this.intervalId = window.setInterval(function() {
      var now = Date.now();
      self.remaining -= (now - lastTick);
      lastTick = now;
      if (self.remaining <= 0) {
        self.remaining = 0;
        self.updateDisplay();
        self.pause();
        console.log('Countdown finished');
        self.playBeep();
        setTimeout(function() {
          alert('Countdown finished!');
        }, 400);
        return;
      }
      self.updateDisplay();
    }, 50);
    this.startBtn.textContent = 'Pause';
    this.updateDisplay();
    console.log('Countdown started');
  } catch (e) {
    console.error('Error starting countdown:', e);
  }
};
CountdownTimer.prototype.pause = function() {
  try {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.startBtn.textContent = 'Start';
    this.updateDisplay();
    console.log('Countdown paused');
  } catch (e) {
    console.error('Error pausing countdown:', e);
  }
};
CountdownTimer.prototype.reset = function() {
  try {
    this.running = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.remaining = 0;
    this.enableInputs(true);
    this.inputH.value = 0;
    this.inputM.value = 0;
    this.inputS.value = 0;
    this.updateDisplay();
    this.startBtn.textContent = 'Start';
    console.log('Countdown reset');
  } catch (e) {
    console.error('Error resetting countdown:', e);
  }
};
CountdownTimer.prototype.disableInputs = function(disable) {
  this.inputH.disabled = disable;
  this.inputM.disabled = disable;
  this.inputS.disabled = disable;
};
CountdownTimer.prototype.enableInputs = function(enable) {
  this.inputH.disabled = !enable;
  this.inputM.disabled = !enable;
  this.inputS.disabled = !enable;
};

// Add beep sound using Web Audio API
CountdownTimer.prototype.playBeep = function() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.2;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(function() {
      o.stop();
      ctx.close();
    }, 350);
  } catch (e) {
    console.error('Error playing beep:', e);
  }
};

var timersContainer = document.getElementById('timers-container');
var addStopwatchBtn = document.getElementById('add-stopwatch');
var addCountdownBtn = document.getElementById('add-countdown');

addStopwatchBtn.addEventListener('click', function() {
  try {
    var stopwatch = new Stopwatch();
    timersContainer.appendChild(stopwatch.render());
    console.log('Stopwatch instance added');
  } catch (e) {
    console.error('Failed to add stopwatch:', e);
  }
});

addCountdownBtn.addEventListener('click', function() {
  try {
    var countdown = new CountdownTimer();
    timersContainer.appendChild(countdown.render());
    console.log('Countdown timer instance added');
  } catch (e) {
    console.error('Failed to add countdown timer:', e);
  }
});

// Add a default stopwatch and countdown timer on page load
window.addEventListener('DOMContentLoaded', function() {
  var stopwatch = new Stopwatch();
  timersContainer.appendChild(stopwatch.render());
  var countdown = new CountdownTimer();
  timersContainer.appendChild(countdown.render());
});
