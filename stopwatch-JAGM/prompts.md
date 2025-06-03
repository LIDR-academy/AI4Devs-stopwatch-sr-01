## Prompt inicial:

Eres un experto desarrollador de software, con experiencia en proyectos con Javascript Vanilla, HTML y CSS. Dada la tarea:

Desarrolla **un cronómetro** y **una cuenta regresiva**. Utiliza 🔗 [Online Stopwatch](https://www.online-stopwatch.com/) y la imagen proporcionada como guía de diseño. Al finalizar una cuenta regresiva, **muestra una notificación** y **reproduce un sonido de alerta**. Permite **crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente**.

El código generado debe estar en 2 ficheros. Un fichero llamado index.html con los estilos CSS y un fichero llamado script.js con el código JavaScript Vanilla.

Define y describe los pasos a dar en un orden lógico que me permita ir verificando que los avances funcionan. No programes nada aún. Cuando te confirme que todo está OK, puedes comenzar con el código del primer paso, y solo avanzarás cuando te confirme de nuevo, así sucesivamente hasta el final.

Hazme todas las preguntas que consideres necesarias para realizar tu trabajo adecuadamente.

---

### Estrategias:

- **One-shot prompting:** Incluyo el ejemplo proporcionado de la url
- **Rol:** Experto desarrollador de software, con experiencia en proyectos con Javascript Vanilla, HTML y CSS.
- **Contexto:** Imagen y url proporcionada
- **Instrucción:** Desarrolla **un cronómetro** y **una cuenta regresiva**. Al finalizar una cuenta regresiva, **muestra una notificación** y **reproduce un sonido de alerta**. Permite **crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente**.
- **Salida esperada:** El código generado debe estar en 2 ficheros. Un fichero llamado index.html con los estilos CSS y un fichero llamado script.js con el código JavaScript Vanilla.
- **División en subtareas:** He considerado que la tarea es compleja como para obtenerla correctamente en un único prompt, por eso le pido que la divida en subtareas.
- **Resolver dudas:** Estoy seguro de que se me escapa algún detalle así que prefiero resolver cualquier cosa que no esté clara.

---

### Preguntas de la IA:

---

**P:**
Gestión múltiple: ¿Cuántos cronómetros/cuentas regresivas simultáneas como máximo deberías poder manejar? ¿Hay un límite práctico?

**R:**
Como máximo 3 cronómetros/cuentas regresivas simultáneas.

---

**P:**
Interfaz de múltiples timers: ¿Prefieres que se muestren todos en una sola pantalla (como pestañas o lista) o cada uno en su propia "tarjeta/panel"?

**R:**
Todos en una sola pantalla, como pestañas.

---

**P:**
Configuración de cuenta regresiva: ¿Cómo quieres configurar el tiempo inicial? ¿Campos separados para horas:minutos:segundos o algún formato específico?

**R:**
Horas minutos y segundos.

---

**P:**
Persistencia: ¿Los timers deben mantenerse si se recarga la página o pueden perderse?

**R:**
Los timers deben mantenerse

---

**P:**
Etiquetas/nombres: ¿Cada cronómetro/cuenta regresiva debería tener un nombre personalizable?

**R:**
Sí.

---

**P:**
Estilo visual: Veo que la imagen muestra un diseño minimalista. ¿Quieres mantener exactamente ese estilo o puedo hacer variaciones modernas?

**R:**
Mantén el estilo.

---

**P:**
Responsive: ¿Debe funcionar bien en móviles y tablets?

**R:**
No es prioritario.

---

**P:**
Tipo de sonido: ¿Tienes preferencia por algún tipo de sonido específico (beep, campana, etc.) o genero uno simple?

**R:**
Sonido tipo campana

---

**P:**
Notificaciones del navegador: ¿Además del sonido, quieres notificaciones del sistema del navegador?

**R:**
Sí

---

**P:**
Control de volumen: ¿Necesitas controles para ajustar o silenciar el sonido?

**R:**
Solo para silenciar.

---

### Prompt con mejoras tras la ejecución del paso 1:

Antes de pasar al paso 2 modifica lo siguiente:

El botón de sonido bloquea la visión del título de la tercera pestaña. Mueve el botón de sonido a la hilera de botones Start/Pause/Reset/Clear. Modifica el estilo del botón para integrarlo visualmente

---

### Prompt con mejoras tras la ejecución del paso 2:

Una pregunta: En qué se diferencian los botones Reset y Clear?

Y algunas mejoras:

- Separa el código como te he indicado en la primera instrucción. Un fichero para el código html y los estilos css llamado index.html y un fichero para el código javascript llamada script.js.
- Para el cronómetro utiliza el formato minutos:segundos:centésimas de segundo
- Cuando paso del cronometro a las cuenta regresiva el contador debería resetearse a cero. Cómo puedes ver la imagen proporcionada esto no ocurre.

**_\*No he podido ejecutar este prompt. Adjunto la foto `length_limit.png` con la captura del mensaje en Claude_**

---

## Refinamientos

- **No usar la division en subtareas:** Creo que ha sido este el problema de que haya alcanzado el límite
- **Seguir usando la resolución de dudas:** Creo que esto es acertado
- **Añadir más contexto tras las preguntas de la primera interacción**
- **Uso de buenas prácticas**
- **Ser más específico en la estructura de archivos**

---

## Prompt final

Eres un experto desarrollador de software, con experiencia en proyectos con **JavaScript Vanilla**, **HTML** y **CSS**.  
Dada la tarea:

1. Desarrolla **un cronómetro** y **una cuenta regresiva**.

2. Utiliza 🔗 [Online Stopwatch](https://www.online-stopwatch.com/) y la imagen proporcionada como guía de diseño.  
   Al finalizar una cuenta regresiva:

   - **Muestra una notificación**
   - **Reproduce un sonido de alerta**

3. Permite **crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente**.

   - 3.1 Como máximo **3 cronómetros/cuentas regresivas simultáneas**
   - 3.2 Muestra todos en una sola pantalla, como **pestañas**

4. Formato:

   - 4.1 Formato cuenta regresiva: `HH:MM:SS`
   - 4.2 Formato cronómetro: `MM:SS:centésimas`

5. Botones:

   - 5.1 Botón **start**
   - 5.2 Botón **pause**
   - 5.3 Botón **restart**
   - 5.4 Botón **reset**
   - 5.5 Botón **sonido/silencio**

6. Utiliza **buenas prácticas**

---

### Estructura de Archivos

El código generado debe estar en **2 ficheros**:

1. `index.html`: Contiene el código HTML y CSS
2. `script.js`: Contiene el código JavaScript Vanilla

---

Hazme todas las preguntas que consideres necesarias para realizar tu trabajo adecuadamente.

---

### Preguntas de la IA:

---

**P:**
**Entrada de tiempo para cuenta regresiva**: ¿Cómo quieres que el usuario ingrese el tiempo inicial? ¿Campos separados para horas, minutos y segundos, o un solo campo con formato HH:MM:SS?

**R:**
Un solo campo HH:MM:SS

---

**P:**
**Persistencia**: ¿Los cronómetros deben mantener su estado si el usuario recarga la página, o pueden reiniciarse?

**R:**
Sí

---

**P:**
**Nombres de pestañas**: ¿Las pestañas deben tener nombres personalizables (ej: "Ejercicio", "Cocina") o simplemente "Timer 1", "Timer 2", etc.?

**R:**
Sí

---

**P:**
**Botón restart vs reset**:

- ¿"Restart" reinicia desde el tiempo inicial configurado?
- ¿"Reset" pone todo en 00:00:00?

**R:**
No. Restart continúa el cronómetro o cuenta regresiva cuando han sido pausados. Reset pone el cronómetro a cero y la cuenta regresiva al tiempo introducido inicialmente.

---

**P:**
**Sonido**: ¿Prefieres un sonido específico (beep, alarma) o cualquier sonido de alerta está bien?

**R:**
Un sonido tipo beep.

---

**P:**
**Estilo visual**: Veo que mencionas Online Stopwatch como referencia. ¿Prefieres un diseño minimalista similar a la imagen (fondo claro, botones grandes) o algo más moderno?

**R:**
Utiliza la imagen como referencia para los estilos

---

**P:**
**Responsive**: ¿Necesitas que funcione bien en móviles o solo en desktop?

**R:**
Responsive no es una prioridad

---

**P:**
**Notificaciones**: ¿Te refieres a notificaciones del navegador o simplemente una alerta visual en la página?

**R:**
Notificaciones del navegador

---

### Refinamientos:

Buen trabajo. Solo he encontrado un problema. Aunque el botón "Pause" aparece tanto para los cronómetros como para las cuentas regresivas, en ambos casos el botón está deshabilitado y no se puede clickar.

**_\*Este prompt no arregló el problema por lo que decidí modificarlo yo mismo._**

## Conclusión

Creo que el prompt final ha funcionado mejor por que ha sido mucho más detallado. También considero que en este caso evitar división en subtareas ha sido un acierto.
