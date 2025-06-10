# Historial de Prompts - StopWatch MAMR

## LLM: Claude 4 Sonnet

Este documento contiene todos los prompts proporcionados durante el desarrollo de la aplicación StopWatch MAMR.

## Prompt #1 - Solicitud Inicial de Desarrollo

**Como frontend senior de clase mundial, experto en html, javascript y css Crea una aplicación web completa de cronómetro y temporizador llamada "StopWatch MAMR" con las siguientes especificaciones:**

### Funcionalidades Core:

1. **Cronómetro (Stopwatch)**:

   - Mostrar tiempo transcurrido (HH:MM:SS.MS)
   - Botones: Iniciar, Pausar, Reiniciar
   - Función de "Lap" para marcar tiempos intermedios

2. **Temporizador de Cuenta Atrás**:

   - Configuración de tiempo personalizada (horas, minutos, segundos)
   - Visualización en tiempo real del tiempo restante
   - Alerta visual y sonora al finalizar
   - Auto-reinicio opcional

3. **Gestión Múltiple**:
   - Crear múltiples cronómetros/temporizadores simultáneos
   - Cada uno con nombre personalizable
   - Vista de panel con todos los timers activos
   - Eliminar timers individualmente

### Especificaciones Técnicas:

- **Stack**: HTML5, JavaScript vanilla, Tailwind CSS
- **Responsivo**: Funcional en desktop y móvil
- **Sin dependencias externas** (excepto Tailwind CDN)
- **Almacenamiento**: Solo en memoria (sin localStorage)

### Diseño y UX:

- **Interfaz limpia y minimalista**
- **Botones grandes y accesibles** para fácil interacción
- **Colores distintivos** para diferentes estados (activo, pausado, alerta)
- **Animaciones suaves** en transiciones
- **Tipografía clara** para los números del tiempo

### Características Específicas:

- **Sonido de alerta** cuando termine la cuenta atrás
- **Notificación visual** (parpadeo o cambio de color)
- **Precisión de milisegundos** en el cronómetro
- **Controles intuitivos** con iconos reconocibles
- **Historial de laps** en el cronómetro

### Estructura de la Aplicación:

```
- Header: Título y navegación entre modos
- Panel Principal: Vista de todos los timers activos
- Controles: Botones de acción principales
- Configuración: Ajustes de sonido y preferencias
- Footer: Información adicional
```

---

## Prompt #2 - Reporte de Bug en Controles

**Al dar click en los botones de pausa y reset, no funcionan hasta que se termina el timer o counter, analiza a detalle y ayudame a resolverlo**

---

## Prompt #3 - Problema de Performance

**el problema persiste tal vez debas usar performance o alguna otra forma que no bloquee el hilo del usuairo**

---
