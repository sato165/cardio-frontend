import { Link, useLocation } from 'react-router-dom'
import { Heart, ClipboardList, Upload } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? 'bg-blue-900 text-white'
        : 'text-gray-300 hover:bg-blue-800 hover:text-white'
    }`

  return (
    <nav className="bg-blue-950 shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="text-red-500" size={22} fill="currentColor" />
          <span className="text-white font-bold text-lg tracking-tight">
            Cardio<span className="text-red-500">Predict</span>
          </span>
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-2">
          <Link to="/manual" className={linkClass('/manual')}>
            <ClipboardList size={16} />
            Formulario manual
          </Link>
          <Link to="/upload" className={linkClass('/upload')}>
            <Upload size={16} />
            Cargar historia clínica
          </Link>
        </div>

      </div>
    </nav>
  )
}
