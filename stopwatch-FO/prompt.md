# 🧠 Estrategia de Prompting y Iteración

## Prompt inicial con justificación

Para resolver este ejercicio, utilicé una **estrategia de metaprompting**, combinada con **Q&A prompting**. Es decir, el primer prompt no solicitaba directamente la resolución del ejercicio, sino que pedía a la IA generar **el mejor prompt posible** para que posteriormente otra IA resolviera el ejercicio con la máxima calidad posible.

Esta aproximación me permitía:

- Obtener un **prompt optimizado**, bien estructurado y alineado con los objetivos del ejercicio.
- Incluir instrucciones claras sobre aspectos técnicos, visuales y funcionales.
- Delegar a la IA la formulación de **preguntas clave** para cerrar los detalles antes de generar el prompt definitivo.

Mi prompt inicial fue el siguiente:

> Eres un experto en la creación de prompts y voy a encargarte que me hagas el mejor prompt posible para dártelo en otra conversación de chatGPT 4o y que realices lo mejor posible la tarea. Hazme las preguntas que consideres para generar el mejor prompt.  
>  
> Te explico lo que tengo que conseguir:  
> Estoy haciendo un ejercicio para un curso, nos proporcionan un repositorio de github el cual contiene un readme con la explicación, te lo adjunto (README.md), también proporcionan una imagen de referencia que adjuntaré al prompt que me proporciones. Si tengo que facilitar algún otro archivo indícalo en el prompt y yo lo añadiré.  
>  
> No quiero que el prompt se limite a solicitar de manera eficiente lo que se requiere en el ejercicio, sino que además este prompt debe solicitar una mejora visual y funcional sobre el ejercicio.

La IA me respondió con un conjunto de preguntas para afinar el contexto (diseño, nivel técnico, compatibilidad móvil, etc.), lo cual permitió adaptar el prompt con precisión a los objetivos del ejercicio.

---

## Resultados parciales con errores o fallos detectados

El primer resultado funcional que generó la IA cumplía con casi todos los requisitos:

- Incluía el cronómetro y cuenta regresiva.
- Añadía marcas de tiempo ("laps").
- Tenía diseño responsive y sonido online.
- Código limpio y dividido en `index.html` y `script.js`.

Sin embargo, se detectaron **varios fallos importantes**:

1. No se respetaba la estructura de navegación de la web de referencia (`https://www.online-stopwatch.com/`), donde debía existir un **menú inicial** y la posibilidad de volver atrás.
2. La **función de añadir marcas de tiempo (laps)** no funcionaba correctamente o no estaba bien integrada.
3. Hubo comportamientos inesperados al gestionar varias funciones al mismo tiempo (cronómetro y cuenta regresiva), incluso aunque estuvieran en tarjetas distintas.

---

## Refinamientos aplicados

Para resolver estos problemas, realicé varios **refinamientos progresivos**:

- Solicité a la IA que añadiera un **menú inicial** para elegir entre cronómetro o cuenta regresiva, y un **botón de retorno** a dicho menú.
- Pedí que se corrigiera la implementación de la función **"laps"** para que los tiempos intermedios se registraran correctamente y en orden.
- Aclaré que **no era necesario permitir la creación de múltiples cronómetros/cuentas** ni el guardado de datos.

Más adelante, decidí **intentar añadir múltiples funciones simultáneas (cronómetro y cuenta regresiva en tarjetas separadas)** y se implementó **sin mayores problemas**.

Sin embargo, al añadir las funcionalidades de **notificación visual** y **sonido al finalizar la cuenta atrás**, surgieron nuevas dificultades:

- En algunos navegadores no se mostraba correctamente la notificación sin interacción previa del usuario.
- El sonido no siempre se reproducía, especialmente en dispositivos móviles, por restricciones de autoplay de audio sin interacción.
- Fue necesario indicar el uso de **recursos de sonido gratuitos online verificados** y garantizar que se gestionaran correctamente dentro del flujo de la cuenta atrás.

Estos puntos obligaron a realizar ajustes adicionales en el prompt y en la estructura del código, refinando la forma en que se activaban los eventos y cómo se manejaban las condiciones de reproducción y visualización.

---

## Prompt final (incluido también en el comentario del Pull Request)

```markdown
Estás a punto de ayudarme a resolver un ejercicio práctico de desarrollo web. Te daré todos los recursos necesarios y te pido una solución completa, funcional, y mejorada en aspectos visuales y funcionales. El proyecto debe ser desarrollado exclusivamente con **HTML** y **JavaScript puro** (sin frameworks).

### 🎯 Objetivo del ejercicio

Crear una página web que contenga:
- Un **cronómetro** con las funciones: iniciar, pausar, reiniciar y **añadir marcas de tiempo** ("laps").
- Una **cuenta regresiva** que permita definir un tiempo personalizado y al finalizar:
  - Muestre una **notificación visual**
  - Reproduzca un **sonido de alerta**
- Debe permitir **cronómetro y cuenta regresiva en tarjetas diferentes**, **no deben poder añadirse más instancias**.

### 🧭 Navegación

- Al cargar la web debe mostrarse un **menú de selección** con dos botones: “Cronómetro” y “Cuenta regresiva”.
- Al seleccionar uno, se accede a la herramienta correspondiente.
- Dentro de cada herramienta debe haber un **botón para volver al menú**.

### 🎨 Requisitos de diseño

- La estructura debe ser **fiel a la referencia visual** (te adjunto una imagen `stopwatch.png` en el prompt).
- Aplica un diseño **más moderno, minimalista y profesional**.
- Que funcione correctamente tanto en escritorio como en **dispositivos móviles**.
- No es necesario que sea accesible para lectores de pantalla.

### 💡 Mejora funcional requerida

- El cronómetro debe permitir al usuario **marcar tiempos intermedios ("laps")**, listados en orden.
- El sonido debe reproducirse al finalizar la cuenta atrás. Puedes usar recursos online gratuitos (por ejemplo, `notificationsounds.com`).

### 📦 Estructura esperada del resultado

El código debe estar dividido en:
- `index.html`
- `script.js`

No necesitas incluir CSS externo. Puedes usar `style` embebido si lo ves necesario, pero prioriza la limpieza del código.

### 📁 Recursos adicionales

- Te adjunto una imagen llamada `stopwatch.png` como referencia de estructura.
- Adjunto también la **plantilla inicial del HTML**.
- Usa como ejemplo la página: https://www.online-stopwatch.com/

### ✅ Resultado esperado

Devuélveme el código completo en bloques separados para `index.html` y `script.js`, asegurándote de que:

- Todo funcione correctamente desde el navegador.
- El flujo de navegación sea fiel al de la web de referencia.
- Las funcionalidades estén correctamente implementadas.
- El diseño sea limpio y profesional.

Hazme las preguntas que necesites antes de realizar la tarea.

**Se adjuntaron la imagen de referencia y el index.html