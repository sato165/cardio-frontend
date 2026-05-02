import { usePredictionContext } from '../context/PredictionContext'
import { predecirDesdeJson, predecirDesdePdf } from '../api/cardioApi'
import FileUpload from '../components/FileUpload'
import PatientSummary from '../components/PatientSummary'
import ResultCard from '../components/ResultCard'
import ExplainabilityChart from '../components/ExplainabilityChart'
import ComparisonCard from '../components/ComparisonCard'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function UploadPage() {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const { loading, result, error, patientData } = state.upload

  const handleSubmit = async (archivos, tipo, camposManuales) => {
    dispatch({ type: ActionTypes.SET_UPLOAD_LOADING, payload: true })
    dispatch({ type: ActionTypes.SET_UPLOAD_ERROR, payload: null })
    dispatch({ type: ActionTypes.SET_UPLOAD_MISSING, payload: [] })

    try {
      let respuesta
      if (tipo === 'json') {
        respuesta = await predecirDesdeJson(archivos[0], camposManuales)
      } else {
        respuesta = await predecirDesdePdf(archivos, camposManuales)
      }
      procesarUploadOutput(respuesta, camposManuales)
    } catch (err) {
      const mensaje =
        err.response?.data?.detalle?.[0]?.mensaje ??
        err.response?.data?.error ??
        'Error al conectar con el servidor.'
      dispatch({ type: ActionTypes.SET_UPLOAD_ERROR, payload: mensaje })
    } finally {
      dispatch({ type: ActionTypes.SET_UPLOAD_LOADING, payload: false })
    }
  }

  const procesarUploadOutput = (respuesta, camposManuales) => {
    const extraidos = respuesta.datos_paciente ?? {}
    const combinados = { ...extraidos, ...camposManuales }
    dispatch({ type: ActionTypes.SET_UPLOAD_PATIENT, payload: combinados })

    if (respuesta.campos_faltantes?.length > 0) {
      dispatch({ type: ActionTypes.SET_UPLOAD_MISSING, payload: respuesta.campos_faltantes })
    } else if (respuesta.prediccion) {
      dispatch({ type: ActionTypes.SET_UPLOAD_RESULT, payload: respuesta.prediccion })
    }
  }

  const handleReset = () => {
    dispatch({ type: ActionTypes.RESET_UPLOAD })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-2">
          Cargar Historia Clínica
        </h1>
        <p className="text-slate-400 text-sm">
          Suba un archivo JSON o uno o varios PDFs del mismo paciente.
          El sistema extrae los datos automáticamente.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/5 animate-slide-up delay-100">
        <FileUpload onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-scale-in">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-0.5">Error en la predicción</p>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-end animate-fade-in">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <RotateCcw size={14} />
              Nueva predicción
            </button>
          </div>
          <PatientSummary paciente={patientData} />
          <ResultCard resultado={result} />

          {result.riesgo_comparativo && (
            <ComparisonCard
              riesgoComparativo={result.riesgo_comparativo}
              probabilidadPropia={result.probabilidad}
              nivelPropio={result.nivel_riesgo}
            />
          )}

          <ExplainabilityChart explicabilidad={result.explicabilidad} />
        </div>
      )}
    </div>
  )
}