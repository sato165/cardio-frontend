import { useState } from 'react'
import { Info, Send, User, Heart, FlaskConical, Dumbbell, ArrowRight } from 'lucide-react'

const CAMPOS_INICIALES = {
  age_years: '', gender: '', height: '', weight: '',
  ap_hi: '', ap_lo: '', cholesterol: '', gluc: '',
  smoke: '', alco: '', active: '',
  // Nuevos campos Framingham (opcionales)
  colesterol_total_mgdl: '', hdl_mgdl: '', diabetes: '', tratamiento_antihipertensivo: '',
}

function InputField({ label, name, type = 'number', value, onChange, error, hint, min, max, tooltip }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
        {label}
        {hint && <span className="text-xs text-slate-500 font-normal">({hint})</span>}
        {tooltip && (
          <span className="group relative ml-1 cursor-help">
            <Info size={13} className="text-slate-500" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 leading-relaxed border border-slate-700">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full px-4 py-3 rounded-xl input-glass text-sm transition-all ${
          error ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, error, hint, tooltip }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
        {label}
        {hint && <span className="text-xs text-slate-500 font-normal">({hint})</span>}
        {tooltip && (
          <span className="group relative ml-1 cursor-help">
            <Info size={13} className="text-slate-500" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 leading-relaxed border border-slate-700">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl select-glass text-sm transition-all ${
          error ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
        }`}
      >
        <option value="">Seleccionar...</option>
        {options.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function SectionTitle({ children, icono: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {Icon && <Icon size={16} className="text-blue-400" />}
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {children}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
    </div>
  )
}

function validar(campos) {
  const errores = {}
  const n = (v) => parseFloat(v)

  if (!campos.age_years) errores.age_years = 'Campo requerido'
  else if (n(campos.age_years) < 18 || n(campos.age_years) > 109) errores.age_years = 'Debe estar entre 18 y 109 años'

  if (!campos.gender) errores.gender = 'Campo requerido'

  if (!campos.height) errores.height = 'Campo requerido'
  else if (n(campos.height) < 140 || n(campos.height) > 220) errores.height = 'Debe estar entre 140 y 220 cm'

  if (!campos.weight) errores.weight = 'Campo requerido'
  else if (n(campos.weight) < 30 || n(campos.weight) > 180) errores.weight = 'Debe estar entre 30 y 180 kg'

  if (!campos.ap_hi) errores.ap_hi = 'Campo requerido'
  else if (n(campos.ap_hi) < 60 || n(campos.ap_hi) > 250) errores.ap_hi = 'Debe estar entre 60 y 250 mmHg'

  if (!campos.ap_lo) errores.ap_lo = 'Campo requerido'
  else if (n(campos.ap_lo) < 40 || n(campos.ap_lo) > 200) errores.ap_lo = 'Debe estar entre 40 y 200 mmHg'
  else if (campos.ap_hi && n(campos.ap_lo) >= n(campos.ap_hi)) errores.ap_lo = 'Debe ser menor que la presión sistólica'

  if (!campos.cholesterol) errores.cholesterol = 'Campo requerido'
  if (!campos.gluc) errores.gluc = 'Campo requerido'
  if (campos.smoke === '') errores.smoke = 'Campo requerido'
  if (campos.alco === '') errores.alco = 'Campo requerido'
  if (campos.active === '') errores.active = 'Campo requerido'

  // Los nuevos campos NO son requeridos, solo validamos rangos si tienen valor
  if (campos.colesterol_total_mgdl !== '') {
    if (n(campos.colesterol_total_mgdl) < 50 || n(campos.colesterol_total_mgdl) > 500)
      errores.colesterol_total_mgdl = 'Debe estar entre 50 y 500 mg/dL'
  }
  if (campos.hdl_mgdl !== '') {
    if (n(campos.hdl_mgdl) < 15 || n(campos.hdl_mgdl) > 120)
      errores.hdl_mgdl = 'Debe estar entre 15 y 120 mg/dL'
  }

  return errores
}

export default function PredictionForm({ onSubmit, loading }) {
  const [campos, setCampos] = useState(CAMPOS_INICIALES)
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setCampos(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevosErrores = validar(campos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    const payload = {
      age_days:    Math.round(parseFloat(campos.age_years) * 365.25),
      gender:      parseInt(campos.gender),
      height:      parseInt(campos.height),
      weight:      parseFloat(campos.weight),
      ap_hi:       parseInt(campos.ap_hi),
      ap_lo:       parseInt(campos.ap_lo),
      cholesterol: parseInt(campos.cholesterol),
      gluc:        parseInt(campos.gluc),
      smoke:       parseInt(campos.smoke),
      alco:        parseInt(campos.alco),
      active:      parseInt(campos.active),
    }
    // Agregar opcionales si tienen valor
    if (campos.colesterol_total_mgdl !== '') payload.colesterol_total_mgdl = parseFloat(campos.colesterol_total_mgdl)
    if (campos.hdl_mgdl !== '') payload.hdl_mgdl = parseFloat(campos.hdl_mgdl)
    if (campos.diabetes !== '') payload.diabetes = parseInt(campos.diabetes)
    if (campos.tratamiento_antihipertensivo !== '') payload.tratamiento_antihipertensivo = parseInt(campos.tratamiento_antihipertensivo)

    onSubmit(payload)
  }

  const opcionesNivel = [
    { value: '1', label: 'Normal' },
    { value: '2', label: 'Por encima de lo normal' },
    { value: '3', label: 'Muy por encima de lo normal' },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-8">

        <div>
          <SectionTitle icono={User}>Datos personales</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Edad" name="age_years" value={campos.age_years}
              onChange={handleChange} error={errores.age_years} hint="años" min={18} max={109} />
            <SelectField label="Género" name="gender" value={campos.gender}
              onChange={handleChange} error={errores.gender}
              options={[{ value: '1', label: 'Mujer' }, { value: '2', label: 'Hombre' }]} />
            <InputField label="Altura" name="height" value={campos.height}
              onChange={handleChange} error={errores.height} hint="cm" min={140} max={220} />
            <InputField label="Peso" name="weight" value={campos.weight}
              onChange={handleChange} error={errores.weight} hint="kg" min={30} max={180} />
          </div>
        </div>

        <div>
          <SectionTitle icono={Heart}>Presión arterial</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Presión sistólica" name="ap_hi" value={campos.ap_hi}
              onChange={handleChange} error={errores.ap_hi} hint="mmHg" min={60} max={250}
              tooltip="Presión máxima durante el latido. Rango aceptado: 60–250 mmHg." />
            <InputField label="Presión diastólica" name="ap_lo" value={campos.ap_lo}
              onChange={handleChange} error={errores.ap_lo} hint="mmHg" min={40} max={200}
              tooltip="Presión mínima entre latidos. Debe ser menor que la sistólica. Rango aceptado: 40–200 mmHg." />
          </div>
        </div>

        <div>
          <SectionTitle icono={FlaskConical}>Exámenes clínicos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField label="Colesterol" name="cholesterol" value={campos.cholesterol}
              onChange={handleChange} error={errores.cholesterol} options={opcionesNivel}
              tooltip="Normal: < 200 mg/dL · Por encima: 200–239 mg/dL · Muy por encima: ≥ 240 mg/dL" />
            <SelectField label="Glucosa" name="gluc" value={campos.gluc}
              onChange={handleChange} error={errores.gluc} options={opcionesNivel}
              tooltip="Normal: < 100 mg/dL · Por encima: 100–125 mg/dL · Muy por encima: ≥ 126 mg/dL" />
          </div>
        </div>

        <div>
          <SectionTitle icono={Dumbbell}>Hábitos de vida</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <SelectField label="Tabaquismo" name="smoke" value={campos.smoke}
              onChange={handleChange} error={errores.smoke}
              options={[{ value: '1', label: 'Fuma' }, { value: '0', label: 'No fuma' }]}
              tooltip="Nota clínica: este campo puede estar subregistrado. Ver advertencia en la explicabilidad." />
            <SelectField label="Alcohol" name="alco" value={campos.alco}
              onChange={handleChange} error={errores.alco}
              options={[{ value: '1', label: 'Consume' }, { value: '0', label: 'No consume' }]}
              tooltip="Nota clínica: este campo puede estar subregistrado. Ver advertencia en la explicabilidad." />
            <SelectField label="Actividad física" name="active" value={campos.active}
              onChange={handleChange} error={errores.active}
              options={[{ value: '1', label: 'Activo' }, { value: '0', label: 'Sedentario' }]} />
          </div>
        </div>

        {/* ─── Nueva sección: Framingham opcional ─── */}
        <div>
          <SectionTitle icono={FlaskConical}>Datos para Framingham (opcionales)</SectionTitle>
          <p className="text-xs text-slate-500 mb-4 -mt-3">
            Estos datos permiten calcular el riesgo cardiovascular según Framingham 2008 y el ajuste de la Sociedad Colombiana de Cardiología. Si no se completan, solo se mostrará la predicción del modelo propio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Colesterol total"
              name="colesterol_total_mgdl"
              value={campos.colesterol_total_mgdl}
              onChange={handleChange}
              hint="mg/dL"
              min={50} max={500}
              tooltip="Colesterol total en mg/dL. Necesario para Framingham."
            />
            <InputField
              label="Colesterol HDL"
              name="hdl_mgdl"
              value={campos.hdl_mgdl}
              onChange={handleChange}
              hint="mg/dL"
              min={15} max={120}
              tooltip="Colesterol HDL en mg/dL. Necesario para Framingham."
            />
            <SelectField
              label="Diabetes"
              name="diabetes"
              value={campos.diabetes}
              onChange={handleChange}
              options={[
                { value: '1', label: 'Sí' },
                { value: '0', label: 'No' },
              ]}
              tooltip="Diagnóstico de diabetes mellitus."
            />
            <SelectField
              label="Tto. antihipertensivo"
              name="tratamiento_antihipertensivo"
              value={campos.tratamiento_antihipertensivo}
              onChange={handleChange}
              options={[
                { value: '1', label: 'Sí' },
                { value: '0', label: 'No' },
              ]}
              tooltip="¿El paciente recibe tratamiento antihipertensivo actualmente?"
            />
          </div>
        </div>

      </div>

      <div className="mt-10">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl btn-primary flex items-center justify-center gap-3 text-base"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Procesando predicción...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Predecir riesgo cardiovascular</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}