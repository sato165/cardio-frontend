import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react'

const CONFIG_RIESGO = {
  Alto: {
    color: 'red',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    textLight: 'text-red-300',
    barra: 'bg-gradient-to-r from-red-500 to-red-600',
    icono: ShieldAlert,
    descripcion: 'El paciente presenta alto riesgo de enfermedad cardiovascular. Se recomienda evaluación clínica inmediata.',
    glow: 'shadow-red-500/20',
  },
  Moderado: {
    color: 'yellow',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    textLight: 'text-yellow-300',
    barra: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    icono: AlertTriangle,
    descripcion: 'El paciente presenta riesgo moderado. Se recomienda seguimiento y control de factores de riesgo.',
    glow: 'shadow-yellow-500/20',
  },
  Bajo: {
    color: 'green',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    textLight: 'text-green-300',
    barra: 'bg-gradient-to-r from-green-500 to-emerald-500',
    icono: ShieldCheck,
    descripcion: 'El paciente presenta bajo riesgo cardiovascular. Se recomienda mantener hábitos saludables.',
    glow: 'shadow-green-500/20',
  },
}

export default function ResultCard({ resultado }) {
  const [animatedWidth, setAnimatedWidth] = useState(0)
  
  if (!resultado) return null

  const { nivel_riesgo, probabilidad } = resultado
  const cfg = CONFIG_RIESGO[nivel_riesgo] ?? CONFIG_RIESGO['Moderado']
  const Icono = cfg.icono
  const pct = Math.round(probabilidad * 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(pct)
    }, 100)
    return () => clearTimeout(timer)
  }, [pct])

  return (
    <div className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-6 shadow-xl ${cfg.glow} animate-scale-in`}>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl glass-card border ${cfg.border}`}>
            <Icono className={cfg.text} size={28} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
              Resultado de la predicción
            </p>
            <h2 className={`text-2xl font-bold ${cfg.text}`}>
              Riesgo {nivel_riesgo}
            </h2>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-500 mb-1">Probabilidad</div>
          <div className={`text-4xl font-bold ${cfg.text}`}>
            {pct}%
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full ${cfg.barra} rounded-full progress-bar-animated relative overflow-hidden`}
            style={{ width: `${animatedWidth}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </div>
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-600">0%</span>
          <span className="text-xs text-slate-600">25%</span>
          <span className="text-xs text-slate-600">50%</span>
          <span className="text-xs text-slate-600">75%</span>
          <span className="text-xs text-slate-600">100%</span>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-4 border-t border-white/10">
        <Activity className={`${cfg.text} shrink-0 mt-0.5`} size={18} />
        <p className={`text-sm ${cfg.textLight} leading-relaxed`}>
          {cfg.descripcion}
        </p>
      </div>

    </div>
  )
}