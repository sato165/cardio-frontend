import { AlertCircle, RotateCcw } from 'lucide-react'
import PredictionForm from '../components/PredictionForm'
import PatientSummary from '../components/PatientSummary'
import ResultCard from '../components/ResultCard'
import ExplainabilityChart from '../components/ExplainabilityChart'
import ComparisonCard from '../components/ComparisonCard'
import { usePredictionContext } from '../context/PredictionContext'
import { predecirManual } from '../api/cardioApi'

export default function ManualPage() {
  const { state, dispatch, ActionTypes } = usePredictionContext()
  const { loading, result, error, patientData } = state.manual

  const handleSubmit = async (datos) => {
    dispatch({ type: ActionTypes.SET_MANUAL_PATIENT, payload: datos })
    dispatch({ type: ActionTypes.SET_MANUAL_LOADING, payload: true })
    dispatch({ type: ActionTypes.SET_MANUAL_ERROR, payload: null })
    try {
      const res = await predecirManual(datos)
      dispatch({ type: ActionTypes.SET_MANUAL_RESULT, payload: res })
    } catch (err) {
      const msg = err.response?.data?.detalle?.[0]?.mensaje ??
                  err.response?.data?.error ??
                  'Error al conectar con el servidor.'
      dispatch({ type: ActionTypes.SET_MANUAL_ERROR, payload: msg })
    } finally {
      dispatch({ type: ActionTypes.SET_MANUAL_LOADING, payload: false })
    }
  }

  const handleReset = () => {
    dispatch({ type: ActionTypes.RESET_MANUAL })
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
        <PredictionForm onSubmit={handleSubmit} loading={loading} />
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