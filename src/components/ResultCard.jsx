import { useEffect, useState } from 'react'
import { Activity, ShieldCheck, AlertTriangle, Heart, Sparkles } from 'lucide-react'

const CONFIG_CLUSTER = {
  0: {
    nombre: 'Cardio-renal',
    color: 'red',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    textLight: 'text-red-300',
    barra: 'bg-gradient-to-r from-red-600 to-red-500',
    icono: Heart,
    descripcion: 'Perfil de disfunción renal con alteración lipídica.'
  },
  1: {
    nombre: 'Cardiovascular Inflamatorio',
    color: 'yellow',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    textLight: 'text-yellow-300',
    barra: 'bg-gradient-to-r from-yellow-600 to-orange-500',
    icono: AlertTriangle,
    descripcion: 'Perfil inflamatorio-cardiovascular con presión elevada y glucosa en prediabetes.'
  },
  2: {
    nombre: 'Bajo Riesgo',
    color: 'green',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    textLight: 'text-green-300',
    barra: 'bg-gradient-to-r from-green-600 to-emerald-500',
    icono: ShieldCheck,
    descripcion: 'Perfil de bajo riesgo cardiovascular.'
  }
}

function ClusterBar({ cluster, probabilidad, maxProb, animated }) {
  const cfg = CONFIG_CLUSTER[cluster] || CONFIG_CLUSTER[1]
  const pct = Math.round(probabilidad * 100)
  const width = animated ? (probabilidad / maxProb) * 100 : 0

  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <div className="w-32 text-right">
        <span className={`text-xs font-medium ${cfg.text}`}>
          {cfg.nombre}
        </span>
      </div>
      <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className={`h-full ${cfg.barra} rounded-full relative transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
      </div>
      <div className="w-12 text-left">
        <span className={`text-sm font-semibold ${cfg.text}`}>{pct}%</span>
      </div>
    </div>
  )
}

export default function ResultCard({ resultado, onExplain, explainLoading }) {
  const [animated, setAnimated] = useState(false)
  const { predicted_cluster, cluster_name, description, probabilities } = resultado || {}

  const clusterPrincipal = predicted_cluster ?? 1
  const cfg = CONFIG_CLUSTER[clusterPrincipal] || CONFIG_CLUSTER[1]
  const Icono = cfg.icono
  const maxProb = probabilities?.length ? Math.max(...probabilities.map(p => p.probability)) : 1

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!resultado) return null

  return (
    <div className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-6 shadow-xl animate-scale-in`}>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

      {/* Descripción del perfil */}
      <div className="flex items-start gap-3 mb-6 pt-4 border-t border-white/10">
        <Activity className={`${cfg.text} shrink-0 mt-0.5`} size={18} />
        <p className={`text-sm ${cfg.textLight} leading-relaxed`}>
          {description || cfg.descripcion}
        </p>
      </div>

      {/* Barras de probabilidad por perfil */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
          Probabilidades por perfil
        </p>
        {probabilities?.map((p) => (
          <ClusterBar
            key={p.cluster_id}
            cluster={p.cluster_id}
            probabilidad={p.probability}
            maxProb={maxProb}
            animated={animated}
          />
        ))}
      </div>

      {/* ─── NUEVO: Botón para explicabilidad SHAP ──────────────────────── */}
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