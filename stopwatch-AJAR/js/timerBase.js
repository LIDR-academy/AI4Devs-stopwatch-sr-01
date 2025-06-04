// ===========================
//  js/timerBase.js
//  Contiene la clase TimerBase (esqueleto común para todos los timers)
// ===========================

// Capturamos ya el contenedor donde se insertan las tarjetas
const timersContainer = document.getElementById('timers-container');

class TimerBase {
  /**
   * Constructor Base para Cronómetro y Cuenta Regresiva.
   *
   * @param {object} options
   *   - id: número único de temporizador
   *   - name: string (nombre asignado por el usuario, único)
   *   - type: 'stopwatch' o 'countdown'
   */
  constructor({ id, name, type }) {
    this.id = id;
    this.name = name;
    this.type = type; // 'stopwatch' | 'countdown'
    this.state = 'stopped'; // 'stopped' | 'running' | 'paused' | 'finished'
    this.muted = false;     // Si el sonido está silenciado

    // Elementos del DOM (se inicializarán en _createCard)
    this.cardElement    = null;
    this.displayElement = null;
    this.msElement      = null;
    this.btnStart       = null;
    this.btnClear       = null;
    this.btnDelete      = null;
    this.btnMute        = null;

    // Manejo interno de intervalos y tiempos
    this._intervalHandle = null;
    this._lastTick       = null;

    // Valores iniciales para clear()
    this.initialHour   = 0;
    this.initialMinute = 0;
    this.initialSecond = 0;
    this.remainingMs   = 0; // Solo relevante en cuenta regresiva

    // Flag para controlar si la tarjeta está en el viewport
    this.isVisible = true;

    // Creamos la tarjeta en el DOM
    this._createCard();
  }

  /**
   * Crea la tarjeta (div.contenedor) en el DOM y enlaza eventos.
   */
  _createCard() {
    try {
      // Creamos la columna responsiva de Bootstrap
      const col = document.createElement('div');
      col.classList.add('col-12', 'col-md-6', 'col-lg-4');

      // Creamos la “card” principal
      const card = document.createElement('div');
      card.classList.add('timer-card', 'stopped');
      card.id = `timer-card-${this.id}`;
      card.setAttribute('data-timer-id', this.id);

      // === Botón “Eliminar” (ícono papelera) ===
      const btnDelete = document.createElement('button');
      btnDelete.classList.add('btn-delete');
      btnDelete.innerHTML = `<i class="bi bi-trash"></i>`;
      btnDelete.title = 'Eliminar Temporizador';
      card.appendChild(btnDelete);
      this.btnDelete = btnDelete;

      // === Botón “Silenciar / Activar sonido” ===
      const btnMute = document.createElement('button');
      btnMute.classList.add('btn-mute');
      btnMute.innerHTML = `<i class="bi bi-volume-up"></i>`;
      btnMute.title = 'Silenciar / Activar sonido';
      card.appendChild(btnMute);
      this.btnMute = btnMute;

      // === Título: nombre del temporizador ===
      const title = document.createElement('h5');
      title.textContent = this.name;
      title.classList.add('text-center');
      card.appendChild(title);

      // === Display de HH:MM:SS ===
      const displayDiv = document.createElement('div');
      displayDiv.classList.add('timer-display', 'mt-3');
      displayDiv.textContent = '00:00:00';
      card.appendChild(displayDiv);
      this.displayElement = displayDiv;

      // === Milisegundos: “000” (sobre botones) ===
      const msDiv = document.createElement('div');
      msDiv.classList.add('timer-milliseconds');
      msDiv.textContent = '000';
      card.appendChild(msDiv);
      this.msElement = msDiv;

      // === Botones Iniciar / Reiniciar ===
      const btnGroup = document.createElement('div');
      btnGroup.classList.add('d-flex', 'justify-content-between', 'mt-4', 'gap-2');

      const btnStart = document.createElement('button');
      btnStart.classList.add('btn', 'btn-start');
      btnStart.textContent = 'Iniciar';
      btnGroup.appendChild(btnStart);
      this.btnStart = btnStart;

      const btnClear = document.createElement('button');
      btnClear.classList.add('btn', 'btn-clear');
      btnClear.textContent = 'Reiniciar';
      btnGroup.appendChild(btnClear);
      this.btnClear = btnClear;

      card.appendChild(btnGroup);
      col.appendChild(card);

      // 1) Insertamos la columna en el contenedor global
      timersContainer.appendChild(col);

      // 2) Observamos la tarjeta con IntersectionObserver global
      window.timerObserver.observe(card);

      // 3) Guardamos referencia a la card
      this.cardElement = card;

      // 4) Enlazamos los eventos
      this._bindEvents();
    } catch (err) {
      console.error(`[TimerBase._createCard] Error al crear la card del timer ${this.id}:`, err);
      throw err;
    }
  }

  /**
   * Enlaza los eventos de Iniciar / Pausar / Continuar, Reiniciar, Eliminar y Silenciar.
   */
  _bindEvents() {
    // Iniciar / Pausar / Continuar
    this.btnStart.addEventListener('click', () => {
      try {
        this._handleStartPauseResume();
      } catch (err) {
        console.error(`[Timer ${this.id}] Error en Start/Pause/Continue:`, err);
      }
    });

    // Reiniciar
    this.btnClear.addEventListener('click', () => {
      try {
        this.clear();
      } catch (err) {
        console.error(`[Timer ${this.id}] Error en Reiniciar:`, err);
      }
    });

    // Eliminar (abre modal de confirmación)
    this.btnDelete.addEventListener('click', () => {
      try {
        this._handleDelete();
      } catch (err) {
        console.error(`[Timer ${this.id}] Error en Eliminar:`, err);
      }
    });

    // Silenciar / Activar sonido
    this.btnMute.addEventListener('click', () => {
      try {
        this._toggleMute();
      } catch (err) {
        console.error(`[Timer ${this.id}] Error en Toggle Mute:`, err);
      }
    });
  }

  /**
   * Alterna el estado “mute” (silenciar beep).
   */
  _toggleMute() {
    this.muted = !this.muted;
    const icon = this.btnMute.querySelector('i');
    if (this.muted) {
      icon.classList.remove('bi-volume-up');
      icon.classList.add('bi-volume-mute');
      this.btnMute.classList.add('muted');
    } else {
      icon.classList.remove('bi-volume-mute');
      icon.classList.add('bi-volume-up');
      this.btnMute.classList.remove('muted');
    }
    console.log(`[Timer ${this.id}] Mute: ${this.muted}`);
  }

  /**
   * Manejador unificado de “Iniciar / Pausar / Continuar”.
   */
  _handleStartPauseResume() {
    switch (this.state) {
      case 'stopped':
        this.start();
        break;
      case 'running':
        this.pause();
        break;
      case 'paused':
        this.resume();
        break;
      case 'finished':
        // Si ya terminó, al pulsar “Iniciar” nuevamente, reiniciamos
        this.start();
        break;
      default:
        console.error(`[Timer ${this.id}] Estado desconocido: '${this.state}'`);
    }
  }

  /**
   * Cambia la apariencia de la tarjeta según el estado (stopped, running, paused, finished).
   */
  _updateCardStyle() {
    this.cardElement.classList.remove('stopped', 'running', 'paused', 'finished');
    this.cardElement.classList.add(this.state);
  }

  /**
   * Abre el modal de confirmación para eliminar este temporizador.
   */
  _handleDelete() {
    pendingDeleteTimer = this;
    confirmDeleteNameSpan.textContent = this.name;
    bsModalConfirmDelete.show();
  }

  /**
   * Ejecuta la eliminación definitiva (invocado desde main.js al pulsar “Eliminar” en el modal).
   */
  _performDelete() {
    this._clearInterval();
    window.timersMap.delete(this.id);
    this.cardElement.parentElement.remove(); // elimina la columna completa
    console.log(`[Timer ${this.id}] Temporizador eliminado.`);
  }

  /**
   * Inicia el temporizador (implementado en las subclases).
   */
  start() {
    throw new Error('[TimerBase.start] Debe implementarse en la subclase');
  }

  /**
   * Pausa el temporizador (implementado en las subclases).
   */
  pause() {
    throw new Error('[TimerBase.pause] Debe implementarse en la subclase');
  }

  /**
   * Reanuda el temporizador (implementado en las subclases).
   */
  resume() {
    throw new Error('[TimerBase.resume] Debe implementarse en la subclase');
  }

  /**
   * Reinicia el temporizador a su estado inicial (implementado en las subclases).
   */
  clear() {
    throw new Error('[TimerBase.clear] Debe implementarse en la subclase');
  }

  /**
   * Detiene y limpia el intervalo si existe.
   */
  _clearInterval() {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = null;
    }
  }
}
