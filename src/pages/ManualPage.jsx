import { AlertCircle } from 'lucide-react'
import PredictionForm from '../components/PredictionForm'
import ResultCard from '../components/ResultCard'
import ExplainabilityChart from '../components/ExplainabilityChart'
import usePrediction from '../hooks/usePrediction'

export default function ManualPage() {
  const { loading, resultado, error, predecir, reset } = usePrediction()

  const handleSubmit = (datos) => {
    predecir(datos, 'manual')
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-950 mb-1">
          Formulario manual
        </h1>
        <p className="text-gray-500 text-sm">
          Complete los datos del paciente. Todos los campos son requeridos.
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <PredictionForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-0.5">Error en la predicción</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={reset}
              className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Nueva predicción
            </button>
          </div>
          <ResultCard resultado={resultado} />
          <ExplainabilityChart explicabilidad={resultado.explicabilidad} />
        </div>
      )}

    </div>
  )
}
