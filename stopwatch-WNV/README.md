# ⏱ Multi Timer Web App

Una aplicación web responsive para gestionar múltiples temporizadores independientes en modo **cronómetro (stopwatch)** o **cuenta regresiva (countdown)**.

## 🧠 Descripción

Este proyecto permite a los usuarios crear y controlar múltiples timers que pueden operar como cronómetros o cuentas regresivas. Está desarrollado con **JavaScript moderno (ES Modules)**, sigue principios de **arquitectura SOLID**, y aplica **Test Driven Development (TDD)** con **Jest**.

## 🚀 Características

- ✅ Múltiples temporizadores independientes
- ⏱ Modos: **Stopwatch** (por defecto) y **Countdown**
- ▶️ Funciones por temporizador: iniciar, pausar, resetear y eliminar
- 🔔 Notificaciones del navegador y alertas de sonido al terminar un countdown
- 🧪 Tests unitarios con Jest (con Babel)
- 🎨 Estilo CSS plano, estructurado y responsivo (mobile-first)
- 🧩 Accesibilidad básica: ARIA y uso de roles
- 🛠 Código modular usando ES Modules

## 🧪 Testing

Este proyecto sigue el enfoque de **TDD** desde la base. Los tests cubren:

- Lógica del temporizador (`stopwatch`, `countdown`)
- Formateo del tiempo (`hh:mm:ss`)
- Manejo de finalización (onFinish callback)
- Simulación de notificaciones (`Notification`)
- Reseteo y pausa

### 🔧 Ejecutar tests

```bash
npm install
npm test



---

### 📌 6. Cómo usar

```markdown
## 🧭 Cómo usar

1. Clona el repositorio y abre con servidor local:

```bash
npx serve
# o
npx http-server



---

### 📌 7. Notas adicionales

```markdown
## 🔔 Notas adicionales

- El sonido se carga desde `alert.mp3`. Puedes reemplazarlo con otro archivo.
- Las notificaciones requieren permisos del navegador.
- Usa `setInterval` para actualizar cada display por separado.
