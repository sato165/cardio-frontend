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
    // Limpiar explicación anterior
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-2">
          Formulario Manual
        </h1>
        <p className="text-slate-400 text-sm">
          Complete los datos clínicos del paciente. Todos los campos son requeridos.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/5 animate-slide-up delay-100">
        <PredictionForm
          onSubmit={handleSubmit}
          loading={loading}
          backendErrors={backendErrors}
          onFieldChange={() => setBackendErrors({})}
        />
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
            <ComparisonCard riesgoComparativo={result.riesgo_comparativo} />
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