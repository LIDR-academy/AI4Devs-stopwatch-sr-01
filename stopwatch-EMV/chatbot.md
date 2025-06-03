# chatbot.md

## 🤖 ¿Qué chatbot(s) usaste?

Utilicé ChatGPT-4 para desarrollar y refinar el proyecto. Fue el modelo principal en todas las etapas: diseño del código, depuración, estilo visual y construcción de prompts.

---

## ⚠️ ¿Qué problemas encontraste al interactuar con el modelo?

- En ocasiones el modelo proponía código que funcionaba, pero era visualmente básico.
- El modelo asumía que el input del usuario ya estaba validado, lo cual causaba fallos si no se ingresaban bien los minutos.
- Hubo intentos de reproducir sonido, pero por políticas del navegador (autoplay) no siempre funcionaban.
- A veces sugería soluciones más avanzadas de lo necesario para el ejercicio (por ejemplo, manejar milisegundos reales con `performance.now()`).

---

## 🧠 ¿Qué decisiones tomaste tú como desarrollador?

- Decidí mantener los milisegundos como un componente decorativo (000) en lugar de implementar lógica real, por simplicidad.
- Ajusté el código del input manualmente para asegurar que el valor se leyera correctamente incluso si no se presionaba "Enter".
- Mejoré el estilo visual adaptándolo manualmente a la imagen de referencia.
- Priorizamos funcionalidad clara y robusta sobre complejidad innecesaria.

---

## 📈 ¿Cómo evaluarías la utilidad de este flujo de trabajo real?

Fue muy útil. Permite avanzar más rápido, especialmente en tareas repetitivas o de estructura inicial. La IA ayudó a encontrar errores y probar enfoques rápidamente.

Sin embargo, sigue siendo necesario tener criterio propio como desarrollador para validar, simplificar o ajustar lo que propone la IA. No todo lo que genera es óptimo o aplicable directamente.

---

## ⚠️ En definitiva tuve problemas con la generación del pitido, no logré escucharlo.