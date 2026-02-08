# Creador de Horarios Universitarios

Una aplicación web moderna construida con React, TypeScript y Tailwind CSS para gestionar y visualizar horarios universitarios. Permite crear cursos con múltiples sesiones, detectar conflictos de horario automáticamente y exportar tu horario a PDF.

## Características

*   **Gestión de Cursos:** Agrega cursos con detalles completos (nombre, profesor, aula, cupo).
*   **Múltiples Sesiones:** Soporte para cursos que se imparten varias veces por semana en horarios diferentes.
*   **Detección de Conflictos:** Alertas automáticas si intentas agregar un curso que choca con otro ya agendado.
*   **Múltiples Horarios:** Crea y guarda diferentes versiones de tu horario (Plan A, Plan B, etc.).
*   **Exportación PDF:** Descarga tu horario en formato PDF listo para imprimir.
*   **Persistencia de Datos:** Todo se guarda automáticamente en tu navegador (LocalStorage).

## Requisitos Previos

*   [Node.js](https://nodejs.org/) (versión 14 o superior recomendada)
*   [pnpm](https://pnpm.io/) (instalado globalmente via `npm install -g pnpm`)

## Instalación y Ejecución Local

1.  **Clonar el repositorio** (si aplica) o descargar el código fuente.

2.  **Instalar dependencias:**
    Abre una terminal en la carpeta del proyecto y ejecuta:
    ```bash
    pnpm install
    ```

3.  **Correr el servidor de desarrollo:**
    ```bash
    pnpm dev
    ```
    Esto abrirá la aplicación en `http://localhost:5173/` (o un puerto similar).

4.  **Construir para producción:**
    Si deseas generar los archivos estáticos optimizados:
    ```bash
    pnpm build
    ```
    Los archivos se generarán en la carpeta `dist`.

## Tecnologías Utilizadas

*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [jspdf](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) (para PDF)
*   [Lucide React](https://lucide.dev/) (iconos)

## Despliegue en GitHub Pages

Para desplegar esta aplicación en GitHub Pages:

1.  Asegúrate de que el repositorio esté en GitHub.
2.  Ejecuta el comando de despliegue (ya configurado):
    ```bash
    pnpm deploy
    ```
3.  La aplicación estará disponible en la URL configurada en tu repositorio.
