import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

export async function predecirManual(datos) {
  const { data } = await api.post('/api/predict/', datos)
  return data
}

export async function predecirDesdeJson(archivo, camposManuales = {}) {
  const formData = new FormData()
  formData.append('archivo', archivo)

  // Si hay campos manuales los enviamos como query params
  const params = new URLSearchParams()
  Object.entries(camposManuales).forEach(([k, v]) => {
    if (v !== '' && v !== undefined) params.append(k, v)
  })

  const url = params.toString()
    ? `/api/predict/upload?${params.toString()}`
    : '/api/predict/upload'

  const { data } = await api.post(url, formData)
  return data
}

export async function predecirDesdePdf(archivos, camposManuales = {}) {
  const formData = new FormData()
  archivos.forEach(archivo => formData.append('archivos', archivo))

  const params = new URLSearchParams()
  Object.entries(camposManuales).forEach(([k, v]) => {
    if (v !== '' && v !== undefined) params.append(k, v)
  })

  const url = params.toString()
    ? `/api/predict/upload/pdf?${params.toString()}`
    : '/api/predict/upload/pdf'

  const { data } = await api.post(url, formData)
  return data
}
