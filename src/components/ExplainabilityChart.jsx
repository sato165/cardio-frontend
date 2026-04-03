import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { AlertTriangle } from 'lucide-react'

const TooltipPersonalizado = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 max-w-xs">
      <p className="text-sm font-semibold text-gray-800 mb-1">{d.factor}</p>
      <p className="text-xs text-gray-600 leading-relaxed">{d.descripcion}</p>
      {d.advertencia && (
        <p className="text-xs text-yellow-600 mt-2 border-t border-yellow-100 pt-2 leading-relaxed">
          ⚠ {d.advertencia}
        </p>
      )}
    </div>
  )
}

export default function ExplainabilityChart({ explicabilidad }) {
  if (!explicabilidad?.length) return null

  // Mostrar los 10 factores con mayor impacto absoluto
  const datos = explicabilidad
    .slice(0, 10)
    .map(f => ({ ...f, impactoAbs: Math.abs(f.impacto) }))
    .sort((a, b) => a.impactoAbs - b.impactoAbs)

  const tieneAdvertencias = datos.some(d => d.advertencia)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      {/* Encabezado */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-950 mb-1">
          Factores que influyeron en la predicción
        </h3>
        <p className="text-xs text-gray-400">
          Las barras rojas aumentan el riesgo · Las barras azules lo reducen ·
          El tamaño indica la magnitud del impacto
        </p>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={datos}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 160, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            tickFormatter={v => v.toFixed(2)}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="factor"
            width={155}
            tick={{ fontSize: 12, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: '#f9fafb' }} />
          <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1.5} />
          <Bar dataKey="impacto" radius={[0, 4, 4, 0]} maxBarSize={20}>
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

      {/* Leyenda de niveles */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-xs text-gray-500">Aumenta el riesgo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-xs text-gray-500">Reduce el riesgo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-100" />
          <span className="text-xs text-gray-500">Crítico</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-75" />
          <span className="text-xs text-gray-500">Moderado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 opacity-50" />
          <span className="text-xs text-gray-500">Leve</span>
        </div>
      </div>

      {/* Advertencias de subregistro */}
      {tieneAdvertencias && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
          <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
          <div className="space-y-1">
            {datos.filter(d => d.advertencia).map((d, i) => (
              <p key={i} className="text-xs text-yellow-700 leading-relaxed">
                {d.advertencia}
              </p>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
