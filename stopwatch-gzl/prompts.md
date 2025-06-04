Prompt 1:

Rol
Eres un experto en desarrollo frontend nativo con HTML, CSS y JS

Objetivo
Construir un cronometro y una cuenta regresiva usando solo HTML, CSS y JS nativo, has que la pagina sea responsive y se adapte a las imagenes adjuntas

Instrucciones
Construye una pagina incial donde permita seleccionar si una cuenta regresiva o un cronometro debes adaparte al diseño que te envio, este diseño se muestra como una flecha hacia arriba (cronometro) y una flecha hacia abajo (cuenta regresiva)
Al seleccionar "Stopwatch" deberas colocar 2 botones como se muestran en la imagen siguiendo el mismo diseño. Al dar click en "Start" inicia la cuenta, al dar click en "Clear", limpia y reinicia la cuenta, debe volver a dar click en "Start" para que se inicie
Al seleccionar "Countdown" deberas mostrar una interfaz como te muestro en la imagen siguiendo el mismo diseño. En este se muestra unos botones para seleccionar los numeros del 0 a 9. Ademas 2 botones de "Set" y "Clear", debes permitir que el usuario pueda digitar con el teclado los numeros.
Funcionamiento de los botones:
a. "Set": Al dar click, confirma los numeros que eligio el usuario usando las interfaz grafica o su propio teclado, este redirige a una pagina con el mismo diseño de "Stopwatch" donde se muestra en la pantalla el tiempo, y los botones de "Start" y "Clear", pero al dar click en "Start" este retrocede la cuenta, como es lo previsto, el "Clear" tiene el mismo comportamiento
b. "Clear": Al dar click, solo limpia lo que eligio el usuario usando las interfaz grafica o su propio teclado
Ambas pantallas "Stopwatch" y "Countdown", tienen un boton de "back" para retroceder para intercambiar entre los 2
Has una pagina responsive adaptable a cualquier dispositivo
Usa el HTML y JS que te adjunto, y crea un CSS para los estilos
Prohibiciones
No uses ningun framework de JS, solo usa HTML, CSS y JS nativo
No crees tu propio diseño usa lo que te envio en las imagenes adjuntas
No crees funcionalidades extras que no te he detallado en las instrucciones
No cometas errores, y sigue al pie de la letra todo lo que te digo

Prompt 2:

Ok esto funciona muy bien pero te dejare unas correcciones importantes:

NO estas siguiendo el diseño que te di en la imagenes
Al dar click en "back" deberia regresar como lo hace ahora, pero tambien limpiar y reiniciar la cuenta
El boton de "Clear" que esta al lado de "Start" en la opcion de "Countdown", ddeberia reiniciar con el valor seteado por el usuario es decir si eligio 10 min deberia resetear a los 10 min, actualmente lo deja en 0
Cuando coloco 5:55 en countdown y dar click en Set me muestra 55:05
Actualmente cuando defino un tiempo en countdown, se completa por hora, minuto y segundo, pero yo quiero que primero se complete, los segundos, minutos y despues horas
Analiza las imagenes que te doy para el diseño, y hazlas tal cual

Otros:
Hubo algunas mas iteracciones mas enfocadas al diseño pero las perdi de vista, porque me concentre en eso.

Resultados parciales con errores o fallos detectados
Sobre la parte funcional, no hubo mucha complicacion, el problema fue en el diseño, sobretodo en la pagina incial para diujar los iconos, las pantallas de countdown y stopwatch si lo hizo bien a la primera

Refinamientos aplicados
Hubo varios refinamientos mas enfocados en el HTML y CSS

Prompt final (también colócalo en el comentario del Pull Request)
Tambien tienes que redondear las puntas, solo estas redondeando las esquinas

Breve explicación de por qué el último prompt funcionó mejor
El ultimo prompt solo fue para afinar el diseño de los iconos del home
