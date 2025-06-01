# Prompt inicial
aqui le compartimos la imagen como contexto
# rol
eres un experto desarrollador web

# criterios a usar
- separa el codigo html y javascript en index.html y scripts.js
- crea el proyecto implementando material design
- el proyecto debe ser responsivo
- agrega un diseño atractivo pero no muy lejano al diseño de la imagen que te comparti
- mantengamos la distribucion de los botones como se observa en la imagen
- crea una interfaz donde el usuario agrege un nuevo cronometro con un maximo de 5 cronometros
- muestra los cronometros en tarjetas como cuadriculas

# funcionalidad
- Diseña un componente de stopwatch (cronómetro) que tenga las siguientes funcionalidades:
	1.	Iniciar, pausar y reiniciar el cronometro.
	2.	Mostrar una alerta visual (como un snackbar) y reproducir un sonido al finalizar.
	3.	Soportar múltiples cronómetros activos simultáneamente.

El código debe estar bien estructurado, escalable y fácil de mantener, antes de que empices a crear componentes y funciones preguntame cualquier duda que tengas y solo empieza a crear cuando te lo indique

aqui me realizo las siguientes preguntas
Preguntas antes de iniciar
	1.	¿Quieres que el tiempo de cada cronómetro se configure manualmente (como en la imagen: 8 minutos) o todos deben iniciar con un valor fijo?
	2.	¿El botón “Clear” debe reiniciar a cero o también eliminar el cronómetro de la vista?
	3.	¿Tienes preferencia por alguna biblioteca específica de Material Design? ¿Materialize CSS, Google MDC, u otra?
	4.	¿El sonido de alerta lo proveerás tú o quieres que use un tono genérico?
	5.	¿El cronómetro debe ser de cuenta regresiva (como en la imagen) o de cuenta hacia adelante como un cronómetro tradicional?

# Segundo Prompt
    1- los cronometros deben ser configuarables manualmente
    2- el boton clear debe reinicar a cero
    3- implementa materialze css
    4- usa un tono generico
    5- el cronometro debe ser cuenta regresiva

aqui me pregunta lo siguiente 
¿Quieres que incluya también un archivo styles.css para pequeños ajustes visuales sobre Materialize (como bordes redondeados o colores personalizados similares a la imagen que compartiste), o prefieres mantener todo solo con Materialize + estilos inline mínimos?

# Tercer Prompt
si incluye el archivo styles.css
aqui no me mostro los archivos pero me indico que ya estaban creados
# Cuarto Prompt
muestrame los archovs, adicional al configurar el cronometro solo permite selccionar horas, minutos, y segundos pero en todo puede ser seleccionado individualmente en este caso lo mas bajo que podemos seleccionar es 1:00:00 lo cual es demaciado para un cronometro
# Quinto Prompt
ahora todo esta en orden con excepcion del sonido este no se reproduce ya que en el console log indica que la ruta esta prohibida
# Sexto Prompt
a los cronometros agregales un icono de eliminar para eliminarlos del dom
