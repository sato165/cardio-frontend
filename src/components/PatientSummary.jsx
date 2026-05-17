// PatientSummary.jsx
import { User, Activity, Heart, FlaskConical, MapPin, Ruler, Scale, Droplets } from 'lucide-react'

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

  // Formateadores
  const siNo = (v) => v === 1 || v === '1' ? 'Sí' : v === 0 || v === '0' ? 'No' : null
  const sexoNombre = (v) => v === 0 || v === '0' ? 'Mujer' : v === 1 || v === '1' ? 'Hombre' : null
  const zonaNombre = (v) => v === 0 || v === '0' ? 'Rural' : v === 1 || v === '1' ? 'Urbana' : null
  const conUnidad = (valor, unidad) => valor != null ? `${valor} ${unidad}` : null

  // Convertir talla de cm a metros para mostrar (el backend trabaja en cm)
  const tallaEnMetros = paciente.talla != null ? (paciente.talla / 100).toFixed(2) : null

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 animate-scale-in">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <User size={18} className="text-blue-400" />
        Datos del paciente evaluado
      </h3>

      <div className="space-y-1">
        {/* Demográficos */}
        <SectionHeader icono={User} titulo="Datos demográficos" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Dato label="Edad" valor={paciente.edad ? `${paciente.edad} años` : null} />
          <Dato label="Sexo" valor={sexoNombre(paciente.sexo)} />
          <Dato label="Zona" valor={zonaNombre(paciente.zona)} />
        </div>

        <Separador />

        {/* Antecedentes */}
        <SectionHeader icono={Activity} titulo="Antecedentes" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Dato
            label="Antecedente HTA"
            valor={siNo(paciente.ap_hipertension)}
            badge={siNo(paciente.ap_hipertension)}
            badgeColor={paciente.ap_hipertension == 1 ? 'orange' : 'green'}
          />
          {paciente.diabetes != null && (
            <Dato
              label="Diabetes"
              valor={siNo(paciente.diabetes)}
              badge={siNo(paciente.diabetes)}
              badgeColor={paciente.diabetes == 1 ? 'orange' : 'green'}
            />
          )}
          {paciente.tratamiento_antihipertensivo != null && (
            <Dato
              label="Tto. antihipertensivo"
              valor={siNo(paciente.tratamiento_antihipertensivo)}
              badge={siNo(paciente.tratamiento_antihipertensivo)}
              badgeColor={paciente.tratamiento_antihipertensivo == 1 ? 'orange' : 'green'}
            />
          )}
          {paciente.fuma != null && (
            <Dato
              label="Fumador"
              valor={siNo(paciente.fuma)}
              badge={siNo(paciente.fuma)}
              badgeColor={paciente.fuma == 1 ? 'orange' : 'green'}
            />
          )}
        </div>

        <Separador />

        {/* Signos vitales y antropometría */}
        <SectionHeader icono={Heart} titulo="Signos vitales y antropometría" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Dato label="Presión sistólica" valor={conUnidad(paciente.ta_sistolica, 'mmHg')} />
          <Dato label="Presión diastólica" valor={conUnidad(paciente.ta_diastolica, 'mmHg')} />
          <Dato label="Peso" valor={conUnidad(paciente.peso, 'kg')} />
          <Dato label="Talla" valor={tallaEnMetros ? `${tallaEnMetros} m` : null} />
          <Dato label="IMC" valor={conUnidad(paciente.imc, 'kg/m²')} />
        </div>

        <Separador />

        {/* Laboratorio */}
        <SectionHeader icono={FlaskConical} titulo="Exámenes de laboratorio" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Dato label="Colesterol total" valor={conUnidad(paciente.c_total, 'mg/dL')} />
          <Dato label="Creatinina" valor={conUnidad(paciente.creatinina, 'mg/dL')} />
          <Dato label="Glucosa" valor={conUnidad(paciente.glucosa, 'mg/dL')} />
          <Dato label="HDL" valor={conUnidad(paciente.hdl, 'mg/dL')} />
          <Dato label="LDL" valor={conUnidad(paciente.ldl, 'mg/dL')} />
          <Dato label="Triglicéridos" valor={conUnidad(paciente.trigliceridos, 'mg/dL')} />
          <Dato label="Hemoglobina" valor={conUnidad(paciente.hemoglobina, 'g/dL')} />
          <Dato label="Leucocitos" valor={conUnidad(paciente.leucocitos, '10³/µL')} />
          <Dato label="Plaquetas" valor={conUnidad(paciente.plaquetas, '10³/µL')} />
          <Dato label="TFG" valor={conUnidad(paciente.TFG, 'mL/min/1.73m²')} />
        </div>
      </div>
    </div>
  )
}