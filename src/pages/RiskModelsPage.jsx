import { 
  Cpu, Heart, Shield, Activity, FileText, 
  AlertTriangle, CheckCircle, BarChart2, 
  ArrowRight, FlaskConical, Calculator, Info
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

function VariableBadge({ name, type, unit, extra }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300 py-1">
      <span className="text-blue-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">{name}</span>
      <span className="text-xs text-slate-500">({type}{unit ? `, ${unit}` : ''})</span>
      {extra && <span className="text-xs text-slate-600">{extra}</span>}
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
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Variables de entrada</h4>
            <div className="space-y-1">
              <VariableBadge name="age"          type="numérica" unit="años" />
              <VariableBadge name="gender"       type="categórica" />
              <VariableBadge name="height"       type="numérica" unit="cm" />
              <VariableBadge name="weight"       type="numérica" unit="kg" />
              <VariableBadge name="ap_hi"        type="numérica" unit="mmHg" />
              <VariableBadge name="ap_lo"        type="numérica" unit="mmHg" />
              <VariableBadge name="cholesterol"  type="ordinal" extra="1=normal, 2=alto, 3=muy alto" />
              <VariableBadge name="gluc"         type="ordinal" extra="1=normal, 2=alto, 3=muy alto" />
              <VariableBadge name="smoke"        type="binaria" />
              <VariableBadge name="alco"         type="binaria" />
              <VariableBadge name="active"       type="binaria" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Features derivados</h4>
            <div className="space-y-1">
              <VariableBadge name="bmi"            type="calculada" unit="kg/m²" extra="IMC = peso/(altura/100)²" />
              <VariableBadge name="age_range"      type="ordinal" extra="1: <40, 2: 40-49, 3: 50-59, 4: ≥60" />
              <VariableBadge name="bp_category"    type="ordinal" extra="Normal, Elevada, HTA1, HTA2 (AHA)" />
              <VariableBadge name="pulse_pressure" type="calculada" unit="mmHg" extra="AP_hi - AP_lo" />
              <VariableBadge name="metabolic_risk" type="score" extra="0-3 (col >1, gluc >1, IMC≥30)" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { val: '0.799',  lab: 'AUC-ROC' },
            { val: '73.3%',  lab: 'Accuracy' },
            { val: '71.9%',  lab: 'F1-Score' },
            { val: '16',     lab: 'Features totales' },
          ].map(m => (
            <div key={m.lab} className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{m.val}</p>
              <p className="text-xs text-slate-500">{m.lab}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <AlertTriangle size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-300">Nota sobre sesgos</p>
            <p className="text-xs text-blue-400/70">
              Las variables <code>smoke</code> y <code>alco</code> están subregistradas 
              (autorreporte). El modelo incluye una advertencia explícita en la explicabilidad 
              SHAP para que el médico lo considere al interpretar el resultado.
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
            Se asigna puntos a cada factor según tablas específicas por sexo, luego el puntaje total 
            se convierte a porcentaje usando una tabla de correspondencia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-red-300 mb-1">Variables requeridas</p>
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
              <p className="text-xs font-semibold text-red-300 mb-1">Clasificación del riesgo</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/> Bajo: &lt;10%</li>
                <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"/> Moderado: 10-20%</li>
                <li className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/> Alto: &gt;20%</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
          <Info size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">Limitaciones en Latinoamérica</p>
            <p className="text-xs text-red-400/70">
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
            Se aplican los mismos umbrales: bajo (&lt;10%), moderado (10-20%) y alto (&gt;20%).
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
            <p className="text-xs text-slate-400">Modelo de ML entrenado con datos de Kaggle. Categoriza en Bajo/Moderado/Alto usando umbrales clínicos (45% y 70%).</p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">Framingham 2008</span>
            <p className="text-xs text-slate-400">Ecuación de riesgo de la cohorte original. Validada internacionalmente pero sobreestima en LATAM.</p>
          </div>
          <div className="text-center">
            <span className="inline-block bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">SCC Colombia</span>
            <p className="text-xs text-slate-400">Ajuste local con factor 0.75. Recomendado por la guía colombiana para dislipidemias.</p>
          </div>
        </div>
      </div>

    </div>
  )
}