import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Info } from 'lucide-react'

const NOMBRES_CLUSTER = {
  0: 'Cardio-renal',
  1: 'Cardiovascular Inflamatorio',
  2: 'Bajo Riesgo'
}

const COLORES = ['#ef4444', '#f59e0b', '#10b981']

const TooltipPersonalizado = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-3">
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="text-sm text-slate-300">{value}%</p>
    </div>
  )
}

export default function ExplainabilityChart({ probabilidades }) {
  if (!probabilidades?.length) return null

  const datos = probabilidades.map(p => ({
    name: NOMBRES_CLUSTER[p.cluster_id] || `Cluster ${p.cluster_id}`,
    value: Math.round(p.probability * 100),
    cluster_id: p.cluster_id
  }))

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          Probabilidades por perfil clínico
        </h3>
        <p className="text-xs text-slate-500">
          Distribución de probabilidad entre los tres perfiles del modelo
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={datos}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 180, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={170}
            tick={{ fontSize: 13, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {datos.map((entry, index) => (
              <Cell key={index} fill={COLORES[entry.cluster_id]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-xs text-slate-500">Cardio-renal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-xs text-slate-500">Cardiovascular Inflamatorio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-slate-500">Bajo Riesgo</span>
        </div>
      </div>
    </div>
  )
}