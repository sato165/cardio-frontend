# CardioPredict — Frontend

Interfaz web del sistema de predicción de riesgo cardiovascular con perfilamiento clínico para médicos.

Desarrollado por Sebastián Torres Ortega, Mayerlis Acosta Peralta como proyecto integrador de Ingeniería de Sistemas e Ingeniería Biomédica.

---

## ¿Qué hace esta interfaz?

Permite a un médico ingresar los datos de un paciente de dos formas, enviarlos al backend y recibir un perfil clínico — **Cardio‑renal**, **Cardiovascular Inflamatorio** o **Bajo Riesgo** — junto con las probabilidades de pertenencia a cada perfil y una descripción interpretativa. Opcionalmente muestra la comparativa con los índices Framingham 2008 y SCC si se proporcionan datos adicionales.

---

## Stack tecnológico

| Librería | Versión | Para qué se usa |
|---|---|---|
| React + React DOM | 19.x | Framework base |
| Vite | 6.x | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.x | Estilos utilitarios |
| React Router DOM | 7.x | Navegación entre páginas |
| Axios | 1.x | Llamadas HTTP al backend |
| Recharts | 2.x | Gráficos de probabilidades por perfil |
| Lucide React | 0.x | Iconos SVG |

---

## Requisitos previos

- Node.js 18 o superior
- El backend `cardio-backend` corriendo en `http://localhost:8000`

---

## Instalación (modo desarrollo)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd cardio-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Arrancar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`.

En desarrollo, Vite redirige automáticamente las llamadas a `/api` al backend en `http://localhost:8000` mediante el proxy configurado en `vite.config.js`. No hay que cambiar nada en el código.

---

## Variables de entorno

```env
# .env.example
VITE_API_URL=
```

En producción cambiar `VITE_API_URL` a la URL del servidor desplegado. Esta variable nunca se escribe directamente en el código — se accede con `import.meta.env.VITE_API_URL`.

---

## Vistas

### `/` — Inicio
Pantalla de bienvenida con las opciones de predicción y las características del sistema.

### `/manual` — Formulario manual
Formulario con las 22 variables clínicas organizadas en secciones: datos demográficos, laboratorio, signos vitales y antropometría. Incluye campos opcionales para Framingham y SCC.

### `/upload` — Cargar historia clínica
Área de drag-and-drop que acepta archivos JSON o PDF. Si el archivo tiene campos faltantes los lista con inputs para completarlos manualmente antes de confirmar.

### `/about` — Acerca del sistema
Información sobre el proyecto, el equipo y el modelo utilizado.

### `/risk-models` — Modelos de riesgo
Descripción de los perfiles clínicos y los índices de riesgo Framingham y SCC.

---

## Resultado de la predicción

Ambos flujos muestran al final:

**ResultCard** — tarjeta con el perfil clínico asignado, las probabilidades por perfil con barras visuales y una descripción interpretativa.

**ExplainabilityChart** — gráfico de barras con las probabilidades por cluster.

**ComparisonCard** — comparativa con Framingham 2008 y SCC (solo si se proporcionaron los datos opcionales).

**PatientSummary** — resumen de los datos del paciente ingresados.

---

## Estructura del proyecto

```
src/
├── api/
│   └── cardioApi.js              ← Todas las llamadas HTTP al backend
├── components/
│   ├── ComparisonCard.jsx        ← Comparativa Framingham / SCC
│   ├── ExplainabilityChart.jsx   ← Gráfico de probabilidades por perfil
│   ├── FileUpload.jsx            ← Carga de JSON y PDF
│   ├── Navbar.jsx                ← Barra de navegación
│   ├── PatientSummary.jsx        ← Resumen de datos del paciente
│   ├── PredictionForm.jsx        ← Formulario de ingreso manual (22 campos)
│   ├── ResultCard.jsx            ← Perfil clínico + probabilidades
│   └── SHAPChart.jsx             ← Gráfico SHAP auxiliar
├── context/
│   └── PredictionContext.jsx     ← Estado global del ciclo de predicción
├── pages/
│   ├── AboutPage.jsx
│   ├── HomePage.jsx
│   ├── ManualPage.jsx
│   ├── RiskModelsPage.jsx
│   └── UploadPage.jsx
├── App.jsx                       ← Router + layout global
├── main.jsx                      ← Punto de entrada
└── index.css                     ← Imports de Tailwind
```

---

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo con hot reload
npm run build    # Build de producción en dist/
npm run preview  # Vista previa del build de producción
```

---

## Despliegue integrado con el backend (ejecutable de escritorio)

En la modalidad de escritorio, el frontend no se despliega por separado. El build de producción se empaqueta dentro del ejecutable `CardioPredictor.exe` junto con el backend FastAPI. El servidor sirve los archivos estáticos del frontend directamente en `http://127.0.0.1:8000`.

### Flujo de build integrado

Cada vez que se modifique el frontend y se quiera actualizar el ejecutable:

```bash
# 1. Generar el build de producción
npm run build

# 2. Copiar el build al backend (desde cardio-frontend/)
xcopy dist ..\cardio-backend\frontend_dist /E /I /Y

# 3. Reconstruir el ejecutable (desde cardio-backend/ con venv activado)
rmdir /s /q build dist & del CardioPredictor.spec & pyinstaller --onefile --name CardioPredictor --add-data "models;models" --add-data "frontend_dist;frontend_dist" --hidden-import main --hidden-import numpy._core --hidden-import numpy._core._multiarray_umath --hidden-import numpy._core.multiarray --hidden-import joblib.externals.loky.backend.managers --collect-all numpy --collect-all scipy --collect-all joblib --collect-all shap --collect-all sklearn --copy-metadata numpy --copy-metadata scipy --copy-metadata joblib --copy-metadata scikit-learn --additional-hooks-dir . cardio_app.py
```

El ejecutable final queda en `cardio-backend/dist/CardioPredictor.exe`.

> El archivo `.env` del frontend no tiene efecto en el ejecutable. En esa modalidad el frontend llama directamente a `http://127.0.0.1:8000` sin pasar por Vite ni por su proxy.

---

## Cómo extender el sistema

**Agregar una nueva vista:**
1. Crear archivo en `src/pages/`
2. Añadir la ruta en `src/App.jsx`
3. Añadir el enlace en `src/components/Navbar.jsx` si corresponde

**Agregar un nuevo campo al formulario:**  
Modificar `src/components/PredictionForm.jsx` y `src/api/cardioApi.js` únicamente.

**Cambiar la URL del backend:**  
Modificar solo el archivo `.env`.

---

## Notas

- El archivo `.env` nunca se sube a Git. Usar `.env.example` como plantilla.
- La carpeta `dist/` generada por `npm run build` no se sube a Git. Se genera localmente antes de cada build del ejecutable.
- El proxy de `vite.config.js` solo aplica en desarrollo. En producción (y en el ejecutable) el frontend llama directamente a la URL del backend.
