import { useState } from 'react'
import { Info, Send, User, Heart, FlaskConical, Activity, Ruler, ArrowRight, MapPin, Clock } from 'lucide-react'
import { usePredictionContext } from '../context/PredictionContext'

// ── Estado inicial — variables del modelo final k=4 ────────────────────────
const CAMPOS_INICIALES = {
  // Laboratorio
  c_total: '', creatinina: '', glucosa: '', hdl: '', hemoglobina: '',
  ldl: '', leucocitos: '', plaquetas: '', trigliceridos: '',
  // Demográficos
  edad: '', sexo: '', zona: '', ap_hipertension: '',
  // Signos vitales y antropometría
  ta_sistolica: '', ta_diastolica: '', peso: '', talla: '', imc: '', TFG: '',
  // Opcionales Framingham
  colesterol_total_mgdl: '', diabetes: '', tratamiento_antihipertensivo: '', fuma: ''
}

// ── Componentes de UI ───────────────────────────────────────────────────────
function InputField({ label, name, value, onChange, error, hint, min, max, step = 'any', tooltip, range }) {
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
      {range && (
        <div className="flex items-center gap-1 text-[11px] text-slate-600">
          <Info size={11} />
          <span>Rango aceptable: {range}</span>
        </div>
      )}
      <input
        type="number"
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

// ── Validación — alineada con input_schema.py del modelo final ──────────────
function validar(campos) {
  const e = {}
  const n = v => parseFloat(v)

  // Laboratorio
  if (!campos.c_total) e.c_total = 'Requerido'
  else if (n(campos.c_total) < 0 || n(campos.c_total) > 550) e.c_total = '0 – 550 mg/dL'

  if (!campos.creatinina) e.creatinina = 'Requerido'
  else if (n(campos.creatinina) < 0 || n(campos.creatinina) > 2.0) e.creatinina = '0 – 2.0 mg/dL'

  if (!campos.glucosa) e.glucosa = 'Requerido'
  else if (n(campos.glucosa) < 25 || n(campos.glucosa) > 492) e.glucosa = '25 – 492 mg/dL'

  if (!campos.hdl) e.hdl = 'Requerido'
  else if (n(campos.hdl) < 0 || n(campos.hdl) > 120) e.hdl = '0 – 120 mg/dL'

  if (!campos.hemoglobina) e.hemoglobina = 'Requerido'
  else if (n(campos.hemoglobina) < 7 || n(campos.hemoglobina) > 21) e.hemoglobina = '7 – 21 g/dL'

  if (!campos.ldl) e.ldl = 'Requerido'
  else if (n(campos.ldl) < 0 || n(campos.ldl) > 404.6) e.ldl = '0 – 404.6 mg/dL'

  if (!campos.leucocitos) e.leucocitos = 'Requerido'
  else if (n(campos.leucocitos) < 0 || n(campos.leucocitos) > 50) e.leucocitos = '0 – 50 10³/µL'

  if (!campos.plaquetas) e.plaquetas = 'Requerido'
  else if (n(campos.plaquetas) < 0 || n(campos.plaquetas) > 1000) e.plaquetas = '0 – 1000 10³/µL'

  if (!campos.trigliceridos) e.trigliceridos = 'Requerido'
  else if (n(campos.trigliceridos) < 0 || n(campos.trigliceridos) > 420) e.trigliceridos = '0 – 420 mg/dL'

  // Demográficos
  if (!campos.edad) e.edad = 'Requerido'
  else if (n(campos.edad) < 6 || n(campos.edad) > 110) e.edad = '6 – 110 años'

  if (campos.sexo === '')            e.sexo            = 'Requerido'
  if (campos.zona === '')            e.zona            = 'Requerido'
  if (campos.ap_hipertension === '') e.ap_hipertension = 'Requerido'

  // Signos vitales y antropometría
  if (!campos.ta_sistolica) e.ta_sistolica = 'Requerido'
  else if (n(campos.ta_sistolica) < 60.5 || n(campos.ta_sistolica) > 220) e.ta_sistolica = '60.5 – 220 mmHg'

  if (!campos.ta_diastolica) e.ta_diastolica = 'Requerido'
  else if (n(campos.ta_diastolica) < 40 || n(campos.ta_diastolica) > 120) e.ta_diastolica = '40 – 120 mmHg'
  else if (campos.ta_sistolica && n(campos.ta_diastolica) >= n(campos.ta_sistolica))
    e.ta_diastolica = 'Debe ser menor que la sistólica'

  if (!campos.peso) e.peso = 'Requerido'
  else if (n(campos.peso) < 9 || n(campos.peso) > 170) e.peso = '9 – 170 kg'

  // talla en cm en el formulario
  if (!campos.talla) e.talla = 'Requerido'
  else if (n(campos.talla) < 127 || n(campos.talla) > 197) e.talla = '127 – 197 cm'

  if (!campos.imc) e.imc = 'Requerido'
  else if (n(campos.imc) < 4.51 || n(campos.imc) > 60) e.imc = '4.51 – 60 kg/m²'

  if (!campos.TFG) e.TFG = 'Requerido'
  else if (n(campos.TFG) < 11.47 || n(campos.TFG) > 197.39) e.TFG = '11.47 – 197.39 mL/min/1.73m²'

  // Opcionales Framingham
  if (campos.colesterol_total_mgdl !== '' &&
      (n(campos.colesterol_total_mgdl) < 50 || n(campos.colesterol_total_mgdl) > 500))
    e.colesterol_total_mgdl = '50 – 500 mg/dL'

  return e
}

// ── Componente principal ────────────────────────────────────────────────────
export default function PredictionForm({ onSubmit, loading, backendErrors = {}, onFieldChange }) {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const campos  = state.manual?.fields ?? CAMPOS_INICIALES
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: ActionTypes.SET_MANUAL_FIELDS, payload: { ...campos, [name]: value } })
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: undefined }))
    if (onFieldChange) onFieldChange()
  }

  // Auto-calcular IMC cuando peso y talla están completos
  const handleBlurAntropometria = () => {
    const peso  = parseFloat(campos.peso)
    const talla = parseFloat(campos.talla)
    if (peso > 0 && talla > 0 && !campos.imc) {
      const tallam = talla / 100
      const imc    = (peso / (tallam * tallam)).toFixed(2)
      dispatch({ type: ActionTypes.SET_MANUAL_FIELDS, payload: { ...campos, imc } })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrores({})
    const nuevosErrores = validar(campos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    // Payload — talla se envía en cm, el backend convierte a metros
    const payload = {
      c_total:        parseFloat(campos.c_total),
      creatinina:     parseFloat(campos.creatinina),
      glucosa:        parseFloat(campos.glucosa),
      hdl:            parseFloat(campos.hdl),
      hemoglobina:    parseFloat(campos.hemoglobina),
      ldl:            parseFloat(campos.ldl),
      leucocitos:     parseFloat(campos.leucocitos),
      plaquetas:      parseFloat(campos.plaquetas),
      trigliceridos:  parseFloat(campos.trigliceridos),
      edad:           parseInt(campos.edad),
      sexo:           parseInt(campos.sexo),
      zona:           parseInt(campos.zona),
      ap_hipertension: parseInt(campos.ap_hipertension),
      ta_sistolica:   parseFloat(campos.ta_sistolica),
      ta_diastolica:  parseFloat(campos.ta_diastolica),
      peso:           parseFloat(campos.peso),
      talla:          parseFloat(campos.talla),   // cm — backend convierte
      imc:            parseFloat(campos.imc),
      TFG:            parseFloat(campos.TFG),
    }

    // Opcionales Framingham solo si tienen valor
    if (campos.colesterol_total_mgdl !== '')        payload.colesterol_total_mgdl        = parseFloat(campos.colesterol_total_mgdl)
    if (campos.diabetes !== '')                     payload.diabetes                     = parseInt(campos.diabetes)
    if (campos.tratamiento_antihipertensivo !== '') payload.tratamiento_antihipertensivo = parseInt(campos.tratamiento_antihipertensivo)
    if (campos.fuma !== '')                         payload.fuma                         = parseInt(campos.fuma)

    onSubmit(payload)
  }

  const getError = (field) => errores[field] || backendErrors[field]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-8">

        {/* Demográficos */}
        <div>
          <SectionTitle icono={User}>Datos demográficos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              label="Edad" name="edad" value={campos.edad} onChange={handleChange}
              error={getError('edad')} hint="años" min={6} max={110} range="6 – 110 años"
            />
            <SelectField
              label="Sexo" name="sexo" value={campos.sexo} onChange={handleChange}
              error={getError('sexo')}
              options={[{ value: '0', label: 'Mujer' }, { value: '1', label: 'Hombre' }]}
            />
            <SelectField
              label="Zona de residencia" name="zona" value={campos.zona} onChange={handleChange}
              error={getError('zona')} tooltip="Zona donde reside habitualmente el paciente"
              options={[{ value: '0', label: 'Rural' }, { value: '1', label: 'Urbana' }]}
            />
          </div>
        </div>

        {/* Antecedentes */}
        <div>
          <SectionTitle icono={Clock}>Antecedentes</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField
              label="Antecedente personal de hipertensión" name="ap_hipertension"
              value={campos.ap_hipertension} onChange={handleChange}
              error={getError('ap_hipertension')}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
            />
          </div>
        </div>

        {/* Laboratorio */}
        <div>
          <SectionTitle icono={FlaskConical}>Exámenes de laboratorio</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              label="Colesterol total" name="c_total" value={campos.c_total} onChange={handleChange}
              error={getError('c_total')} hint="mg/dL" range="0 – 550" min={0} max={550} step="0.1"
              tooltip="Colesterol total sérico"
            />
            <InputField
              label="Creatinina" name="creatinina" value={campos.creatinina} onChange={handleChange}
              error={getError('creatinina')} hint="mg/dL" range="0 – 2.0" min={0} max={2.0} step="0.01"
            />
            <InputField
              label="Glucosa" name="glucosa" value={campos.glucosa} onChange={handleChange}
              error={getError('glucosa')} hint="mg/dL" range="25 – 492" min={25} max={492} step="0.1"
            />
            <InputField
              label="HDL" name="hdl" value={campos.hdl} onChange={handleChange}
              error={getError('hdl')} hint="mg/dL" range="0 – 120" min={0} max={120} step="0.1"
              tooltip="Colesterol HDL — lipoproteína de alta densidad"
            />
            <InputField
              label="LDL" name="ldl" value={campos.ldl} onChange={handleChange}
              error={getError('ldl')} hint="mg/dL" range="0 – 404.6" min={0} max={404.6} step="0.1"
              tooltip="Colesterol LDL — lipoproteína de baja densidad"
            />
            <InputField
              label="Triglicéridos" name="trigliceridos" value={campos.trigliceridos} onChange={handleChange}
              error={getError('trigliceridos')} hint="mg/dL" range="0 – 420" min={0} max={420} step="0.1"
            />
            <InputField
              label="Hemoglobina" name="hemoglobina" value={campos.hemoglobina} onChange={handleChange}
              error={getError('hemoglobina')} hint="g/dL" range="7 – 21" min={7} max={21} step="0.1"
            />
            <InputField
              label="Leucocitos" name="leucocitos" value={campos.leucocitos} onChange={handleChange}
              error={getError('leucocitos')} hint="10³/µL" range="0 – 50" min={0} max={50} step="0.1"
            />
            <InputField
              label="Plaquetas" name="plaquetas" value={campos.plaquetas} onChange={handleChange}
              error={getError('plaquetas')} hint="10³/µL" range="0 – 1000" min={0} max={1000} step="1"
            />
            <InputField
              label="TFG" name="TFG" value={campos.TFG} onChange={handleChange}
              error={getError('TFG')} hint="mL/min/1.73m²" range="11.47 – 197.39"
              min={11.47} max={197.39} step="0.01"
              tooltip="Tasa de Filtración Glomerular — indicador de función renal"
            />
          </div>
        </div>

        {/* Signos vitales y antropometría */}
        <div>
          <SectionTitle icono={Heart}>Signos vitales y antropometría</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              label="Presión sistólica" name="ta_sistolica" value={campos.ta_sistolica} onChange={handleChange}
              error={getError('ta_sistolica')} hint="mmHg" range="60.5 – 220" min={60.5} max={220} step="0.1"
            />
            <InputField
              label="Presión diastólica" name="ta_diastolica" value={campos.ta_diastolica} onChange={handleChange}
              error={getError('ta_diastolica')} hint="mmHg" range="40 – 120" min={40} max={120} step="0.1"
            />
            <InputField
              label="Peso" name="peso" value={campos.peso} onChange={handleChange}
              error={getError('peso')} hint="kg" range="9 – 170" min={9} max={170} step="0.1"
              onBlur={handleBlurAntropometria}
            />
            <InputField
              label="Talla" name="talla" value={campos.talla} onChange={handleChange}
              error={getError('talla')} hint="cm" range="127 – 197 cm" min={127} max={197} step="1"
              tooltip="Ingrese la talla en centímetros. El sistema la convierte a metros internamente."
              onBlur={handleBlurAntropometria}
            />
            <InputField
              label="IMC" name="imc" value={campos.imc} onChange={handleChange}
              error={getError('imc')} hint="kg/m²" range="4.51 – 60" min={4.51} max={60} step="0.01"
              tooltip="Se calcula automáticamente si ingresa peso y talla."
            />
          </div>
        </div>

        {/* Opcionales Framingham */}
        <div>
          <SectionTitle icono={Activity}>Datos para Framingham (opcionales)</SectionTitle>
          <p className="text-xs text-slate-500 mb-4 -mt-3">
            Permiten calcular el riesgo cardiovascular según Framingham 2008 y el ajuste
            de la Sociedad Colombiana de Cardiología.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Colesterol total (Framingham)" name="colesterol_total_mgdl"
              value={campos.colesterol_total_mgdl} onChange={handleChange}
              error={getError('colesterol_total_mgdl')} hint="mg/dL" range="50 – 500" min={50} max={500}
            />
            <SelectField
              label="Diabetes" name="diabetes" value={campos.diabetes} onChange={handleChange}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
            />
            <SelectField
              label="Tratamiento antihipertensivo" name="tratamiento_antihipertensivo"
              value={campos.tratamiento_antihipertensivo} onChange={handleChange}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
            />
            <SelectField
              label="Fumador actual" name="fuma" value={campos.fuma} onChange={handleChange}
              options={[{ value: '1', label: 'Sí' }, { value: '0', label: 'No' }]}
            />
          </div>
        </div>
      </div>

      {/* Botón de envío */}
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