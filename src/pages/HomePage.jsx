import { useNavigate } from 'react-router-dom'
import { 
  ClipboardList, Upload, HeartPulse, ShieldCheck, FileText, 
  Sparkles, ArrowRight, Cpu, Activity, Brain, BarChart2,
  FlaskConical, Layers, Server, Users, CheckCircle, AlertCircle
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center">

      {/* Hero Section - Impactante */}
      <div className="relative text-center mt-8 mb-20 w-full">
        {/* Glow effects de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-2xl -z-10" />
        
        {/* Icono animado */}
        <div className="relative inline-block mb-6 animate-float">
          <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 backdrop-blur-sm">
            <HeartPulse className="text-red-500 animate-heartbeat" size={56} fill="currentColor" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          Artery<span className="text-gradient-red">-VA</span>
        </h1>
        <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Predicción de riesgo cardiovascular con <strong className="text-blue-400">clustering avanzado</strong> 
          y <strong className="text-purple-400">explicabilidad SHAP</strong> para la toma de decisiones clínicas.
        </p>
        
        {/* Badges reales del proyecto */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-light border border-white/10 backdrop-blur-sm">
            <Cpu size={16} className="text-blue-400" />
            <span className="text-sm text-slate-200 font-medium">Random Forest</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-light border border-white/10 backdrop-blur-sm">
            <Layers size={16} className="text-cyan-400" />
            <span className="text-sm text-slate-200 font-medium">4 Clusters clínicos</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-light border border-white/10 backdrop-blur-sm">
            <Brain size={16} className="text-purple-400" />
            <span className="text-sm text-slate-200 font-medium">SHAP Explainability</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-light border border-white/10 backdrop-blur-sm">
            <Users size={16} className="text-green-400" />
            <span className="text-sm text-slate-200 font-medium">Datos reales colombianos</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de acción principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-20">
        {/* Formulario manual */}
        <button
          onClick={() => navigate('/manual')}
          className="group relative overflow-hidden glass-card rounded-3xl p-8 text-left transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 hover:border-blue-500/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-all duration-700" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 group-hover:border-blue-500/60 transition-colors">
                <ClipboardList className="text-blue-400" size={32} />
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-2 transition-all duration-300" size={24} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">Formulario Manual</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Ingrese las <strong className="text-blue-300">19 variables clínicas</strong> del paciente campo por campo.
              Validación en tiempo real con rangos clínicos y mensajes de ayuda.
            </p>
            
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <span>Ingresar datos</span>
              <Sparkles size={14} />
            </div>
          </div>
        </button>

        {/* Carga de archivos */}
        <button
          onClick={() => navigate('/upload')}
          className="group relative overflow-hidden glass-card rounded-3xl p-8 text-left transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 hover:border-red-500/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/40 transition-all duration-700" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-red-500/20 backdrop-blur-sm border border-red-500/30 group-hover:border-red-500/60 transition-colors">
                <Upload className="text-red-400" size={32} />
              </div>
              <ArrowRight className="text-slate-500 group-hover:text-red-400 group-hover:translate-x-2 transition-all duration-300" size={24} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">Cargar Historia Clínica</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Suba archivos <strong className="text-red-300">JSON o PDF</strong>. El sistema extrae automáticamente
              los datos mediante IA avanzada y solicita campos faltantes.
            </p>
            
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <span>Subir archivo</span>
              <Sparkles size={14} />
            </div>
          </div>
        </button>
      </div>

      {/* Sección: El modelo detrás de Artery-VA */}
      <div className="w-full max-w-5xl mb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full">Pipeline clínico</span>
          <h2 className="text-3xl font-bold text-white mt-4 mb-3">El modelo detrás de Artery-VA</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Clustering no supervisado + Random Forest entrenado con datos reales de pacientes colombianos y validado externamente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 text-center border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users size={24} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-xs text-slate-400">Perfiles clínicos</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <BarChart2 size={24} className="text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">19</p>
            <p className="text-xs text-slate-400">Variables clínicas</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Brain size={24} className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">150</p>
            <p className="text-xs text-slate-400">Árboles Random Forest</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center border border-white/5 hover:border-green-500/30 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">11</p>
            <p className="text-xs text-slate-400">Componentes PCA</p>
          </div>
        </div>

        <div className="mt-6 glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-800/80">
                <FlaskConical size={24} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pipeline completo</p>
                <p className="text-xs text-slate-500">Winsorización experta → KNN Imputer → StandardScaler → PCA → Random Forest</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-800/80">
                <ShieldCheck size={24} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Validación externa</p>
                <p className="text-xs text-slate-500">Prueba en cohorte real de pacientes anónimos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Perfiles clínicos (los 4 clusters) */}
      <div className="w-full max-w-5xl mb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full">Fenotipos de riesgo</span>
          <h2 className="text-3xl font-bold text-white mt-4 mb-3">Perfiles clínicos identificados</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">El modelo asigna cada paciente a uno de cuatro clusters con características fisiopatológicas distintas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 border-l-4 border-red-500 bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
              <HeartPulse size={20} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cardiovascular</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Alteración lipídica predominante con riesgo cardiovascular elevado. Seguimiento cardiológico recomendado.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border-l-4 border-green-500 bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bajo riesgo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Perfil saludable. Mantener hábitos de vida saludable y revisión anual.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border-l-4 border-yellow-500 bg-gradient-to-br from-yellow-500/5 to-transparent">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
              <Activity size={20} className="text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cardiometabólico</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Resistencia metabólica + perfil lipídico alterado. Control metabólico y seguimiento endocrinológico.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border-l-4 border-purple-500 bg-gradient-to-br from-purple-500/5 to-transparent">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
              <Server size={20} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cardiorrenal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Disfunción renal + alteración lipídica. Nefrología + manejo agresivo de lípidos.</p>
          </div>
        </div>
      </div>

      {/* Sección: Tecnologías y características */}
      <div className="w-full max-w-5xl mb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full">Stack tecnológico</span>
          <h2 className="text-3xl font-bold text-white mt-4 mb-3">Tecnologías que potencian Artery-VA</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Backend robusto, frontend moderno y modelos de IA explicables.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Server size={20} className="text-blue-400" />
            </div>
            <p className="text-sm font-medium text-white">FastAPI</p>
            <p className="text-xs text-slate-500">Backend asíncrono</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-red-500/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Activity size={20} className="text-red-400" />
            </div>
            <p className="text-sm font-medium text-white">React + Vite</p>
            <p className="text-xs text-slate-500">Frontend moderno</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Brain size={20} className="text-purple-400" />
            </div>
            <p className="text-sm font-medium text-white">SHAP</p>
            <p className="text-xs text-slate-500">Explicabilidad</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-green-500/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FileText size={20} className="text-green-400" />
            </div>
            <p className="text-sm font-medium text-white">scikit-learn</p>
            <p className="text-xs text-slate-500">Modelos ML</p>
          </div>
        </div>
      </div>

      {/* Call to action final */}
      <div className="w-full max-w-4xl mb-16">
        <div className="relative glass-card rounded-3xl p-10 text-center overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/5 to-purple-500/10" />
          <div className="relative">
            <Sparkles className="mx-auto text-blue-400 mb-4" size={32} />
            <h3 className="text-2xl font-bold text-white mb-3">¿Listo para predecir el riesgo cardiovascular?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Elija una de las dos opciones y obtenga resultados precisos respaldados por IA y validación clínica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/manual')}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ClipboardList size={18} />
                Formulario manual
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-8 py-3 rounded-xl glass-light border border-white/20 hover:bg-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                Subir historia clínica
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos adicionales para animaciones personalizadas */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .text-gradient-red {
          background: linear-gradient(135deg, #ef4444, #f97316);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .heart-glow {
          filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.6));
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}