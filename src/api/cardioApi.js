// cardioApi.js — modelo final k=4 (notebook_proy_final)

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

export async function predecirManual(datos) {
  // datos.talla llega en cm — el backend lo convierte a metros en preprocessing.py
  const { data } = await api.post('/api/predict/', datos)
  return data
}

export async function predecirDesdeJson(archivo, camposManuales = {}) {
  const formData = new FormData()
  formData.append('archivo', archivo)

  const params = new URLSearchParams()
  Object.entries(camposManuales).forEach(([k, v]) => {
    if (v !== '' && v !== undefined) params.append(k, v)
  })

  const url = params.toString() ? `/api/upload?${params.toString()}` : '/api/upload'
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

  const url = params.toString() ? `/api/upload/pdf?${params.toString()}` : '/api/upload/pdf'
  const { data } = await api.post(url, formData)
  return data
}

export async function predecirExplain(datos) {
  // Mismo payload que predecirManual — el endpoint devuelve SHAP values por cluster
  const { data } = await api.post('/api/predict/explain', datos)
  return data
}