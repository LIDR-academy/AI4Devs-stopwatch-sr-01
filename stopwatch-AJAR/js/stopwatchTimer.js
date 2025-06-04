// ===========================
//  js/stopwatchTimer.js
//  Contiene la clase StopwatchTimer (implementación de cronómetro)
//  Hereda de TimerBase
// ===========================

class StopwatchTimer extends TimerBase {
  constructor(options) {
    super(options);
    this.elapsedMs = 0;
    this.initialHour = 0;
    this.initialMinute = 0;
    this.initialSecond = 0;
    this._updateDisplay(0); // Muestra 00:00:00:000
  }

  start() {
    try {
      if (this._intervalHandle) {
        this._clearInterval();
      }
      this.elapsedMs = 0;
      this._applyState('running');
      this._lastTick = Date.now();
      // Usamos window.MILLISECONDS_INTERVAL
      this._intervalHandle = setInterval(() => this._tick(), window.MILLISECONDS_INTERVAL);
      this.btnStart.textContent = 'Pausar';
      console.log(`[Timer ${this.id}] Cronómetro iniciado.`);
    } catch (err) {
      console.error(`[StopwatchTimer ${this.id}] Error en start():`, err);
    }
  }

  pause() {
    if (this.state !== 'running') {
      console.warn(`[StopwatchTimer ${this.id}] No se puede pausar (estado: ${this.state}).`);
      return;
    }
    this._clearInterval();
    this._applyState('paused');
    this.btnStart.textContent = 'Continuar';
    console.log(
      `[Timer ${this.id}] Cronómetro pausado en ${Utils.pad2(this._hours())}:` +
      `${Utils.pad2(this._minutes())}:${Utils.pad2(this._seconds())}.${Utils.pad3(this._milliseconds())}.`
    );
  }

  resume() {
    if (this.state !== 'paused') {
      console.warn(`[StopwatchTimer ${this.id}] No se puede reanudar (estado: ${this.state}).`);
      return;
    }
    this._applyState('running');
    this._lastTick = Date.now();
    this._intervalHandle = setInterval(() => this._tick(), window.MILLISECONDS_INTERVAL);
    this.btnStart.textContent = 'Pausar';
    console.log(`[Timer ${this.id}] Cronómetro reanudado.`);
  }

  clear() {
    this._clearInterval();
    this.elapsedMs = 0;
    this._updateDisplay(0);
    this._applyState('stopped');
    this.btnStart.textContent = 'Iniciar';
    console.log(`[Timer ${this.id}] Cronómetro reiniciado a 00:00:00.`);
  }

  _tick() {
    const now = Date.now();
    const delta = now - this._lastTick;
    this._lastTick = now;
    this.elapsedMs += delta;

    // Solo actualizamos el DOM si la tarjeta está visible
    if (this.isVisible) {
      this._updateDisplay(this.elapsedMs);
    }
  }

  _updateDisplay(msTranscurridos) {
    const totalSeconds = Math.floor(msTranscurridos / 1000);
    const ms = msTranscurridos % 1000;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    this.displayElement.textContent = `${Utils.pad2(h)}:${Utils.pad2(m)}:${Utils.pad2(s)}`;
    this.msElement.textContent = Utils.pad3(ms);
  }

  _hours() {
    return Math.floor(this.elapsedMs / 3600000);
  }
  _minutes() {
    return Math.floor((this.elapsedMs % 3600000) / 60000);
  }
  _seconds() {
    return Math.floor((this.elapsedMs % 60000) / 1000);
  }
  _milliseconds() {
    return this.elapsedMs % 1000;
  }

  _applyState(newState) {
    this.state = newState; // 'running' | 'paused' | 'stopped' | 'finished'
    this._updateCardStyle();
  }
}
