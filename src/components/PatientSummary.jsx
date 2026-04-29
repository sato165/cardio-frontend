import { User, Activity, Heart, FlaskConical, Cigarette, Dumbbell, TrendingUp, Scale, Droplets } from 'lucide-react'

function calcularIMC(peso, altura) {
  if (!peso || !altura) return null
  return (peso / (altura / 100) ** 2).toFixed(1)
}

function calcularPulsoPres(apHi, apLo) {
  if (!apHi || !apLo) return null
  return apHi - apLo
}

function categoriaPANombre(apHi, apLo) {
  if (!apHi || !apLo) return null
  if (apHi < 120 && apLo < 80)  return 'Normal'
  if (apHi < 130 && apLo < 80)  return 'Elevada'
  if (apHi < 140 || apLo < 90)  return 'HTA grado 1'
  return 'HTA grado 2'
}

function categoriaPAColor(apHi, apLo) {
  if (!apHi || !apLo) return 'gray'
  if (apHi < 120 && apLo < 80)  return 'green'
  if (apHi < 130 && apLo < 80)  return 'yellow'
  if (apHi < 140 || apLo < 90)  return 'orange'
  return 'red'
}

function categoriaIMCNombre(bmi) {
  if (!bmi) return null
  const v = parseFloat(bmi)
  if (v < 18.5) return 'Bajo peso'
  if (v < 25)   return 'Normal'
  if (v < 30)   return 'Sobrepeso'
  if (v < 35)   return 'Obesidad I'
  if (v < 40)   return 'Obesidad II'
  return 'Obesidad III'
}

function scoreMetabolico(colesterol, gluc, bmi) {
  if (!colesterol || !gluc || !bmi) return null
  return (
    (parseInt(colesterol) > 1 ? 1 : 0) +
    (parseInt(gluc) > 1 ? 1 : 0) +
    (parseFloat(bmi) >= 30 ? 1 : 0)
  )
}

function nivelColesterol(v) {
  const map = { '1': 'Normal', '2': 'Por encima de lo normal', '3': 'Muy por encima de lo normal' }
  return map[String(v)] ?? '-'
}

function nivelGlucosa(v) {
  return nivelColesterol(v)
}

function nombreGenero(v) {
  return String(v) === '1' ? 'Mujer' : String(v) === '2' ? 'Hombre' : '-'
}

function SectionHeader({ titulo, icono }) {
  const IconComponent = icono
  return (
    <div className="flex items-center gap-2 mb-4">
      <IconComponent size={16} className="text-blue-400" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {titulo}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
    </div>
  )
}

function Dato({ label, valor, sub, badge, badgeColor }) {
  const colores = {
    green:  'bg-green-500/20 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    red:    'bg-red-500/20 text-red-300 border-red-500/30',
    blue:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
    gray:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-slate-200">{valor ?? '—'}</span>
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${colores[badgeColor] ?? colores.gray}`}>
            {badge}
          </span>
        )}
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
    </div>
  )
}

function Separador() {
  return <div className="border-t border-white/5 my-5" />
}

export default function PatientSummary({ paciente }) {
  if (!paciente) return null

  const {
    age_days, age_years, gender, height, weight,
    ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active,
  } = paciente

  const edad = age_years
    ? parseFloat(age_years).toFixed(0)
    : age_days
      ? (age_days / 365.25).toFixed(0)
      : null

  const bmi      = calcularIMC(weight, height)
  const pulso    = calcularPulsoPres(ap_hi, ap_lo)
  const catPA    = categoriaPANombre(ap_hi, ap_lo)
  const colorPA  = categoriaPAColor(ap_hi, ap_lo)
  const catIMC   = categoriaIMCNombre(bmi)
  const scoreMet = scoreMetabolico(cholesterol, gluc, bmi)

  const scoreColor = scoreMet === 0 ? 'green' : scoreMet === 1 ? 'yellow' : scoreMet === 2 ? 'orange' : 'red'

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">

      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <User size={18} className="text-blue-400" />
        Datos del paciente evaluado
      </h3>

      <div className="space-y-1">
        <SectionHeader icono={User} titulo="Datos personales" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Dato label="Edad" valor={edad ? `${edad} años` : null} />
          <Dato label="Género" valor={nombreGenero(gender)} />
          <Dato label="Altura" valor={height ? `${height} cm` : null} />
          <Dato label="Peso" valor={weight ? `${weight} kg` : null} />
        </div>

        <Separador />

        <SectionHeader icono={Heart} titulo="Presión arterial" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Dato label="Sistólica" valor={ap_hi ? `${ap_hi} mmHg` : null} />
          <Dato label="Diastólica" valor={ap_lo ? `${ap_lo} mmHg` : null} />
          <Dato label="Pulso de presión" valor={pulso ? `${pulso} mmHg` : null}
            sub="(sistólica − diastólica)" />
          <Dato label="Categoría AHA" valor={catPA}
            badge={catPA} badgeColor={colorPA} />
        </div>

        <Separador />

        <SectionHeader icono={FlaskConical} titulo="Exámenes clínicos" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Dato label="Colesterol" valor={nivelColesterol(cholesterol)} />
          <Dato label="Glucosa" valor={nivelGlucosa(gluc)} />
          <Dato
            label="IMC"
            valor={bmi ? `${bmi} kg/m²` : null}
            badge={catIMC}
            badgeColor={
              catIMC === 'Normal' ? 'green' :
              catIMC === 'Sobrepeso' ? 'yellow' :
              catIMC === 'Bajo peso' ? 'blue' : 'red'
            }
          />
                    {/* ─── Nuevos campos Framingham ─── */}
          {paciente.colesterol_total_mgdl !== undefined && paciente.colesterol_total_mgdl !== null && (
            <Dato label="Colesterol total" valor={`${paciente.colesterol_total_mgdl} mg/dL`} />
          )}
          {paciente.hdl_mgdl !== undefined && paciente.hdl_mgdl !== null && (
            <Dato label="HDL" valor={`${paciente.hdl_mgdl} mg/dL`} />
          )}
          {paciente.diabetes !== undefined && paciente.diabetes !== null && (
            <Dato
              label="Diabetes"
              valor={String(paciente.diabetes) === '1' ? 'Sí' : 'No'}
              badge={String(paciente.diabetes) === '1' ? 'Sí' : 'No'}
              badgeColor={String(paciente.diabetes) === '1' ? 'orange' : 'green'}
            />
          )}
          {paciente.tratamiento_antihipertensivo !== undefined && paciente.tratamiento_antihipertensivo !== null && (
            <Dato
              label="Tto. antihipertensivo"
              valor={String(paciente.tratamiento_antihipertensivo) === '1' ? 'Sí' : 'No'}
              badge={String(paciente.tratamiento_antihipertensivo) === '1' ? 'Sí' : 'No'}
              badgeColor={String(paciente.tratamiento_antihipertensivo) === '1' ? 'orange' : 'green'}
            />
          )}
        </div>

        <Separador />

        <SectionHeader icono={Dumbbell} titulo="Hábitos de vida" />
        <div className="grid grid-cols-3 gap-4">
          <Dato
            label="Tabaquismo"
            valor={smoke === undefined || smoke === null ? '—' : String(smoke) === '1' ? 'Fuma' : 'No fuma'}
            badge={String(smoke) === '1' ? 'Sí' : 'No'}
            badgeColor={String(smoke) === '1' ? 'orange' : 'green'}
          />
          <Dato
            label="Alcohol"
            valor={alco === undefined || alco === null ? '—' : String(alco) === '1' ? 'Consume' : 'No consume'}
            badge={String(alco) === '1' ? 'Sí' : 'No'}
            badgeColor={String(alco) === '1' ? 'orange' : 'green'}
          />
          <Dato
            label="Actividad física"
            valor={active === undefined || active === null ? '—' : String(active) === '1' ? 'Activo' : 'Sedentario'}
            badge={String(active) === '1' ? 'Sí' : 'No'}
            badgeColor={String(active) === '1' ? 'green' : 'orange'}
          />
        </div>

        <Separador />

        <SectionHeader icono={Activity} titulo="Variables derivadas del modelo" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Dato label="IMC calculado" valor={bmi ? `${bmi} kg/m²` : null} sub={catIMC} />
          <Dato label="Pulso de presión" valor={pulso ? `${pulso} mmHg` : null} />
          <Dato
            label="Score metabólico"
            valor={scoreMet !== null ? `${scoreMet} / 3` : null}
            badge={
              scoreMet === 0 ? 'Bajo' :
              scoreMet === 1 ? 'Moderado' :
              scoreMet === 2 ? 'Alto' : 'Muy alto'
            }
            badgeColor={scoreColor}
          />
        </div>
      </div>

    </div>
  )
}