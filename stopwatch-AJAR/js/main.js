// ===========================
//  js/main.js
//  Inicialización general, controladores de modales y eventos
// ===========================

'use strict';

// 1) Definir la constante de intervalo en el ámbito global
window.MILLISECONDS_INTERVAL = 50;

// 2) Crear o referenciar el Map global donde se almacenan las instancias
window.timersMap = new Map();

// 3) Declarar globales para el modal de confirmación de eliminación
window.pendingDeleteTimer = null;
window.confirmDeleteNameSpan = document.getElementById('confirm-delete-name');
window.bsModalConfirmDelete = new bootstrap.Modal(document.getElementById('modalConfirmDelete'));

// Lleva un conteo de cuántos timers (para asignar IDs únicos)
  window.nextTimerId = 1;   // Nota: lo hacemos global para que TimerFactory lo use

// -----------------------------------------------------
//  Resto de main.js (sin cambios más allá de lo necesitado)
// -----------------------------------------------------
(() => {
  const MAX_TIMERS = 20;

  document.addEventListener('DOMContentLoaded', () => {
    try {
      _initNewTimerModal();
      _initDeleteModal();
    } catch (err) {
      console.error('[Main] Error al inicializar la aplicación:', err);
    }
  });

  /**
   * Inicializa el modal de Confirmación de Eliminación.
   */
  function _initDeleteModal() {
    // Aquí usamos window.btnConfirmDelete, definido globalmente en el HTML
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    btnConfirmDelete.addEventListener('click', () => {
      if (window.pendingDeleteTimer) {
        window.pendingDeleteTimer._performDelete();
        window.pendingDeleteTimer = null;
      }
      window.bsModalConfirmDelete.hide();
    });
  }

  /**
   * Inicializa la lógica del modal de "Nuevo Temporizador".
   * - Mostrar/ocultar campos de cuenta regresiva.
   * - Validaciones de nombre único.
   * - Crear nueva instancia cuando se pulsa "Crear Temporizador".
   * - Soporte para scroll en inputs numéricos.
   */
  function _initNewTimerModal() {
    const modalEl = document.getElementById('modalNewTimer');
    const form = document.getElementById('form-new-timer');
    const inputName = document.getElementById('timer-name');
    const radioStopwatch = document.getElementById('type-stopwatch');
    const radioCountdown = document.getElementById('type-countdown');
    const countdownFields = document.getElementById('countdown-fields');
    const inputHours = document.getElementById('input-hours');
    const inputMinutes = document.getElementById('input-minutes');
    const inputSeconds = document.getElementById('input-seconds');
    const btnCreate = document.getElementById('btn-create-timer');
    const bsModal = new bootstrap.Modal(modalEl);

    // 1) Mostrar u ocultar campos de cuenta regresiva
    radioStopwatch.addEventListener('change', () => {
      if (radioStopwatch.checked) countdownFields.classList.add('d-none');
    });
    radioCountdown.addEventListener('change', () => {
      if (radioCountdown.checked) countdownFields.classList.remove('d-none');
    });

    // 2) Validación y scroll en inputs numéricos
    const numericInputs = [inputHours, inputMinutes, inputSeconds];
    numericInputs.forEach((input) => {
      input.addEventListener('input', (ev) => {
        const cleaned = ev.target.value.replace(/\D+/g, '');
        ev.target.value = cleaned === '' ? '0' : cleaned;
        let val = parseInt(ev.target.value, 10) || 0;
        if (input === inputHours && val > 99) val = 99;
        if ((input === inputMinutes || input === inputSeconds) && val > 59) val = 59;
        ev.target.value = val;
      });
      input.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const direction = ev.deltaY < 0 ? +1 : -1;
        let current = parseInt(input.value, 10) || 0;
        const min = parseInt(input.min, 10) || 0;
        const max = parseInt(input.max, 10) || 0;
        let nuevo = current + direction;
        if (nuevo < min) nuevo = min;
        if (nuevo > max) nuevo = max;
        input.value = nuevo;
      });
    });

    // 3) Botón "Crear Temporizador"
    btnCreate.addEventListener('click', () => {
      try {
        if (window.timersMap.size >= MAX_TIMERS) {
          Utils.showToast(`⚠️ Has alcanzado el límite de ${MAX_TIMERS} temporizadores.`, 'bg-warning');
          return;
        }

        const nameValue = inputName.value.trim();
        if (!nameValue) {
          inputName.classList.add('is-invalid');
          return;
        }
        if (Utils.isNameTaken(nameValue)) {
          inputName.classList.add('is-invalid');
          return;
        }
        inputName.classList.remove('is-invalid');

        const typeValue = radioStopwatch.checked ? 'stopwatch' : 'countdown';
        const params = { name: nameValue, type: typeValue };

        if (typeValue === 'countdown') {
          const h = parseInt(inputHours.value, 10) || 0;
          const m = parseInt(inputMinutes.value, 10) || 0;
          const s = parseInt(inputSeconds.value, 10) || 0;
          if (h === 0 && m === 0 && s === 0) {
            Utils.showToast('⏳ Debes especificar al menos 1 segundo para la cuenta regresiva.', 'bg-danger');
            return;
          }
          params.initH = h;
          params.initM = m;
          params.initS = s;
        }

        const timer = TimerFactory.createTimer(params);
        window.timersMap.set(timer.id, timer);

        form.reset();
        countdownFields.classList.add('d-none');
        bsModal.hide();

        console.log(`[Main] Temporizador creado: ID=${timer.id}, Nombre="${timer.name}", Tipo="${timer.type}"`);
      } catch (err) {
        console.error('[Main] Error al pulsar "Crear Temporizador":', err);
        Utils.showToast(`❌ Ocurrió un error al crear el temporizador.`, 'bg-danger');
      }
    });

    // 4) Al mostrar el modal, enfocamos en el campo nombre
    modalEl.addEventListener('shown.bs.modal', () => {
      inputName.focus();
    });

    // 5) Al ocultar el modal, limpiamos validaciones y campos
    modalEl.addEventListener('hidden.bs.modal', () => {
      inputName.classList.remove('is-invalid');
      form.reset();
      countdownFields.classList.add('d-none');
    });
  }
})();
