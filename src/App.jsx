// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import EkgBackground from './components/EkgBackground'
import HomePage from './pages/HomePage'
import ManualPage from './pages/ManualPage'
import UploadPage from './pages/UploadPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <div className="relative min-h-screen hero-grid text-slate-200">
      {/* Fondo animado fijo (cubre toda la pantalla) */}
      <EkgBackground color="green" />

      {/* Capa de contenido por encima del fondo */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="pt-20 pb-12 px-4 flex-1">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/manual" element={<ManualPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}