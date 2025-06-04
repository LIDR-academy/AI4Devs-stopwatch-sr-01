// Variables globales
let stopwatchInterval = null;
let countdownInterval = null;
let stopwatchTime = 0; // en milisegundos
let countdownTime = 0; // en milisegundos
let originalCountdownTime = 0; // valor original seteado por el usuario
let isStopwatchRunning = false;
let isCountdownRunning = false;
let currentInput = ''; // Para el input del countdown

// Referencias a elementos del DOM
const screens = {
    home: null, // Se inicializarán en DOMContentLoaded
    stopwatch: null,
    countdownSetup: null,
    countdown: null
};

const elements = {
    // Se inicializarán todos en DOMContentLoaded
};

// Funciones utilitarias
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatMilliseconds(milliseconds) {
    const ms = Math.floor((milliseconds % 1000) / 10); // Convertir a centésimas
    return ms.toString().padStart(2, '0') + '0'; // Agregar un 0 para mostrar 3 dígitos
}

function formatInputAsTime(input) {
    // Remover todo excepto números
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) return '00:00:00';
    if (numbers.length === 1) return `00:00:0${numbers}`; // Solo segundos: 5
    if (numbers.length === 2) return `00:00:${numbers}`; // Solo segundos: 55
    if (numbers.length === 3) {
        // 3 dígitos: minutos y segundos -> 00:M:SS
        const minutes = numbers.slice(0, 1);
        const seconds = numbers.slice(1);
        return `00:0${minutes}:${seconds}`;
    }
    if (numbers.length === 4) {
        // 4 dígitos: minutos y segundos -> 00:MM:SS
        const minutes = numbers.slice(0, 2);
        const seconds = numbers.slice(2);
        return `00:${minutes}:${seconds}`;
    }
    if (numbers.length === 5) {
        // 5 dígitos: horas, minutos y segundos -> 0H:MM:SS
        const hours = numbers.slice(0, 1);
        const minutes = numbers.slice(1, 3);
        const seconds = numbers.slice(3);
        return `0${hours}:${minutes}:${seconds}`;
    }
    if (numbers.length >= 6) {
        // 6 dígitos: horas, minutos y segundos -> HH:MM:SS
        const hours = numbers.slice(0, 2);
        const minutes = numbers.slice(2, 4);
        const seconds = numbers.slice(4, 6);
        return `${hours}:${minutes}:${seconds}`;
    }
}

function parseTimeInput(timeString) {
    // Remover caracteres no numéricos excepto :
    const cleanTime = timeString.replace(/[^\d:]/g, '');
    const parts = cleanTime.split(':');
    
    let hours = 0, minutes = 0, seconds = 0;
    
    if (parts.length >= 3) {
        // Tres números = horas:minutos:segundos
        hours = parseInt(parts[0]) || 0;
        minutes = parseInt(parts[1]) || 0;
        seconds = parseInt(parts[2]) || 0;
    } else if (parts.length === 2) {
        // Dos números = minutos:segundos
        minutes = parseInt(parts[0]) || 0;
        seconds = parseInt(parts[1]) || 0;
    } else if (parts.length === 1) {
        // Solo un número = segundos
        seconds = parseInt(parts[0]) || 0;
    }
    
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// Funciones de navegación
function showScreen(screenName) {
    console.log('showScreen called with:', screenName);
    
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        console.log('Removing active from:', screen.id);
    });
    
    // Mostrar la pantalla solicitada
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Adding active to:', targetScreen.id);
    } else {
        console.error('Screen not found:', screenName + '-screen');
    }
    
    // Ajustar body para diferentes pantallas
    if (screenName === 'home') {
        document.body.style.background = '#e8e8e8';
        document.body.style.display = 'block';
        document.body.style.alignItems = 'unset';
        document.body.style.justifyContent = 'unset';
        document.body.style.height = '100vh';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    } else if (screenName === 'countdown-setup' || screenName === 'stopwatch' || screenName === 'countdown') {
        document.body.style.background = '#f0f0f0';
        document.body.style.display = 'block';
        document.body.style.alignItems = 'unset';
        document.body.style.justifyContent = 'unset';
        document.body.style.height = 'auto';
        document.body.style.minHeight = '100vh';
    } else {
        document.body.style.background = '#f0f0f0';
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
        document.body.style.height = '100vh';
    }
}

// Funciones del Stopwatch
function startStopwatch() {
    if (!isStopwatchRunning) {
        isStopwatchRunning = true;
        elements.startStopwatch.textContent = 'Pause';
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime += 10; // Incrementar cada 10ms para mejor precisión en milisegundos
            elements.stopwatchTime.textContent = formatTime(stopwatchTime);
            if (elements.stopwatchMilliseconds) {
                elements.stopwatchMilliseconds.textContent = formatMilliseconds(stopwatchTime);
            }
        }, 10);
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
    if (elements.stopwatchMilliseconds) {
        elements.stopwatchMilliseconds.textContent = '000';
    }
    elements.startStopwatch.textContent = 'Start';
}

// Funciones del Countdown Setup
function addNumberToInput(number) {
    if (currentInput.length < 6) {
        currentInput += number;
        const formattedTime = formatInputAsTime(currentInput);
        elements.countdownInputDisplay.textContent = formattedTime;
        elements.countdownInput.value = formattedTime;
    }
}

function clearCountdownSetup() {
    currentInput = '';
    elements.countdownInputDisplay.textContent = '00:00:00';
    elements.countdownInput.value = '';
}

function setCountdown() {
    const inputValue = elements.countdownInputDisplay.textContent;
    if (inputValue === '00:00:00') return;
    
    countdownTime = parseTimeInput(inputValue);
    originalCountdownTime = countdownTime; // Guardar valor original
    if (countdownTime > 0) {
        elements.countdownTime.textContent = formatTime(countdownTime);
        if (elements.countdownMilliseconds) {
            elements.countdownMilliseconds.textContent = '000';
        }
        showScreen('countdown');    }
}

// Funciones del Countdown activo
function startCountdown() {
    if (!isCountdownRunning && countdownTime > 0) {
        isCountdownRunning = true;
        elements.startCountdown.textContent = 'Pause';
        
        countdownInterval = setInterval(() => {
            countdownTime -= 10; // Decrementar cada 10ms para mejor precisión
            elements.countdownTime.textContent = formatTime(countdownTime);
            if (elements.countdownMilliseconds) {
                elements.countdownMilliseconds.textContent = formatMilliseconds(countdownTime);
            }
            
            if (countdownTime <= 0) {
                countdownTime = 0;
                elements.countdownTime.textContent = '00:00:00';
                if (elements.countdownMilliseconds) {
                    elements.countdownMilliseconds.textContent = '000';
                }
                clearInterval(countdownInterval);
                isCountdownRunning = false;
                elements.startCountdown.textContent = 'Start';
                alert('¡Tiempo terminado!');
            }
        }, 10);
    } else if (isCountdownRunning) {
        isCountdownRunning = false;
        elements.startCountdown.textContent = 'Start';
        clearInterval(countdownInterval);
    }
}

function clearCountdown() {
    isCountdownRunning = false;
    clearInterval(countdownInterval);
    countdownTime = originalCountdownTime; // Resetear al valor original
    elements.countdownTime.textContent = formatTime(countdownTime);
    if (elements.countdownMilliseconds) {
        elements.countdownMilliseconds.textContent = '000';
    }    elements.startCountdown.textContent = 'Start';
}

// Soporte para teclado en toda la aplicación
document.addEventListener('keydown', (e) => {
    // Solo procesar números cuando estamos en countdown setup
    if (screens.countdownSetup.classList.contains('active')) {
        if (/^\d$/.test(e.key)) {
            addNumberToInput(e.key);
        } else if (e.key === 'Enter') {
            setCountdown();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                const formattedTime = formatInputAsTime(currentInput);
                elements.countdownInputDisplay.textContent = formattedTime;
                elements.countdownInput.value = formattedTime;
            }
        }
    }
});

// Animación de click para los botones del home
function addClickAnimation() {
    document.querySelectorAll('#home-screen .option').forEach(option => {
        option.addEventListener('click', function(e) {
            // NO usar preventDefault() para permitir la navegación
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            }, 100);
        });
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar referencias a elementos del DOM
    screens.home = document.getElementById('home-screen');
    screens.stopwatch = document.getElementById('stopwatch-screen');
    screens.countdownSetup = document.getElementById('countdown-setup-screen');
    screens.countdown = document.getElementById('countdown-screen');
    
    // Inicializar elementos
    elements.stopwatchBtn = document.getElementById('stopwatch-btn');
    elements.countdownBtn = document.getElementById('countdown-btn');
    elements.backFromStopwatch = document.getElementById('back-from-stopwatch');
    elements.backFromCountdownSetup = document.getElementById('back-from-countdown-setup');
    elements.backFromCountdown = document.getElementById('back-from-countdown');
    elements.stopwatchTime = document.getElementById('stopwatch-time');
    elements.stopwatchMilliseconds = document.getElementById('stopwatch-milliseconds');
    elements.startStopwatch = document.getElementById('start-stopwatch');
    elements.clearStopwatch = document.getElementById('clear-stopwatch');
    elements.countdownInput = document.getElementById('countdown-input');
    elements.countdownInputDisplay = document.getElementById('countdown-input-display');
    elements.setCountdown = document.getElementById('set-countdown');
    elements.clearCountdownSetup = document.getElementById('clear-countdown-setup');
    elements.countdownTime = document.getElementById('countdown-time');
    elements.countdownMilliseconds = document.getElementById('countdown-milliseconds');
    elements.startCountdown = document.getElementById('start-countdown');
    elements.clearCountdown = document.getElementById('clear-countdown');
    elements.numberBtns = document.querySelectorAll('.number-btn');
    
    console.log('DOM loaded');
    console.log('stopwatch-btn element:', elements.stopwatchBtn);
    console.log('countdown-btn element:', elements.countdownBtn);
    
    // Configurar event listeners para navegación
    if (elements.stopwatchBtn) {
        elements.stopwatchBtn.addEventListener('click', () => {
            console.log('Stopwatch button clicked');
            showScreen('stopwatch');
        });
        console.log('Stopwatch event listener added');
    } else {
        console.error('stopwatch-btn element not found!');
    }
      if (elements.countdownBtn) {
        elements.countdownBtn.addEventListener('click', () => {
            console.log('Countdown button clicked');
            showScreen('countdown-setup');
        });
        console.log('Countdown event listener added');
    } else {
        console.error('countdown-btn element not found!');
    }

    // Event listeners para botones de regreso
    elements.backFromStopwatch.addEventListener('click', () => {
        console.log('Back from stopwatch clicked'); // Debug
        clearStopwatch();
        showScreen('home');
    });

    elements.backFromCountdownSetup.addEventListener('click', () => {
        console.log('Back from countdown setup clicked'); // Debug
        currentInput = '';
        elements.countdownInputDisplay.textContent = '00:00:00';
        showScreen('home');
    });

    elements.backFromCountdown.addEventListener('click', () => {
        console.log('Back from countdown clicked'); // Debug
        clearCountdown();
        showScreen('countdown-setup');
    });

    // Event listeners del Stopwatch
    elements.startStopwatch.addEventListener('click', startStopwatch);
    elements.clearStopwatch.addEventListener('click', clearStopwatch);

    // Event listeners del Countdown Setup
    elements.numberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addNumberToInput(btn.dataset.number);
        });
    });

    elements.clearCountdownSetup.addEventListener('click', clearCountdownSetup);
    elements.setCountdown.addEventListener('click', setCountdown);

    // Event listeners del Countdown activo
    elements.startCountdown.addEventListener('click', startCountdown);
    elements.clearCountdown.addEventListener('click', clearCountdown);

    // Inicializar pantalla y valores
    showScreen('home');
    elements.stopwatchTime.textContent = '00:00:00';
    elements.countdownTime.textContent = '00:00:00';
    if (elements.stopwatchMilliseconds) {
        elements.stopwatchMilliseconds.textContent = '000';
    }
    if (elements.countdownMilliseconds) {
        elements.countdownMilliseconds.textContent = '000';
    }
    elements.countdownInputDisplay.textContent = '00:00:00';
    addClickAnimation();
});
