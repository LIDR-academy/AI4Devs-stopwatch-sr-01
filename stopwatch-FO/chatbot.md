# 🤖 Interacción con el Chatbot

## ¿Qué chatbot(s) usaste?

Usé **ChatGPT modelo 4o** para generar tanto el prompt como el código HTML y JavaScript del ejercicio.

---

## ¿Qué problemas encontraste al interactuar con el modelo?

- **No cumplió correctamente con las funcionalidades extra de notificación y sonido**, a pesar de que le indiqué que verificara la disponibilidad del sonido en internet. La IA asumió que podía usar un archivo sin confirmar si existía, lo cual generó errores.
- **Tuve que indicarle manualmente que mostrara el código completo de cada archivo**, ya que en varias ocasiones dividía el contenido o no lo entregaba todo junto.
---

## ¿Qué decisiones tuviste que tomar tú como desarrollador para mejorar el código propuesto?

- Indiqué que debía **generar un menú inicial** para seleccionar entre cronómetro o cuenta regresiva, en lugar de mostrar ambas herramientas directamente al cargar la página.
- Aclaré que no debía permitir añadir múltiples cronómetros o cuentas regresivas, para simplificar la lógica, en un primer momento.
- Especificando mejor los flujos de navegación y el comportamiento de cada componente, logré que el resultado se ajustara más fielmente a la referencia (https://www.online-stopwatch.com/).

---

## ¿Qué tipo de intervenciones manuales realizaste como desarrollador para mejorar la eficiencia del proceso?

- Durante la conversación con ChatGPT, **adjunté los archivos de referencia (README.md e imagen)** para facilitar que la IA entendiera el contexto y replicara la estructura.
- No realicé modificaciones directas en el código generado, pero **tuve que intervenir en el diseño del prompt y en la iteración de instrucciones** para asegurarme de que el resultado cumpliera con todos los requisitos visuales y funcionales.

---

## ¿Cómo evaluarías la utilidad de este flujo de trabajo real?

Considero que el flujo de trabajo fue **útil**, especialmente para generar una base funcional rápida del ejercicio. Sin embargo, su utilidad es **inferior a un flujo en VS Code o Cursor**, donde podría haberse iterado y probado todo de forma más fluida y sin necesidad de ir solicitando el código por partes o corrigiendo detalles básicos de experiencia de usuario.