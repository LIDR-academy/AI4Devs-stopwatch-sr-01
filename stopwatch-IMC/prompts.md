# PROMPTS

## Prompt inicial con justificación: Debes explicar qué estrategia de prompting elegiste, por qué estructuraste los prompts de una u otra manera y qué tipo de consideraciones tuviste en cuenta al hacerlo (por ejemplo, nivel de detalle, contexto, iteraciones, etc.).

Para tratar de partir de un prompt completo, le pregunté a ChatGPT lo siguiente:

Estoy estudiando un master para expertos en inteligencia artificial y me piden resolver el siguiente ejercicio, para lo que necesito que me diseñes un prompt profesional y que detalle cada funcionalidad de forma pormenorizada, atendiendo también a los detalles de diseño y maquetación: 

Instrucciones del Ejercicio: Cronómetro y Cuenta Regresiva

Objetivo
Utiliza lo aprendido en prompt engineering para desarrollar un cronómetro y una cuenta regresiva.

Referencia visual
Consulta Online Stopwatch y la imagen res/stopwatch.png como guía de diseño.

Recursos Base
Parte del archivo index.html y script.js proporcionados.

💡 Tip: Si el chatbot permite análisis de imágenes, puedes subir la referencia visual para generar un diseño más preciso.

⭐️ Extras Obligatorios
Al finalizar una cuenta regresiva, muestra una notificación y reproduce un sonido de alerta.
Permite crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente.

************************

Este prompt me devolvió la estructura del prompt final (indicado más abajo) a un 70%. Solo tuve que completarlo detallando más cada funcionalidad. 

## Resultados parciales con errores o fallos detectados

Conseguí relativamente pronto acercarme a la solución funcional, pero el diseño estaba muy lejos de lo esperado.

## Refinamientos aplicados

Además de solicitar algunas correcciones funcionales y varias correcciones importantes de diseño, tuve ue proporcionar 3 capturas de pantalla para guiar el diseño (como se ve en el prompt final).


## Prompt final (también colócalo en el comentario del Pull Request)

Contexto:
Estoy desarrollando una aplicación web interactiva para un máster de inteligencia artificial, aplicando prompt engineering. El objetivo es construir una aplicación dinámica que permita crear y gestionar múltiples cronómetros y cuentas regresivas simultáneamente, con un diseño moderno, responsive, y respetando una estructura clara y modular.

📁 Referencias visuales:
1. selector.jpg — diseño del bloque superior con dos botones: "+ Cronómetro" y "+ Cuenta regresiva".
2. cronometro.jpg — diseño exacto del componente de cronómetro, que debe copiarse con precisión.
3. cuenta-regresiva.jpg — diseño del componente de cuenta regresiva, incluyendo el teclado numérico para establecer la cuenta atrás.

🧩 Componentes de la aplicación:

### 🧭 1. Bloque superior para añadir cronómetros y cuentas regresivas
- Posicionado en la parte superior centrado horizontalmente
- Contiene dos grandes botones:
  - **+ Cronómetro**: crea una nueva tarjeta de cronómetro.
  - **+ Cuenta regresiva**: crea una nueva tarjeta de cuenta regresiva.
- Diseño según selector.jpg, con dos grandes botones con iconos, de estética moderna y limpia.
- Los nuevos elementos generados se colocan debajo de ese bloque, organizados en **dos columnas responsive** (row + col-md-6) usando Bootstrap.

### ⏱️ 2. Componente de **Cronómetro**
Diseño exacto según cronometro.jpg.

#### Estructura visual:
- Tarjeta (card de Bootstrap).
- Visualización centrada del tiempo en formato:  
  **hh : mm : ss** (en grande)  
  **milisegundos** (en pequeño, alineado a la derecha).
- Botones:
  - **Start / Pause**: inicia o pausa el cronómetro, cambiando la leyenda del botón (mostrará "Start" si el cronómetro está detenido y "Pause" si está en marcha).
  - **Reset**: pone el tiempo a 00:00:00.000.
  - **Delete**: elimina la tarjeta.

#### Funcionalidad:
- Precisión hasta milisegundos (actualización cada 10ms mínimo).
- Temporizador puede iniciar, pausar, reiniciarse y eliminarse.
- Debe gestionarse con una clase Stopwatch con métodos: start(), pause(), reset(), delete().


### ⏳ 3. Componente de **Cuenta Regresiva**
Diseño según cuenta-regresiva.jpg. Comportamiento dividido en dos fases: **entrada de tiempo** y **cuenta atrás activa**.

#### A. Fase 1: Entrada de tiempo
- Tarjeta Bootstrap con el siguiente contenido:
  - Marcador digital con 6 dígitos: **hh:mm:ss**, inicialmente en 00:00:00.
  - **Teclado numérico virtual**: botones del 0 al 9.
    - Cada número pulsado se inserta desde la derecha a la izquierda.
    - Formato: primero los segundos, luego minutos, luego horas.
  - Botones:
    - **Set**: establece el tiempo introducido y pasa a fase 2.
    - **Clear**: reinicia el marcador a 00:00:00.

#### B. Fase 2: Ejecución de la cuenta regresiva
- Una vez presionado **Set**:
  - Se oculta el teclado numérico y los botones Set y Clear.
  - Aparecen dos nuevos botones:
    - **Start / Pause**: para iniciar o pausar la cuenta regresiva.
    - **Reset**: para reiniciar el tiempo al valor seteado inicialmente.
- Durante la cuenta atrás:
  - El marcador se actualiza segundo a segundo.
  - Al llegar a 00:00:00:
    - Se reproduce un **sonido de alerta** (utilizar el recurso local "alert.mp3").
    - Se muestra una **notificación visual** (puede ser una alerta HTML o una notificación del navegador).
    - Se puede dejar la tarjeta resaltada para indicar que ha finalizado.

#### Implementación:
- Clase CountdownTimer:
  - Propiedades: tiempoActual, tiempoOriginal, estado, etc.
  - Métodos: inputDigit(d), set(), clear(), start(), pause(), reset(), notify().


### 🗂️ Estructura del proyecto

- index.html
  - Contiene el bloque superior con los dos botones, contenedor dinámico de tarjetas y llamadas a los scripts y estilos.
- style.css
  - Estilos personalizados complementarios a Bootstrap.
  - Reproducción visual exacta (en la medida posible) de las tres imágenes de referencia.
- script.js
  - Lógica en JavaScript modular y clara.
  - Uso de clases Stopwatch y CountdownTimer.
  - Eventos conectados dinámicamente a los componentes creados.
  - Funciones auxiliares:
    - formatearTiempo(ms)
    - insertarComponente(tipo)
    - crearBotonesNumericos()
    - reproducirSonidoAlarma()
    - mostrarNotificacionFinalizacion()


### 🧪 Buenas prácticas:
- Código bien comentado, separado por funciones y clases.
- Reutilización de componentes.
- No se deben usar frameworks externos (solo Bootstrap 5 y JS nativo).
- Diseño responsive y funcional en móvil y escritorio.


✅ **Resultado esperado**:
Una aplicación web funcional, profesional y responsiva que permita crear múltiples cronómetros y cuentas regresivas con comportamiento independiente, replicando con precisión los diseños proporcionados y cumpliendo la lógica definida para cada componente.

## Breve explicación de por qué el último prompt funcionó mejor

No funcionó al 100%, pero la solución se aproximó mucho más a lo esperado. Fuí refinando la solución mediante prompts concretos que indicaban pequeños problemas funcionales y ajustes de diseño, y llegué facilmente a la solución planteada.