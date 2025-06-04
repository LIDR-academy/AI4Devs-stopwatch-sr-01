// ===========================
//  js/utils.js
//  Contiene la clase Utils con funciones auxiliares
// ===========================

// Capturamos ya el contenedor de toasts del DOM
const toastContainer = document.getElementById('toast-container');

class Utils {
  /**
   * Genera un número formateado en 2 dígitos (p.ej. 5 → "05").
   */
  static pad2(n) {
    return n.toString().padStart(2, '0');
  }

  /**
   * Genera un número formateado en 3 dígitos (para milisegundos).
   */
  static pad3(n) {
    return n.toString().padStart(3, '0');
  }

  /**
   * Valida si un nombre de temporizador ya existe en timersMap (global).
   */
  static isNameTaken(name) {
    for (let timer of timersMap.values()) {
      if (timer.name.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Muestra un Toast de Bootstrap con mensaje y tipo de fondo.
   *
   * @param {string} message  Mensaje a mostrar
   * @param {string} bgClass  Clase de fondo (p.ej. 'bg-success', 'bg-warning', 'bg-danger')
   */
  static showToast(message, bgClass = 'bg-primary') {
    const toastId = `toast-${Date.now()}`;
    const toastEl = document.createElement('div');
    toastEl.classList.add('toast', 'fade', bgClass, 'text-white');
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.id = toastId;
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
    `;
    toastContainer.appendChild(toastEl);

    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }

  /**
   * Reproduce un beep genérico usando la Web Audio API.
   *
   * @param {boolean} muted  Si está en true, no hace nada.
   */
  static playBeep(muted = false) {
    if (muted) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000 Hz
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // volumen bajo

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2); // dura 200 ms
    } catch (err) {
      console.error('[Utils.playBeep] Error al reproducir beep:', err);
    }
  }
}
