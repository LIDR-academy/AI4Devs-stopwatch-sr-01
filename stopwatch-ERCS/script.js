// Principios SOLID: separación de responsabilidades, código modular, manejo de excepciones.
// Alerta de beep sencilla
function beep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        osc.onended = () => ctx.close();
    } catch (e) {
        // Silenciar si no hay soporte
    }
}

// Utils
class AlertManager {
    static show(message, type = "success", timeout = 3500) {
        try {
            const alertsArea = document.getElementById('alerts-area');
            const id = 'alert-' + Math.random().toString(36).substr(2,9);
            const div = document.createElement('div');
            div.innerHTML = `
                <div id="${id}" class="alert alert-${type} alert-dismissible fade show shadow-sm mb-2" role="alert">
                    ${message}
                </div>`;
            alertsArea.appendChild(div.firstElementChild);
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.remove();
            }, timeout);
        } catch (e) { /* Silenciar */ }
    }
}

// Gestión de UI principal
const UI = {
    selectionScreen: document.getElementById('selection-screen'),
    timersScreen: document.getElementById('timers-screen'),
    timersTitle: document.getElementById('timers-title'),
    btnBack: document.getElementById('btn-back'),
    btnAddTimer: document.getElementById('btn-add-timer'),
    btnClearAll: document.getElementById('btn-clear-all'),
    timersList: document.getElementById('timers-list'),
    timerMode: null, // "cronometro" | "cuenta"
    timers: [],

    init() {
        document.getElementById('btn-cronometro').onclick = () => UI.showTimersScreen("cronometro");
        document.getElementById('btn-cuenta').onclick = () => UI.showTimersScreen("cuenta");
        this.btnBack.onclick = UI.backToSelection;
        this.btnAddTimer.onclick = UI.addTimerDialog;
        this.btnClearAll.onclick = UI.clearAllTimers;
    },

    showTimersScreen(mode) {
        try {
            UI.timerMode = mode;
            UI.selectionScreen.style.display = "none";
            UI.timersScreen.style.display = "block";
            UI.timersTitle.textContent = (mode === "cronometro") ? "Cronómetros" : "Cuentas regresivas";
            UI.renderTimers();
        } catch (e) { AlertManager.show("Error al cambiar de modo", "danger"); }
    },

    backToSelection() {
        try {
            UI.timersScreen.style.display = "none";
            UI.selectionScreen.style.display = "flex";
        } catch (e) { AlertManager.show("Error al regresar", "danger"); }
    },

    addTimerDialog() {
        try {
            // Modal input personalizado (simple)
            const presetNames = ["Ejercicio", "Descanso", "Estudio", "Cocina", "Trabajo", "Personalizado..."];
            let presetOptions = presetNames.map(n => `<option value="${n}">${n}</option>`).join('');
            let inputFields = '';
            if (UI.timerMode === "cuenta") {
                inputFields = `
                    <div class="mb-2">
                        <label class="form-label">Horas</label>
                        <input type="number" class="form-control" id="add-hours" min="0" max="23" value="0">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Minutos</label>
                        <input type="number" class="form-control" id="add-mins" min="0" max="59" value="0">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Segundos</label>
                        <input type="number" class="form-control" id="add-secs" min="0" max="59" value="0">
                    </div>
                `;
            }
            const html = `
                <div class="modal fade" tabindex="-1" id="addTimerModal">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <form id="add-timer-form">
                        <div class="modal-header">
                          <h5 class="modal-title">Nuevo ${(UI.timerMode === "cronometro") ? "Cronómetro" : "Cuenta regresiva"}</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                          <div class="mb-2">
                            <label class="form-label">Nombre</label>
                            <select class="form-select mb-2" id="add-name-select">${presetOptions}</select>
                            <input type="text" class="form-control" id="add-name-input" style="display:none;" placeholder="Nombre personalizado">
                          </div>
                          ${inputFields}
                        </div>
                        <div class="modal-footer">
                          <button type="submit" class="btn btn-primary">Agregar</button>
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
            `;
            // Insertar modal temporalmente
            document.body.insertAdjacentHTML('beforeend', html);
            const modal = new bootstrap.Modal(document.getElementById('addTimerModal'));
            modal.show();

            const nameSelect = document.getElementById('add-name-select');
            const nameInput = document.getElementById('add-name-input');
            nameSelect.onchange = () => {
                nameInput.style.display = (nameSelect.value === "Personalizado...") ? "block" : "none";
            };

            document.getElementById('add-timer-form').onsubmit = (e) => {
                e.preventDefault();
                let name = nameSelect.value === "Personalizado..." ? nameInput.value.trim() : nameSelect.value;
                if (!name) return AlertManager.show("Debe ingresar un nombre", "warning");
                let duration = 0;
                if (UI.timerMode === "cuenta") {
                    let h = parseInt(document.getElementById('add-hours').value) || 0;
                    let m = parseInt(document.getElementById('add-mins').value) || 0;
                    let s = parseInt(document.getElementById('add-secs').value) || 0;
                    if (h < 0 || m < 0 || s < 0 || m > 59 || s > 59) return AlertManager.show("Valores de tiempo no válidos", "danger");
                    duration = h * 3600 + m * 60 + s;
                    if (duration === 0) return AlertManager.show("Ingrese un tiempo mayor a cero", "warning");
                }
                UI.addTimer(name, duration);
                modal.hide();
                setTimeout(() => document.getElementById('addTimerModal').remove(), 500);
            };
            document.getElementById('addTimerModal').addEventListener('hidden.bs.modal', () => {
                document.getElementById('addTimerModal').remove();
            });
        } catch (e) {
            AlertManager.show("Error al agregar", "danger");
        }
    },

    addTimer(name, duration) {
        try {
            let timer = null;
            if (UI.timerMode === "cronometro") {
                timer = new ChronoTimer(name);
            } else {
                timer = new CountdownTimer(name, duration);
            }
            UI.timers.push(timer);
            UI.renderTimers();
        } catch (e) { AlertManager.show("Error al crear el temporizador", "danger"); }
    },

    renderTimers() {
        try {
            UI.timersList.innerHTML = "";
            UI.timers
                .filter(t => t.type === UI.timerMode)
                .forEach((timer, idx) => {
                    UI.timersList.appendChild(timer.render(idx));
                });
        } catch (e) { AlertManager.show("Error al mostrar temporizadores", "danger"); }
    },

    clearAllTimers() {
        try {
            if (!confirm("¿Eliminar todos los temporizadores?")) return;
            UI.timers = UI.timers.filter(t => t.type !== UI.timerMode);
            UI.renderTimers();
        } catch (e) { AlertManager.show("Error al limpiar", "danger"); }
    },

    removeTimer(idx) {
        try {
            UI.timers.splice(idx, 1);
            UI.renderTimers();
        } catch (e) { AlertManager.show("Error al eliminar", "danger"); }
    }
};

// Abstracción general de temporizador
class BaseTimer {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.interval = null;
        this.state = "stopped"; // "running" | "paused" | "stopped"
    }

    start() { throw "No implementado"; }
    pause() { throw "No implementado"; }
    reset() { throw "No implementado"; }
    stop() { this.state = "stopped"; clearInterval(this.interval); }
    render(idx) { throw "No implementado"; }
}

// Cronómetro (cuenta hacia arriba)
class ChronoTimer extends BaseTimer {
    constructor(name) {
        super(name, "cronometro");
        this.elapsed = 0; // en segundos
        this.lastTick = null;
    }

    start() {
        if (this.state === "running") return;
        this.state = "running";
        this.lastTick = Date.now();
        this.interval = setInterval(() => {
            if (this.state !== "running") return;
            const now = Date.now();
            this.elapsed += Math.floor((now - this.lastTick) / 1000);
            this.lastTick = now;
            UI.renderTimers();
        }, 1000);
    }
    pause() {
        if (this.state !== "running") return;
        this.state = "paused";
        clearInterval(this.interval);
        this.interval = null;
    }
    reset() {
        this.stop();
        this.elapsed = 0;
        UI.renderTimers();
    }
    render(idx) {
        const card = document.createElement('div');
        card.className = "col-12 col-md-6 col-lg-4";
        let h = Math.floor(this.elapsed / 3600);
        let m = Math.floor((this.elapsed % 3600) / 60);
        let s = this.elapsed % 60;
        card.innerHTML = `
            <div class="card shadow">
                <div class="card-body">
                    <h5 class="card-title">${this.name}</h5>
                    <div class="display-6 fw-bold text-primary text-center mb-2">
                        ${pad(h)}:${pad(m)}:${pad(s)}
                    </div>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-success btn-sm" title="Iniciar/Reanudar"><i class="bi bi-play-fill"></i></button>
                        <button class="btn btn-warning btn-sm" title="Pausar"><i class="bi bi-pause-fill"></i></button>
                        <button class="btn btn-danger btn-sm" title="Parar/Reset"><i class="bi bi-stop-fill"></i></button>
                        <button class="btn btn-secondary btn-sm" title="Eliminar"><i class="bi bi-x-lg"></i></button>
                    </div>
                </div>
            </div>
        `;
        const [btnPlay, btnPause, btnReset, btnDelete] = card.querySelectorAll('button');
        btnPlay.onclick = () => { this.start(); };
        btnPause.onclick = () => { this.pause(); };
        btnReset.onclick = () => { this.reset(); };
        btnDelete.onclick = () => { UI.removeTimer(UI.getTimerIdx(this)); };
        return card;
    }
}

// Cuenta regresiva
class CountdownTimer extends BaseTimer {
    constructor(name, duration) {
        super(name, "cuenta");
        this.initial = duration; // segundos
        this.remaining = duration; // segundos
        this.lastTick = null;
        this.finished = false;
    }
    start() {
        if (this.state === "running" || this.finished) return;
        this.state = "running";
        this.lastTick = Date.now();
        this.interval = setInterval(() => {
            if (this.state !== "running") return;
            const now = Date.now();
            let delta = Math.floor((now - this.lastTick) / 1000);
            if (delta > 0) {
                this.remaining -= delta;
                this.lastTick = now;
                if (this.remaining <= 0) {
                    this.remaining = 0;
                    this.stop();
                    this.finished = true;
                    beep();
                    AlertManager.show(`¡"${this.name}" ha finalizado!`, "info");
                }
                UI.renderTimers();
            }
        }, 1000);
    }
    pause() {
        if (this.state !== "running") return;
        this.state = "paused";
        clearInterval(this.interval);
        this.interval = null;
    }
    reset() {
        this.stop();
        this.finished = false;
        this.remaining = this.initial;
        UI.renderTimers();
    }
    render(idx) {
        const card = document.createElement('div');
        card.className = "col-12 col-md-6 col-lg-4";
        let h = Math.floor(this.remaining / 3600);
        let m = Math.floor((this.remaining % 3600) / 60);
        let s = this.remaining % 60;
        const timeColor = this.finished ? 'text-danger' : 'text-success';
        card.innerHTML = `
            <div class="card shadow ${this.finished ? 'border-danger' : ''}">
                <div class="card-body">
                    <h5 class="card-title">${this.name}</h5>
                    <div class="display-6 fw-bold ${timeColor} text-center mb-2">
                        ${pad(h)}:${pad(m)}:${pad(s)}
                    </div>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-success btn-sm" title="Iniciar/Reanudar" ${this.finished ? 'disabled' : ''}><i class="bi bi-play-fill"></i></button>
                        <button class="btn btn-warning btn-sm" title="Pausar" ${this.finished ? 'disabled' : ''}><i class="bi bi-pause-fill"></i></button>
                        <button class="btn btn-danger btn-sm" title="Reset"><i class="bi bi-stop-fill"></i></button>
                        <button class="btn btn-secondary btn-sm" title="Eliminar"><i class="bi bi-x-lg"></i></button>
                    </div>
                </div>
            </div>
        `;
        const [btnPlay, btnPause, btnReset, btnDelete] = card.querySelectorAll('button');
        btnPlay.onclick = () => { this.start(); };
        btnPause.onclick = () => { this.pause(); };
        btnReset.onclick = () => { this.reset(); };
        btnDelete.onclick = () => { UI.removeTimer(UI.getTimerIdx(this)); };
        return card;
    }
}

// Helpers
function pad(n) { return n.toString().padStart(2, "0"); }
UI.getTimerIdx = (obj) => UI.timers.findIndex(t => t === obj);

// Inicializar UI
window.onload = () => UI.init();
