import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react'

const TooltipPersonalizado = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-4 max-w-xs">
      <p className="text-sm font-semibold text-white mb-1">{d.factor}</p>
      <p className="text-xs text-slate-300 leading-relaxed">{d.descripcion}</p>
      {d.advertencia && (
        <p className="text-xs text-yellow-400 mt-3 pt-3 border-t border-yellow-500/20 leading-relaxed flex items-start gap-1.5">
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          {d.advertencia}
        </p>
      )}
    </div>
  )
}

export default function ExplainabilityChart({ explicabilidad }) {
  if (!explicabilidad?.length) return null

  const datos = explicabilidad
    .slice(0, 10)
    .map(f => ({ ...f, impactoAbs: Math.abs(f.impacto) }))
    .sort((a, b) => a.impactoAbs - b.impactoAbs)

  const tieneAdvertencias = datos.some(d => d.advertencia)

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          Factores que influyeron en la predicción
        </h3>
        <p className="text-xs text-slate-500">
          Las barras rojas aumentan el riesgo · Las barras azules lo reducen · 
          El tamaño indica la magnitud del impacto
        </p>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={datos}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 140, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            tickFormatter={v => v.toFixed(2)}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="factor"
            width={135}
            tick={{ fontSize: 12, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine x={0} stroke="#334155" strokeWidth={1.5} />
          <Bar dataKey="impacto" radius={[0, 6, 6, 0]} maxBarSize={24}>
            {datos.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.impacto > 0 ? '#ef4444' : '#3b82f6'}
                fillOpacity={
                  entry.nivel === 'crítico' ? 1 :
                  entry.nivel === 'moderado' ? 0.75 : 0.5
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-xs text-slate-500">Aumenta el riesgo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-xs text-slate-500">Reduce el riesgo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-100" />
          <span className="text-xs text-slate-500">Crítico</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-75" />
          <span className="text-xs text-slate-500">Moderado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-50" />
          <span className="text-xs text-slate-500">Leve</span>
        </div>
      </div>

      {tieneAdvertencias && (
        <div className="mt-5 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 animate-scale-in">
          <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1.5">
            {datos.filter(d => d.advertencia).map((d, i) => (
              <p key={i} className="text-xs text-yellow-300/80 leading-relaxed">
                {d.advertencia}
              </p>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}