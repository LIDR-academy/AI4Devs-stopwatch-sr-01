// Variables globales
let stopwatchInterval = null;
let countdownInterval = null;
let stopwatchTime = 0; // en milisegundos
let countdownTime = 0; // en milisegundos
let isStopwatchRunning = false;
let isCountdownRunning = false;

// Referencias a elementos del DOM
const screens = {
    home: document.getElementById('home-screen'),
    stopwatch: document.getElementById('stopwatch-screen'),
    countdownSetup: document.getElementById('countdown-setup-screen'),
    countdown: document.getElementById('countdown-screen')
};

const elements = {
    // Botones de selección inicial
    stopwatchBtn: document.getElementById('stopwatch-btn'),
    countdownBtn: document.getElementById('countdown-btn'),
    
    // Botones de regreso
    backFromStopwatch: document.getElementById('back-from-stopwatch'),
    backFromCountdownSetup: document.getElementById('back-from-countdown-setup'),
    backFromCountdown: document.getElementById('back-from-countdown'),
    
    // Elementos del stopwatch
    stopwatchTime: document.getElementById('stopwatch-time'),
    startStopwatch: document.getElementById('start-stopwatch'),
    clearStopwatch: document.getElementById('clear-stopwatch'),
    
    // Elementos del countdown setup
    countdownInput: document.getElementById('countdown-input'),
    setCountdown: document.getElementById('set-countdown'),
    clearCountdownSetup: document.getElementById('clear-countdown-setup'),
    
    // Elementos del countdown activo
    countdownTime: document.getElementById('countdown-time'),
    startCountdown: document.getElementById('start-countdown'),
    clearCountdown: document.getElementById('clear-countdown'),
    
    // Botones numéricos
    numberBtns: document.querySelectorAll('.number-btn')
};

// Funciones utilitarias
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function parseTimeInput(timeString) {
    // Remover caracteres no numéricos excepto :
    const cleanTime = timeString.replace(/[^\d:]/g, '');
    const parts = cleanTime.split(':');
    
    let hours = 0, minutes = 0, seconds = 0;
    
    if (parts.length === 1) {
        seconds = parseInt(parts[0]) || 0;
    } else if (parts.length === 2) {
        minutes = parseInt(parts[0]) || 0;
        seconds = parseInt(parts[1]) || 0;
    } else if (parts.length >= 3) {
        hours = parseInt(parts[0]) || 0;
        minutes = parseInt(parts[1]) || 0;
        seconds = parseInt(parts[2]) || 0;
    }
    
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

function formatInputAsTime(input) {
    // Remover todo excepto números
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return numbers.slice(0, 2) + ':' + numbers.slice(2);
    return numbers.slice(0, 2) + ':' + numbers.slice(2, 4) + ':' + numbers.slice(4, 6);
}

// Funciones de navegación
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Event listeners para navegación
elements.stopwatchBtn.addEventListener('click', () => showScreen('stopwatch'));
elements.countdownBtn.addEventListener('click', () => showScreen('countdownSetup'));

elements.backFromStopwatch.addEventListener('click', () => showScreen('home'));
elements.backFromCountdownSetup.addEventListener('click', () => showScreen('home'));
elements.backFromCountdown.addEventListener('click', () => showScreen('countdownSetup'));

// Funciones del Stopwatch
function startStopwatch() {
    if (!isStopwatchRunning) {
        isStopwatchRunning = true;
        elements.startStopwatch.textContent = 'Pause';
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime += 100;
            elements.stopwatchTime.textContent = formatTime(stopwatchTime);
        }, 100);
    } else {
        isStopwatchRunning = false;
        elements.startStopwatch.textContent = 'Start';
        clearInterval(stopwatchInterval);
    }
}

function clearStopwatch() {
    isStopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    elements.stopwatchTime.textContent = '00:00:00';
    elements.startStopwatch.textContent = 'Start';
}

// Event listeners del Stopwatch
elements.startStopwatch.addEventListener('click', startStopwatch);
elements.clearStopwatch.addEventListener('click', clearStopwatch);

// Funciones del Countdown Setup
function addNumberToInput(number) {
    const currentValue = elements.countdownInput.value.replace(/\D/g, '');
    if (currentValue.length < 6) {
        const newValue = currentValue + number;
        elements.countdownInput.value = formatInputAsTime(newValue);
    }
}

function clearCountdownSetup() {
    elements.countdownInput.value = '';
}

function setCountdown() {
    const inputValue = elements.countdownInput.value;
    if (inputValue.trim() === '') return;
    
    countdownTime = parseTimeInput(inputValue);
    if (countdownTime > 0) {
        elements.countdownTime.textContent = formatTime(countdownTime);
        showScreen('countdown');
    }
}

// Event listeners del Countdown Setup
elements.numberBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        addNumberToInput(btn.dataset.number);
    });
});

elements.clearCountdownSetup.addEventListener('click', clearCountdownSetup);
elements.setCountdown.addEventListener('click', setCountdown);

// Permitir entrada desde el teclado
elements.countdownInput.addEventListener('input', (e) => {
    e.target.value = formatInputAsTime(e.target.value);
});

elements.countdownInput.addEventListener('keydown', (e) => {
    // Permitir teclas de control
    if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
    }
    
    // Solo permitir números
    if (!/^\d$/.test(e.key)) {
        e.preventDefault();
    }
    
    // Ejecutar Set al presionar Enter
    if (e.key === 'Enter') {
        setCountdown();
    }
});

// Funciones del Countdown activo
function startCountdown() {
    if (!isCountdownRunning && countdownTime > 0) {
        isCountdownRunning = true;
        elements.startCountdown.textContent = 'Pause';
        
        countdownInterval = setInterval(() => {
            countdownTime -= 100;
            elements.countdownTime.textContent = formatTime(countdownTime);
            
            if (countdownTime <= 0) {
                countdownTime = 0;
                elements.countdownTime.textContent = '00:00:00';
                clearInterval(countdownInterval);
                isCountdownRunning = false;
                elements.startCountdown.textContent = 'Start';
                alert('¡Tiempo terminado!');
            }
        }, 100);
    } else if (isCountdownRunning) {
        isCountdownRunning = false;
        elements.startCountdown.textContent = 'Start';
        clearInterval(countdownInterval);
    }
}

function clearCountdown() {
    isCountdownRunning = false;
    clearInterval(countdownInterval);
    countdownTime = 0;
    elements.countdownTime.textContent = '00:00:00';
    elements.startCountdown.textContent = 'Start';
}

// Event listeners del Countdown activo
elements.startCountdown.addEventListener('click', startCountdown);
elements.clearCountdown.addEventListener('click', clearCountdown);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    showScreen('home');
    elements.stopwatchTime.textContent = '00:00:00';
    elements.countdownTime.textContent = '00:00:00';
});
