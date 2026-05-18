import { 
  Cpu, Heart, Shield, Activity, FileText,
  AlertTriangle, CheckCircle, BarChart2,
  ArrowRight, FlaskConical, Info, Layers,
  Sparkles
} from 'lucide-react'

function SectionTitle({ children, icono: Icon }) {
  return (
    <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-white/10 flex items-center gap-2">
      {Icon && <Icon size={20} className="text-blue-400" />}
      {children}
    </h2>
  )
}

function ModelDetailCard({ titulo, icono, colorClass, children }) {
  const Icon = icono
  return (
    <div className={`glass-card border rounded-2xl p-6 ${colorClass} mb-8`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${colorClass.replace('border-', 'bg-').replace('/30', '/10')}`}>
          <Icon size={24} className={colorClass.replace('border-', 'text-').replace('/30', '-400')} />
        </div>
        <h3 className="text-xl font-bold text-white">{titulo}</h3>
      </div>
      {children}
    </div>
  )
}

function FeatureRow({ variable, tipo, unidad, descripcion }) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-3 py-2"><code className="text-xs bg-slate-800 text-blue-400 px-2 py-1 rounded font-mono">{variable}</code></td>
      <td className="px-3 py-2 text-sm text-slate-400">{descripcion}</td>
    </tr>
  )
}

function MetricBadge({ valor, label, color }) {
  const col = {
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
    green: 'border-green-500/20 bg-green-500/10 text-green-400',
    amber: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
    red: 'border-red-500/20 bg-red-500/10 text-red-400',
  }
  return (
    <div className={`border rounded-xl px-4 py-3 text-center ${col[color]}`}>
      <p className="text-2xl font-bold">{valor}</p>
      <p className="text-xs mt-1">{label}</p>
    </div>
  )
}

export default function RiskModelsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">
          Modelos de predicción de riesgo cardiovascular
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          El sistema utiliza un modelo de clustering con IA entrenado en datos reales colombianos,
          complementado opcionalmente con Framingham 2008 y el ajuste de la SCC.
          Incluye explicabilidad SHAP para entender cómo cada variable influye en la predicción.
        </p>
      </div>

      {/* Artery VA – modelo final del notebook */}
      <ModelDetailCard 
        titulo="1. Artery VA"
        icono={Heart}
        colorClass="border-blue-500/30"
      >
        <p className="text-sm text-slate-300 mb-4">
          Modelo de inteligencia artificial entrenado con datos clínicos reales de pacientes colombianos, diseñado para identificar patrones asociados al riesgo cardiovascular y apoyar la estratificación clínica de los pacientes mediante análisis predictivo.

        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Variables de entrada (19)</h4>
            <div className="glass-card border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-800/60">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-400">Variable</th>
                    <th className="px-3 py-2 text-left text-slate-400">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow variable="c_total" descripcion="Colesterol total." />
<FeatureRow variable="creatinina" descripcion="Función renal." />
<FeatureRow variable="glucosa" descripcion="Glicemia en ayunas." />
<FeatureRow variable="hdl" descripcion="Colesterol HDL." />
<FeatureRow variable="hemoglobina" descripcion="Hemoglobina." />
<FeatureRow variable="ldl" descripcion="Colesterol LDL." />
<FeatureRow variable="leucocitos" descripcion="Leucocitos." />
<FeatureRow variable="plaquetas" descripcion="Plaquetas." />
<FeatureRow variable="trigliceridos" descripcion="Triglicéridos." />
<FeatureRow variable="edad" descripcion="Edad del paciente." />
<FeatureRow variable="sexo" descripcion="0 = Mujer, 1 = Hombre." />
<FeatureRow variable="zona" descripcion="0 = Rural, 1 = Urbana." />
<FeatureRow variable="ap_hipertension" descripcion="Antecedente personal de HTA." />
<FeatureRow variable="ta_sistolica" descripcion="Presión sistólica." />
<FeatureRow variable="ta_diastolica" descripcion="Presión diastólica." />
<FeatureRow variable="peso" descripcion="Peso corporal." />
<FeatureRow variable="talla" descripcion="Talla en metros." />
<FeatureRow variable="imc" descripcion="Índice de masa corporal." />
<FeatureRow variable="TFG" descripcion="Filtración glomerular." />
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Perfiles clínicos</h4>
            <div className="glass-card border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-300 font-medium">Cardiovascular:</span>
                <span className="text-xs text-slate-400">Alteración lipídica predominante con riesgo cardiovascular elevado.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-slate-300 font-medium">Bajo riesgo:</span>
                <span className="text-xs text-slate-400">Perfil saludable, mantener hábitos y revisión anual.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-300 font-medium">Cardiometabólico:</span>
                <span className="text-xs text-slate-400">Perfil lipídico alterado.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-slate-300 font-medium">Cardiorrenal:</span>
                <span className="text-xs text-slate-400">Disfunción renal y/o alteración lipídica.</span>
              </div>
            </div>
            <div className="mt-4 glass-card border border-white/10 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <FlaskConical size={16} className="text-blue-400" />
                Pipeline de inferencia
              </h4>
              <p className="text-xs text-slate-400">
                Datos → Winsorización experta → KNN Imputer → StandardScaler → PCA (11 componentes) → Random Forest → Cluster + Probabilidades.
              </p>
            </div>
            {/* Explicabilidad SHAP */}
            <div className="mt-4 glass-card border border-indigo-500/20 rounded-xl p-4 bg-indigo-500/5">
              <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                Explicabilidad con SHAP
              </h4>
              <p className="text-xs text-indigo-200/80">
                El sistema incorpora <strong>SHAP (SHapley Additive exPlanations)</strong> mediante TreeExplainer.
                Calcula la contribución exacta de cada una de las 19 variables a la predicción del perfil clínico,
                permitiendo al médico interpretar por qué el modelo asignó un perfil determinado.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <MetricBadge valor="4" label="Clusters" color="blue" />
          <MetricBadge valor="11" label="Componentes PCA" color="green" />
          <MetricBadge valor="150" label="Árboles (RF)" color="amber" />
          <MetricBadge valor="19" label="Features" color="blue" />
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-300">Dataset real colombiano + validación externa</p>
            <p className="text-xs text-green-400/70 mt-1">
              El modelo se entrenó con datos reales de pacientes colombianos y se validó con una cohorte externa anónima,
              asegurando predicciones ajustadas al contexto local.
            </p>
          </div>
        </div>
      </ModelDetailCard>

      {/* Framingham 2008 */}
      <ModelDetailCard 
        titulo="2. Framingham risk score classic 2008"
        icono={Heart}
        colorClass="border-red-500/30"
      >
        <p className="text-sm text-slate-300 mb-4">
          Ecuación de riesgo cardiovascular general a 10 años del estudio de Framingham. Estima el riesgo de
          enfermedad coronaria, cerebrovascular, insuficiencia cardíaca y enfermedad arterial periférica.
        </p>
        <div className="glass-card border border-white/10 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Info size={16} className="text-red-400" />
            Variables requeridas
          </h4>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Edad (30–74 años)</li>
            <li>Colesterol total (mg/dL)</li>
            <li>HDL colesterol (mg/dL)</li>
            <li>Presión sistólica (mmHg)</li>
            <li>Tratamiento antihipertensivo (sí/no)</li>
            <li>Tabaquismo (sí/no)</li>
            <li>Diabetes mellitus (sí/no)</li>
          </ul>
        </div>
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-300">Limitación en Latinoamérica</p>
            <p className="text-xs text-yellow-400/70 mt-1">
              Framingham tiende a sobreestimar el riesgo en poblaciones latinoamericanas. Por eso se ofrece el ajuste de la SCC.
            </p>
          </div>
        </div>
      </ModelDetailCard>

      {/* SCC Colombia */}
      <ModelDetailCard 
        titulo="3. Sociedad colombiana de cardiologia & cirugía cardiovascular (SCC)"
        icono={Heart}
        colorClass="border-yellow-500/30"
      >
        <p className="text-sm text-slate-300 mb-4">
          Ajuste recomendado por la Guía colombiana para dislipidemias (Ministerio de Salud, 2014):
          <strong> Riesgo SCC = Framingham × 0.75</strong>.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2 flex items-center gap-2">
            <CheckCircle size={16} /> Fórmula de ajuste
          </h4>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">Riesgo SCC =</span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-white font-mono">Framingham × 0.75</span>
          </div>
        </div>
      </ModelDetailCard>

      {/* Comparativa */}
      <div className="glass-card border border-white/5 rounded-2xl p-6">
        <SectionTitle icono={BarChart2}>Comparación entre modelos</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">Artery VA</span>
            <p className="text-xs text-slate-400">Clustering con Random Forest sobre datos reales colombianos. Incluye explicabilidad SHAP.</p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">Framingham 2008</span>
            <p className="text-xs text-slate-400">Ecuación clásica de riesgo validada internacionalmente.</p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">SCC Colombia</span>
            <p className="text-xs text-slate-400">Ajuste local con factor 0.75 para población colombiana.</p>
          </div>
        </div>
      </div>
    </div>
  )
}