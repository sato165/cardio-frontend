import { useState } from 'react'
import { Info } from 'lucide-react'

const CAMPOS_INICIALES = {
  age_years: '', gender: '', height: '', weight: '',
  ap_hi: '', ap_lo: '', cholesterol: '', gluc: '',
  smoke: '', alco: '', active: '',
}

function InputField({ label, name, type = 'number', value, onChange, error, hint, min, max, tooltip }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
        {label}
        {hint && <span className="text-xs text-gray-400 font-normal">({hint})</span>}
        {tooltip && (
          <span className="group relative ml-1 cursor-help">
            <Info size={13} className="text-gray-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-48 bg-gray-800 text-white text-xs rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
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
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, error, hint, tooltip }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
        {label}
        {hint && <span className="text-xs text-gray-400 font-normal">({hint})</span>}
        {tooltip && (
          <span className="group relative ml-1 cursor-help">
            <Info size={13} className="text-gray-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 bg-gray-800 text-white text-xs rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      >
        <option value="">Seleccionar...</option>
        {options.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
      {children}
    </h3>
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
    onSubmit({
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
    })
  }

  const opcionesNivel = [
    { value: '1', label: 'Normal' },
    { value: '2', label: 'Por encima de lo normal' },
    { value: '3', label: 'Muy por encima de lo normal' },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-8">

        {/* Datos personales */}
        <div>
          <SectionTitle>Datos personales</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Presión arterial */}
        <div>
          <SectionTitle>Presión arterial</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Presión sistólica" name="ap_hi" value={campos.ap_hi}
              onChange={handleChange} error={errores.ap_hi} hint="mmHg" min={60} max={250}
              tooltip="Presión máxima durante el latido. Rango aceptado: 60–250 mmHg." />
            <InputField label="Presión diastólica" name="ap_lo" value={campos.ap_lo}
              onChange={handleChange} error={errores.ap_lo} hint="mmHg" min={40} max={200}
              tooltip="Presión mínima entre latidos. Debe ser menor que la sistólica. Rango aceptado: 40–200 mmHg." />
          </div>
        </div>

        {/* Exámenes clínicos */}
        <div>
          <SectionTitle>Exámenes clínicos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Colesterol" name="cholesterol" value={campos.cholesterol}
              onChange={handleChange} error={errores.cholesterol} options={opcionesNivel}
              tooltip="Normal: < 200 mg/dL · Por encima: 200–239 mg/dL · Muy por encima: ≥ 240 mg/dL" />
            <SelectField label="Glucosa" name="gluc" value={campos.gluc}
              onChange={handleChange} error={errores.gluc} options={opcionesNivel}
              tooltip="Normal: < 100 mg/dL · Por encima: 100–125 mg/dL · Muy por encima: ≥ 126 mg/dL" />
          </div>
        </div>

        {/* Hábitos de vida */}
        <div>
          <SectionTitle>Hábitos de vida</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Procesando...' : 'Predecir riesgo cardiovascular'}
        </button>
      </div>
    </form>
  )
}
