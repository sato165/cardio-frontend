import {
  HeartPulse, Activity, Shield, Brain, BarChart2,
  AlertTriangle, CheckCircle, Cpu, Database, Users,
  Layers, Code2, Network, Server, Monitor
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
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    red: 'from-red-500/20 to-red-600/5 border-red-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    green: 'from-green-500/20 to-green-600/5 border-green-500/20',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 text-center`}>
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
          Sistema de predicción de riesgo cardiovascular basado en clustering con inteligencia artificial,
          entrenado con datos reales de pacientes colombianos.
        </p>
        <p className="text-xs text-slate-500 mt-4">Universidad · 2026</p>
      </div>

      {/* Arquitectura */}
      <section className="animate-slide-up delay-100">
        <SectionTitle><Layers size={20} className="text-blue-400" /> Arquitectura del sistema</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl p-6">
          <p className="text-sm text-slate-300 mb-4">
            El frontend React envía datos a una API REST en FastAPI. El backend ejecuta un pipeline de
            <strong> StandardScaler → PCA → Random Forest</strong> para asignar al paciente uno de tres perfiles clínicos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-300 uppercase mb-2">Frontend</p>
              <p className="text-sm text-slate-400">React 19 · Vite 6 · Tailwind CSS 4 · React Router 7 · Axios · Recharts</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-300 uppercase mb-2">Backend</p>
              <p className="text-sm text-slate-400">FastAPI · Random Forest · PCA · PyMuPDF · pdfplumber · Pydantic v2</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flujo */}
      <section className="animate-slide-up delay-200">
        <SectionTitle><Activity size={20} className="text-blue-400" /> Flujo de datos</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl divide-y divide-white/5">
          <FeatureRow icono={Monitor} titulo="1. Entrada de datos"
            descripcion="El médico ingresa 22 variables clínicas manualmente o sube una historia clínica en JSON/PDF." />
          <FeatureRow icono={Server} titulo="2. Validación y preprocesamiento"
            descripcion="FastAPI valida los datos con Pydantic, aplica winsorización de valores atípicos y escala las variables." />
          <FeatureRow icono={Brain} titulo="3. Predicción por clustering"
            descripcion="El pipeline PCA + Random Forest asigna al paciente a uno de tres perfiles: Cardio-renal, Cardiovascular Inflamatorio o Bajo Riesgo, con probabilidades." />
          <FeatureRow icono={Monitor} titulo="4. Visualización de resultados"
            descripcion="El frontend muestra el perfil asignado, las probabilidades por cluster y, opcionalmente, la comparación con Framingham/SCC." />
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
                <td className="px-4 py-3 text-slate-400 text-xs">Predicción desde formulario manual (22 campos).</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">POST</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/upload</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Predicción desde archivo JSON de historia clínica.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">POST</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/upload/pdf</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Predicción desde archivos PDF de historia clínica.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">GET</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/api/health</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Verificación de que el servidor y los artefactos están operativos.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-blue-400 font-mono text-xs">GET</td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">/docs</td>
                <td className="px-4 py-3 text-slate-400 text-xs">Swagger UI con la documentación completa de la API.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Explicabilidad */}
      <section className="animate-slide-up delay-400">
        <SectionTitle><Brain size={20} className="text-blue-400" /> Interpretación de resultados</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl divide-y divide-white/5">
          <FeatureRow icono={BarChart2} titulo="Probabilidades por perfil clínico"
            descripcion="El modelo devuelve la probabilidad de pertenencia a cada uno de los tres clusters, permitiendo al médico evaluar la incertidumbre de la clasificación." />
          <FeatureRow icono={CheckCircle} titulo="Perfiles clínicos definidos por expertos"
            descripcion="Cada cluster cuenta con una descripción e interpretación clínica validada que incluye recomendaciones específicas (manejo renal, control metabólico, etc.)." />
          <FeatureRow icono={AlertTriangle} titulo="Datos reales colombianos"
            descripcion="El modelo fue entrenado con datos de pacientes colombianos, ofreciendo predicciones más relevantes para el contexto local." />
        </div>
      </section>

      {/* Stack */}
      <section className="animate-slide-up delay-500">
        <SectionTitle><Code2 size={20} className="text-blue-400" /> Stack tecnológico</SectionTitle>
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Backend</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StackBadge nombre="FastAPI" version="0.115" categoria="backend" />
              <StackBadge nombre="scikit-learn" version="1.6" categoria="backend" />
              <StackBadge nombre="Random Forest" version="—" categoria="backend" />
              <StackBadge nombre="Pydantic v2" version="2.10" categoria="backend" />
              <StackBadge nombre="PyMuPDF" version="1.24" categoria="backend" />
              <StackBadge nombre="pdfplumber" version="0.11" categoria="backend" />
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
              <StackBadge nombre="PCA" version="—" categoria="ml" />
              <StackBadge nombre="K-Means" version="—" categoria="ml" />
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="animate-slide-up delay-500">
        <SectionTitle><Users size={20} className="text-blue-400" /> Equipo de desarrollo</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TeamCard nombre="Sebastián Torres Ortega" rol="Desarrollo backend, frontend e investigación" area="Ingeniería de Sistemas" />
          <TeamCard nombre="Mayerlis Acosta Peralta" rol="Investigación y validación clínica" area="Ingeniería Biomédica" />
        </div>
      </section>
    </div>
  )
}