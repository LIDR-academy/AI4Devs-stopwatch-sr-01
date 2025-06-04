# Prompts
- **Primer Prompt**

    # Rol
    Eres un experto en desarrollo de aplicaciones JavaScript Fullstack.

    # Meta
    Crea una página web en donde se puedan crear y ejecutar un cronómetro y una cuenta regresiva tomando como referencia para la interfaz de usuario la imagen proporcionada.  Teniendo en cuenta los siguientes criterios de aceptación:
    Criterios técnicos:
    1. Separar el código HTML y JavaScript en index.html y script.js respectivamente.
    2. Aplicar los principios SOLID y comentarios cuando aplique.
    3. Capturar todas las posibles excepciones.
    4. Implementar logs por consola en donde sea necesario.
    5. Utiliza bootstrap para dar estilos y hacer que el web sea responsive.

    Criterios funcionales:
    1. Cuando finalice una cuenta regresiva se debe mostrar una notificación y reproducir un sonido de alerta.
    2. En el caso de la cuenta regresiva que se permita digitar los valores con el teclado, o incrementar y decrementar cada parte del tiempo con las flechas del teclado o es scroll del ratón.
    3. Permitir crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente


    Pregúntame toda la información adicional que necesites antes de desarrollarla.

- **Segundo Prompt**

    1.1 Con un botón global para ambos casos y que se respliege un modal.
    1.2 Que el usuario le asigne un nombre y que no se repita.
    1.3 Con el mismo botón «Start» alternar entre iniciar, pausar y continuar. El botón de clear vuelve siempre al valor inicial, para el crónometro a cero y para la cuneta regresiva al valor fijado inicialmente.
    1.4 Adicionar botón para eliminar con el icono de basura en la parte superior derecha.

    2.1 Campos serparados. En los tres campos se debe permitir escribir con teclado, incrementar y decrementar con las flechas y scroll del ratón.
    2.2 Simplemente pemitir que solo se digiten números, cualquier otra cosa se omite.

    3.1 Notificación con toast de Boopstrap y que incluya el nombre asignado.
    3.2 Incluir el «Beep» generico que propones. Si incluir el icono de silenciar.

    4.1 y 4.2 Como está en 1.3
    4.3 Sin persistencia.
    4.4 Que siga corriendo sin importar que se cambie la pestaña o se minimice el navegador.

    5.1 Usar Bootstrap5.
    5.2 La distibución que me propones está bien.
    5.3 El estilo tal cual la imagen pero si incluir que el color de fondo cambie en función del estado como lo propones.

    6.1 Relamente lo importae para mi seria el log de los posibles errores que ocurran.
    6.2 Si envolver la inicialización de cda temporizador en un bloque try/catch. Cuando se creen más de X temporizadoes e intento de pausar/reanudar un temporizador eliminado.

    7.1 En la ubicación propuesta está bien y con lo dicho en 3.1 se complementa.
    7.2 Reproducir sin importar si la pestaña tiene foco o no. 

    8.1 el comportamiento como en 2.1 y el valor inicial siempre es 0.
    8.2 Está bien el comportamiento que propones y el limite de las horas haysa 99h.
    8.3 Puede ingresar el valor númerico sin pero controlando que este entre 0 y 59 para minutos y segundos.

    9.1 Se podiria conlocar un limite de hasta 20 temporizadores y mostrar la avertencia queme indicas al llegar la limite.
    9.2 Es asceptable que no sea 100 % exacto milisguno a milisegundo.

    10.1 Si mostrar la parte de los milisegundos en todos.
    10.2 El botón «Clear» debe detener y restablecer la interfaz.
    10.3 Solicitar confirmación al cerrar el temporizador.
    10.4 Esta bien la selección de navegadores que me indicas.

- **Tercer prompt**

    En consola se muestra el siguiente error: Failed to find a valid digest in the 'integrity' attribute for resource 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' with computed SHA-384 integrity '9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'. The resource has been blocked.

- **Cuarto prompt**

    Encontré algunos errores y mejoras por realizar:

    - El scroll del ratón no está funcionando para incrementar o decrementar el valor de las horas, minutos y segundos. 

    - Los milisegundos se están mostrando dentro del botón de clear.

    - Los textos de los botones colocarlos en español. 

    - Mantener el estilo de la tarjeta según la imagen que se proporcionó, a excepción de los botones que se agregaron para silenciar la notificación como para eliminar.

    - Para la confirmación de eliminación de un temporizador utilizar modal en lugar de simple Alert de JavaScript.

    Para probar más fácil las modificaciones dame una a una las soluciones y cunado de confirme que ya quedó bien proseguimos con la siguiente. Para cada caso siempre entrégame el código HTLM y JavaScript completos.

- **Quinto prompt**

    Solucionado lo del scroll, continuar con la siguiente mejora.

- **Sexto prompt**

    Solucionado lo de los milisegundos, continuar con la siguiente mejora.


- **Séptimo prompt**

    Solucionado lo de los textos, continuar con la siguiente mejora.

- **Octavo prompt**

    Como un requerimiento no funcional: Cómo el JavaScript es extenso divídelo en varios JS para aportar claridad y hacerlo más fácil de mantener.

- **Noveno prompt**

    No me entregaste el resultado!

- **Décimo prompt**

    Al intentar crear un cronometro me arroja el siguiente error en consola: TimerBase._createCard] Error al crear la card del timer 1: ReferenceError: timersContainer is not defined
    at StopwatchTimer._createCard (timerBase.js:116:7)
    at new TimerBase (timerBase.js:44:10)
    at new StopwatchTimer (stopwatchTimer.js:9:5)
    at TimerFactory.createTimer (timerFactory.js:23:14)
    at HTMLButtonElement.<anonymous> (main.js:142:36)

- **Undécimo prompt**

    ahora al iniciar el cronometro arroja el siguiente error : [StopwatchTimer 1] Error en start(): ReferenceError: MILLISECONDS_INTERVAL is not defined
    at StopwatchTimer.start (stopwatchTimer.js:25:62)
    at StopwatchTimer._handleStartPauseResume (timerBase.js:197:14)
    at HTMLButtonElement.<anonymous> (timerBase.js:139:14)

- **Duodécimo prompt**

    Aportaria algo al rendimiento de la aplicación que no se actualice la parte gráfica de los temporizadores que no están siendo visualizados ?

- **Decimotercero prompt**

    Aplicar este cambio en los JS correspondientes


- **Decimocuarto prompt**

    incluye el script del observer en un archivo JS separado y no dentro del index.html

- **Decimoquinto prompt**

    Al intentar borrar un temporizador me arroja el siguiente error en consola: [Timer 6] Error en Eliminar: ReferenceError: pendingDeleteTimer is not defined
    at StopwatchTimer._handleDelete (timerBase.js:232:24)
    at HTMLButtonElement.<anonymous> (timerBase.js:163:14)


# Justificación
La estrategia utilizada fue la de One-shot prompting ya que tenia una imagen como ejemplo de la interfaz de lo que se queria implementar a demás de especificar algunos detalles de funcionamiento. Lo realice tratando de tener una structura lógica donde fuera claro el rol que debia tener, el contexto de lo que se queria que las instrucciones fueran claras y cual era la Meta a logar, y además use markdown para que esa estrucutura fuera más clara.

Y por otro lado, como se me podian escapar detalles aplique una estrategia más, *«Resolver todas las dudas antes de comenzar»* incluyendo la instrucción «Pregúntame toda la información adicional que necesites antes de desarrollarla».

Ya con estó contestando las preguntas que me hizó pude ser más especifico y t5uve un muy buen resultado inicial.

Los errores que se me presentaron ya al ejecutar el programa se los especifique indicando el momento en le que salia y me dio la solución a estos.

En una parte, donde vi varias cosas por corregir o por mejorar en cuanto a la funcionalidad del programa opte por la estategia de dividir en subtareas, es decir, le especifique cuales erarn los errores y mejoras por hacer pero le indique que me fuera dando la solucioón a cada una de ellas una por una y solo avanzaramos a la siguiente mejora si ya quedaba solventada la actual, esto con el fin de yo poder probar los cambios más facilmente.