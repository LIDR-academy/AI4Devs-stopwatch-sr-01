## 🎯 Prompt Maestro – Cronómetro y Cuenta Regresiva (Desarrollo Incremental con Autorefinamiento)

Crea una **aplicación web con cronómetro y cuenta regresiva**, utilizando HTML, CSS y JavaScript puros (sin frameworks). El proceso debe desarrollarse de forma **incremental, iterativa y con refinamiento automático**, evaluando en cada fase los siguientes aspectos:

- 📌 Correctitud funcional
- 🎨 Diseño visual
- 🧠 Calidad del código y del prompt
- 📁 Organización modular y reutilizable

---

### 🔁 Flujo de Trabajo Iterativo

1. ✅ **Genera un bloque de funcionalidad inicial (por ejemplo: cronómetro básico)**.
2. 🧪 **Ejecuta en entorno local (VSCode + Live Server)**.
3. 🕵️‍♂️ **Evalúa si cumple el objetivo funcional y visual esperado**.
4. 🔧 **Refina automáticamente el prompt si el resultado es incompleto, ineficiente o mal diseñado**.
5. 📁 **Copia el código de esa versión a un subfolder con nombre versionado**.
6. 🔁 **Continúa con la siguiente funcionalidad o mejora de diseño**.

---

### 🧱 Etapas Iterativas (con refinamiento automático en cada una)

#### 1️⃣ Versión Base HTML + Estructura de diseño mínima
- Generar `index.html` con las secciones: cronómetro, cuenta regresiva, botones de control.
- Incluir referencias a `script.js` y `style.css`.
- Comenzar con diseño limpio basado en la referencia visual de [Online Stopwatch](https://www.online-stopwatch.com/).

🗂 Guardar como: `versiones/v1_html_base/`

---

#### 2️⃣ Funcionalidad: Cronómetro básico
- Implementar cronómetro funcional con Start, Pause, Reset.
- Mostrar tiempo en formato `mm:ss:ms`.
- Modularizar en una clase `Chronometer`.

🗂 Guardar como: `versiones/v2_cronometro/`

---

#### 3️⃣ Funcionalidad: Cuenta regresiva básica
- Inputs de minutos y segundos.
- Start, Stop, Reset para la cuenta regresiva.
- Mostrar tiempo restante.
- Modularizar en una clase `Countdown`.

🗂 Guardar como: `versiones/v3_countdown/`

---

#### 4️⃣ Mejoras funcionales y visuales
- Alerta visual al terminar (`⏰ ¡Tiempo finalizado!`).
- Reproducir `res/alarm.mp3`.
- Usar `Notification` si está disponible.
- Estilizar con CSS: fondos, márgenes, animaciones sutiles.

🗂 Guardar como: `versiones/v4_alerta_estilo/`

---

#### 5️⃣ Soporte para múltiples cronómetros y regresivas
- Botones “Agregar Cronómetro” y “Agregar Cuenta Regresiva”.
- Cada reloj debe ser independiente.
- Reutilizar las clases `Chronometer` y `Countdown`.
- Cada instancia en su contenedor visual con sus propios controles.

🗂 Guardar como: `versiones/v5_multi_relojes/`

---

#### 6️⃣ Revisión del Prompt Final + Refactor
- Evaluar si el prompt inicial fue suficientemente claro.
- Ajustar la redacción del prompt para que sea más preciso, eficiente y orientado a modularidad.
- Documentar ese refinamiento en el subfolder.

🗂 Guardar como: `versiones/v6_refactor_prompt/`

---

### 📁 Estructura esperada del proyecto

```plaintext
stopwatch-<INICIALES>/
├── index.html             <-- archivo base para pruebas actuales
├── script.js              <-- archivo base funcional
├── style.css              <-- diseño base en raíz
├── prompts.md             <-- este archivo
├── chatbot.md             <-- interacción con el modelo
├── res/
│   └── alarm.mp3
└── versiones/
    ├── v1_html_base/
    ├── v2_cronometro/
    ├── v3_countdown/
    ├── v4_alerta_estilo/
    ├── v5_multi_relojes/
    └── v6_refactor_prompt/
