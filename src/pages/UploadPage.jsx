import { useState } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
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
        <FileUpload
          key={uploadKey}
          onSubmit={handleSubmit}
          loading={loading}
          camposFaltantesExternos={camposFaltantes}
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

      {resultado && (
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
          <PatientSummary paciente={datosPaciente} />
          <ResultCard resultado={resultado} />
          <ExplainabilityChart explicabilidad={resultado.explicabilidad} />
        </div>
      )}

    </div>
  )
}