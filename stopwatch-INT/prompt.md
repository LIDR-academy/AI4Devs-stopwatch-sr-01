### Prompt

```
Eres un desarrollador frontend y diseñador UI/UX experto.

Contexto:
Estoy creando una app con temporizadores que soporte dos modos: Cronómetro (Stopwatch) y Cuenta Regresiva (Countdown), usando HTML, CSS y JavaScript. Y que ofrece la posibilidad de crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente.

Requisitos


Cada temporizador es una tarjeta con un ícono de cronómetro y un contador que se actualiza en formato 00:00:00. Usa Font Awesome para el ícono y JavaScript para el contador.

Mostrar un toogle para poder cambiar el modo y muestra en texto el modo actual: “Stopwatch” o “Countdown”.

Botón único que cambie entre “Start” y “Pause” o "Continue". Solo uno visible a la vez.

Botón Clear para limpiarlo en cualquier momento, si está start, se para y limpia.

Tarjeta en verde cuando el temporizador está activo, rojo cuando está pausado.

Para Countdown, agregar tres selectores para días, minutos y segundos antes de iniciar. Al hacer clear los selectores vuelven a 0 también.

Para Stopwatch, empezar siempre desde cero sin configurar tiempo.

Permitir crear y eliminar múltiples temporizadores.

Permitir cambiar el modo de cada temporizador en cualquier momento.

Contenedor principal centrado donde se agreguen los temporizadores.

Botones para añadir nuevos temporizadores en modo Stopwatch o Countdown con una flecha hacia arriba para Stopwatch y una flecha hacia abajo para Countdown .

Al finalizar una cuenta regresiva, reproduce un sonido de alerta y muestra una alerta.

Diseño limpio, moderno, responsivo

Interfaz en inglés (textos, tooltips, botones).

Entrega
Código separado en HTML, CSS y JavaScript.

Comentarios en partes importantes.

Código limpio y fácil de entender.
```

### Estrategia de prompting y consideraciones

Elegí usar un solo prompt detallado que incluía todos los requisitos desde el principio.

La app tiene varias funciones y estados que deben funcionar juntos (múltiples temporizadores, modos, botones que cambian, colores, alertas, etc.), por eso quise evitar confusiones y muchas iteraciones.

Pedí desde el inicio:

- Código separado en HTML, CSS y JavaScript.
- Comentarios en las partes importantes para entender mejor.
- Diseño moderno, limpio, responsivo y fácil de usar.
- Lógica para cambiar modos y manejar varios temporizadores a la vez.

### Por qué estructuré el prompt así

- Para que el modelo entendiera bien todas las funciones (botones, colores, toggles, alertas, sonidos) y no hiciera código incompleto.
- Para dar todo el contexto (modos Stopwatch y Countdown, múltiples timers) y que el código sea escalable y claro.
- Para mantener el código modular y fácil de mantener, separando archivos.
- Para incluir indicaciones claras de UX/UI (colores según estado, tooltips, textos en inglés).
- Para evitar muchas correcciones y obtener una solución casi lista desde la primera vez.
