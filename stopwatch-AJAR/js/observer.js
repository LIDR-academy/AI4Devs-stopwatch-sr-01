// ===========================
//  js/observer.js
//  Define el IntersectionObserver global para observar cada tarjeta (.timer-card)
// ===========================

// Opciones para observar respecto al viewport
const ioOptions = {
  root: null,        // viewport
  rootMargin: '0px',
  threshold: 0       // se dispara cuando al menos 1px es visible/invisible
};

// El callback se llama cada vez que una tarjeta entra o sale del viewport
window.timerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const cardEl = entry.target;
    const timerId = parseInt(cardEl.getAttribute('data-timer-id'), 10);
    const timerInstance = window.timersMap.get(timerId);
    if (!timerInstance) return;
    // Si entry.isIntersecting es true, la tarjeta está visible
    timerInstance.isVisible = entry.isIntersecting;
  });
}, ioOptions);
