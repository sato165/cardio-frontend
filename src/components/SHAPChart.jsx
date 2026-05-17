import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { Sparkles, ChevronDown, Info } from 'lucide-react'

// ── k=4 clusters — modelo final ────────────────────────────────────────────
const CLUSTER_NAMES = {
  0: 'Cardiovascular',
  1: 'Bajo riesgo',
  2: 'Cardiometabólico',
  3: 'Cardiorrenal',
}

const CLUSTER_COLORS = {
  0: '#f97316',   // orange
  1: '#10b981',   // green
  2: '#f59e0b',   // yellow
  3: '#ef4444',   // red
}

// ── Tooltip personalizado ───────────────────────────────────────────────────
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

  const feature     = p.name.split('(')[0].trim()
  const patientVal  = p.feature_value ?? '?'
  const impacto     = p.delta > 0
    ? 'Aumenta la probabilidad de este perfil'
    : 'Reduce la probabilidad de este perfil'

  return (
    <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-3 max-w-xs">
      <p className="text-sm font-semibold text-white capitalize">{feature}</p>
      <p className="text-xs text-slate-500">Valor del paciente: {patientVal}</p>
      <p className={`text-sm font-mono ${p.delta >= 0 ? 'text-red-400' : 'text-green-400'}`}>
        {p.delta >= 0 ? '+' : ''}{p.delta.toFixed(4)} log‑odds
      </p>
      <p className="text-xs text-slate-400 mt-1">{impacto}</p>
    </div>
  )
}

// ── Barra waterfall personalizada ───────────────────────────────────────────
const WaterfallBar = (props) => {
  const { x, y, width, height, payload } = props
  if (!payload) return null

  if (payload.isBase) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height}
          fill="transparent" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" />
        <text x={x + width + 6} y={y + height / 2}
          textAnchor="start" dominantBaseline="middle"
          fill="#818cf8" fontSize={11} fontFamily="monospace">
          {payload.value.toFixed(3)}
        </text>
      </g>
    )
  }

  const fill = payload.delta >= 0 ? '#ef4444' : '#10b981'
  return (
    <g>
      <rect x={x} y={y} width={width} height={height}
        fill={fill} fillOpacity={0.85} rx={3} />
      <text x={x + width + 6} y={y + height / 2}
        textAnchor="start" dominantBaseline="middle"
        fill="#cbd5e1" fontSize={11} fontFamily="monospace">
        {payload.delta >= 0 ? '+' : ''}{payload.delta.toFixed(4)}
      </text>
    </g>
  )
}

// ── Construcción de datos waterfall ────────────────────────────────────────
function buildWaterfallData(explainData, clusterId) {
  const { shap_values, base_values } = explainData
  const clusterKey = CLUSTER_NAMES[clusterId]
  const features   = shap_values?.[clusterKey] ?? []
  const base       = base_values?.[clusterKey]  ?? 0

  if (!features.length) return { data: [], finalScore: base }

  // Ordenar por valor absoluto descendente
  const sorted  = [...features].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
  const TOP_N   = 10
  const top     = sorted.slice(0, TOP_N)
  const rest    = sorted.slice(TOP_N)
  const restSum = rest.reduce((s, f) => s + f.shap_value, 0)

  const rows = []

  // Fila: valor base
  rows.push({
    name:    'Valor base',
    value:   base,
    delta:   0,
    isBase:  true,
    fill:    '#6366f1',
  })

  let cumulative = base
  top.forEach(f => {
    cumulative += f.shap_value
    rows.push({
      name:          `${f.feature} (${f.feature_value ?? '?'})`,
      value:         cumulative,
      delta:         f.shap_value,
      feature_value: f.feature_value,
      isBase:        false,
      fill:          f.shap_value >= 0 ? '#ef4444' : '#10b981',
    })
  })

  if (rest.length > 0) {
    cumulative += restSum
    rows.push({
      name:    `Otras (${rest.length} variables)`,
      value:   cumulative,
      delta:   restSum,
      isBase:  false,
      fill:    restSum >= 0 ? '#ef4444' : '#10b981',
    })
  }

  return { data: rows, finalScore: cumulative }
}

// ── Componente principal ────────────────────────────────────────────────────
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
  const chartHeight = Math.max(400, data.length * 30)

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">

      {/* Cabecera */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            Explicación detallada (Waterfall SHAP)
          </h3>
          <p className="text-xs text-slate-500">
            Contribución de cada variable al score del perfil seleccionado.
            Se parte del valor base y cada barra muestra el cambio en log‑odds.
          </p>
        </div>

        {/* Selector de los 4 perfiles */}
        <div className="relative">
          <select
            value={selectedCluster}
            onChange={e => setSelectedCluster(Number(e.target.value))}
            className="appearance-none bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(CLUSTER_NAMES).map(([id, name]) => (
              <option key={id} value={id}>
                {name}{Number(id) === explainData.predicted_cluster ? ' ★ predicho' : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Indicador de color del cluster seleccionado */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: CLUSTER_COLORS[selectedCluster] }}
        />
        <span className="text-sm text-slate-300 font-medium">
          {CLUSTER_NAMES[selectedCluster]}
        </span>
        {selectedCluster === explainData.predicted_cluster && (
          <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            Perfil predicho
          </span>
        )}
      </div>

      {/* Gráfico waterfall */}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 90, left: 170, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#cbd5e1' }}
            axisLine={false}
            tickLine={false}
            width={165}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar
            dataKey="value"
            shape={<WaterfallBar />}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Resumen */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-white/5 pt-4">
        <div>
          Valor base:
          <span className="font-mono text-indigo-300 ml-1">
            {data[0]?.value.toFixed(4)}
          </span>
        </div>
        <div>
          Score final —
          <span className="text-white font-medium mx-1">
            {CLUSTER_NAMES[selectedCluster]}
          </span>:
          <span className="font-mono text-white ml-1">{finalScore.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Info size={12} />
          <span>Escala log‑odds. Mayor valor → mayor probabilidad del perfil.</span>
        </div>
      </div>

      {/* Leyenda de colores */}
      <div className="mt-3 flex items-center gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-85" />
          <span>Aumenta probabilidad del perfil</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500 opacity-85" />
          <span>Reduce probabilidad del perfil</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border-2 border-dashed border-indigo-500" />
          <span>Valor base</span>
        </div>
      </div>
    </div>
  )
}