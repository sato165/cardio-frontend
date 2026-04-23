import { useNavigate } from 'react-router-dom'
import { ClipboardList, Upload, HeartPulse, ShieldCheck, FileText, Sparkles, ArrowRight, Cpu, Activity } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center">

      {/* Hero Section */}
      <div className="text-center mt-8 mb-16 relative">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-2xl -z-10" />
        
        {/* Animated heart icon */}
        <div className="relative inline-block mb-6 stagger-1">
          <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 glass-card">
            <HeartPulse className="text-red-500 animate-heartbeat" size={56} fill="currentColor" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight stagger-2">
          Artery<span className="text-gradient-red">-VA</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed stagger-3">
          Sistema de predicción de riesgo cardiovascular con inteligencia artificial 
          y explicabilidad clínica avanzada para profesionales de la salud.
        </p>
        
        {/* Stats badges */}
        <div className="flex items-center justify-center gap-6 mt-8 stagger-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <Cpu size={16} className="text-blue-400" />
            <span className="text-sm text-slate-300">XGBoost</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <Activity size={16} className="text-cyan-400" />
            <span className="text-sm text-slate-300">AUC 0.799</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <ShieldCheck size={16} className="text-green-400" />
            <span className="text-sm text-slate-300">68K+ Registros</span>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-16">

        {/* Formulario manual */}
        <button
          onClick={() => navigate('/manual')}
          className="group relative overflow-hidden glass-card rounded-3xl p-8 text-left glass-card-hover stagger-3"
        >
          {/* Card background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                <ClipboardList className="text-blue-400" size={32} />
              </div>
              <ArrowRight className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={20} />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              Formulario Manual
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Ingrese los datos clínicos del paciente campo por campo. 
              Validación en tiempo real con mensajes de ayuda contextuales.
            </p>
            
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <span>Ingresar datos</span>
              <Sparkles size={14} />
            </div>
          </div>
        </button>

        {/* Cargar historia clínica */}
        <button
          onClick={() => navigate('/upload')}
          className="group relative overflow-hidden glass-card rounded-3xl p-8 text-left glass-card-hover stagger-4"
        >
          {/* Card background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                <Upload className="text-red-400" size={32} />
              </div>
              <ArrowRight className="text-slate-600 group-hover:text-red-400 group-hover:translate-x-1 transition-all" size={20} />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              Cargar Historia Clínica
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Suba archivos JSON o PDF. El sistema extrae los datos 
              automáticamente mediante IA y solicita campos faltantes.
            </p>
            
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <span>Subir archivo</span>
              <Sparkles size={14} />
            </div>
          </div>
        </button>

      </div>

      {/* Features Section */}
      <div className="w-full max-w-4xl border-t border-white/5 pt-12 stagger-5">
        <p className="text-xs text-slate-500 text-center uppercase tracking-[0.3em] mb-8">
          Características del Sistema
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-blue-500/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ShieldCheck className="text-blue-400" size={20} />
              </div>
              <p className="text-sm font-semibold text-white">Modelo XGBoost</p>
            </div>
            <p className="text-xs text-slate-500">AUC-ROC 0.799 · 68,515 registros entrenados</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <FileText className="text-cyan-400" size={20} />
              </div>
              <p className="text-sm font-semibold text-white">Explicabilidad SHAP</p>
            </div>
            <p className="text-xs text-slate-500">Factores de riesgo en lenguaje clínico</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-red-500/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Upload className="text-red-400" size={20} />
              </div>
              <p className="text-sm font-semibold text-white">JSON y PDF</p>
            </div>
            <p className="text-xs text-slate-500">Extracción de texto, tablas y escaneados</p>
          </div>

        </div>
      </div>

    </div>
  )
}