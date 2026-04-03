import { useNavigate } from 'react-router-dom'
import { ClipboardList, Upload, Heart, ShieldCheck, FileText } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center">

      {/* Hero */}
      <div className="text-center mt-12 mb-14">
        <div className="flex justify-center mb-4">
          <Heart className="text-red-500" size={48} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold text-blue-950 mb-3 tracking-tight">
          CardioPredict
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Sistema de predicción de riesgo cardiovascular con explicabilidad
          clínica para médicos.
        </p>
      </div>

      {/* Tarjetas de acceso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-16">

        {/* Formulario manual */}
        <button
          onClick={() => navigate('/manual')}
          className="group flex flex-col items-start gap-4 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-900 transition-all text-left cursor-pointer"
        >
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
            <ClipboardList className="text-blue-900" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-950 mb-1">
              Formulario manual
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ingrese los datos del paciente campo por campo. Validación en
              tiempo real antes de enviar la predicción.
            </p>
          </div>
          <span className="text-blue-900 text-sm font-medium group-hover:underline">
            Ingresar datos →
          </span>
        </button>

        {/* Cargar historia clínica */}
        <button
          onClick={() => navigate('/upload')}
          className="group flex flex-col items-start gap-4 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-red-600 transition-all text-left cursor-pointer"
        >
          <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
            <Upload className="text-red-600" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-950 mb-1">
              Cargar historia clínica
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Suba un archivo JSON o PDF. El sistema extrae los datos
              automáticamente y solicita los campos faltantes.
            </p>
          </div>
          <span className="text-red-600 text-sm font-medium group-hover:underline">
            Subir archivo →
          </span>
        </button>

      </div>

      {/* Características */}
      <div className="w-full max-w-3xl border-t border-gray-100 pt-10">
        <p className="text-xs text-gray-400 text-center uppercase tracking-widest mb-6">
          Características del sistema
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
            <ShieldCheck className="text-blue-900 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">Modelo XGBoost</p>
              <p className="text-xs text-gray-400 mt-0.5">AUC-ROC 0.799 · 68 515 registros</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
            <FileText className="text-blue-900 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">Explicabilidad SHAP</p>
              <p className="text-xs text-gray-400 mt-0.5">Factores en lenguaje clínico</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
            <Upload className="text-blue-900 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">JSON y PDF</p>
              <p className="text-xs text-gray-400 mt-0.5">Texto, tablas y escaneados</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
