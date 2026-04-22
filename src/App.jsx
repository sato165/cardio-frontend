import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ManualPage from './pages/ManualPage'
import UploadPage from './pages/UploadPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <div className="min-h-screen hero-grid text-slate-200">
      <Navbar />
      <main className="pt-20 pb-12 px-4">
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
  )
}