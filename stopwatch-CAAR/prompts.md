# Prompt inicial con justificación - Debes explicar qué estrategia de prompting elegiste, por qué estructuraste los prompts de una u otra manera y qué tipo de consideraciones tuviste en cuenta al hacerlo (por ejemplo, nivel de detalle, contexto, iteraciones, etc.).

Realice la estrategia de OneShot ya que me hace pensar en lo que debo solicitarle y de esa manera reducir las interacciones que debo realizar o que estás sean muy puntuales y/o especificas.
En cuando a la estructura del prompt, siempre inicio con el role, por otra parte implementando lo visto en la sesión 1 y en los recursos del curso, estoy usando MD para dejarlo más estilizado. En cuanto al contexto trate de ser muy detallado, sin embargo hubo errores y detalles que genero la respuesta.

# Resultados parciales con errores o fallos detectados

Al cargar la página, se mostraba el modal el cual solo se debe mostrar al finizalizar una cuenta regresiva, además que no cerraba al darle click en cerrar
Los botonos para controlar cada cronometro iniciado vibraban
Las cajas aumentaban de tamaño aun sin que se hubiera iniciado un cronometro
Parpadeaban los botones al finalizar una cuenta regresiva

# Refinamientos aplicados

- Fue necesario aplicar que el modal permanezca cerrado al cargar la pagina.
- Fue necesario ajustar la función de cierre del modal.
- Ajustes funcionales y visuales.

# Prompt final (también colócalo en el comentario del Pull Request)

```md
# Role:

Actua como experto como fullstack en programación y generación de código. Para la parte visual actua como experto en diseño grafico.

# Tech Stack:

- Javascript para la parte funcional

- HTML

- CSS

# Meta:

Debo implementar un cronometro el cual tenga las sigueintes funcionalidades:

- Cronómetro hacia adelante

- Cronometro de cuenta regresiva

# Consideraciones funcionales:

Tener en cuenta las siguientes reglas e implementarlas:

- Se deben ver ambos cronometros para ser inicialzados en la misma pantalla pero separados uno del otro.

- Ambos cronometros prodrán ser inicializados cuantas veces se quiera. Cada iniciación se debe agregar en una lista visual debajo del boton iniciador, de manera enumerada, indicando y/o actualizandose en cada milisegundo que va transcurriendo. Cada registro tendra botonos para pausar, continuar y eliminar registro

- Cuando una cuenta regresiva termine al llegar a 00:00:00.00, se debe mostrar una alerta tipo modal reproduciendo un sonido y con un boton de cerrar. En caso de que multiples cuentas regresivas terminen y el modal o alerta esté mostrandose, se debe agregar en la misma alerta el numero de la cuenta regresiva que termino con un botón de finalizar. El sonido solo se debe quitar cuando se de click en el boton de cerrar. No se deben reproducir multiples sonidos si se finalizan multilples cuentas regresivas.

- Genera archivos por separado de index.html, script.js y style.css

- Ten en cuenta buenas practicas de programación, estructura de código y principios SOLID.

- Genera un readme que describa la funcionalidad

# Consideraciones visules

- Para los botones de pausar y continuar, usar iconos

- Cuanto la cuenta regresiva falten 10 segundos, este registro debe comenzar a parpadear y poner el timer en el registro en rojo

- Implementar diseño responsive

- Usar una paleta de colores que de una sensacion plecentera sin colores fuertes y brillates.

- Implementar modo dark

- Ten en cuenta la imagen para implementar el diseño pero que no quede igual ya que se requeire es que los 2 cronometros esten visibles.

Si consideras que algo más falta por especificar, realizame preguntas con el fin de enriquecer o contextualizar más
```

# Breve explicación de por qué el último prompt funcionó mejor

Los ajustes y afectaciones fueron mínimos.
