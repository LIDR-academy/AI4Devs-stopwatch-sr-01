# prompts.md

## 🎯 Prompt inicial con justificación

**Prompt usado:**

> "Necesito construir una aplicación web que permita crear múltiples cronómetros y múltiples cuentas regresivas. Cada cronómetro debe poder iniciar, pausar y reiniciar de manera independiente. Cada cuenta regresiva debe permitir ingresar un tiempo (en minutos), iniciar la cuenta atrás, pausarla y reiniciarla. Al finalizar la cuenta regresiva, debe sonar una alerta y mostrarse una notificación en el navegador. Todo debe presentarse con un diseño visual similar al estilo del sitio Online Stopwatch."

**Justificación de la estrategia de prompting:**

- Elegí un prompt completo y detallado desde el inicio para minimizar iteraciones.
- Usé lenguaje natural directo, sin estructuras técnicas complejas, pero dejando claros los requisitos funcionales.
- Incluir el estilo visual deseado desde el principio ayudó a obtener un diseño adecuado más rápido.
- Solicité soporte para múltiples instancias desde el inicio porque es un punto crítico del requerimiento.

---

## 🔍 Resultados parciales con errores o fallos detectados

1. El cronómetro básico funcionaba correctamente, pero el estilo visual era muy simple.
2. Inicialmente no se generaban botones visualmente diferenciados para iniciar, pausar y reiniciar.
3. El input de minutos para la cuenta regresiva no tomaba el valor correctamente si el campo no perdía el foco.
4. El sonido de alerta no se estaba reproduciendo correctamente (posiblemente por políticas del navegador sobre autoplay).
5. El diseño no reflejaba del todo el estilo de la herramienta de referencia.

---

## 🔧 Refinamientos aplicados

- Se mejoró el CSS para simular el diseño visual del sitio de referencia (Online Stopwatch).
- Se agregaron estilos personalizados para botones de **Iniciar**, **Pausar**, y **Reiniciar**.
- Se ajustó la lectura del input con `.blur()` para asegurar que el valor ingresado se tome correctamente.
- Se integró el componente visual de los "milisegundos" (`000`) debajo del contador, como decorativo.
- Se incluyó una función para pedir permiso de notificación y mostrarla al finalizar la cuenta regresiva.

---

## ✅ Prompt final (también incluirlo en el comentario del Pull Request)

> "Desarrolla una aplicación web que permita crear múltiples cronómetros y múltiples cuentas regresivas. Cada cronómetro debe poder iniciar, pausar y reiniciar de forma independiente. Cada cuenta regresiva debe permitir definir el tiempo (mínimos minutos, opcional horas/segundos), iniciar la cuenta atrás, pausarla y reiniciarla. Al finalizar debe sonar una alerta y mostrar una notificación. El diseño debe imitar el estilo visual de Online Stopwatch, incluyendo botones de colores grandes, fondo azul claro para el display, y texto negro grande. Agrega un texto decorativo '000' debajo del tiempo para simular milisegundos."

---

## 💡 Breve explicación de por qué funcionó mejor

El prompt final es efectivo porque:

- Describe de forma clara el comportamiento esperado del sistema.
- Incluye aspectos visuales concretos desde el inicio (botones, colores, estructura).
- Detalla comportamientos clave como múltiples instancias, control individual, y manejo de eventos al finalizar la cuenta regresiva.
- Usa un lenguaje amigable, pero sin ambigüedades.

---