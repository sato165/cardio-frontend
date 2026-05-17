import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Sparkles, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// ── Configuración k=4 ──────────────────────────────────────────────────────
const CLUSTERS = [
  { id: 0, name: 'Cardiovascular',    color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.4)'  },
  { id: 1, name: 'Bajo riesgo',       color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)' },
  { id: 2, name: 'Cardiometabólico',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
  { id: 3, name: 'Cardiorrenal',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.4)'  },
]

// Unidades clínicas por variable para mejorar la interpretación
const UNITS = {
  c_total:        'mg/dL',
  creatinina:     'mg/dL',
  glucosa:        'mg/dL',
  hdl:            'mg/dL',
  ldl:            'mg/dL',
  trigliceridos:  'mg/dL',
  hemoglobina:    'g/dL',
  leucocitos:     'K/µL',
  plaquetas:      'K/µL',
  edad:           'años',
  peso:           'kg',
  talla:          'm',
  imc:            'kg/m²',
  TFG:            'mL/min',
  ta_sistolica:   'mmHg',
  ta_diastolica:  'mmHg',
  sexo:           '',
  zona:           '',
  ap_hipertension:'',
}

const LABELS = {
  c_total:        'Colesterol total',
  creatinina:     'Creatinina',
  glucosa:        'Glucosa',
  hdl:            'HDL',
  ldl:            'LDL',
  trigliceridos:  'Triglicéridos',
  hemoglobina:    'Hemoglobina',
  leucocitos:     'Leucocitos',
  plaquetas:      'Plaquetas',
  edad:           'Edad',
  peso:           'Peso',
  talla:          'Talla',
  imc:            'IMC',
  TFG:            'TFG',
  ta_sistolica:   'TA sistólica',
  ta_diastolica:  'TA diastólica',
  sexo:           'Sexo',
  zona:           'Zona',
  ap_hipertension:'HTA',
}

// ── Tooltip ────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, clusterColor }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null

  if (d.isBase) {
    return (
      <div style={{
        background: 'rgba(15,23,42,0.97)',
        border: '1px solid rgba(99,102,241,0.4)',
        borderRadius: 12,
        padding: '10px 14px',
        maxWidth: 240,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: '#818cf8', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Valor base</p>
        <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>
          Predicción promedio del modelo para este perfil (log-odds)
        </p>
        <p style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 14 }}>
          {d.baseVal.toFixed(4)}
        </p>
      </div>
    )
  }

  const unit = UNITS[d.featureKey] || ''
  const valDisplay = unit
    ? `${d.featureValue} ${unit}`
    : d.featureValue === 1 ? 'Sí' : d.featureValue === 0 ? 'No' : d.featureValue

  const isPos = d.shap > 0
  return (
    <div style={{
      background: 'rgba(15,23,42,0.97)',
      border: `1px solid ${isPos ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
      borderRadius: 12,
      padding: '10px 14px',
      maxWidth: 260,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
        {d.label}
      </p>
      <p style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>
        Valor del paciente: <span style={{ color: '#cbd5e1' }}>{valDisplay}</span>
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{
          color: isPos ? '#f87171' : '#34d399',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 14,
        }}>
          {isPos ? '+' : ''}{d.shap.toFixed(4)}
        </span>
        <span style={{ color: '#475569', fontSize: 11 }}>log-odds</span>
      </div>
      <p style={{ color: isPos ? '#fca5a5' : '#6ee7b7', fontSize: 11 }}>
        {isPos ? '▲ Aumenta' : '▼ Reduce'} la probabilidad de este perfil
      </p>
      {d.pctAbs !== undefined && (
        <p style={{ color: '#64748b', fontSize: 10, marginTop: 4 }}>
          Peso relativo: {d.pctAbs.toFixed(1)}% del impacto total
        </p>
      )}
    </div>
  )
}

// ── Barra waterfall correcta ───────────────────────────────────────────────
// Recharts en layout vertical calcula x/y/width/height a partir de dataKey="shap"
// (el delta). Añadimos un "start" invisible con dataKey="start" para el offset.
// Usamos dos <Bar>: una transparente de offset + una de delta coloreada.
const WaterfallBarShape = ({ x, y, width, height, payload, clusterColor }) => {
  if (!payload) return null

  if (payload.isBase) {
    return (
      <g>
        <rect
          x={x} y={y} width={width} height={Math.max(height, 2)}
          fill="transparent"
          stroke="#6366f1"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          rx={3}
        />
        <text
          x={x + width + 8} y={y + Math.max(height, 2) / 2}
          textAnchor="start" dominantBaseline="middle"
          fill="#a5b4fc" fontSize={10} fontFamily="monospace"
        >
          {payload.baseVal?.toFixed(3)}
        </text>
      </g>
    )
  }

  const isPos = payload.shap >= 0
  const barColor = isPos ? '#ef4444' : '#10b981'
  const barH = Math.max(Math.abs(height), 2)

  return (
    <g>
      <rect
        x={x} y={y} width={width} height={barH}
        fill={barColor} fillOpacity={0.82} rx={3}
      />
      <text
        x={x + width + 8} y={y + barH / 2}
        textAnchor="start" dominantBaseline="middle"
        fill="#94a3b8" fontSize={10} fontFamily="monospace"
      >
        {isPos ? '+' : ''}{payload.shap?.toFixed(4)}
      </text>
    </g>
  )
}

// ── Construcción de datos waterfall (delta + acumulado para offset) ────────
function buildWaterfall(explainData, clusterId) {
  const cluster    = CLUSTERS[clusterId]
  const features   = explainData.shap_values?.[cluster.name] ?? []
  const base       = explainData.base_values?.[cluster.name]  ?? 0
  const TOP_N      = 10

  if (!features.length) return { rows: [], base, finalScore: base, totalAbsShap: 0 }

  const sorted     = [...features].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
  const top        = sorted.slice(0, TOP_N)
  const rest       = sorted.slice(TOP_N)
  const restSum    = rest.reduce((s, f) => s + f.shap_value, 0)
  const totalAbs   = sorted.reduce((s, f) => s + Math.abs(f.shap_value), 0)

  const rows = []

  // Fila base (offset=0, shap=base)
  rows.push({
    name:         'Valor base',
    featureKey:   '_base',
    label:        'Valor base',
    start:        0,
    shap:         base,
    baseVal:      base,
    featureValue: null,
    pctAbs:       null,
    isBase:       true,
  })

  let cumulative = base
  for (const f of top) {
    const fKey = f.feature
    rows.push({
      name:         LABELS[fKey] || fKey,
      featureKey:   fKey,
      label:        LABELS[fKey] || fKey,
      start:        f.shap >= 0 ? cumulative : cumulative + f.shap_value,
      shap:         f.shap_value,
      baseVal:      base,
      featureValue: f.feature_value,
      pctAbs:       totalAbs > 0 ? (Math.abs(f.shap_value) / totalAbs) * 100 : 0,
      isBase:       false,
    })
    cumulative += f.shap_value
  }

  if (rest.length > 0) {
    rows.push({
      name:         `Otras ${rest.length} variables`,
      featureKey:   '_rest',
      label:        `Otras ${rest.length} variables`,
      start:        restSum >= 0 ? cumulative : cumulative + restSum,
      shap:         restSum,
      baseVal:      base,
      featureValue: null,
      pctAbs:       totalAbs > 0 ? (Math.abs(restSum) / totalAbs) * 100 : 0,
      isBase:       false,
    })
    cumulative += restSum
  }

  return { rows, base, finalScore: cumulative, totalAbsShap: totalAbs }
}

// ── Mini-badge de impacto relativo ─────────────────────────────────────────
function ImpactBadge({ pct }) {
  const w = Math.min(pct, 100)
  return (
    <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, display: 'inline-block', verticalAlign: 'middle' }}>
      <div style={{ width: `${w}%`, height: '100%', background: '#6366f1', borderRadius: 2 }} />
    </div>
  )
}

// ── Panel lateral: top contribuyentes en texto ─────────────────────────────
function TopContributors({ rows, cluster }) {
  const items = rows
    .filter(r => !r.isBase && r.featureKey !== '_rest')
    .slice(0, 5)

  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)',
      border: `1px solid ${cluster.border}`,
      borderRadius: 14,
      padding: '14px 16px',
    }}>
      <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
        Principales factores
      </p>
      {items.map((r, i) => {
        const isPos = r.shap > 0
        const unit  = UNITS[r.featureKey] || ''
        const val   = unit ? `${r.featureValue} ${unit}`
          : r.featureValue === 1 ? 'Sí'
          : r.featureValue === 0 ? 'No'
          : r.featureValue ?? '—'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 4,
              background: isPos ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {isPos
                ? <TrendingUp size={11} color="#f87171" />
                : <TrendingDown size={11} color="#34d399" />
              }
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.label}
                </span>
                <span style={{ color: isPos ? '#f87171' : '#34d399', fontFamily: 'monospace', fontSize: 11, flexShrink: 0, marginLeft: 6 }}>
                  {isPos ? '+' : ''}{r.shap.toFixed(3)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <span style={{ color: '#64748b', fontSize: 10 }}>{val}</span>
                <ImpactBadge pct={r.pctAbs ?? 0} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function SHAPChart({ explainData }) {
  const [selectedId, setSelectedId] = useState(explainData?.predicted_cluster ?? 0)

  const cluster   = CLUSTERS[selectedId]
  const waterfall = useMemo(() => buildWaterfall(explainData, selectedId), [explainData, selectedId])

  if (!explainData) return null

  const { rows, base, finalScore } = waterfall
  const chartHeight = Math.max(380, rows.length * 36 + 40)

  return (
    <div style={{
      background: 'rgba(15,23,42,0.85)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 20,
      padding: '24px',
      backdropFilter: 'blur(12px)',
    }}>

      {/* ── Cabecera ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Sparkles size={17} color="#818cf8" />
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, margin: 0 }}>
            Explicación SHAP — Waterfall
          </h3>
        </div>
        <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
          Cada barra muestra cuánto empuja una variable hacia o en contra de este perfil clínico, partiendo del valor base del modelo.
        </p>
      </div>

      {/* ── Selector de perfiles ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {CLUSTERS.map(c => {
          const isActive    = c.id === selectedId
          const isPredicho  = c.id === explainData.predicted_cluster
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 10,
                border: isActive ? `1.5px solid ${c.color}` : '1.5px solid rgba(255,255,255,0.08)',
                background: isActive ? c.bg : 'transparent',
                color: isActive ? '#f1f5f9' : '#64748b',
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: isActive ? c.color : '#334155',
                flexShrink: 0,
              }} />
              {c.name}
              {isPredicho && (
                <span style={{
                  fontSize: 9, color: c.color,
                  background: `${c.color}22`,
                  border: `1px solid ${c.color}44`,
                  borderRadius: 4, padding: '1px 4px', marginLeft: 2,
                }}>
                  ★ predicho
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Contenido principal: gráfico + panel lateral ─────────────── */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Gráfico waterfall */}
        <div style={{ flex: '1 1 400px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 4, right: 80, left: 140, bottom: 4 }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#475569' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v.toFixed(2)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={135}
              />
              <Tooltip
                content={<CustomTooltip clusterColor={cluster.color} />}
                cursor={{ fill: 'rgba(255,255,255,0.025)' }}
              />

              {/* Barra de offset (invisible): empuja la barra coloreada al lugar correcto */}
              <Bar dataKey="start" stackId="wf" fill="transparent" isAnimationActive={false} legendType="none" />

              {/* Barra real: delta (shap o base) */}
              <Bar dataKey="shap" stackId="wf" isAnimationActive={true} shape={<WaterfallBarShape />} barSize={20}>
                {rows.map((r, i) => (
                  <Cell
                    key={i}
                    fill={r.isBase ? 'transparent' : r.shap >= 0 ? '#ef4444' : '#10b981'}
                    fillOpacity={r.isBase ? 0 : 0.82}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Panel lateral */}
        <div style={{ flexShrink: 0, width: 220 }}>
          <TopContributors rows={rows} cluster={cluster} />
        </div>
      </div>

      {/* ── Resumen numérico ──────────────────────────────────────────── */}
      <div style={{
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'center',
      }}>
        <div>
          <span style={{ color: '#475569', fontSize: 11 }}>Valor base </span>
          <span style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 13 }}>{base.toFixed(4)}</span>
        </div>
        <div>
          <span style={{ color: '#475569', fontSize: 11 }}>Score final — </span>
          <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>{cluster.name}</span>
          <span style={{ color: '#f1f5f9', fontFamily: 'monospace', fontSize: 13, marginLeft: 6 }}>{finalScore.toFixed(4)}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: '#334155', fontSize: 11 }}>
          <Info size={11} />
          <span>Escala log-odds. Mayor valor → mayor probabilidad del perfil.</span>
        </div>
      </div>

      {/* ── Leyenda ───────────────────────────────────────────────────── */}
      <div style={{ marginTop: 10, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {[
          { color: '#ef4444', label: 'Aumenta probabilidad del perfil' },
          { color: '#10b981', label: 'Reduce probabilidad del perfil'  },
          { color: null,      label: 'Valor base (promedio del modelo)', dashed: true },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.dashed
              ? <div style={{ width: 14, height: 14, borderRadius: 3, border: '2px dashed #6366f1' }} />
              : <div style={{ width: 14, height: 14, borderRadius: 3, background: item.color, opacity: 0.85 }} />
            }
            <span style={{ color: '#475569', fontSize: 11 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
