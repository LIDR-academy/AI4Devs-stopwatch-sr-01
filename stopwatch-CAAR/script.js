const forwardList = document.getElementById('forward-list');
const countdownList = document.getElementById('countdown-list');
const startForward = document.getElementById('start-forward');
const startCountdown = document.getElementById('start-countdown');
const hoursSel = document.getElementById('hours');
const minutesSel = document.getElementById('minutes');
const secondsSel = document.getElementById('seconds');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementById('close-modal');
const alertSound = document.getElementById('alert-sound');

let countdownsFinished = [];

for (let i = 0; i < 60; i++) {
  let padded = i.toString().padStart(2, '0');
  if (i < 24) hoursSel.innerHTML += `<option value="${i}">${padded}</option>`;
  minutesSel.innerHTML += `<option value="${i}">${padded}</option>`;
  secondsSel.innerHTML += `<option value="${i}">${padded}</option>`;
}

class Timer {
  constructor(type, list) {
    this.type = type;
    this.list = list;
    this.index = list.children.length + 1;
    this.createItem();
  }

  createItem() {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const pauseBtn = document.createElement('button');
    const playBtn = document.createElement('button');
    const delBtn = document.createElement('button');

    span.classList.add('timer-value');
    span.textContent = '00:00:00.00';
    pauseBtn.innerHTML = '⏸️';
    playBtn.innerHTML = '▶️';
    delBtn.textContent = '❌';

    li.append(`#${this.index} `, span, pauseBtn, playBtn, delBtn);
    this.list.appendChild(li);

    let start = performance.now();
    let offset = 0;
    let countdown = this.type === 'countdown';
    let duration = 0;

    if (countdown) {
      const h = parseInt(hoursSel.value);
      const m = parseInt(minutesSel.value);
      const s = parseInt(secondsSel.value);
      duration = (h * 3600 + m * 60 + s) * 1000;
      offset = duration;
    }

    const formatTime = (ms) => {
      let cs = Math.floor((ms % 1000) / 10);
      let sec = Math.floor(ms / 1000) % 60;
      let min = Math.floor(ms / 60000) % 60;
      let hr = Math.floor(ms / 3600000);
      return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    };

    const tick = (now) => {
      if (!this.running) return;
      let elapsed = now - start;
      let value = countdown ? offset - elapsed : offset + elapsed;
      span.textContent = formatTime(Math.max(0, value));
      if (countdown && value <= 10000) {
        span.classList.add('blink', 'timer-value');
      }
      if (countdown && value <= 0) {
        this.running = false;
        this.showAlert();
        return;
      }

      if (countdown && value <= 10000) {
        li.classList.add('blink');
      }

      this.raf = requestAnimationFrame(tick);
    };

    this.running = true;
    this.raf = requestAnimationFrame(tick);

    pauseBtn.onclick = () => {
      if (this.running) {
        this.running = false;
        cancelAnimationFrame(this.raf);
        offset = countdown ? offset - (performance.now() - start) : offset + (performance.now() - start);
      }
    };

    playBtn.onclick = () => {
      if (!this.running) {
        start = performance.now();
        this.running = true;
        this.raf = requestAnimationFrame(tick);
      }
    };

    delBtn.onclick = () => {
      cancelAnimationFrame(this.raf);
      li.remove();
    };
  }

  showAlert() {
    countdownsFinished.push(`#${this.index}`);
    modal.hidden = false;
    alertSound.play();
    modalMessage.textContent = `Finalizaron: ${countdownsFinished.join(', ')}`;
  }
}

startForward.onclick = () => new Timer('forward', forwardList);
startCountdown.onclick = () => new Timer('countdown', countdownList);

closeModal.onclick = () => {
  modal.hidden = true;
  alertSound.pause();
  alertSound.currentTime = 0;
  countdownsFinished = [];
};
