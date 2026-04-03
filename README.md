# CardioPredict — Frontend

Interfaz web del sistema de predicción de riesgo cardiovascular con explicabilidad clínica para médicos.

Desarrollado por Sebastián Torres Ortega, Mayerlis Acosta Peralta y Christian Rivera Dibasto como proyecto integrador de Ingeniería de Sistemas e Ingeniería Biomédica.

---

## ¿Qué hace esta interfaz?

Permite a un médico ingresar los datos de un paciente de tres formas distintas, enviarlos al backend y recibir una predicción de riesgo cardiovascular junto con una explicación visual en lenguaje clínico que muestra qué factores influyeron en el resultado y en qué proporción.

---

## Stack tecnológico

| Librería | Versión | Para qué se usa |
|---|---|---|
| React + React DOM | 19.x | Framework base |
| Vite | 6.x | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.x | Estilos utilitarios |
| React Router DOM | 7.x | Navegación entre páginas |
| Axios | 1.x | Llamadas HTTP al backend |
| Recharts | 2.x | Gráfico de barras SHAP |
| Lucide React | 0.x | Iconos SVG |

---

## Requisitos previos

- Node.js 18 o superior
- El backend `cardio-backend` corriendo en `http://localhost:8000`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd cardio-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si el backend corre en una URL distinta

# 4. Arrancar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Variables de entorno

```env
# .env.example
VITE_API_URL=http://localhost:8000
```

En producción cambiar `VITE_API_URL` a la URL del servidor desplegado. Esta variable nunca se escribe directamente en el código — se accede con `import.meta.env.VITE_API_URL`.

---

## Vistas

### `/` — Inicio
Pantalla de bienvenida con las dos opciones de predicción y las características del sistema.

### `/manual` — Formulario manual
Formulario con los 11 campos del modelo organizados en 4 secciones: datos personales, presión arterial, exámenes clínicos y hábitos de vida. Incluye validación en tiempo real y tooltips con rangos clínicos de referencia para colesterol, glucosa y presión arterial.

### `/upload` — Cargar historia clínica
Área de drag-and-drop que acepta archivos JSON o PDF. Si el archivo tiene campos faltantes los lista con inputs para que el médico los complete manualmente antes de confirmar. Acepta hasta 5 PDFs del mismo paciente simultáneamente.

---

## Resultado de la predicción

Ambas vistas muestran al final del flujo:

**ResultCard** — tarjeta con el nivel de riesgo (Alto / Moderado / Bajo) en color semafórico, porcentaje de probabilidad con barra visual y mensaje interpretativo para el médico.

**ExplainabilityChart** — gráfico de barras horizontales con los 10 factores SHAP de mayor impacto. Las barras rojas aumentan el riesgo y las azules lo reducen. La opacidad indica el nivel de impacto (crítico / moderado / leve). Las variables `smoke` y `alco` muestran una advertencia de subregistro documentada en el EDA.

---

## Estructura del proyecto

```
src/
├── api/
│   └── cardioApi.js           ← Todas las llamadas HTTP al backend
├── components/
│   ├── Navbar.jsx             ← Barra de navegación
│   ├── PredictionForm.jsx     ← Formulario de ingreso manual
│   ├── FileUpload.jsx         ← Carga de JSON y PDF
│   ├── ResultCard.jsx         ← Resultado + probabilidad + nivel de riesgo
│   └── ExplainabilityChart.jsx ← Gráfico de barras SHAP
├── hooks/
│   └── usePrediction.js       ← Estado del ciclo de predicción
├── pages/
│   ├── HomePage.jsx
│   ├── ManualPage.jsx
│   └── UploadPage.jsx
├── App.jsx                    ← Router + layout global
├── main.jsx                   ← Punto de entrada
└── index.css                  ← Imports de Tailwind
```

---

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo con hot reload
npm run build    # Build de producción en dist/
npm run preview  # Vista previa del build de producción
```

---

## Agregar una nueva vista

1. Crear archivo en `src/pages/`
2. Añadir la ruta en `src/App.jsx`
3. Añadir el enlace en `src/components/Navbar.jsx` si corresponde

No hay que tocar ningún otro archivo.

## Agregar un nuevo campo al formulario

Modificar `src/components/PredictionForm.jsx` y `src/api/cardioApi.js` únicamente.

## Cambiar la URL del backend

Modificar solo el archivo `.env`.

---

## Notas de despliegue

- El archivo `.env` nunca se sube a Git. Usar `.env.example` como plantilla.
- La carpeta `dist/` generada por `npm run build` es la que se despliega.
- El proxy configurado en `vite.config.js` solo aplica en desarrollo. En producción el frontend llama directamente a `VITE_API_URL`.
