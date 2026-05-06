import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { Sparkles, ChevronDown } from 'lucide-react'

const CLUSTER_COLORS = ['#ef4444', '#f59e0b', '#10b981']
const CLUSTER_NAMES = {
  0: 'Cardio-renal',
  1: 'Cardiovascular Inflamatorio',
  2: 'Bajo Riesgo'
}

const TooltipPersonalizado = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { feature, shap_value } = payload[0].payload
  const val = shap_value
  const impacto = val > 0 ? 'Aumenta el riesgo para este perfil' : 'Reduce el riesgo para este perfil'
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-3 max-w-xs">
      <p className="text-sm font-semibold text-white capitalize">{feature}</p>
      <p className={`text-sm font-mono ${val >= 0 ? 'text-red-400' : 'text-green-400'}`}>
        {val >= 0 ? '+' : ''}{val.toFixed(4)}
      </p>
      <p className="text-xs text-slate-500 mt-1">{impacto}</p>
    </div>
  )
}

export default function SHAPChart({ explainData }) {
  const [selectedCluster, setSelectedCluster] = useState(
    explainData?.predicted_cluster ?? 0
  )

  if (!explainData) return null

  const { shap_values, base_values, predicted_cluster, cluster_name } = explainData
  const clusterId = selectedCluster
  const clusterKey = CLUSTER_NAMES[clusterId]
  const features = shap_values[clusterKey] || []
  // Ordenar por valor absoluto descendente
  const sorted = [...features]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
  // Limitar a las 15 más importantes para claridad
  const top = sorted.slice(0, 15)

  const dataChart = top.map(f => ({
    feature: f.feature,
    shap_value: f.shap_value,
    fill: f.shap_value >= 0 ? '#ef4444' : '#10b981'
  }))

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            Explicación SHAP
          </h3>
          <p className="text-xs text-slate-500">
            Contribución de cada variable a la predicción del perfil seleccionado
          </p>
        </div>
        {/* Selector de perfil */}
        <div className="relative">
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(Number(e.target.value))}
            className="appearance-none bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(CLUSTER_NAMES).map(([id, name]) => (
              <option key={id} value={id}>
                {name} {Number(id) === predicted_cluster ? '(predicho)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(350, top.length * 24)}>
        <BarChart
          data={dataChart}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 120, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fontSize: 12, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="shap_value" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {dataChart.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="shap_value"
              position="right"
              formatter={v => v.toFixed(3)}
              style={{ fontSize: '10px', fill: '#94a3b8' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {base_values && (
        <div className="mt-4 text-xs text-slate-500">
          Valor base (intercepto) para <span className="text-white font-medium">{clusterKey}</span>: <span className="font-mono text-slate-300">{base_values[clusterKey]?.toFixed(4)}</span>
        </div>
      )}
    </div>
  )
}