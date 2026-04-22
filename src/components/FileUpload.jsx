import { useState, useRef } from 'react'
import { Upload, FileText, X, AlertCircle, FileJson, File, CheckCircle, Sparkles } from 'lucide-react'

export default function FileUpload({ onSubmit, loading, camposFaltantesExternos = [] }) {
  const [archivos, setArchivos]               = useState([])
  const [tipoArchivo, setTipoArchivo]         = useState(null)
  const [errorTipo, setErrorTipo]             = useState(null)
  const [valoresManuales, setValoresManuales] = useState({})
  const [isDragging, setIsDragging]           = useState(false)
  const inputRef = useRef(null)

  const validarTipo = (archivo) => {
    if (archivo.type === 'application/json') return 'json'
    if (archivo.type === 'application/pdf')  return 'pdf'
    const ext = archivo.name.split('.').pop().toLowerCase()
    if (ext === 'json') return 'json'
    if (ext === 'pdf')  return 'pdf'
    return null
  }

  const handleArchivos = (nuevos) => {
    setErrorTipo(null)
    const lista = Array.from(nuevos)
    const tipo  = validarTipo(lista[0])

    if (!tipo) { setErrorTipo('Solo se aceptan archivos JSON o PDF.'); return }
    if (lista.some(a => validarTipo(a) !== tipo)) { setErrorTipo('No se pueden mezclar archivos JSON y PDF.'); return }
    if (tipo === 'json' && lista.length > 1) { setErrorTipo('Solo se puede subir un archivo JSON a la vez.'); return }
    if (tipo === 'pdf'  && lista.length > 5) { setErrorTipo('Se permiten máximo 5 archivos PDF por solicitud.'); return }

    setArchivos(lista)
    setTipoArchivo(tipo)
    setValoresManuales({})
  }

  const handleDrop     = (e) => { 
    e.preventDefault()
    setIsDragging(false)
    handleArchivos(e.dataTransfer.files) 
  }
  const handleDragOver = (e) => { 
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const quitarArchivo = (index) => {
    const nueva = archivos.filter((_, i) => i !== index)
    setArchivos(nueva)
    if (nueva.length === 0) { setTipoArchivo(null); setValoresManuales({}) }
  }

  const handleCampoManual = (campo, valor) => {
    setValoresManuales(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = () => {
    if (!archivos.length) return
    onSubmit(archivos, tipoArchivo, valoresManuales)
  }

  const todosCompletos = camposFaltantesExternos.length === 0 ||
    camposFaltantesExternos.every(c =>
      valoresManuales[c.campo] !== undefined && valoresManuales[c.campo] !== ''
    )

  const FileIcon = tipoArchivo === 'json' ? FileJson : File

  return (
    <div className="space-y-6">

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-2xl p-12 text-center cursor-pointer 
          transition-all duration-300 border-2 border-dashed
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.pdf"
          multiple
          className="hidden"
          onChange={e => handleArchivos(e.target.files)}
        />
        
        {/* Background effect */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-red-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
            isDragging ? 'bg-blue-500/20 scale-110' : 'bg-slate-700/50'
          }`}>
            <Upload className={`${isDragging ? 'text-blue-400' : 'text-slate-400'}`} size={32} />
          </div>
          
          <p className="text-slate-200 font-medium mb-2">
            {isDragging ? 'Suelta los archivos aquí' : 'Arrastra los archivos aquí o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-slate-500">
            JSON (1 archivo) · PDF (hasta 5 del mismo paciente)
          </p>
          
          {isDragging && (
            <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl animate-pulse pointer-events-none" />
          )}
        </div>
      </div>

      {errorTipo && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-scale-in">
          <AlertCircle className="text-red-400 shrink-0" size={20} />
          <p className="text-sm text-red-300">{errorTipo}</p>
        </div>
      )}

      {archivos.length > 0 && (
        <div className="space-y-3 animate-scale-in">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            {archivos.length} archivo{archivos.length > 1 ? 's' : ''} seleccionado{archivos.length > 1 ? 's' : ''}
          </p>
          {archivos.map((archivo, i) => (
            <div key={i} className="flex items-center justify-between p-4 glass-card rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  tipoArchivo === 'json' ? 'bg-blue-500/10' : 'bg-red-500/10'
                }`}>
                  <FileIcon 
                    className={tipoArchivo === 'json' ? 'text-blue-400' : 'text-red-400'} 
                    size={24} 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{archivo.name}</p>
                  <p className="text-xs text-slate-500">
                    {(archivo.size / 1024).toFixed(1)} KB · {tipoArchivo?.toUpperCase()}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); quitarArchivo(i) }} 
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {camposFaltantesExternos.length > 0 && (
        <div className="glass-card border border-yellow-500/20 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertCircle className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {camposFaltantesExternos.length} campo{camposFaltantesExternos.length > 1 ? 's' : ''} no encontrado{camposFaltantesExternos.length > 1 ? 's' : ''} en el archivo
              </p>
              <p className="text-xs text-slate-500">
                Complete los valores faltantes para continuar con la predicción.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {camposFaltantesExternos.map(({ campo, descripcion }) => (
              <div key={campo}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  {descripcion}
                </label>
                <input
                  type="number"
                  value={valoresManuales[campo] ?? ''}
                  onChange={e => handleCampoManual(campo, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl input-glass text-sm"
                  placeholder={`Ingrese ${descripcion.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {archivos.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={loading || !todosCompletos}
          className="w-full py-4 px-6 rounded-xl btn-primary flex items-center justify-center gap-3 text-base"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Procesando predicción...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Predecir riesgo cardiovascular</span>
            </>
          )}
        </button>
      )}

    </div>
  )
}