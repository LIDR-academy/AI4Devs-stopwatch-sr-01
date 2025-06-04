// ===========================
//  js/timerFactory.js
//  Contiene la clase TimerFactory (fábrica de temporizadores)
// ===========================

class TimerFactory {
  /**
   * Crea una instancia de cronómetro o cuenta regresiva.
   *
   * @param {object} params
   *   - name: nombre único
   *   - type: 'stopwatch' | 'countdown'
   *   - initH, initM, initS (solo para cuenta regresiva)
   * @returns instancia de TimerBase
   */
  static createTimer(params) {
    const baseParams = {
      id: nextTimerId++,
      name: params.name,
      type: params.type,
    };
    if (params.type === 'stopwatch') {
      return new StopwatchTimer(baseParams);
    } else {
      return new CountdownTimer({
        ...baseParams,
        initH: params.initH,
        initM: params.initM,
        initS: params.initS,
      });
    }
  }
}
