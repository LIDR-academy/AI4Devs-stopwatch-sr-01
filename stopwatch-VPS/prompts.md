## Estrategia - Meta-prompting

Para arrancar esta tarea he decidido empezar con una estrategia de prompting comentada en la última sesión, el metaprompting. Lo he aplicado adjuntandole la foto y siendo claro con los roles que tiene que seguir y cual es el objetivo.

### Primer prompt
Eres un prompt engineer profesional, has de escribirle un prompt a una IA generativa de código para crear una aplicación de un cronómetro, te adjunto una imagen de ejemplo la cual también se la adjuntaré a la IA a la cual le vas a escribir el prompt. Quiero que en tu prompt se incluya el hecho de que necesito un index.html y un script.js.

### Segundo prompt (resultado del primero)

Quiero que generes una aplicación web funcional con la siguiente estructura y características. Esta aplicación tendrá dos funcionalidades principales: un cronómetro y un temporizador regresivo, ambas basadas en las interfaces visuales que te adjunto como referencia.

🗂 Archivos requeridos:
index.html

script.js

🔘 Interfaz principal (pantalla de inicio)
Al cargar la aplicación, se debe mostrar una pantalla de menú con dos botones grandes:

Cronómetro

Temporizador

Al hacer clic en uno de los botones, se debe cargar la interfaz correspondiente.

En ambas vistas funcionales (cronómetro y temporizador) debe haber un botón para volver al menú principal.

⏱ Funcionalidad 1: Cronómetro
Basado en la primera imagen adjunta.

Debe mostrar el tiempo transcurrido en formato HH:MM:SS:MS.

Botón verde: Start para iniciar/pausar.

Botón rojo: Clear para reiniciar a cero.

El diseño debe replicar el estilo visual: colores, tipografía grande y bordes redondeados.

⌛ Funcionalidad 2: Temporizador regresivo
Basado en la segunda imagen adjunta.

Debe mostrar el tiempo restante en formato HH:MM:SS:MS.

Debe permitir ingresar el tiempo deseado usando un teclado numérico visual (como en la imagen).

Botón Set para configurar el tiempo ingresado.

Botón Start para comenzar la cuenta atrás.

Botón Clear para borrar el tiempo ingresado.

Estética y colores similares a la imagen: botones verdes, botón Clear en gris, y fuente grande.

💡 Consideraciones técnicas:
Usa HTML para la estructura básica (index.html).

Usa JavaScript puro (script.js) para toda la lógica del cronómetro y temporizador.

Usa setInterval() para el control del tiempo.

El diseño puede usar CSS embebido en el HTML o por separado, pero enfócate en replicar visualmente las imágenes proporcionadas.

Asegúrate de que todas las transiciones entre vistas (menú ↔ cronómetro / temporizador) sean suaves y no recarguen la página.

🖼 Archivos de referencia
Te adjunto dos imágenes como guía visual:

imagen_1.png: interfaz del cronómetro.

imagen_2.png: interfaz del temporizador regresivo.

#####  Notas:
El segundo prompt ha sido prácticamente perfecto y me ha generado lo que quería casi a la primera, solo falta poder pausar la cuenta regresiva. A partir de aquí el metaprompting ya no es tan necesario por lo que hablaré directamente con mis propios prompts.

### Tercer prompt 

El código que me has pasado es justo lo que necesito, por lo que a partir de ahora cualquier modificación que te solicite lo haremos en base a este código. Mi primera petición es que modifiques el temporizador regresivo para que una vez haya empezado la cuenta atrás el botón de Start se convierta en Pause y te permita pausar la cuenta atrás al pulsarlo. Como es lógico, el botón de Pause se cambiará por Start una vez se haya pausado.

### Cuarto prompt

Ahora vas a añadir una funcionalidad para poder tener varios cronómetros y temporizadores simultáneos en pantalla. Quiero un botón para poder añadir un cronómetro o un temporizador (depende de la pantalla en la que esté el usuario) Cada uno de los cronómetros y temporizadores tendrá un botón para eliminarlo, pero como mínimo siempre tendrá que haber uno en pantalla, por lo que esa opción de eliminar no tiene que aparecer si solo queda uno. Por último vamos a añadir que si uno de los temporizadores acaba la cuenta atrás se mostrará una alerta por pantalla y se reproducirá un sonido de alerta. 


### Única modificación hecha por mi:
El chatbot ha colocado el sonido de alerta después de lanzar el alert(), por lo que el sonido no se reproducia hasta que se cerraba la alerta. Como el cambio símplemente era subir una linea arriba el sonido de alerta he considerado que lo podia cambiar yo mismo.