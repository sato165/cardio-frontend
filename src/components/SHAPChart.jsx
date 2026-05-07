import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { Sparkles, ChevronDown, Info } from 'lucide-react'

const CLUSTER_COLORS = ['#ef4444', '#f59e0b', '#10b981']
const CLUSTER_NAMES = {
  0: 'Cardio-renal',
  1: 'Cardiovascular Inflamatorio',
  2: 'Bajo Riesgo'
}

// Componente personalizado para cada barra del waterfall
const WaterfallBar = (props) => {
  const { x, y, width, height, fill, payload } = props
  if (!payload) return null
  // payload.isBase => barra del valor base, se dibuja solo el contorno
  if (payload.isBase) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="transparent" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" />
        <text x={x + width + 4} y={y + height/2} textAnchor="start" dominantBaseline="middle" fill="#818cf8" fontSize={12} className="font-mono">
          {payload.value.toFixed(3)}
        </text>
      </g>
    )
  }
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.9} rx={2} />
      {/* Etiqueta interna con el valor shap */}
      <text x={x + width + 4} y={y + height/2} textAnchor="start" dominantBaseline="middle" fill="#cbd5e1" fontSize={11} className="font-mono">
        {payload.delta >= 0 ? '+' : ''}{payload.delta.toFixed(4)}
      </text>
    </g>
  )
}

// Tooltip personalizado
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  if (p.isBase) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-3 max-w-xs">
        <p className="text-sm font-semibold text-white">Valor base</p>
        <p className="text-xs text-slate-400">Predicción promedio para este perfil (log‑odds)</p>
        <p className="font-mono text-indigo-400">{p.value.toFixed(4)}</p>
      </div>
    )
  }
  const feature = p.name.split('(')[0] // extract feature name
  const patientValue = p.feature_value ?? '?'
  const impacto = p.delta > 0 ? 'Aumenta el riesgo para este perfil' : 'Reduce el riesgo para este perfil'
  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-3 max-w-xs">
      <p className="text-sm font-semibold text-white capitalize">{feature}</p>
      <p className="text-xs text-slate-500">Valor del paciente: {patientValue}</p>
      <p className={`text-sm font-mono ${p.delta >= 0 ? 'text-red-400' : 'text-green-400'}`}>
        {p.delta >= 0 ? '+' : ''}{p.delta.toFixed(4)} log‑odds
      </p>
      <p className="text-xs text-slate-400 mt-1">{impacto}</p>
    </div>
  )
}

// Función para construir los datos del waterfall a partir de explainData
function buildWaterfallData(explainData, clusterId) {
  const { shap_values, base_values } = explainData
  const clusterKey = CLUSTER_NAMES[clusterId]
  const features = shap_values[clusterKey] || []
  const base = base_values[clusterKey]

  if (!features.length) return { data: [], finalScore: base }

  // Ordenar por valor absoluto
  const sorted = [...features].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
  const topN = 10
  const top = sorted.slice(0, topN)
  const otherFeatures = sorted.slice(topN)
  const otherShap = otherFeatures.reduce((sum, f) => sum + f.shap_value, 0)

  const waterfallData = []

  // Barra del valor base
  waterfallData.push({
    name: 'Valor base',
    value: base,
    delta: 0,
    cumulative: base,
    isBase: true,
    fill: '#6366f1',
  })

  let cumulative = base
  top.forEach((f) => {
    cumulative += f.shap_value
    waterfallData.push({
      name: `${f.feature} (${f.feature_value})`,
      value: cumulative, // necesario para la posición
      delta: f.shap_value,
      cumulative,
      feature_value: f.feature_value,
      fill: f.shap_value >= 0 ? '#ef4444' : '#10b981',
    })
  })

  if (otherFeatures.length > 0) {
    cumulative += otherShap
    waterfallData.push({
      name: `Otras (${otherFeatures.length} variables)`,
      value: cumulative,
      delta: otherShap,
      cumulative,
      fill: otherShap >= 0 ? '#ef4444' : '#10b981',
    })
  }

  return { data: waterfallData, finalScore: cumulative }
}

export default function SHAPChart({ explainData }) {
  const [selectedCluster, setSelectedCluster] = useState(
    explainData?.predicted_cluster ?? 0
  )

  const waterfall = useMemo(() => {
    if (!explainData) return null
    return buildWaterfallData(explainData, selectedCluster)
  }, [explainData, selectedCluster])

  if (!waterfall) return null

  const { data, finalScore } = waterfall

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            Explicación detallada (Waterfall)
          </h3>
          <p className="text-xs text-slate-500">
            Contribución de cada variable al score del perfil seleccionado. Se parte del valor base (riesgo promedio) y cada barra muestra el cambio en log‑odds.
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
                {name} {Number(id) === explainData.predicted_cluster ? '(predicho)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(400, data.length * 28)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 80, left: 160, bottom: 0 }}
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
            dataKey="name"
            tick={{ fontSize: 12, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            width={150}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="value"
            shape={<WaterfallBar />}
            // Para que Recharts no apile, usamos un único bar
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Resumen final */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <div>
          Valor base (promedio): <span className="font-mono text-indigo-300">{data[0]?.value.toFixed(4)}</span>
        </div>
        <div>
          Score final para <span className="text-white font-medium">{CLUSTER_NAMES[selectedCluster]}</span>:
          <span className="font-mono text-white ml-1">{finalScore.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Info size={12} />
          <span>Los valores están en escala log‑odds. Cuanto mayor, más probable es el perfil.</span>
        </div>
      </div>
    </div>
  )
}