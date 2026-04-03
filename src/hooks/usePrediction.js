import { useState } from 'react'
import { predecirManual, predecirDesdeJson, predecirDesdePdf } from '../api/cardioApi'

export default function usePrediction() {
  const [loading, setLoading]                 = useState(false)
  const [resultado, setResultado]             = useState(null)
  const [error, setError]                     = useState(null)
  const [camposFaltantes, setCamposFaltantes] = useState([])

  const predecir = async (datos, tipo, camposManuales = {}) => {
    setLoading(true)
    setError(null)
    setResultado(null)
    setCamposFaltantes([])

    try {
      let respuesta

      if (tipo === 'manual') {
        respuesta = await predecirManual(datos)
        setResultado(respuesta)
      } else if (tipo === 'json') {
        respuesta = await predecirDesdeJson(datos, camposManuales)
        _procesarUploadOutput(respuesta)
      } else if (tipo === 'pdf') {
        respuesta = await predecirDesdePdf(datos, camposManuales)
        _procesarUploadOutput(respuesta)
      }
    } catch (err) {
      const mensaje =
        err.response?.data?.detalle?.[0]?.mensaje ??
        err.response?.data?.error ??
        'Error al conectar con el servidor. Verifique que el backend esté activo.'
      setError(mensaje)
    } finally {
      setLoading(false)
    }
  }

  const _procesarUploadOutput = (respuesta) => {
    if (respuesta.campos_faltantes?.length > 0) {
      setCamposFaltantes(respuesta.campos_faltantes)
    } else if (respuesta.prediccion) {
      setResultado(respuesta.prediccion)
    }
  }

  const reset = () => {
    setResultado(null)
    setError(null)
    setCamposFaltantes([])
  }

  return { loading, resultado, error, camposFaltantes, predecir, reset }
}
