import { usePredictionContext } from '../context/PredictionContext'
import { predecirDesdeJson, predecirDesdePdf, predecirExplain } from '../api/cardioApi'
import FileUpload from '../components/FileUpload'
import PatientSummary from '../components/PatientSummary'
import ResultCard from '../components/ResultCard'
import ComparisonCard from '../components/ComparisonCard'
import SHAPChart from '../components/SHAPChart'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function UploadPage() {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const { loading, result, error, patientData } = state.upload
  const { explain } = state

  const handleSubmit = async (archivos, tipo, camposManuales) => {
    dispatch({ type: ActionTypes.SET_UPLOAD_LOADING, payload: true })
    dispatch({ type: ActionTypes.SET_UPLOAD_ERROR, payload: null })
    dispatch({ type: ActionTypes.SET_UPLOAD_MISSING, payload: [] })
    dispatch({ type: ActionTypes.RESET_EXPLAIN })

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
    } else {
      dispatch({ type: ActionTypes.SET_UPLOAD_MISSING, payload: [] })
    }

    if (respuesta.framingham_faltante?.length > 0) {
      dispatch({ type: ActionTypes.SET_FRAMINGHAM_MISSING, payload: respuesta.framingham_faltante })
    } else {
      dispatch({ type: ActionTypes.SET_FRAMINGHAM_MISSING, payload: null })
    }

    if (respuesta.prediccion) {
      dispatch({ type: ActionTypes.SET_UPLOAD_RESULT, payload: respuesta.prediccion })
    }
  }

  const handleExplain = async () => {
    if (!patientData) return
    dispatch({ type: ActionTypes.SET_EXPLAIN_LOADING, payload: true })
    dispatch({ type: ActionTypes.SET_EXPLAIN_ERROR, payload: null })
    try {
      const data = await predecirExplain(patientData)
      dispatch({ type: ActionTypes.SET_EXPLAIN_DATA, payload: data })
    } catch (err) {
      const msg = err.response?.data?.error ?? 'Error al obtener explicación.'
      dispatch({ type: ActionTypes.SET_EXPLAIN_ERROR, payload: msg })
    }
  }

  const handleReset = () => {
    dispatch({ type: ActionTypes.RESET_UPLOAD })
    dispatch({ type: ActionTypes.RESET_EXPLAIN })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-2">
          Cargar documentos electrónicos del paciente
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
          <ResultCard
            resultado={result}
            onExplain={handleExplain}
            explainLoading={explain.loading}
          />

          {result.riesgo_comparativo && (
            <ComparisonCard
              riesgoComparativo={result.riesgo_comparativo}
            />
          )}

          {/* ─── Explicación SHAP ─────────────────────────────── */}
          {explain.loading && (
            <div className="text-center py-4 text-slate-400 text-sm">Cargando explicación SHAP...</div>
          )}
          {explain.error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-400/80">{explain.error}</p>
            </div>
          )}
          {explain.data && <SHAPChart explainData={explain.data} />}
        </div>
      )}
    </div>
  )
}