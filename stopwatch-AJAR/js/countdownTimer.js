// ===========================
//  js/countdownTimer.js
//  Contiene la clase CountdownTimer (implementación de cuenta regresiva)
//  Hereda de TimerBase
// ===========================

class CountdownTimer extends TimerBase {
  /**
   * @param {*} options
   *   - id, name, type
   *   - initH, initM, initS: valores iniciales (horas, minutos, segundos)
   */
  constructor(options) {
    super(options);
    this.initialHour = options.initH;
    this.initialMinute = options.initM;
    this.initialSecond = options.initS;
    this.totalInitialMs =
      this.initialHour * 3600000 +
      this.initialMinute * 60000 +
      this.initialSecond * 1000;
    this.remainingMs = this.totalInitialMs;
    this._updateDisplay(this.remainingMs);
  }

  start() {
    try {
      if (this._intervalHandle) {
        this._clearInterval();
      }
      this.remainingMs = this.totalInitialMs;
      this._applyState('running');
      this._lastTick = Date.now();
      this._updateDisplay(this.remainingMs);
      // Usamos window.MILLISECONDS_INTERVAL
      this._intervalHandle = setInterval(() => this._tick(), window.MILLISECONDS_INTERVAL);
      this.btnStart.textContent = 'Pausar';
      console.log(
        `[Timer ${this.id}] Cuenta regresiva iniciada con ` +
        `${Utils.pad2(this.initialHour)}:${Utils.pad2(this.initialMinute)}:` +
        `${Utils.pad2(this.initialSecond)}.`
      );
    } catch (err) {
      console.error(`[CountdownTimer ${this.id}] Error en start():`, err);
    }
  }

  pause() {
    if (this.state !== 'running') {
      console.warn(`[CountdownTimer ${this.id}] No se puede pausar (estado: ${this.state}).`);
      return;
    }
    this._clearInterval();
    this._applyState('paused');
    this.btnStart.textContent = 'Continuar';
    console.log(`[Timer ${this.id}] Cuenta pausada en ${this._formatTime(this.remainingMs)}.`);
  }

  resume() {
    if (this.state !== 'paused') {
      console.warn(`[CountdownTimer ${this.id}] No se puede reanudar (estado: ${this.state}).`);
      return;
    }
    this._applyState('running');
    this._lastTick = Date.now();
    this._intervalHandle = setInterval(() => this._tick(), window.MILLISECONDS_INTERVAL);
    this.btnStart.textContent = 'Pausar';
    console.log(`[Timer ${this.id}] Cuenta regresiva reanudada.`);
  }

  clear() {
    this._clearInterval();
    this.remainingMs = this.totalInitialMs;
    this._updateDisplay(this.remainingMs);
    this._applyState('stopped');
    this.btnStart.textContent = 'Iniciar';
    console.log(
      `[Timer ${this.id}] Cuenta regresiva reiniciada a ` +
      `${Utils.pad2(this.initialHour)}:${Utils.pad2(this.initialMinute)}:` +
      `${Utils.pad2(this.initialSecond)}.`
    );
  }

  _tick() {
    const now = Date.now();
    const delta = now - this._lastTick;
    this._lastTick = now;
    this.remainingMs -= delta;

    if (this.remainingMs <= 0) {
      this._clearInterval();
      this.remainingMs = 0;
      if (this.isVisible) {
        this._updateDisplay(this.remainingMs);
      }
      this._applyState('finished');
      this.btnStart.textContent = 'Iniciar';
      console.log(`[Timer ${this.id}] ¡Cuenta regresiva finalizada!`);
      Utils.playBeep(this.muted);
      Utils.showToast(`🕒 "${this.name}" terminó.`, 'bg-success');
    } else {
      if (this.isVisible) {
        this._updateDisplay(this.remainingMs);
      }
    }
  }

  _updateDisplay(msRestantes) {
    const totalSeconds = Math.floor(msRestantes / 1000);
    const ms = msRestantes % 1000;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    this.displayElement.textContent = `${Utils.pad2(h)}:${Utils.pad2(m)}:${Utils.pad2(s)}`;
    this.msElement.textContent = Utils.pad3(ms);
  }

  _formatTime(msRestantes) {
    const totalSeconds = Math.floor(msRestantes / 1000);
    const ms = msRestantes % 1000;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${Utils.pad2(h)}:${Utils.pad2(m)}:${Utils.pad2(s)}.${Utils.pad3(ms)}`;
  }

  _applyState(newState) {
    this.state = newState; // 'running' | 'paused' | 'stopped' | 'finished'
    this._updateCardStyle();
  }
}
