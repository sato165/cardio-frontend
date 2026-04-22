import { Heart, Shield, FileText, Users, Brain, BarChart2, AlertTriangle, CheckCircle, Cpu, Activity, Database } from 'lucide-react'

function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-bold text-white mb-6 pb-3 border-b border-white/10 flex items-center gap-2">
      {children}
    </h2>
  )
}

function MetricCard({ valor, label, sub, color = 'blue' }) {
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
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

function FeatureRow({ icono, titulo, descripcion }) {
  const Icono = icono
  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="p-2.5 bg-blue-500/10 rounded-xl shrink-0">
        <Icono size={18} className="text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200 mb-1">{titulo}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{descripcion}</p>
      </div>
    </div>
  )
}

function ModelRow({ modelo, accuracy, f1, auc, activo }) {
  return (
    <tr className={activo ? 'bg-blue-500/10' : ''}>
      <td className="px-4 py-3 text-sm font-medium text-slate-200 flex items-center gap-2">
        {modelo}
        {activo && (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
            Activo
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-400 text-center">{accuracy}</td>
      <td className="px-4 py-3 text-sm text-slate-400 text-center">{f1}</td>
      <td className="px-4 py-3 text-sm font-semibold text-blue-400 text-center">{auc}</td>
    </tr>
  )
}

function VariableRow({ variable, tipo, descripcion, sesgo }) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-4 py-3">
        <code className="text-xs bg-slate-800 text-blue-400 px-2 py-1 rounded font-mono">
          {variable}
        </code>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{tipo}</td>
      <td className="px-4 py-3 text-sm text-slate-400">{descripcion}</td>
      <td className="px-4 py-3">
        {sesgo && (
          <span className="flex items-center gap-1 text-xs text-yellow-400">
            <AlertTriangle size={11} />
            Subregistro
          </span>
        )}
      </td>
    </tr>
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

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">

      <div className="text-center pt-4 animate-slide-up">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
          <div className="relative p-5 rounded-3xl glass-card">
            <Heart className="text-red-500 animate-heartbeat" size={40} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Cardio<span className="text-gradient-red">Predict</span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
          Sistema de predicción de riesgo cardiovascular con explicabilidad clínica
          para médicos. Proyecto integrador de Ingeniería de Sistemas e Ingeniería Biomédica.
        </p>
        <p className="text-xs text-slate-500 mt-4">
          Universidad · 2026
        </p>
      </div>

      <section className="animate-slide-up delay-100">
        <SectionTitle><Activity size={20} className="text-blue-400" /> Rendimiento del modelo</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard valor="0.799" label="AUC-ROC" sub="XGBoost tuneado" color="blue" />
          <MetricCard valor="73.3%" label="Accuracy" sub="En conjunto de test" color="cyan" />
          <MetricCard valor="71.9%" label="F1-Score" sub="Media ponderada" color="green" />
          <MetricCard valor="68 515" label="Registros" sub="Tras limpieza" color="red" />
        </div>
      </section>

      <section className="animate-slide-up delay-200">
        <SectionTitle><Cpu size={20} className="text-blue-400" /> Comparativa de modelos entrenados</SectionTitle>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Se entrenaron y compararon dos modelos con ajuste de hiperparámetros mediante
          GridSearchCV con validación cruzada estratificada de 5 folds. El criterio de
          selección principal fue AUC-ROC por ser más informativo que accuracy en
          clasificación binaria médica.
        </p>
        <div className="glass-card border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-left">Modelo</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-center">Accuracy</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-center">F1</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-center">AUC-ROC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <ModelRow modelo="Random Forest (baseline)" accuracy="71.1%" f1="70.3%" auc="76.6%" activo={false} />
              <ModelRow modelo="Random Forest (tuneado)"  accuracy="73.1%" f1="71.5%" auc="79.8%" activo={false} />
              <ModelRow modelo="XGBoost (baseline)"       accuracy="72.9%" f1="71.5%" auc="79.3%" activo={false} />
              <ModelRow modelo="XGBoost (tuneado)"        accuracy="73.3%" f1="71.9%" auc="79.9%" activo={true}  />
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Hiperparámetros XGBoost seleccionados: max_depth=4 · learning_rate=0.05 ·
          n_estimators=200 · subsample=0.8 · colsample_bytree=0.8
        </p>
      </section>

      <section className="animate-slide-up delay-300">
        <SectionTitle><Database size={20} className="text-blue-400" /> Dataset</SectionTitle>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Dataset público de enfermedades cardiovasculares disponible en Kaggle.
          Contiene 70 000 registros originales recopilados en el momento del examen médico.
          Tras el proceso de limpieza quedaron 68 515 registros con balance de clases 50/50,
          lo que elimina la necesidad de técnicas de sobremuestreo.
        </p>
        <div className="glass-card border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Variable</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-left uppercase tracking-wider">Nota</th>
              </tr>
            </thead>
            <tbody>
              <VariableRow variable="age"         tipo="Numérica"  descripcion="Edad en años (convertida desde días)"             sesgo={false} />
              <VariableRow variable="gender"      tipo="Categórica" descripcion="1 = mujer · 2 = hombre"                         sesgo={false} />
              <VariableRow variable="height"      tipo="Numérica"  descripcion="Altura en cm · rango válido: 140–220"             sesgo={false} />
              <VariableRow variable="weight"      tipo="Numérica"  descripcion="Peso en kg · rango válido: 30–180"               sesgo={false} />
              <VariableRow variable="ap_hi"       tipo="Numérica"  descripcion="Presión sistólica mmHg · rango: 60–250"          sesgo={false} />
              <VariableRow variable="ap_lo"       tipo="Numérica"  descripcion="Presión diastólica mmHg · rango: 40–200"         sesgo={false} />
              <VariableRow variable="cholesterol" tipo="Ordinal"   descripcion="1 normal · 2 alto · 3 muy alto"                  sesgo={false} />
              <VariableRow variable="gluc"        tipo="Ordinal"   descripcion="1 normal · 2 alto · 3 muy alto"                  sesgo={false} />
              <VariableRow variable="smoke"       tipo="Binaria"   descripcion="0 no fuma · 1 fuma (8.8% positivos)"            sesgo={true}  />
              <VariableRow variable="alco"        tipo="Binaria"   descripcion="0 no consume · 1 consume alcohol (5.4%)"        sesgo={true}  />
              <VariableRow variable="active"      tipo="Binaria"   descripcion="0 sedentario · 1 activo físicamente"            sesgo={false} />
              <VariableRow variable="cardio"      tipo="Objetivo"  descripcion="0 sin enfermedad · 1 con enfermedad (50/50)"    sesgo={false} />
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
          <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-sm font-semibold text-yellow-300 mb-1">
              Sesgo de subregistro en tabaquismo y alcohol
            </p>
            <p className="text-xs text-yellow-400/70 leading-relaxed">
              Las variables <code className="bg-yellow-500/20 px-1 rounded text-yellow-300">smoke</code> y{' '}
              <code className="bg-yellow-500/20 px-1 rounded text-yellow-300">alco</code> son autorreportadas
              por el paciente. El análisis exploratorio muestra que los fumadores tienen una
              tasa de cardio paradójicamente menor que los no fumadores (47.5% vs 50.2%),
              lo cual contradice la evidencia médica y confirma subregistro sistemático con
              sesgo de género diferencial. El modelo refleja esta limitación del dataset y
              advierte al médico en la explicabilidad de cada predicción.
            </p>
          </div>
        </div>
      </section>

      <section className="animate-slide-up delay-400">
        <SectionTitle><BarChart2 size={20} className="text-blue-400" /> Feature engineering</SectionTitle>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Además de las 11 variables originales, se construyeron 4 features derivados con
          justificación clínica que enriquecen la señal del modelo.
        </p>
        <div className="glass-card border border-white/5 rounded-2xl divide-y divide-white/5">
          <FeatureRow
            icono={BarChart2}
            titulo="IMC — Índice de Masa Corporal"
            descripcion="Calculado como peso(kg) / altura(m)². Combina peso y altura en una métrica clínica estándar con interpretación directa según clasificación OMS."
          />
          <FeatureRow
            icono={Heart}
            titulo="Categoría de presión arterial (bp_category)"
            descripcion="Clasificación AHA en 4 niveles: Normal, Elevada, HTA grado 1, HTA grado 2. El feature con gradiente más limpio: de 22.1% de riesgo en presión normal a 84.3% en HTA grado 2."
          />
          <FeatureRow
            icono={Shield}
            titulo="Pulso de presión (pulse_pressure)"
            descripcion="Diferencia entre presión sistólica y diastólica. Indicador de rigidez arterial con correlación 0.337 con cardio — la tercera más alta del dataset."
          />
          <FeatureRow
            icono={Brain}
            titulo="Score de riesgo metabólico (metabolic_risk)"
            descripcion="Score sentado de 0 a 3 combinando colesterol elevado, glucosa elevada y obesidad (IMC ≥ 30). Sube de 39.6% de riesgo con score 0 a 72.7% con score 3."
          />
        </div>
      </section>

      <section className="animate-slide-up delay-500">
        <SectionTitle><Brain size={20} className="text-blue-400" /> Explicabilidad clínica</SectionTitle>
        <div className="glass-card border border-white/5 rounded-2xl divide-y divide-white/5">
          <FeatureRow
            icono={Brain}
            titulo="SHAP (SHapley Additive exPlanations)"
            descripcion="Calcula la contribución de cada variable a la predicción individual. Los valores positivos aumentan el riesgo y los negativos lo reducen. Se presenta ordenado por impacto absoluto con descripción en lenguaje clínico para cada factor."
          />
          <FeatureRow
            icono={FileText}
            titulo="LIME (Local Interpretable Model-agnostic Explanations)"
            descripcion="Alternativa a SHAP que explica predicciones individuales perturbando los datos de entrada localmente. Implementado como complemento para validación cruzada de la explicabilidad."
          />
          <FeatureRow
            icono={CheckCircle}
            titulo="Texto clínico legible"
            descripcion="Cada factor se presenta en lenguaje natural para el médico: 'Su presión sistólica de 145 mmHg aumenta el riesgo en un 18%'. Las variables con sesgo documentado incluyen una advertencia explícita."
          />
        </div>
      </section>

      <section className="animate-slide-up delay-500">
        <SectionTitle><Cpu size={20} className="text-blue-400" /> Stack tecnológico</SectionTitle>
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

      <section className="animate-slide-up delay-500">
        <SectionTitle><CheckCircle size={20} className="text-blue-400" /> Pruebas del sistema</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">66</p>
            <p className="text-sm font-medium text-slate-300">Pruebas unitarias</p>
            <p className="text-xs text-slate-500 mt-1">pytest · 100% passing</p>
          </div>
          <div className="glass-card border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">3</p>
            <p className="text-sm font-medium text-slate-300">Archivos de test</p>
            <p className="text-xs text-slate-500 mt-1">predict · upload · preprocessing</p>
          </div>
          <div className="glass-card border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">3</p>
            <p className="text-sm font-medium text-slate-300">Endpoints probados</p>
            <p className="text-xs text-slate-500 mt-1">manual · JSON · PDF</p>
          </div>
        </div>
      </section>

      <section className="animate-slide-up delay-500">
        <SectionTitle><Users size={20} className="text-blue-400" /> Equipo de desarrollo</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TeamCard
            nombre="Sebastián Torres Ortega"
            rol="Desarrollo backend y frontend"
            area="Ingeniería de Sistemas"
          />
          <TeamCard
            nombre="Mayerlis Acosta Peralta"
            rol="Investigación y validación clínica"
            area="Ingeniería Biomédica"
          />
          <TeamCard
            nombre="Christian Rivera Dibasto"
            rol="Investigación y documentación"
            area="Ingeniería de Sistemas"
          />
        </div>
      </section>

    </div>
  )
}