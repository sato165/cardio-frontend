import { useState } from 'react'
import { Info, Send, User, Heart, FlaskConical, Activity, Ruler, ArrowRight, MapPin, Clock } from 'lucide-react'
import { usePredictionContext } from '../context/PredictionContext'

const CAMPOS_INICIALES = {
  creatinina: '', celulas_medias: '', glucosa: '', granulocitos: '',
  hdl: '', hematocrito: '', hemoglobina: '', ldl: '', leucocitos: '',
  linfocitos: '', plaquetas: '', trigliceridos: '',
  edad: '', sexo: '', zona: '', ap_hipertension: '',
  ta_sistolica: '', ta_diastolica: '', peso: '', talla: '', imc: '', TFG: '',
  colesterol_total_mgdl: '', diabetes: '', tratamiento_antihipertensivo: '', fuma: ''
}

// Componente reutilizable para inputs numéricos
function InputField({ label, name, type = 'number', value, onChange, error, hint, min, max, step = 'any', tooltip }) {
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
        step={step}
        className={`w-full px-4 py-3 rounded-xl input-glass text-sm transition-all ${
          error ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
        }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

// Componente para selects
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
  const e = {}
  const n = v => parseFloat(v)

  // Rangos clínicos del dataset real
  if (!campos.creatinina) e.creatinina = 'Requerido'
  else if (n(campos.creatinina) < 0 || n(campos.creatinina) > 15) e.creatinina = '0–15 mg/dL'

  if (!campos.celulas_medias) e.celulas_medias = 'Requerido'
  else if (n(campos.celulas_medias) < 0 || n(campos.celulas_medias) > 150) e.celulas_medias = '0–150 fL'

  if (!campos.glucosa) e.glucosa = 'Requerido'
  else if (n(campos.glucosa) < 20 || n(campos.glucosa) > 600) e.glucosa = '20–600 mg/dL'

  if (!campos.granulocitos) e.granulocitos = 'Requerido'
  else if (n(campos.granulocitos) < 0 || n(campos.granulocitos) > 100) e.granulocitos = '0–100 %'

  if (!campos.hdl) e.hdl = 'Requerido'
  else if (n(campos.hdl) < 10 || n(campos.hdl) > 150) e.hdl = '10–150 mg/dL'

  if (!campos.hematocrito) e.hematocrito = 'Requerido'
  else if (n(campos.hematocrito) < 10 || n(campos.hematocrito) > 70) e.hematocrito = '10–70 %'

  if (!campos.hemoglobina) e.hemoglobina = 'Requerido'
  else if (n(campos.hemoglobina) < 5 || n(campos.hemoglobina) > 25) e.hemoglobina = '5–25 g/dL'

  if (!campos.ldl) e.ldl = 'Requerido'
  else if (n(campos.ldl) < 20 || n(campos.ldl) > 500) e.ldl = '20–500 mg/dL'

  if (!campos.leucocitos) e.leucocitos = 'Requerido'
  else if (n(campos.leucocitos) < 1 || n(campos.leucocitos) > 50) e.leucocitos = '1–50 10³/µL'

  if (!campos.linfocitos) e.linfocitos = 'Requerido'
  else if (n(campos.linfocitos) < 0 || n(campos.linfocitos) > 100) e.linfocitos = '0–100 %'

  if (!campos.plaquetas) e.plaquetas = 'Requerido'
  else if (n(campos.plaquetas) < 10 || n(campos.plaquetas) > 1000) e.plaquetas = '10–1000 10³/µL'

  if (!campos.trigliceridos) e.trigliceridos = 'Requerido'
  else if (n(campos.trigliceridos) < 20 || n(campos.trigliceridos) > 2000) e.trigliceridos = '20–2000 mg/dL'

  if (!campos.edad) e.edad = 'Requerido'
  else if (n(campos.edad) < 18 || n(campos.edad) > 110) e.edad = '18–110 años'

  if (campos.sexo === '') e.sexo = 'Requerido'
  if (campos.zona === '') e.zona = 'Requerido'
  if (campos.ap_hipertension === '') e.ap_hipertension = 'Requerido'

  if (!campos.ta_sistolica) e.ta_sistolica = 'Requerido'
  else if (n(campos.ta_sistolica) < 50 || n(campos.ta_sistolica) > 300) e.ta_sistolica = '50–300 mmHg'

  if (!campos.ta_diastolica) e.ta_diastolica = 'Requerido'
  else if (n(campos.ta_diastolica) < 30 || n(campos.ta_diastolica) > 200) e.ta_diastolica = '30–200 mmHg'
  else if (campos.ta_sistolica && n(campos.ta_diastolica) >= n(campos.ta_sistolica)) e.ta_diastolica = 'Debe ser menor que la sistólica'

  if (!campos.peso) e.peso = 'Requerido'
  else if (n(campos.peso) < 5 || n(campos.peso) > 300) e.peso = '5–300 kg'

  if (!campos.talla) e.talla = 'Requerido'
  else if (n(campos.talla) < 100 || n(campos.talla) > 250) e.talla = '100–250 cm'

  if (!campos.imc) e.imc = 'Requerido'
  else if (n(campos.imc) < 10 || n(campos.imc) > 70) e.imc = '10–70 kg/m²'

  if (!campos.TFG) e.TFG = 'Requerido'
  else if (n(campos.TFG) < 5 || n(campos.TFG) > 300) e.TFG = '5–300 mL/min/1.73m²'

  // Opcionales Framingham (rangos si se ingresan)
  if (campos.colesterol_total_mgdl !== '' && (n(campos.colesterol_total_mgdl) < 50 || n(campos.colesterol_total_mgdl) > 500))
    e.colesterol_total_mgdl = '50–500 mg/dL'
  if (campos.diabetes !== '' && ![0,1].includes(parseInt(campos.diabetes))) e.diabetes = '0 o 1'
  if (campos.tratamiento_antihipertensivo !== '' && ![0,1].includes(parseInt(campos.tratamiento_antihipertensivo))) e.tratamiento_antihipertensivo = '0 o 1'
  if (campos.fuma !== '' && ![0,1].includes(parseInt(campos.fuma))) e.fuma = '0 o 1'

  return e
}

export default function PredictionForm({ onSubmit, loading }) {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const campos = state.manual.fields
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: ActionTypes.SET_MANUAL_FIELDS, payload: { ...campos, [name]: value } })
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevosErrores = validar(campos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    // Construir payload para backend (talla en metros)
    const payload = {
      creatinina: parseFloat(campos.creatinina),
      celulas_medias: parseFloat(campos.celulas_medias),
      glucosa: parseFloat(campos.glucosa),
      granulocitos: parseFloat(campos.granulocitos),
      hdl: parseFloat(campos.hdl),
      hematocrito: parseFloat(campos.hematocrito),
      hemoglobina: parseFloat(campos.hemoglobina),
      ldl: parseFloat(campos.ldl),
      leucocitos: parseFloat(campos.leucocitos),
      linfocitos: parseFloat(campos.linfocitos),
      plaquetas: parseFloat(campos.plaquetas),
      trigliceridos: parseFloat(campos.trigliceridos),
      edad: parseInt(campos.edad),
      sexo: parseInt(campos.sexo),
      zona: parseInt(campos.zona),
      ap_hipertension: parseInt(campos.ap_hipertension),
      ta_sistolica: parseFloat(campos.ta_sistolica),
      ta_diastolica: parseFloat(campos.ta_diastolica),
      peso: parseFloat(campos.peso),
      talla: parseFloat(campos.talla) / 100,   // cm → m
      imc: parseFloat(campos.imc),
      TFG: parseFloat(campos.TFG),
    }
    // Opcionales Framingham
    if (campos.colesterol_total_mgdl !== '') payload.colesterol_total_mgdl = parseFloat(campos.colesterol_total_mgdl)
    if (campos.diabetes !== '') payload.diabetes = parseInt(campos.diabetes)
    if (campos.tratamiento_antihipertensivo !== '') payload.tratamiento_antihipertensivo = parseInt(campos.tratamiento_antihipertensivo)
    if (campos.fuma !== '') payload.fuma = parseInt(campos.fuma)

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-8">
        {/* Demográficos */}
        <div>
          <SectionTitle icono={User}>Datos demográficos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField label="Edad" name="edad" value={campos.edad} onChange={handleChange} error={errores.edad} hint="años" min={18} max={110} />
            <SelectField label="Sexo" name="sexo" value={campos.sexo} onChange={handleChange} error={errores.sexo}
              options={[{ value: '0', label: 'Mujer' }, { value: '1', label: 'Hombre' }]} />
            <SelectField label="Zona" name="zona" value={campos.zona} onChange={handleChange} error={errores.zona}
              options={[{ value: '0', label: 'Rural' }, { value: '1', label: 'Urbana' }]}
              tooltip="Zona de residencia del paciente" />
          </div>
        </div>

        {/* Antecedentes */}
        <div>
          <SectionTitle icono={Clock}>Antecedentes</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField label="Antecedente de hipertensión" name="ap_hipertension" value={campos.ap_hipertension} onChange={handleChange} error={errores.ap_hipertension}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]} />
          </div>
        </div>

        {/* Laboratorio */}
        <div>
          <SectionTitle icono={FlaskConical}>Exámenes de laboratorio</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField label="Creatinina" name="creatinina" value={campos.creatinina} onChange={handleChange} error={errores.creatinina} hint="mg/dL" />
            <InputField label="Glucosa" name="glucosa" value={campos.glucosa} onChange={handleChange} error={errores.glucosa} hint="mg/dL" />
            <InputField label="HDL" name="hdl" value={campos.hdl} onChange={handleChange} error={errores.hdl} hint="mg/dL" />
            <InputField label="LDL" name="ldl" value={campos.ldl} onChange={handleChange} error={errores.ldl} hint="mg/dL" />
            <InputField label="Triglicéridos" name="trigliceridos" value={campos.trigliceridos} onChange={handleChange} error={errores.trigliceridos} hint="mg/dL" />
            <InputField label="TFG" name="TFG" value={campos.TFG} onChange={handleChange} error={errores.TFG} hint="mL/min/1.73m²" />
            <InputField label="Hemoglobina" name="hemoglobina" value={campos.hemoglobina} onChange={handleChange} error={errores.hemoglobina} hint="g/dL" />
            <InputField label="Hematocrito" name="hematocrito" value={campos.hematocrito} onChange={handleChange} error={errores.hematocrito} hint="%" />
            <InputField label="Leucocitos" name="leucocitos" value={campos.leucocitos} onChange={handleChange} error={errores.leucocitos} hint="10³/µL" />
            <InputField label="Linfocitos" name="linfocitos" value={campos.linfocitos} onChange={handleChange} error={errores.linfocitos} hint="%" />
            <InputField label="Granulocitos" name="granulocitos" value={campos.granulocitos} onChange={handleChange} error={errores.granulocitos} hint="%" />
            <InputField label="Plaquetas" name="plaquetas" value={campos.plaquetas} onChange={handleChange} error={errores.plaquetas} hint="10³/µL" />
            <InputField label="Células medias (VCM)" name="celulas_medias" value={campos.celulas_medias} onChange={handleChange} error={errores.celulas_medias} hint="fL" />
          </div>
        </div>

        {/* Signos vitales y antropometría */}
        <div>
          <SectionTitle icono={Heart}>Signos vitales y antropometría</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField label="Presión sistólica" name="ta_sistolica" value={campos.ta_sistolica} onChange={handleChange} error={errores.ta_sistolica} hint="mmHg" />
            <InputField label="Presión diastólica" name="ta_diastolica" value={campos.ta_diastolica} onChange={handleChange} error={errores.ta_diastolica} hint="mmHg" />
            <InputField label="Peso" name="peso" value={campos.peso} onChange={handleChange} error={errores.peso} hint="kg" />
            <InputField label="Talla" name="talla" value={campos.talla} onChange={handleChange} error={errores.talla} hint="cm" min={100} max={250} />
            <InputField label="IMC" name="imc" value={campos.imc} onChange={handleChange} error={errores.imc} hint="kg/m²" />
          </div>
        </div>

        {/* Opcionales Framingham */}
        <div>
          <SectionTitle icono={Activity}>Datos para Framingham (opcionales)</SectionTitle>
          <p className="text-xs text-slate-500 mb-4 -mt-3">
            Estos datos permiten calcular el riesgo cardiovascular según Framingham 2008 y el ajuste de la Sociedad Colombiana de Cardiología.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Colesterol total"
              name="colesterol_total_mgdl"
              value={campos.colesterol_total_mgdl}
              onChange={handleChange}
              hint="mg/dL"
              min={50} max={500}
            />
            <SelectField
              label="Diabetes"
              name="diabetes"
              value={campos.diabetes}
              onChange={handleChange}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
            />
            <SelectField
              label="Tto. antihipertensivo"
              name="tratamiento_antihipertensivo"
              value={campos.tratamiento_antihipertensivo}
              onChange={handleChange}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
            />
            <SelectField
              label="Fumador actual"
              name="fuma"
              value={campos.fuma}
              onChange={handleChange}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
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