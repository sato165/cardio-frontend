import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import PatientSummary from '../components/PatientSummary'
import ResultCard from '../components/ResultCard'
import ExplainabilityChart from '../components/ExplainabilityChart'
import usePrediction from '../hooks/usePrediction'

export default function UploadPage() {
  const { loading, resultado, error, camposFaltantes, datosPaciente, predecir, reset } = usePrediction()
  const [uploadKey, setUploadKey] = useState(0)

  const handleSubmit = (archivos, tipo, camposManuales) => {
    if (tipo === 'json') {
      predecir(archivos[0], 'json', camposManuales)
    } else {
      predecir(archivos, 'pdf', camposManuales)
    }
  }

  const handleReset = () => {
    reset()
    setUploadKey(k => k + 1)
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-950 mb-1">
          Cargar historia clínica
        </h1>
        <p className="text-gray-500 text-sm">
          Suba un archivo JSON o uno o varios PDFs del mismo paciente.
          El sistema extrae los datos automáticamente.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <FileUpload
          key={uploadKey}
          onSubmit={handleSubmit}
          loading={loading}
          camposFaltantesExternos={camposFaltantes}
        />
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-0.5">Error en la predicción</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {resultado && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Nueva predicción
            </button>
          </div>
          <PatientSummary paciente={datosPaciente} />
          <ResultCard resultado={resultado} />
          <ExplainabilityChart explicabilidad={resultado.explicabilidad} />
        </div>
      )}

    </div>
  )
}
