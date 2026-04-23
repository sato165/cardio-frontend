import { Link, useLocation } from 'react-router-dom'
import { HeartPulse, ClipboardList, Upload, Info, Activity } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
      pathname === path
        ? 'text-white'
        : 'text-slate-400 hover:text-white'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <HeartPulse
              className="text-red-500 animate-heartbeat"
              size={24}
              fill="currentColor"
            />
            <div className="absolute inset-0 bg-red-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Artery<span className="text-red-500">-VA</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/manual" className={linkClass('/manual')}>
            <div className="relative">
              <ClipboardList size={18} />
              {pathname === '/manual' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </div>
            <span>Formulario</span>
          </Link>
          
          <Link to="/upload" className={linkClass('/upload')}>
            <div className="relative">
              <Upload size={18} />
              {pathname === '/upload' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
              )}
            </div>
            <span>Historial</span>
          </Link>
          
          <Link to="/about" className={linkClass('/about')}>
            <div className="relative">
              <Info size={18} />
              {pathname === '/about' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
              )}
            </div>
            <span>Acerca</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-light">
          <Activity size={14} className="text-blue-400" />
          <span className="text-xs text-slate-400">Sistema activo</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

      </div>
    </nav>
  )
}