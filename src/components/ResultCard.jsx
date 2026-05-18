import { useEffect, useState } from 'react'
import { Activity, ShieldCheck, AlertTriangle, Heart, Sparkles, Microscope } from 'lucide-react'

// ── Configuración de los 4 clusters — modelo final k=4 ─────────────────────
const CONFIG_CLUSTER = {
  0: {
    nombre:      'Cardiovascular',
    color:       'orange',
    // Fondo muy sutil, casi transparente
    bg:          'bg-slate-900',
    // Borde más visible con el color del cluster
    border:      'border-orange-500/60',
    // Acento del ícono y títulos
    text:        'text-orange-400',
    textLight:   'text-orange-300',
    // Barra del cluster predicho
    barra:       'bg-gradient-to-r from-orange-600 to-red-500',
    // Color del badge/highlight del encabezado
    headerBg:    'bg-orange-500/15',
    headerBorder:'border-orange-500/40',
    glow:        'shadow-orange-500/20',
    icono:       Heart,
    descripcion: 'Perfil con alteración lipídica predominante y riesgo cardiovascular elevado.'
  },
  1: {
    nombre:      'Bajo riesgo',
    color:       'green',
    bg:          'bg-slate-900',
    border:      'border-green-500/60',
    text:        'text-green-400',
    textLight:   'text-green-300',
    barra:       'bg-gradient-to-r from-green-600 to-emerald-500',
    headerBg:    'bg-green-500/15',
    headerBorder:'border-green-500/40',
    glow:        'shadow-green-500/20',
    icono:       ShieldCheck,
    descripcion: 'Perfil de bajo riesgo cardiovascular. Mantener hábitos saludables.'
  },
  2: {
    nombre:      'Cardiometabólico',
    color:       'yellow',
    bg:          'bg-slate-900',
    border:      'border-yellow-500/60',
    text:        'text-yellow-400',
    textLight:   'text-yellow-300',
    barra:       'bg-gradient-to-r from-yellow-500 to-orange-400',
    headerBg:    'bg-yellow-500/15',
    headerBorder:'border-yellow-500/40',
    glow:        'shadow-yellow-500/20',
    icono:       AlertTriangle,
    descripcion: 'Resistencia metabólica con alteración lipídica asociada.'
  },
  3: {
    nombre:      'Cardiorrenal',
    color:       'red',
    bg:          'bg-slate-900',
    border:      'border-red-500/60',
    text:        'text-red-400',
    textLight:   'text-red-300',
    barra:       'bg-gradient-to-r from-red-700 to-red-500',
    headerBg:    'bg-red-500/15',
    headerBorder:'border-red-500/40',
    glow:        'shadow-red-500/20',
    icono:       Microscope,
    descripcion: 'Disfunción renal con alteración lipídica significativa.'
  }
}

const CFG_DEFAULT = CONFIG_CLUSTER[1]

// ── Barra de probabilidad individual ───────────────────────────────────────
function ProbabilityBar({ probabilidad, animated, cfg, esPrincipal }) {
  const pct   = Math.round(probabilidad * 100)
  const width = animated ? pct : 0

  return (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
      esPrincipal ? `${cfg.headerBg} border ${cfg.headerBorder}` : ''
    }`}>
      <div className={`shrink-0 w-36 text-right flex flex-col items-end gap-0.5`}>
        <span className={`font-medium leading-tight ${
          esPrincipal
            ? `${cfg.text} text-sm`
            : 'text-slate-400 text-xs'
        }`}>
          {cfg.nombre}
        </span>
        {esPrincipal && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cfg.headerBg} ${cfg.text} border ${cfg.headerBorder} font-semibold`}>
            predicho
          </span>
        )}
      </div>

      <div className={`flex-1 rounded-full overflow-hidden border ${
        esPrincipal ? `h-5 ${cfg.headerBorder}` : 'h-3.5 border-slate-700'
      } bg-slate-800`}>
        <div
          className={`h-full rounded-full relative transition-all duration-1000 ease-out ${
            esPrincipal ? cfg.barra : 'bg-slate-600'
          }`}
          style={{ width: `${width}%` }}
        >
          {esPrincipal && (
            <div className="absolute inset-0 bg-white/10 animate-shimmer" />
          )}
        </div>
      </div>

      <div className="w-12 text-left shrink-0">
        <span className={`font-semibold ${
          esPrincipal ? `${cfg.text} text-base` : 'text-slate-400 text-sm'
        }`}>
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

  const probabilidadPrincipal =
    probabilities?.find(p => p.cluster_id === clusterPrincipal)?.probability ?? 0

  const barrasOrdenadas = [...(probabilities ?? [])].sort((a, b) => {
    if (a.cluster_id === clusterPrincipal) return -1
    if (b.cluster_id === clusterPrincipal) return 1
    return b.probability - a.probability
  })

  return (
    // Fondo oscuro neutro — solo el BORDE lleva el color del cluster
    <div className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} p-6 shadow-xl shadow-${cfg.glow} animate-scale-in`}>

      {/* Cabecera — el bloque de ícono+título sí tiene el color de fondo suave */}
      <div className={`flex items-center gap-4 mb-6 p-4 rounded-2xl border ${cfg.headerBorder} ${cfg.headerBg}`}>
        <div className={`p-3 rounded-xl border ${cfg.headerBorder} bg-slate-900/60`}>
          <Icono className={cfg.text} size={28} />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            Perfil clínico asignado
          </p>
          <h2 className={`text-2xl font-bold ${cfg.text}`}>
            {cluster_name || cfg.nombre}
          </h2>
          <p className="text-sm font-semibold text-slate-300">
            Confianza:{' '}
            <span className={cfg.text}>{Math.round(probabilidadPrincipal * 100)}%</span>
          </p>
        </div>
      </div>

      {/* Descripción — texto claro sobre fondo oscuro */}
      <div className="flex items-start gap-3 mb-6 pt-4 border-t border-slate-700/60">
        <Activity className={`${cfg.text} shrink-0 mt-0.5`} size={18} />
        <p className="text-sm text-slate-300 leading-relaxed">
          {description || cfg.descripcion}
        </p>
      </div>

      {/* Probabilidades — 4 barras */}
      <div className="space-y-2">
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
      <div className="mt-6 pt-4 border-t border-slate-700/60">
        <button
          onClick={onExplain}
          disabled={explainLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-sm font-medium hover:bg-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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