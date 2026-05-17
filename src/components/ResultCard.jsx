import { useEffect, useState } from 'react'
import { Activity, ShieldCheck, AlertTriangle, Heart, Sparkles, Microscope } from 'lucide-react'

// ── Configuración de los 4 clusters — modelo final k=4 ─────────────────────
const CONFIG_CLUSTER = {
  0: {
    nombre:      'Cardiovascular',
    color:       'orange',
    bg:          'bg-orange-500/10',
    border:      'border-orange-500/30',
    text:        'text-orange-400',
    textLight:   'text-orange-300',
    barra:       'bg-gradient-to-r from-orange-600 to-red-500',
    icono:       Heart,
    descripcion: 'Perfil con alteración lipídica predominante y riesgo cardiovascular elevado.'
  },
  1: {
    nombre:      'Bajo riesgo',
    color:       'green',
    bg:          'bg-green-500/10',
    border:      'border-green-500/30',
    text:        'text-green-400',
    textLight:   'text-green-300',
    barra:       'bg-gradient-to-r from-green-600 to-emerald-500',
    icono:       ShieldCheck,
    descripcion: 'Perfil de bajo riesgo cardiovascular. Mantener hábitos saludables.'
  },
  2: {
    nombre:      'Cardiometabólico',
    color:       'yellow',
    bg:          'bg-yellow-500/10',
    border:      'border-yellow-500/30',
    text:        'text-yellow-400',
    textLight:   'text-yellow-300',
    barra:       'bg-gradient-to-r from-yellow-500 to-orange-400',
    icono:       AlertTriangle,
    descripcion: 'Resistencia metabólica con alteración lipídica asociada.'
  },
  3: {
    nombre:      'Cardiorrenal',
    color:       'red',
    bg:          'bg-red-500/10',
    border:      'border-red-500/30',
    text:        'text-red-400',
    textLight:   'text-red-300',
    barra:       'bg-gradient-to-r from-red-700 to-red-500',
    icono:       Microscope,
    descripcion: 'Disfunción renal con alteración lipídica significativa.'
  }
}

// Fallback si llega un cluster_id inesperado
const CFG_DEFAULT = CONFIG_CLUSTER[1]

// ── Barra de probabilidad individual ───────────────────────────────────────
function ProbabilityBar({ probabilidad, animated, cfg, esPrincipal }) {
  const pct   = Math.round(probabilidad * 100)
  const width = animated ? pct : 0

  return (
    <div className="flex items-center gap-3">
      <div className="w-36 text-right shrink-0">
        <span className={`text-xs font-medium ${esPrincipal ? cfg.text : 'text-slate-400'}`}>
          {cfg.nombre}
        </span>
        {esPrincipal && (
          <span className={`ml-1 text-[10px] ${cfg.text} opacity-70`}>★</span>
        )}
      </div>

      <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className={`h-full rounded-full relative transition-all duration-1000 ease-out ${
            esPrincipal ? cfg.barra : 'bg-slate-600'
          }`}
          style={{ width: `${width}%` }}
        >
          {esPrincipal && (
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          )}
        </div>
      </div>

      <div className="w-12 text-left shrink-0">
        <span className={`text-sm font-semibold ${esPrincipal ? cfg.text : 'text-slate-400'}`}>
          {pct}%
        </span>
      </div>
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────
export default function ResultCard({ resultado, onExplain, explainLoading }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [resultado])

  if (!resultado) return null

  const { predicted_cluster, cluster_name, description, probabilities } = resultado

  const clusterPrincipal = predicted_cluster ?? 1
  const cfg   = CONFIG_CLUSTER[clusterPrincipal] ?? CFG_DEFAULT
  const Icono = cfg.icono

  // Probabilidad del cluster predicho
  const probabilidadPrincipal =
    probabilities?.find(p => p.cluster_id === clusterPrincipal)?.probability ?? 0

  // Ordenar las 4 barras: primero el predicho, luego el resto de mayor a menor
  const barrasOrdenadas = [...(probabilities ?? [])].sort((a, b) => {
    if (a.cluster_id === clusterPrincipal) return -1
    if (b.cluster_id === clusterPrincipal) return 1
    return b.probability - a.probability
  })

  return (
    <div className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-6 shadow-xl animate-scale-in`}>

      {/* Cabecera */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 rounded-2xl glass-card border ${cfg.border}`}>
          <Icono className={cfg.text} size={28} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            Perfil clínico asignado
          </p>
          <h2 className={`text-2xl font-bold ${cfg.text}`}>
            {cluster_name || cfg.nombre}
          </h2>
          <p className={`text-sm font-semibold ${cfg.text} opacity-80`}>
            Confianza: {Math.round(probabilidadPrincipal * 100)}%
          </p>
        </div>
      </div>

      {/* Descripción */}
      <div className="flex items-start gap-3 mb-6 pt-4 border-t border-white/10">
        <Activity className={`${cfg.text} shrink-0 mt-0.5`} size={18} />
        <p className={`text-sm ${cfg.textLight} leading-relaxed`}>
          {description || cfg.descripcion}
        </p>
      </div>

      {/* Probabilidades — 4 barras */}
      <div className="space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
          Probabilidad por perfil
        </p>
        {barrasOrdenadas.map(item => {
          const itemCfg = CONFIG_CLUSTER[item.cluster_id] ?? CFG_DEFAULT
          return (
            <ProbabilityBar
              key={item.cluster_id}
              probabilidad={item.probability}
              animated={animated}
              cfg={itemCfg}
              esPrincipal={item.cluster_id === clusterPrincipal}
            />
          )
        })}
      </div>

      {/* Botón SHAP */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={onExplain}
          disabled={explainLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium hover:bg-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={16} className={explainLoading ? 'animate-pulse' : ''} />
          {explainLoading ? 'Calculando explicación...' : 'Explicación SHAP'}
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Vea cómo cada variable influye en la predicción del modelo.
        </p>
      </div>
    </div>
  )
}