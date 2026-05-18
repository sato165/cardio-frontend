// ManualPage.jsx
import { useState } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import PredictionForm from '../components/PredictionForm'
import PatientSummary from '../components/PatientSummary'
import ResultCard from '../components/ResultCard'
import ComparisonCard from '../components/ComparisonCard'
import SHAPChart from '../components/SHAPChart'
import { usePredictionContext } from '../context/PredictionContext'
import { predecirManual, predecirExplain } from '../api/cardioApi'

export default function ManualPage() {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const { loading, result, error, patientData } = state.manual
  const { explain } = state
  const [backendErrors, setBackendErrors] = useState({})

  const handleSubmit = async (datos) => {
    dispatch({ type: ActionTypes.SET_MANUAL_PATIENT, payload: datos })
    dispatch({ type: ActionTypes.SET_MANUAL_LOADING, payload: true })
    dispatch({ type: ActionTypes.SET_MANUAL_ERROR, payload: null })
    setBackendErrors({})
    dispatch({ type: ActionTypes.RESET_EXPLAIN })

    try {
      const res = await predecirManual(datos)
      dispatch({ type: ActionTypes.SET_MANUAL_RESULT, payload: res })
    } catch (err) {
      const detail = err.response?.data?.detail
      if (err.response?.status === 422 && Array.isArray(detail)) {
        const fieldErrors = {}
        detail.forEach(({ loc, msg }) => {
          const field = loc[loc.length - 1]
          fieldErrors[field] = msg
        })
        setBackendErrors(fieldErrors)
        const primerError = detail[0]?.msg || 'Error de validación'
        dispatch({ type: ActionTypes.SET_MANUAL_ERROR, payload: primerError })
      } else {
        const msg = err.response?.data?.error ?? 'Error al conectar con el servidor.'
        dispatch({ type: ActionTypes.SET_MANUAL_ERROR, payload: msg })
      }
    } finally {
      dispatch({ type: ActionTypes.SET_MANUAL_LOADING, payload: false })
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
    dispatch({ type: ActionTypes.RESET_MANUAL })
    dispatch({ type: ActionTypes.RESET_EXPLAIN })
    setBackendErrors({})
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Formulario manual
        </h1>
        <p className="text-slate-300 text-base max-w-2xl">
          Complete los datos clínicos del paciente. Todos los campos con <span className="text-red-400">*</span> son requeridos.
        </p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl p-6 md:p-8 transition-all">
        <PredictionForm
          onSubmit={handleSubmit}
          loading={loading}
          backendErrors={backendErrors}
          onFieldChange={() => setBackendErrors({})}
        />
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-0.5">Error en la predicción</p>
            <p className="text-sm text-red-300/80">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/70 hover:text-white border border-slate-700 transition-all duration-200"
            >
              <RotateCcw size={15} />
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
            <ComparisonCard riesgoComparativo={result.riesgo_comparativo} />
          )}
          
          {explain.loading && (
            <div className="text-center py-6 text-slate-300 bg-slate-800/30 rounded-xl">
              <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              Cargando explicación SHAP...
            </div>
          )}
          {explain.error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-300/80">{explain.error}</p>
            </div>
          )}
          {explain.data && <SHAPChart explainData={explain.data} />}
        </div>
      )}
    </div>
  )
}