// FileUpload.jsx (corregido)
import { useState, useRef } from 'react'
import {
  Upload, X, AlertCircle, FileJson, File, CheckCircle,
  Sparkles, ChevronDown, ChevronUp, Info
} from 'lucide-react'
import { usePredictionContext } from '../context/PredictionContext'

const ETIQUETAS_OBLIGATORIOS = {
  creatinina: 'Creatinina (mg/dL)',
  celulas_medias: 'Células medias VCM (fL)',
  glucosa: 'Glucosa (mg/dL)',
  granulocitos: 'Granulocitos (%)',
  hdl: 'HDL (mg/dL)',
  hematocrito: 'Hematocrito (%)',
  hemoglobina: 'Hemoglobina (g/dL)',
  ldl: 'LDL (mg/dL)',
  leucocitos: 'Leucocitos (10³/µL)',
  linfocitos: 'Linfocitos (%)',
  plaquetas: 'Plaquetas (10³/µL)',
  trigliceridos: 'Triglicéridos (mg/dL)',
  edad: 'Edad (años)',
  sexo: 'Sexo (0=Mujer, 1=Hombre)',
  zona: 'Zona (0=Rural, 1=Urbana)',
  ap_hipertension: 'Antecedente HTA (0/1)',
  ta_sistolica: 'Presión sistólica (mmHg)',
  ta_diastolica: 'Presión diastólica (mmHg)',
  peso: 'Peso (kg)',
  talla: 'Talla (cm)',
  imc: 'IMC (kg/m²)',
  TFG: 'TFG (mL/min/1.73m²)',
}

const RANGOS = {
  creatinina: '0 – 2.0 mg/dL',
  celulas_medias: '0 – 20 fL',
  glucosa: '25 – 492 mg/dL',
  granulocitos: '0 – 100 %',
  hdl: '0 – 120 mg/dL',
  hematocrito: '14 – 63 %',
  hemoglobina: '7 – 21 g/dL',
  ldl: '0 – 404.6 mg/dL',
  leucocitos: '0 – 50 10³/µL',
  linfocitos: '0 – 100 %',
  plaquetas: '0 – 1000 10³/µL',
  trigliceridos: '0 – 420 mg/dL',
  edad: '6 – 110 años',
  sexo: '0 o 1',
  zona: '0 o 1',
  ap_hipertension: '0 o 1',
  ta_sistolica: '60.5 – 220 mmHg',
  ta_diastolica: '40 – 120 mmHg',
  peso: '9 – 170 kg',
  talla: '127 – 197 cm',
  imc: '4.51 – 60 kg/m²',
  TFG: '11.47 – 197.39 mL/min/1.73m²',
}

function validarCampo(campo, valor) {
  if (valor === undefined || valor === '') return null
  const n = parseFloat(valor)
  switch (campo) {
    case 'creatinina': return (n < 0 || n > 2.0) ? 'Debe estar entre 0 y 2.0 mg/dL' : null
    case 'celulas_medias': return (n < 0 || n > 20) ? 'Debe estar entre 0 y 20 fL' : null
    case 'glucosa': return (n < 25 || n > 492) ? 'Debe estar entre 25 y 492 mg/dL' : null
    case 'granulocitos': return (n < 0 || n > 100) ? 'Debe estar entre 0 y 100 %' : null
    case 'hdl': return (n < 0 || n > 120) ? 'Debe estar entre 0 y 120 mg/dL' : null
    case 'hematocrito': return (n < 14 || n > 63) ? 'Debe estar entre 14 y 63 %' : null
    case 'hemoglobina': return (n < 7 || n > 21) ? 'Debe estar entre 7 y 21 g/dL' : null
    case 'ldl': return (n < 0 || n > 404.6) ? 'Debe estar entre 0 y 404.6 mg/dL' : null
    case 'leucocitos': return (n < 0 || n > 50) ? 'Debe estar entre 0 y 50 10³/µL' : null
    case 'linfocitos': return (n < 0 || n > 100) ? 'Debe estar entre 0 y 100 %' : null
    case 'plaquetas': return (n < 0 || n > 1000) ? 'Debe estar entre 0 y 1000 10³/µL' : null
    case 'trigliceridos': return (n < 0 || n > 420) ? 'Debe estar entre 0 y 420 mg/dL' : null
    case 'edad': return (n < 6 || n > 110) ? 'Debe estar entre 6 y 110 años' : null
    case 'ta_sistolica': return (n < 60.5 || n > 220) ? 'Debe estar entre 60.5 y 220 mmHg' : null
    case 'ta_diastolica': return (n < 40 || n > 120) ? 'Debe estar entre 40 y 120 mmHg' : null
    case 'peso': return (n < 9 || n > 170) ? 'Debe estar entre 9 y 170 kg' : null
    case 'talla': return (n < 127 || n > 197) ? 'Debe estar entre 127 y 197 cm' : null
    case 'imc': return (n < 4.51 || n > 60) ? 'Debe estar entre 4.51 y 60 kg/m²' : null
    case 'TFG': return (n < 11.47 || n > 197.39) ? 'Debe estar entre 11.47 y 197.39 mL/min/1.73m²' : null
    default: return null
  }
}

export default function FileUpload({ onSubmit, loading }) {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const { files, tipo, manualValues, missingFields, framinghamMissing, framinghamValues } = state.upload
  const [errorTipo, setErrorTipo] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showFramingham, setShowFramingham] = useState(false)
  const [erroresLocales, setErroresLocales] = useState({})
  const inputRef = useRef(null)

  const validarTipo = (archivo) => {
    if (archivo.type === 'application/json') return 'json'
    if (archivo.type === 'application/pdf')  return 'pdf'
    const ext = archivo.name.split('.').pop().toLowerCase()
    if (ext === 'json') return 'json'
    if (ext === 'pdf')  return 'pdf'
    return null
  }

  const handleArchivos = (nuevos) => {
    setErrorTipo(null)
    const lista = Array.from(nuevos)
    const tipoDetectado = validarTipo(lista[0])

    if (!tipoDetectado) { setErrorTipo('Solo se aceptan archivos JSON o PDF.'); return }
    if (lista.some(a => validarTipo(a) !== tipoDetectado)) { setErrorTipo('No se pueden mezclar archivos JSON y PDF.'); return }
    if (tipoDetectado === 'json' && lista.length > 1) { setErrorTipo('Solo se puede subir un archivo JSON a la vez.'); return }
    if (tipoDetectado === 'pdf'  && lista.length > 5) { setErrorTipo('Se permiten máximo 5 archivos PDF por solicitud.'); return }

    dispatch({
      type: ActionTypes.SET_UPLOAD_FILES,
      payload: { files: lista, tipo: tipoDetectado }
    })
  }

  const handleDrop     = (e) => { e.preventDefault(); setIsDragging(false); handleArchivos(e.dataTransfer.files) }
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }

  const quitarArchivo = (index) => {
    const nueva = files.filter((_, i) => i !== index)
    dispatch({
      type: ActionTypes.SET_UPLOAD_FILES,
      payload: { files: nueva, tipo: nueva.length > 0 ? tipo : null }
    })
  }

  const handleCampoManual = (campo, valor) => {
    dispatch({ type: ActionTypes.SET_UPLOAD_MANUAL_VALUES, payload: { ...manualValues, [campo]: valor } })
    setErroresLocales(prev => ({ ...prev, [campo]: undefined }))
    dispatch({ type: ActionTypes.SET_UPLOAD_ERROR, payload: null })
  }

  const handleFraminghamChange = (campo, valor) => {
    dispatch({ type: ActionTypes.SET_FRAMINGHAM_VALUES, payload: { ...framinghamValues, [campo]: valor } })
    dispatch({ type: ActionTypes.SET_UPLOAD_ERROR, payload: null })
  }

  const handleSubmit = () => {
    if (!files.length) return

    const nuevosErrores = {}
    for (const { campo } of missingFields) {
      const valor = manualValues[campo]
      if (valor === undefined || valor === '') {
        nuevosErrores[campo] = 'Este campo es requerido'
      } else {
        const error = validarCampo(campo, valor)
        if (error) nuevosErrores[campo] = error
      }
    }

    if (manualValues.ta_sistolica && manualValues.ta_diastolica) {
      const sist = parseFloat(manualValues.ta_sistolica)
      const diast = parseFloat(manualValues.ta_diastolica)
      if (!isNaN(sist) && !isNaN(diast) && diast >= sist) {
        nuevosErrores.ta_diastolica = 'Debe ser menor que la sistólica'
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores)
      return
    }

    let payloadManual = { ...manualValues, ...framinghamValues }
    if (payloadManual.talla !== undefined && payloadManual.talla !== '') {
      payloadManual.talla = parseFloat(payloadManual.talla) / 100
    }
    const finalManual = Object.fromEntries(
      Object.entries(payloadManual).filter(([_, v]) => v !== '' && v !== undefined)
    )
    onSubmit(files, tipo, finalManual)
  }

  const todosCompletos = missingFields.length === 0 || (
    missingFields.every(c => {
      const valor = manualValues[c.campo]
      return valor !== undefined && valor !== '' && !validarCampo(c.campo, valor)
    })
  )

  const FileIcon = tipo === 'json' ? FileJson : File

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-2xl p-12 text-center cursor-pointer 
          transition-all duration-300 border-2 border-dashed
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.pdf"
          multiple
          className="hidden"
          onChange={e => handleArchivos(e.target.files)}
        />
        
        <div className="relative">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
            isDragging ? 'bg-blue-500/20 scale-110' : 'bg-slate-700/50'
          }`}>
            <Upload className={`${isDragging ? 'text-blue-400' : 'text-slate-400'}`} size={32} />
          </div>
          
          <p className="text-slate-200 font-medium mb-2">
            {isDragging ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-slate-500">
            JSON (1 archivo) · PDF (hasta 5 del mismo paciente)
          </p>
        </div>
      </div>

      {errorTipo && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-scale-in">
          <AlertCircle className="text-red-400 shrink-0" size={20} />
          <p className="text-sm text-red-300">{errorTipo}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3 animate-scale-in">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
          </p>
          {files.map((archivo, i) => (
            <div key={i} className="flex items-center justify-between p-4 glass-card rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tipo === 'json' ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
                  <FileIcon className={tipo === 'json' ? 'text-blue-400' : 'text-red-400'} size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{archivo.name}</p>
                  <p className="text-xs text-slate-500">
                    {(archivo.size / 1024).toFixed(1)} KB · {tipo?.toUpperCase()}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); quitarArchivo(i) }} 
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {missingFields.length > 0 && (
        <div className="glass-card border border-yellow-500/20 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertCircle className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {missingFields.length} campo{missingFields.length > 1 ? 's' : ''} no encontrado{missingFields.length > 1 ? 's' : ''} en el archivo
              </p>
              <p className="text-xs text-slate-500">
                Complete los valores faltantes para continuar con la predicción.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {missingFields.map(({ campo, descripcion }) => (
              <div key={campo}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {descripcion || ETIQUETAS_OBLIGATORIOS[campo] || campo}
                </label>
                {RANGOS[campo] && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-1">
                    <Info size={11} />
                    <span>Rango aceptable: {RANGOS[campo]}</span>
                  </div>
                )}
                <input
                  type="number"
                  value={manualValues[campo] ?? ''}
                  onChange={e => handleCampoManual(campo, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl input-glass text-sm transition-all ${
                    erroresLocales[campo] ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                  }`}
                  placeholder="Ingrese el valor"
                />
                {erroresLocales[campo] && (
                  <p className="text-xs text-red-400 mt-1">{erroresLocales[campo]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!missingFields.length && framinghamMissing && framinghamMissing.length > 0 && (
        <div className="glass-card border border-blue-500/20 rounded-2xl p-6 animate-scale-in">
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => setShowFramingham(!showFramingham)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CheckCircle className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Datos para comparación con Framingham y SCC (opcional)
                </p>
                <p className="text-xs text-slate-500">
                  Faltan {framinghamMissing.length} dato(s) para habilitar la comparación.
                </p>
              </div>
            </div>
            {showFramingham ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
          </div>
          {showFramingham && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {framinghamMissing.map(({ campo, descripcion }) => (
                <div key={campo}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    {descripcion}
                  </label>
                  {campo === 'diabetes' || campo === 'tratamiento_antihipertensivo' || campo === 'fuma' ? (
                    <select
                      value={framinghamValues[campo] ?? ''}
                      onChange={(e) => handleFraminghamChange(campo, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl select-glass text-sm"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1">Sí</option>
                      <option value="0">No</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={framinghamValues[campo] ?? ''}
                      onChange={(e) => handleFraminghamChange(campo, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl input-glass text-sm"
                      placeholder={`Ingrese ${descripcion.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={loading || !todosCompletos}
          className="w-full py-4 px-6 rounded-xl btn-primary flex items-center justify-center gap-3 text-base"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Procesando predicción...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Predecir riesgo cardiovascular</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}