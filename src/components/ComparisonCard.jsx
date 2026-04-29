import { ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react'

const NIVEL_CONFIG = {
  Bajo:      { color: 'green',  Icon: ShieldCheck,  text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  Moderado:  { color: 'yellow', Icon: AlertTriangle, text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  Alto:      { color: 'red',    Icon: ShieldAlert,   text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
}

function ModelColumn({ titulo, porcentaje, nivel, descripcion, referencia }) {
  const cfg = NIVEL_CONFIG[nivel]
  const Icon = cfg?.Icon || HelpCircle
  return (
    <div className={`glass-card border rounded-2xl p-5 flex flex-col items-center text-center ${cfg?.border || 'border-white/5'} ${cfg?.bg || ''}`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{titulo}</p>
      {porcentaje != null ? (
        <>
          <div className={`text-4xl font-bold ${cfg?.text || 'text-slate-200'} mb-2`}>{porcentaje}%</div>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${cfg?.text || 'text-slate-300'}`}>
            <Icon size={16} />
            Riesgo {nivel}
          </div>
          {descripcion && <p className="text-xs text-slate-500 mt-3 leading-relaxed">{descripcion}</p>}
        </>
      ) : (
        <div className="text-slate-500 text-sm">No calculado</div>
      )}
      {referencia && <p className="text-[10px] text-slate-600 mt-4 italic">{referencia}</p>}
    </div>
  )
}

export default function ComparisonCard({ riesgoComparativo, probabilidadPropia, nivelPropio }) {
  if (!riesgoComparativo) return null

  const { datos_suficientes, campos_faltantes_framingham, framingham_porcentaje, framingham_nivel, framingham_descripcion,
    scc_porcentaje, scc_nivel, scc_descripcion, factor_ajuste } = riesgoComparativo

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        Comparativa de modelos de riesgo
      </h3>
      {!datos_suficientes && campos_faltantes_framingham?.length > 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-300 flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Datos insuficientes para Framingham y SCC Colombia</p>
            <p className="text-xs text-yellow-400/80">
              Complete los siguientes campos opcionales en el formulario para ver el riesgo calculado por estos modelos:{' '}
              {campos_faltantes_framingham.map(c => {
                const map = {
                  colesterol_total_mgdl: 'Colesterol total',
                  hdl_mgdl: 'HDL',
                  diabetes: 'Diabetes',
                  tratamiento_hta: 'Tto. antihipertensivo',
                  tratamiento_antihipertensivo: 'Tto. antihipertensivo'
                }
                return map[c] || c
              }).join(', ')}.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Modelo propio */}
        <ModelColumn
          titulo="CardioPredict"
          porcentaje={Math.round(probabilidadPropia * 100)}
          nivel={nivelPropio}
          referencia="Modelo XGBoost entrenado con dataset público"
        />
        {/* Framingham */}
        <ModelColumn
          titulo="Framingham 2008"
          porcentaje={framingham_porcentaje}
          nivel={framingham_nivel}
          descripcion={framingham_descripcion}
          referencia="D'Agostino et al. Circulation 2008"
        />
        {/* SCC */}
        <ModelColumn
          titulo="SCC Colombia"
          porcentaje={scc_porcentaje}
          nivel={scc_nivel}
          descripcion={scc_descripcion}
          referencia={`Ajuste ×${factor_ajuste || 0.75} sobre Framingham`}
        />
      </div>
    </div>
  )
}