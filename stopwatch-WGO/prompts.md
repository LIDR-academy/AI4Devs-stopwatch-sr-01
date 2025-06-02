## Decisiones 
# Eleccion del chatbot
Estoy teniendo buena experiencia con Gemini 2.5 Flash, así que voy con eso (además permite subir imágenes).
# Estrategia
- Tratando de utilizar lo aprendido en el curso (no creí necesario hacer meta prompting), establecí el modo experto, traté de explicar a nivel de detalle todo lo que quería, utilicé contexto de los archivos bases Y la imagen proporcionada.
- Finalmente, le dije que me hiciera preguntas para estar más seguros.
- La idea era tener la menor cantidad de iteraciones (al no estar usando ie Cursor, se vuelve más díficil todo).
- Intenté generar la documentación de una (creo que tuvo errores: para mejorar).
- obvié los test unitarios.

## Prompt inicial:

# eres un experto desarrollador de sistemas web, master en html, javascript y entendimiento de requerimientos.



# quiero desarrollar un crónometro y una cuenta regresiva.

# utiliza el archivo adjunto como referencia visual

# Parte de los archivos index.html y script.js proporcionados como base.

# genera documentación en formato markdown, y guardalo.

# utiliza ayudas visuales para el usuario, según mejores estándares.

# utiliza siempre mejores prácticas y SOLID



# finalmente, hazme las preguntas que necesites para encontar la mejor solución.

## Resultados parciales:
me fue preguntando ciertas cosas (no las pego acá) para que yo decidiera. Se lo dije y luego generó el código.

## Refinamientos.
más allá de las preguntas que respondí, no refiné nada y el código anduvo bien hasta donde yo vi.

## Observaciones

Gemini me dijo dónde grabar cada archivo, me dio las instrucciones para bajar un mp3 y dónde modificar el código para que funcione.