import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

export default function FileUpload({ onSubmit, loading, camposFaltantesExternos = [] }) {
  const [archivos, setArchivos]               = useState([])
  const [tipoArchivo, setTipoArchivo]         = useState(null)
  const [errorTipo, setErrorTipo]             = useState(null)
  const [valoresManuales, setValoresManuales] = useState({})
  const inputRef = useRef(null)

  useEffect(() => {
    if (camposFaltantesExternos.length > 0) setValoresManuales({})
  }, [camposFaltantesExternos])

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

  const handleDrop     = (e) => { e.preventDefault(); handleArchivos(e.dataTransfer.files) }
  const handleDragOver = (e) => e.preventDefault()

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

  return (
    <div className="space-y-6">

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-900 hover:bg-blue-50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.pdf"
          multiple
          className="hidden"
          onChange={e => handleArchivos(e.target.files)}
        />
        <Upload className="mx-auto text-gray-400 mb-3" size={36} />
        <p className="text-gray-700 font-medium mb-1">
          Arrastra los archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-gray-400">
          JSON (1 archivo) · PDF (hasta 5 del mismo paciente)
        </p>
      </div>

      {errorTipo && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 shrink-0" size={16} />
          <p className="text-sm text-red-600">{errorTipo}</p>
        </div>
      )}

      {archivos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            {archivos.length} archivo{archivos.length > 1 ? 's' : ''} seleccionado{archivos.length > 1 ? 's' : ''}
          </p>
          {archivos.map((archivo, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-900 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{archivo.name}</p>
                  <p className="text-xs text-gray-400">
                    {(archivo.size / 1024).toFixed(1)} KB · {tipoArchivo?.toUpperCase()}
                  </p>
                </div>
              </div>
              <button onClick={() => quitarArchivo(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {camposFaltantesExternos.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-yellow-500 shrink-0" size={18} />
            <p className="text-sm font-semibold text-yellow-800">
              {camposFaltantesExternos.length} campo{camposFaltantesExternos.length > 1 ? 's' : ''} no encontrado{camposFaltantesExternos.length > 1 ? 's' : ''} en el archivo
            </p>
          </div>
          <p className="text-xs text-yellow-700 mb-4">
            Complete los valores faltantes para continuar con la predicción.
          </p>
          <div className="space-y-3">
            {camposFaltantesExternos.map(({ campo, descripcion }) => (
              <div key={campo}>
                <label className="block text-xs font-medium text-yellow-800 mb-1">
                  {descripcion}
                </label>
                <input
                  type="number"
                  value={valoresManuales[campo] ?? ''}
                  onChange={e => handleCampoManual(campo, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-yellow-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
          className="w-full py-3 px-6 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Procesando...' : 'Predecir riesgo cardiovascular'}
        </button>
      )}

    </div>
  )
}
