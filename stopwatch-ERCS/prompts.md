PROMPT inicial, le he dado de contexto de archivos el index.html y la imagen stopwatch.png, y le he dado el siguiente PROMPT, elegí la estrategía de que me preguntará lo que no tuviera claro para limitar su respuesta y no diera cabida a ambiguedades, con sus preguntas pude refinar aún más los requerimientos y lograr a la primera un MVP de la aplicación que aúnque no era del todo como la imaginaba (un clon de online-stopwatch.com), me terminó sorprendiendo y hasta gustandome más, claro todo muy a lo bootstrap por que se lo he pedido de esa manera.

```
# Rol

Toma el rol de un brillante especialista programador, apegado a buenas prácticas, con capacidad para dar recomendaciones basado en tu alta experiencia y/o escoger las mejores tecnologías disponibles en base al proyecto a realizar ya que necesito que realices un cronómetro y una cuenta regresiva.

# Contexto

* Debes usar como punto de partida el archivo index.html y script.js proporcionados.
* Debes usar la imagen stopwatch.png y el sitio web https://www.online-stopwatch.com como guía de diseño

# Criterios de Aceptación:

1. Al finalizar una cuenta regresiva, muestra una notificación y reproduce un sonido de alerta.
2. Permite crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente.
3. Separa el código html y el javascript en index.html y script.js
4. Aplica principios SOLID
5. Captura todas las posibles excepciones
6. Para CSS usa bootstrap en su última versión desde algún CDN
7. Haz la aplicación responsiva

# Criterios Funcionales

1. Al ingresar por vez primera el usuario debe poder elegir entre dos opciones: uno para mostrar el cronometro y el otro para la cuenta regresiva
2. Al elegir una de las dos opciones debe ser posible poder agregar más cronómetros o cuentas regresivas que puedan ser usados al mismo tiempo
3. Las notificaciones deben mostrarse con el componente de bootstrap "Alerts" en la parte superior derecha de la página, debe haber un área definida para ello sin que interrumpa visualmente nada y deben desaparecer autoµaticamente al poco tiempo de haberse iniciado.

Antes de darme código fuente pregúntame toda la información que puedas necesitar y que no tengas clara.
```

# Preguntas de la IA

Con el PROMPT anterior hemos iniciadio las iteraciones, la IA me ha realizado las siguientes preguntas:

```
Preguntas clave para el desarrollo:
¿Diseño inicial de selección?

¿Prefieres que la selección entre cronómetro o cuenta regresiva sea a través de un modal al cargar la página, una pantalla de bienvenida o botones visibles en la interfaz?

Gestión de múltiples instancias:

¿Los cronómetros y cuentas regresivas se deben mostrar en tarjetas individuales y agregarse dinámicamente en la página?

¿Deseas que tengan nombres personalizados para diferenciarlos (ej: “Cronómetro de Ejercicio”, “Countdown de Pizza”, etc.)?

Cuenta regresiva:

¿Cuál es el formato máximo que debe aceptar? (ejemplo: solo minutos y segundos, o también horas)

¿Debe permitir ingresar tiempos arbitrarios o solo opciones predefinidas (como 5, 10, 15 minutos)?

Sonido de alerta:

¿Tienes un archivo de sonido específico que quieras usar para la alerta al finalizar la cuenta regresiva, o deseas que te recomiende un beep sencillo/libre?

Persistencia:

¿Debe la app recordar los cronómetros/cuentas regresivas en progreso si el usuario recarga la página (usando localStorage por ejemplo), o solo mientras la sesión está abierta?

Funcionalidad avanzada:

¿Necesitas funcionalidades extra como pausar/reanudar, reiniciar, editar tiempo, duplicar, o con start/stop/reset es suficiente?

¿Quieres mostrar historial de tiempos finalizados, o simplemente limpiar cada tarjeta al finalizar?

Estilo/Branding:

¿Quieres que la app tenga algún logo, color institucional, fondo específico, o solo Bootstrap+stopwatch.png como guía visual?

¿El favicon debe ser personalizado con stopwatch.png?

Internacionalización:

¿Debe estar solo en español o te interesa que soporte inglés también?
```

# Respuestas

Y estas fueron mis respuestas:

```
1. ¿Diseño inicial de selección?

Prefiero que sean bótones visibles y atractivos en la interfaz como lo hace https://www.online-stopwatch.com

2. Gestión de múltiples instancias:

Sí, Los cronómetros y cuentas regresivas se deben mostrar en tarjetas individuales y agregarse dinámicamente en la página
También Deseo que tengan nombres personalizados para diferenciarlos, el usuario debe poder seleccionar de una lista los nombres más obvios o posibles y si ninguno concuerda con su preferencia poder agregar uno personalizado.

3. Cuenta regresiva:

El formato máximo que se debe aceptar es horas, debe poder ingresar tiempos arbitrarios peor medio de un teclado como lo hace  https://www.online-stopwatch.com

4. Sonido de alerta:

No tengo, usa un beep sencillo y libre.

5. Persistencia:

No, no es necesaria la persistencia.

6. Funcionalidad avanzada:

Las funcionalidades extras deben ser: pausar/reanudar, iniciar, parar, reset.

7. ¿Quieres mostrar historial de tiempos finalizados, o simplemente limpiar cada tarjeta al finalizar?

Al finalizar las tarjetas deben quedar en pantalla y debe haber un botón para eliminarlas y/o para limpiarlas todas.

8. Estilo/Branding:

No tengo logo ni favicon por el momento, pero me gustaría un titulo divertido

9. Internacionalización:

Solo en español

Si te quedó todo claro adelante, si no, hazme más preguntas antes de crear el código
```

# Validación y preguntas adicionales

La IA me ha devuelto una parte para validación y ajustar un poco más sus criterios, importante por que no se fue a crear de una vez el código, quiso esperar la validación de su lógica:

```
# Resumen y decisiones de implementación
## Pantalla de inicio:

*Dos botones grandes y atractivos: “Cronómetro” y “Cuenta regresiva”.
* Ambos permitirán agregar múltiples instancias.

## Manejo de múltiples cronos/regresivas:

*Cada instancia aparece en una tarjeta (“card” de Bootstrap).
*El usuario puede ponerle un nombre, seleccionando de una lista sugerida o escribiendo uno personalizado.
*Se pueden eliminar de forma individual, o todas con un botón global de “Limpiar todo”.

## Cuenta regresiva:

* Permite ingresar horas, minutos y segundos mediante campos tipo número o un input de texto.
* El formato será HH:MM:SS.
* Botón para iniciar, pausar/reanudar, resetear y eliminar cada una.

## Cronómetro:

* Idéntico en funcionalidad, pero solo cuenta hacia arriba.

## Alertas y sonido:

* Cuando una cuenta regresiva termina, se mostrará una alerta (Bootstrap Alert en la esquina superior derecha) y se reproducirá un beep.
* Las alertas desaparecerán automáticamente después de unos segundos.

## UX y estilo:

* Todo responsivo usando Bootstrap.
* Imagen de fondo del cronómetro (stopwatch.png) solo en la UI de cronómetro (como referencia visual).
* Título divertido en la parte superior, ejemplo: “¡Mide tu tiempo como un PRO!”

## Idioma:

* Todo en español.
* Los nombres sugeridos serán en español.

## Validación de UX

1. Input de tiempo para cuenta regresiva:
¿Prefieres tres campos numéricos separados (Horas / Minutos / Segundos) o un solo campo tipo HH:MM:SS que parsearemos al agregar?

2. Lista de nombres sugeridos:
¿Te parece bien que proponga algunos ejemplos como:

* “Ejercicio”
* “Descanso”
* “Estudio”
* “Cocina”
* “Trabajo”
* “Personalizado...”

Puedes agregar o quitar ejemplos si lo deseas.

3. ¿Quieres que los cronómetros también puedan tener nombre personalizado o solo la cuenta regresiva?

¿Quieres cambiar, añadir o quitar algo de lo anterior antes de que te entregue la solución y el código?
```

# Respuesta a su validación

```
Los cronómetros también deben poder tener nombre personalizado.

Los botones iniciales son para seleccionar queremos iniciar entre Cronómetro y Cuenta regresiva, una vez seleccionada la opción iremos a una pantalla donde solo podremos agregar tarjetas de Cronómetro o de Cuenta regresiva, nunca mezclar ambas opciones, pero debe haber un botón para regresar a la pantalla inicial donde se puede seleccionar con los dos botones, al regresar a la selección se debe mantener cualquier Cronometro o Cuenta regresiva creada previamente, estas solo podrán limpiarse usando el botón apropiado para ello.
```

# Última validación, solicitud de confirmación

```
¡Excelente! Ahora sí, todo está perfectamente claro y tu especificación es profesional y detallada. Resumo las decisiones finales de interacción para asegurarme de que estamos alineados:

# Comportamiento Final

1. Pantalla inicial:

* Dos botones grandes: “Cronómetro” y “Cuenta regresiva”.
* Elegir una opción te lleva a la pantalla respectiva (solo verás cronómetros o solo cuentas regresivas).
* Un botón de “Volver” siempre disponible para regresar a la pantalla de selección.
* Al regresar, las tarjetas existentes NO se pierden; siguen ahí al volver a la sección correspondiente.

2. Gestión de tarjetas:

* Puedes agregar múltiples cronómetros o múltiples cuentas regresivas (pero no mezclados).
* Cada uno con nombre: puedes elegir de una lista sugerida o ingresar uno personalizado.
* Cada tarjeta puede pausar/reanudar, iniciar, parar, resetear, y eliminarse.
* Hay un botón global de “Limpiar todo” para borrar todas las tarjetas activas de ese tipo.
* Al finalizar una cuenta regresiva: suena beep y sale alerta Bootstrap, la tarjeta se queda (no desaparece sola).

3. Persistencia:

* El estado se mantiene solo mientras la página no se recarga/cierra, pero puedes cambiar de sección y volver sin perder tus timers actuales.

4. UI:

* Bootstrap desde CDN, responsive.
* Estilo divertido, pero limpio y moderno.
* Todo en español.

## Voy a crear la estructura en dos archivos:

* index.html (solo HTML y Bootstrap)
* script.js (toda la lógica JS, aplicando SOLID, buenas prácticas y manejo de excepciones)

## ¿Confirmas que está todo correcto o quieres ajustar algo más?

Si confirmas, empiezo a escribir el código fuente. (¡Será modular, claro, bien comentado y con buenas prácticas!)
```

# Conclusión

No tuve que usar varios PROMPTs ya que al elegir la metodología de que la misma IA preguntara lo necesario antes de generar código pude refinar mis requerimientos y no dejar cabos sueltos.

Ya en esta parte confirmé que generara el código fuente, pienso que debí pedirle inicialmente que me hiciera buenos comentarios explicativos de las funciones, ya que aunque si hizo comentarios, los mismos son bastante básicos.

Me gustó mucho el código fuente generado y que puede ser un buen punto de partida para una aplicación, tal vez le hace falta un poco más de diseño grafico, pero sin haberle dado el contexto de como exactamente debió verse a nivel de UI/UX me parece que salió muy bien.

Pude detectar un fallo, a veces hay un glitch al cambiar número en el contador, pero se lo atribuyo más a javascript que al código en sí.
