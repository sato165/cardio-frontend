import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'

const CONFIG_RIESGO = {
  Alto: {
    color: 'red',
    bg: 'bg-red-50',
    border: 'border-red-200',
    texto: 'text-red-700',
    barra: 'bg-red-500',
    icono: ShieldAlert,
    descripcion: 'El paciente presenta alto riesgo de enfermedad cardiovascular. Se recomienda evaluación clínica inmediata.',
  },
  Moderado: {
    color: 'yellow',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    texto: 'text-yellow-700',
    barra: 'bg-yellow-500',
    icono: AlertTriangle,
    descripcion: 'El paciente presenta riesgo moderado. Se recomienda seguimiento y control de factores de riesgo.',
  },
  Bajo: {
    color: 'green',
    bg: 'bg-green-50',
    border: 'border-green-200',
    texto: 'text-green-700',
    barra: 'bg-green-500',
    icono: ShieldCheck,
    descripcion: 'El paciente presenta bajo riesgo cardiovascular. Se recomienda mantener hábitos saludables.',
  },
}

export default function ResultCard({ resultado }) {
  if (!resultado) return null

  const { nivel_riesgo, probabilidad } = resultado
  const cfg = CONFIG_RIESGO[nivel_riesgo] ?? CONFIG_RIESGO['Moderado']
  const Icono = cfg.icono
  const pct = Math.round(probabilidad * 100)

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6`}>

      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-5">
        <Icono className={cfg.texto} size={28} />
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
            Resultado de la predicción
          </p>
          <h2 className={`text-2xl font-bold ${cfg.texto}`}>
            Riesgo {nivel_riesgo}
          </h2>
        </div>
      </div>

      {/* Barra de probabilidad */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600 font-medium">
            Probabilidad de riesgo cardiovascular
          </span>
          <span className={`text-2xl font-bold ${cfg.texto}`}>
            {pct}%
          </span>
        </div>
        <div className="h-3 bg-white rounded-full border border-gray-200 overflow-hidden">
          <div
            className={`h-full ${cfg.barra} rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">0%</span>
          <span className="text-xs text-gray-400">100%</span>
        </div>
      </div>

      {/* Descripción clínica */}
      <p className="text-sm text-gray-600 border-t border-white/60 pt-4 mt-4 leading-relaxed">
        {cfg.descripcion}
      </p>

    </div>
  )
}
