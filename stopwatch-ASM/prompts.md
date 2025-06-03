# prompts.md

## 1. Prompt inicial con justificación

**Prompt inicial utilizado:**

```markdown
# Role

Eres un desarrollador front-end senior experto en Vanilla JS, HTML5 y CSS3, con especial atención a la precisión visual, la experiencia de usuario y la implementación de lógica interactiva siguiendo referencias visuales y funcionales detalladas.

# Context

Se desea construir una aplicación web single-page (SPA) mediante prompt engineering, partiendo de instrucciones textuales y referencias visuales, que replique fielmente el comportamiento y la interfaz de un sistema de cronómetro y cuenta regresiva (stopwatch & countdown) tal como se muestra en los mockups proporcionados (“screenshot_01.png”, “screenshot_02_stopwatch.png”, “screenshot_03_countdown.png”).

# Goal

El objetivo es generar el código completo que permita:
- Visualizar una landing page para elegir entre cronómetro ("Stopwatch") y cuenta regresiva ("Countdown").
- Implementar la pantalla y el flujo completo de **cronómetro** (“stopwatch”).
- Implementar la pantalla y el flujo completo de **cuenta regresiva** (“countdown”).
- Garantizar la navegación y el funcionamiento fluido entre todas las pantallas, fiel al diseño y lógica especificados.

## Technical criteria

- Utilizar únicamente Vanilla JS (JavaScript puro, ES6+), HTML5 y CSS3.
- Sin frameworks ni librerías externas.
- Estructura mínima de archivos: `index.html`, `script.js` y **estilos en un archivo externo `style.css`**, siguiendo estándares de organización de proyectos web profesionales.
- El diseño debe ser idéntico o muy similar a los mockups proporcionados, tanto en colores, tipografías, disposición de los elementos y tamaños.
- Compatibilidad con navegadores modernos (Chrome, Edge, Firefox).
- Seguir buenas prácticas de programación: guía de estilo StandardJS, nomenclatura camelCase, código comentado y organizado, y aplicar el principio de responsabilidad única (Single Responsibility Principle) en las funciones.
- Código bien estructurado para facilitar la extensibilidad y el mantenimiento.

## Functional criteria

### Landing Page

- Muestra dos botones grandes, “Stopwatch” y “Countdown”, cada uno con una flecha y el estilo mostrado en “screenshot_01.png”.
- Al pulsar cualquier opción, se navega a la pantalla correspondiente.

### Stopwatch (Cronómetro)

- Muestra la interfaz de “screenshot_02_stopwatch.png”:
  - Un visor grande con dos dígitos para horas, dos para minutos, dos para segundos y tres más pequeños para milisegundos.
  - Botón “Start” (verde, texto negro): al pulsar, inicia el conteo ascendente y cambia a “Pause” (verde).
  - Botón “Pause”: detiene el conteo y el botón cambia a azul y texto “Continue”.
  - Botón “Continue”: reanuda el cronómetro y vuelve a “Pause” (verde).
  - Botón “Clear” (rojo): resetea a 00:00:00.000 y deja el botón principal en estado “Start” (verde).
  - Barra inferior azul con flecha verde y texto “Back” para volver a la landing page.
- El cronómetro debe ser fluido y exacto en la visualización.

### Countdown (Cuenta regresiva)

#### Pantalla de configuración (ver “screenshot_03_countdown.png”)

- Interfaz numérica para introducir los 6 dígitos (2 horas, 2 minutos, 2 segundos).
  - Cada vez que se pulsa un dígito, este se añade a la derecha y los existentes se desplazan a la izquierda (como una calculadora).
  - Ejemplo: Si se pulsa “5” y luego “7”, aparecerá 00:00:57.
  - El orden de ingreso es: segundos (derecha) hasta completar 6 dígitos.
- Botón “Clear” limpia todos los dígitos y pone el contador a 00:00:00.
- Barra inferior azul con flecha verde y texto “Back” para volver a la landing page.
- Botón “Set” (o equivalente) para confirmar la cuenta atrás; al pulsar, navega a la pantalla visualmente idéntica al stopwatch, pero con lógica de cuenta regresiva.

#### Pantalla activa de Countdown

- Idéntica en aspecto al cronómetro, pero el conteo es descendente.
- Al pulsar “Start”/“Pause”/“Continue”/“Clear” se mantiene la misma lógica de botones que el cronómetro.
- Cuando el contador llegue a cero:
  - Se debe mostrar una notificación y reproducir un sonido de alerta.
  - Los botones vuelven a su estado inicial.
- Barra inferior azul con flecha verde y texto “Back” para volver a la landing page.

### Ejemplo de interacción countdown:
- Si el usuario pulsa “9” y luego “9”, el display muestra 00:00:99 (99 segundos).
- Si luego pulsa “Clear”, el display vuelve a 00:00:00 y al pulsar “Set” sin ingresar más dígitos, la pantalla activa del countdown muestra 00:00:00.
- Si introduce un tiempo, pulsa “Set”, se muestra la cuenta regresiva en la pantalla activa, y al llegar a cero debe dispararse la alerta y notificación.

## General criteria

- El código debe ser comprensible, organizado, y contener comentarios claros donde sea necesario.
- El diseño debe ser al menos responsive en desktop y tablets.
- El flujo de navegación debe ser intuitivo y sin errores.
- No usar dependencias externas.
- Por favor, pregunta cualquier información adicional que consideres necesaria antes de generar el código.

Justificación y estrategia de prompting:
La estrategia fue definir roles, contexto y criterios técnicos y funcionales de manera exhaustiva y precisa, empleando un lenguaje técnico y descripciones detalladas para reducir ambigüedad. Se utilizaron referencias visuales (mockups), desgloses de pantalla y lógica de interacción como historias de usuario, además de detallar las restricciones tecnológicas y de organización de código. Esto permite que la IA entienda claramente el alcance, nivel de detalle esperado, diseño visual y requisitos de experiencia de usuario, minimizando la necesidad de múltiples iteraciones para detalles de estructura o funcionalidad base.

2. Resultados parciales con errores o fallos detectados
Durante el desarrollo, surgieron varios problemas relevantes:

Problema con el audio de alerta: Inicialmente el sonido de alarma no se reproducía correctamente, debido a restricciones del navegador con la reproducción automática y/o a enlaces rotos de audio externo.

Timers múltiples no funcionales: La versión inicial del código solo permitía ejecutar un cronómetro o countdown de forma correcta a la vez. Al intentar tener varios activos simultáneamente, los intervalos se sobreescribían y los timers dejaban de actualizarse o perdían sincronía.

Renderizado global ineficiente: El renderizado global de toda la interfaz en cada ciclo de actualización causaba problemas de rendimiento y fallos en la actualización de timers independientes.

Estética básica y falta de responsividad: El diseño original era demasiado sencillo, sin atractivo visual ni adaptación a dispositivos móviles, lo que dificultaba la experiencia de usuario.

Textos y títulos no adaptados: La aplicación mostraba textos en español y títulos genéricos en vez del branding personalizado en inglés (“Adrian’s timers”).

3. Refinamientos aplicados
Durante el proceso, se aplicaron los siguientes refinamientos importantes para solucionar los errores y mejorar el producto final:

Corrección del sonido de alarma: Se descargó un archivo de audio propio (alarm-no3-14864.mp3), almacenándolo localmente en una carpeta sounds/, y se actualizó la ruta en el código para asegurar la reproducción estable y consistente del sonido de alerta.

Timers independientes y escalables: El código fue reorganizado para que cada timer (cronómetro o countdown) gestionara su propio intervalo y DOM, eliminando el renderizado global y permitiendo la actualización simultánea y eficiente de múltiples timers sin interferencias.

Control de eventos por timer: Se modularizó la gestión de eventos (start, pause, clear, delete) para cada timer, asegurando que las operaciones fueran totalmente independientes y que las eliminaciones o reinicios no afectaran al resto.

Notificación y sonido antes del popup: Se refinó la lógica para lanzar el sonido de alerta y la notificación web antes de mostrar el popup de aviso, asegurando que el sonido se perciba inmediatamente.

Diseño visual moderno y responsive: Se creó una nueva hoja de estilos con paleta moderna, efectos sutiles, sombras y adaptabilidad a pantallas pequeñas para mejorar la usabilidad en móvil.

Textos en inglés y branding: Se tradujeron todos los textos visibles al inglés y se cambió el título principal a “Adrian’s timers” para reflejar el branding personalizado solicitado.

# Role

You are a senior front-end developer expert in Vanilla JS, HTML5, and CSS3, with special attention to pixel-perfect visual accuracy, user experience, and implementation of interactive logic following detailed visual and functional references.

# Context

Build a single-page web application (SPA) via prompt engineering, starting from textual instructions and visual references, faithfully replicating the behavior and interface of a stopwatch and countdown system as shown in the provided mockups (“screenshot_01.png”, “screenshot_02_stopwatch.png”, “screenshot_03_countdown.png”).

# Goal

The objective is to generate complete code that enables:
- Displaying a landing page to choose between stopwatch and countdown modes.
- Implementing the full screen and logic for the **stopwatch**.
- Implementing the full screen and logic for the **countdown**.
- Managing and operating multiple independent timers (stopwatches and countdowns) simultaneously.
- Ensuring seamless navigation and fluid interaction between all screens, matching the specified design and logic.
- Displaying all text and buttons in English, with the main title as “Adrian’s timers”.

## Technical criteria

- Use only Vanilla JS (plain JavaScript, ES6+), HTML5, and CSS3.
- No frameworks or external libraries.
- Minimum file structure: `index.html`, `script.js`, and **styles in an external `style.css` file** according to modern web project standards. Audio files must be stored in a `sounds/` folder.
- The design must be visually identical or very similar to the mockups provided, including colors, typography, layout, and sizing.
- Compatibility with modern browsers (Chrome, Edge, Firefox).
- Follow programming best practices: StandardJS style guide, camelCase naming, well-commented and organized code, and the Single Responsibility Principle for functions.
- Well-structured code for maintainability and scalability.
- Responsive design for mobile and desktop.

## Functional criteria

### Landing Page

- Shows two large buttons, “New Stopwatch” and “New Countdown”, each with an icon and the style shown in “screenshot_01.png”.
- Below, a dynamic list titled “Adrian’s timers” shows all active timers.

### Timers List

- Each timer (stopwatch or countdown) appears as a card, displaying:
  - Type (“Stopwatch” or “Countdown”) and its number (e.g., Stopwatch #1)
  - Current time in the correct format (hh:mm:ss.ms)
  - “Start/Pause/Continue”, “Clear”, and “Delete” buttons for each timer
- Timers are fully independent: any number of stopwatches and countdowns can run simultaneously.

### Stopwatch (Stopwatch screen)

- Interface as per “screenshot_02_stopwatch.png”:
  - Large display: two digits for hours, two for minutes, two for seconds, three smaller digits for milliseconds.
  - Start (green), Pause (green), Continue (blue), Clear (red).
  - Real-time and precise update.

### Countdown

#### Setup screen (“screenshot_03_countdown.png”)

- Numeric interface to enter 6 digits (2 for hours, 2 for minutes, 2 for seconds), with calculator-style digit entry (digits shift left).
- “Clear” (red), “Create Countdown” (blue), and “Cancel” (blue) buttons.

#### Active countdown

- Countdown timer card, visually identical to stopwatch but counts down.
- When timer reaches zero:
  - Plays the local audio file from `/sounds/alarm-no3-14864.mp3` and shows a web notification **before** displaying an alert popup in English (“The countdown has finished!”).
  - Buttons reset to initial state.

## General criteria

- Code must be clean, well-organized, and contain clear comments as needed.
- Design must be responsive for both desktop and mobile.
- Navigation and interaction must be intuitive and error-free.
- No external dependencies.
- Ask for any extra info you need before generating code.

---

Ask me any extra information you need before building the implementation.

