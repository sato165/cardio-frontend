import {
  HeartPulse, Activity, Shield, FileText, Brain, BarChart2,
  AlertTriangle, CheckCircle, Cpu, Database, Users,
  Layers, Code2, Network, Server, Monitor, ArrowRight
} from 'lucide-react'

function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-bold text-white mb-6 pb-3 border-b border-white/10 flex items-center gap-2">
      {children}
    </h2>
  )
}

function FeatureRow({ icono, titulo, descripcion }) {
  const Icono = icono
  return (
    <div className="flex items-start gap-5 py-4 border-b border-white/5 last:border-0">
      <div className="p-4 bg-blue-500/10 rounded-xl shrink-0">
        <Icono size={20} className="text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200 mb-1">{titulo}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{descripcion}</p>
      </div>
    </div>
  )
}

function StackBadge({ nombre, version, categoria }) {
  const colores = {
    backend:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
    frontend: 'bg-red-500/10 text-red-400 border-red-500/20',
    ml:       'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }
  return (
    <div className={`border rounded-xl px-4 py-3 ${colores[categoria]}`}>
      <p className="text-sm font-semibold text-slate-200">{nombre}</p>
      <p className="text-xs text-slate-500 mt-0.5">{version}</p>
    </div>
  )
}

function MetricCard({ valor, label, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    red: 'from-red-500/20 to-red-600/5 border-red-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    green: 'from-green-500/20 to-green-600/5 border-green-500/20',
  }
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5 text-center`}>
      <p className="text-3xl font-bold text-white mb-1">{valor}</p>
      <p className="text-sm font-medium text-slate-300">{label}</p>
    </div>
  )
}

function TeamCard({ nombre, rol, area }) {
  const iniciales = nombre.split(' ').slice(0, 2).map(n => n[0]).join('')
  return (
    <div className="glass-card border border-white/5 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-sm">{iniciales}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200">{nombre}</p>
        <p className="text-xs text-blue-400 font-medium">{rol}</p>
        <p className="text-xs text-slate-500 mt-0.5">{area}</p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">

      {/* Encabezado */}
      <div className="text-center pt-4 animate-slide-up">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
          <div className="relative p-5 rounded-3xl glass-card">
            <HeartPulse className="text-red-500 animate-heartbeat heart-glow" size={40} fill="currentColor" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Artery<span className="text-gradient-red">-VA</span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
          Sistema de predicción de riesgo cardiovascular con explicabilidad clínica para médicos.
          Proyecto integrador de Ingeniería de Sistemas e Ingeniería Biomédica.
        </p>
        <p className="text-xs text-slate-500 mt-4">
          Universidad · 2026
        </p>
      </div>

      {/* Arquitectura general */}
      <section className="animate-slide-up delay-100">
        <SectionTitle><Layers size={20} className="text-blue-400" /> Arquitectura del sistema</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl p-6">
          <p className="text-sm text-slate-300 mb-4">
            Artery-VA sigue una arquitectura <strong>cliente‑servidor</strong> con separación clara de responsabilidades.
            El frontend, construido con React y Vite, consume una API REST desarrollada en FastAPI.
            Los modelos de machine learning se ejecutan en el backend sin intervención del navegador.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-300 uppercase mb-2">Frontend</p>
              <p className="text-sm text-slate-400">
                React 19 · Vite 6 · Tailwind CSS 4 · React Router 7 · Axios · Recharts
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-300 uppercase mb-2">Backend</p>
              <p className="text-sm text-slate-400">
                FastAPI · XGBoost · SHAP · LIME · PyMuPDF · pdfplumber · Pydantic v2
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo de una predicción */}
      <section className="animate-slide-up delay-200">
        <SectionTitle><Activity size={20} className="text-blue-400" /> Flujo de datos</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl divide-y divide-white/5">
          <FeatureRow
            icono={Monitor}
            titulo="1. El médico ingresa datos manuales o sube una historia clínica (JSON / PDF)"
            descripcion="El frontend envía los datos al endpoint /api/predict o /api/predict/upload según corresponda."
          />
          <FeatureRow
            icono={Server}
            titulo="2. FastAPI valida los datos con Pydantic y los pasa al servicio de predicción"
            descripcion="El servicio preprocesa los datos, aplica feature engineering y ejecuta el modelo XGBoost."
          />
          <FeatureRow
            icono={Brain}
            titulo="3. El modelo retorna riesgo, probabilidad y explicabilidad"
            descripcion="Se calculan valores SHAP y se generan explicaciones en texto legible para el médico."
          />
          <FeatureRow
            icono={Monitor}
            titulo="4. El frontend muestra el resultado y los gráficos de explicabilidad"
            descripcion="ResultCard y ExplainabilityChart presentan la información de forma clara e interpretable."
          />
        </div>
      </section>

      {/* Endpoints */}
      <section className="animate-slide-up delay-300">
        <SectionTitle><Network size={20} className="text-blue-400" /> Endpoints de la API</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 text-left uppercase">Método</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 text-left uppercase">Ruta</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 text-left uppercase">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">POST</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/predict</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Predicción a partir de formulario manual (11 campos).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">POST</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/predict/upload</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Predicción a partir de un archivo JSON de historia clínica.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">POST</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/predict/upload/pdf</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Predicción a partir de uno o varios PDFs de historia clínica.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">GET</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/health</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Verificación de que el servidor y el modelo están operativos.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">GET</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/docs</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Swagger UI autogenerado con toda la documentación de la API.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Explicabilidad */}
      <section className="animate-slide-up delay-400">
        <SectionTitle><Brain size={20} className="text-blue-400" /> Explicabilidad clínica</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl divide-y divide-white/5">
          <FeatureRow
            icono={Brain}
            titulo="SHAP (SHapley Additive exPlanations)"
            descripcion="Calcula la contribución de cada variable a la predicción individual. Los valores positivos aumentan el riesgo y los negativos lo reducen."
          />
          <FeatureRow
            icono={FileText}
            titulo="LIME (Local Interpretable Model-agnostic Explanations)"
            descripcion="Alternativa a SHAP que explica predicciones individuales perturbando los datos de entrada localmente."
          />
          <FeatureRow
            icono={AlertTriangle}
            titulo="Advertencias de subregistro"
            descripcion="Las variables autorreportadas (tabaquismo y alcohol) incluyen una nota explícita sobre posible sesgo de subregistro."
          />
        </div>
      </section>

      {/* Stack tecnológico */}
      <section className="animate-slide-up delay-500">
        <SectionTitle><Code2 size={20} className="text-blue-400" /> Stack tecnológico</SectionTitle>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Backend</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StackBadge nombre="FastAPI" version="0.115" categoria="backend" />
              <StackBadge nombre="XGBoost" version="2.1.3" categoria="backend" />
              <StackBadge nombre="SHAP" version="0.46" categoria="backend" />
              <StackBadge nombre="Pydantic v2" version="2.10" categoria="backend" />
              <StackBadge nombre="PyMuPDF" version="1.24" categoria="backend" />
              <StackBadge nombre="pdfplumber" version="0.11" categoria="backend" />
              <StackBadge nombre="scikit-learn" version="1.6" categoria="backend" />
              <StackBadge nombre="pytest" version="8.3" categoria="backend" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Frontend</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StackBadge nombre="React" version="19.x" categoria="frontend" />
              <StackBadge nombre="Vite" version="6.x" categoria="frontend" />
              <StackBadge nombre="Tailwind CSS" version="4.x" categoria="frontend" />
              <StackBadge nombre="Recharts" version="2.x" categoria="frontend" />
              <StackBadge nombre="React Router" version="7.x" categoria="frontend" />
              <StackBadge nombre="Axios" version="1.x" categoria="frontend" />
              <StackBadge nombre="Lucide React" version="0.x" categoria="frontend" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Entrenamiento</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StackBadge nombre="Google Colab" version="—" categoria="ml" />
              <StackBadge nombre="pandas" version="2.2" categoria="ml" />
              <StackBadge nombre="numpy" version="2.0" categoria="ml" />
              <StackBadge nombre="joblib" version="1.4" categoria="ml" />
            </div>
          </div>
        </div>
      </section>

      {/* Pruebas */}
      <section className="animate-slide-up delay-500">
        <SectionTitle><CheckCircle size={20} className="text-blue-400" /> Pruebas del sistema</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard valor="66" label="Pruebas unitarias" color="blue" />
          <MetricCard valor="3" label="Archivos de test" color="cyan" />
          <MetricCard valor="3" label="Endpoints probados" color="green" />
        </div>
      </section>

      {/* Equipo */}
      <section className="animate-slide-up delay-500">
        <SectionTitle><Users size={20} className="text-blue-400" /> Equipo de desarrollo</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TeamCard
            nombre="Sebastián Torres Ortega"
            rol="Desarrollo backend y frontend, Investigación y documentación"
            area="Ingeniería de Sistemas"
          />
          <TeamCard
            nombre="Mayerlis Acosta Peralta"
            rol="Investigación y validación clínica"
            area="Ingeniería Biomédica"
          />
        </div>
      </section>

    </div>
  )
}