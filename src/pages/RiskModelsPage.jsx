import { 
  Cpu, Heart, Shield, Activity, FileText,
  AlertTriangle, CheckCircle, BarChart2,
  ArrowRight, FlaskConical, Calculator, Info,
  Gauge, Target, Layers
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
        <div className={`p-3 rounded-xl bg-${colorClass}/10`}>
          <Icon size={24} className={`text-${colorClass}`} />
        </div>
        <h3 className="text-xl font-bold text-white">{titulo}</h3>
      </div>
      {children}
    </div>
  )
}

function FeatureRow({ variable, tipo, unidad, descripcion, extra }) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-3 py-2">
        <code className="text-xs bg-slate-800 text-blue-400 px-2 py-1 rounded font-mono">{variable}</code>
      </td>
      <td className="px-3 py-2 text-xs text-slate-500">{tipo}{unidad ? ` (${unidad})` : ''}</td>
      <td className="px-3 py-2 text-sm text-slate-400">{descripcion}</td>
      <td className="px-3 py-2 text-xs text-slate-500">{extra}</td>
    </tr>
  )
}

function MetricBadge({ valor, label, color }) {
  const col = {
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
    green: 'border-green-500/20 bg-green-500/10 text-green-400',
    amber: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
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
          Modelos de Predicción de Riesgo Cardiovascular
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          El sistema utiliza tres modelos complementarios para estimar el riesgo a 10 años.
          Cada uno tiene una metodología y población de referencia diferente.
        </p>
      </div>

      {/* CardioPredict */}
      <ModelDetailCard 
        titulo="1. CardioPredict (Modelo Propio)"
        icono={Cpu}
        colorClass="border-blue-500/30"
      >
        <p className="text-sm text-slate-300 mb-4">
          Modelo de <strong>machine learning</strong> basado en <strong>XGBoost</strong>,
          entrenado con 68,515 registros del dataset público Cardiovascular Disease de Kaggle.
          Utiliza una combinación de variables originales y features de ingeniería clínica.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Variables originales */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Variables de entrada</h4>
            <div className="glass-card border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-800/60">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-400">Variable</th>
                    <th className="px-3 py-2 text-left text-slate-400">Tipo / Unidad</th>
                    <th className="px-3 py-2 text-left text-slate-400">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow variable="Edad" tipo="Numérica" unidad="años" descripcion="Edad del paciente (convertida de días a años)." />
                  <FeatureRow variable="Género" tipo="Categórica" descripcion="1 = Mujer, 2 = Hombre." />
                  <FeatureRow variable="Altura" tipo="Numérica" unidad="cm" descripcion="Altura del paciente en centímetros." />
                  <FeatureRow variable="Peso" tipo="Numérica" unidad="kg" descripcion="Peso del paciente en kilogramos." />
                  <FeatureRow variable="Presión sistólica" tipo="Numérica" unidad="mmHg" descripcion="Presión arterial sistólica (ap_hi)." />
                  <FeatureRow variable="Presión diastólica" tipo="Numérica" unidad="mmHg" descripcion="Presión arterial diastólica (ap_lo)." />
                  <FeatureRow variable="Colesterol" tipo="Ordinal" descripcion="1 = Normal, 2 = Alto, 3 = Muy alto." />
                  <FeatureRow variable="Glucosa" tipo="Ordinal" descripcion="1 = Normal, 2 = Alta, 3 = Muy alta." />
                  <FeatureRow variable="Fumador" tipo="Binaria" descripcion="0 = No fuma, 1 = Fuma." />
                  <FeatureRow variable="Alcohol" tipo="Binaria" descripcion="0 = No consume, 1 = Consume alcohol." />
                  <FeatureRow variable="Actividad física" tipo="Binaria" descripcion="0 = Sedentario, 1 = Activo físicamente." />
                </tbody>
              </table>
            </div>
          </div>

          {/* Features derivados */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Features derivados (ingeniería clínica)</h4>
            <div className="glass-card border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-800/60">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-400">Variable</th>
                    <th className="px-3 py-2 text-left text-slate-400">Tipo</th>
                    <th className="px-3 py-2 text-left text-slate-400">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow variable="IMC" tipo="Calculada" unidad="kg/m²" descripcion="Índice de Masa Corporal: peso / (altura/100)²." />
                  <FeatureRow variable="Rango de edad" tipo="Ordinal" descripcion="1: <40, 2: 40–49, 3: 50–59, 4: ≥60." />
                  <FeatureRow variable="Categoría PA" tipo="Ordinal" descripcion="Clasificación AHA: Normal, Elevada, HTA grado 1, HTA grado 2." />
                  <FeatureRow variable="Pulso de presión" tipo="Calculada" unidad="mmHg" descripcion="Diferencia entre presión sistólica y diastólica (ap_hi − ap_lo)." />
                  <FeatureRow variable="Score metabólico" tipo="Score" descripcion="0–3 (colesterol >1 + glucosa >1 + IMC ≥30)." />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <MetricBadge valor="0.799" label="AUC-ROC" color="blue" />
          <MetricBadge valor="73.3%" label="Accuracy" color="green" />
          <MetricBadge valor="71.9%" label="F1-Score" color="blue" />
          <MetricBadge valor="16" label="Features totales" color="amber" />
        </div>

        {/* Hiperparámetros y entrenamiento */}
        <div className="glass-card border border-white/10 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <FlaskConical size={16} className="text-blue-400" />
            Entrenamiento y validación
          </h4>
          <p className="text-xs text-slate-400 mb-2">
            Se entrenaron Random Forest y XGBoost con <strong>GridSearchCV</strong> (validación cruzada estratificada de 5 folds).
            El criterio principal de selección fue <strong>AUC-ROC</strong>. El modelo seleccionado fue XGBoost con los siguientes hiperparámetros:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-slate-800 text-blue-300 text-xs px-2 py-1 rounded">max_depth=4</span>
            <span className="bg-slate-800 text-blue-300 text-xs px-2 py-1 rounded">learning_rate=0.05</span>
            <span className="bg-slate-800 text-blue-300 text-xs px-2 py-1 rounded">n_estimators=200</span>
            <span className="bg-slate-800 text-blue-300 text-xs px-2 py-1 rounded">subsample=0.8</span>
            <span className="bg-slate-800 text-blue-300 text-xs px-2 py-1 rounded">colsample_bytree=0.8</span>
          </div>
        </div>

        {/* Sesgos */}
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-300">Nota sobre sesgos en tabaquismo y alcohol</p>
            <p className="text-xs text-yellow-400/70 mt-1">
              Las variables <code>smoke</code> y <code>alco</code> presentan subregistro (solo 8.8% y 5.4% de positivos respectivamente)
              y correlación negativa con cardio, debido al autorreporte del paciente.
              El modelo incluye una advertencia explícita en la explicabilidad SHAP.
            </p>
          </div>
        </div>
      </ModelDetailCard>

      {/* Framingham 2008 */}
      <ModelDetailCard 
        titulo="2. Framingham 2008 (D'Agostino)"
        icono={Heart}
        colorClass="border-red-500/30"
      >
        <p className="text-sm text-slate-300 mb-4">
          Ecuación de riesgo cardiovascular general a 10 años derivada del estudio de Framingham
          (Massachusetts, EE.UU.). Publicada por <strong>D'Agostino et al. en Circulation (2008)</strong>.
          Estima el riesgo de enfermedad coronaria, cerebrovascular, insuficiencia cardíaca y
          enfermedad arterial periférica.
        </p>

        <div className="glass-card border border-white/10 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Calculator size={16} className="text-red-400" />
            Método de puntuación (Score)
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Se asignan puntos a cada factor según tablas específicas por sexo. El puntaje total
            se convierte a porcentaje usando una tabla de correspondencia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-red-300 mb-2">Variables requeridas</p>
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
            <div>
              <p className="text-xs font-semibold text-red-300 mb-2">Clasificación del riesgo</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Bajo: &lt;10%</li>
                <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Moderado: 10–20%</li>
                <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Alto: &gt;20%</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
          <Info size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">Limitaciones en Latinoamérica</p>
            <p className="text-xs text-red-400/70 mt-1">
              Framingham fue desarrollado con una población predominantemente blanca de Massachusetts,
              lo que tiende a <strong>sobreestimar el riesgo</strong> en poblaciones latinoamericanas
              que tienen menor incidencia cardiovascular basal.
            </p>
          </div>
        </div>
      </ModelDetailCard>

      {/* SCC Colombia */}
      <ModelDetailCard 
        titulo="3. Sociedad Colombiana de Cardiología (SCC)"
        icono={Shield}
        colorClass="border-yellow-500/30"
      >
        <p className="text-sm text-slate-300 mb-4">
          La <strong>Guía de práctica clínica colombiana para dislipidemias</strong> (Ministerio de Salud,
          2014) recomienda ajustar el puntaje de Framingham con un factor <strong>0.75</strong> para
          corregir la sobreestimación en población colombiana. Este ajuste está respaldado por un estudio
          de validación de Muñoz et al. (Revista Colombiana de Cardiología, 2014).
        </p>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2 flex items-center gap-2">
            <CheckCircle size={16} /> Fórmula de ajuste
          </h4>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">Riesgo SCC =</span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-white font-mono">
              Framingham × 0.75
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Se aplican los mismos umbrales: bajo (&lt;10%), moderado (10–20%) y alto (&gt;20%).
          </p>
        </div>

        <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
          <FileText size={18} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-300">Referencias clave</p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside mt-1">
              <li>Muñoz OM, Rodríguez NI, Ruiz A, Rondón M. Validación de los modelos de predicción de Framingham y PROCAM. Rev Col Cardiol. 2014;21:202-210.</li>
              <li>Ministerio de Salud y Protección Social. Guía de práctica clínica para dislipidemias. Colombia, 2014.</li>
            </ul>
          </div>
        </div>
      </ModelDetailCard>

      {/* Comparativa final */}
      <div className="glass-card border border-white/5 rounded-2xl p-6">
        <SectionTitle icono={BarChart2}>Comparación entre modelos</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">CardioPredict</span>
            <p className="text-xs text-slate-400">
              Modelo de ML entrenado con datos de Kaggle. Categoriza en Bajo/Moderado/Alto usando umbrales clínicos (45% y 70%).
            </p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">Framingham 2008</span>
            <p className="text-xs text-slate-400">
              Ecuación de riesgo de la cohorte original. Validada internacionalmente pero sobreestima en LATAM.
            </p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">SCC Colombia</span>
            <p className="text-xs text-slate-400">
              Ajuste local con factor 0.75. Recomendado por la guía colombiana para dislipidemias.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}