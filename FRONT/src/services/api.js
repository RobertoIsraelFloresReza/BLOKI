/**
 * Axios API Client Configuration
 * Centralized HTTP client with interceptors for authentication and error handling
 * Based on backend API documentation
 */

import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Automatically attaches JWT token to requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('blocki_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || '')
    }

    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles errors globally and provides user feedback
 */
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    return response
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        // Validation errors
        if (Array.isArray(data.message)) {
          data.message.forEach((msg) => toast.error(msg))
        } else {
          toast.error(data.message || 'Datos inválidos')
        }
        break

      case 401:
        // Unauthorized - token invalid or expired
        localStorage.removeItem('blocki_token')
        localStorage.removeItem('blocki_user')
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.')
        // Redirect to login
        window.location.href = '/'
        break

      case 403:
        // Forbidden
        toast.error('No tienes permisos para realizar esta acción.')
        break

      case 404:
        // Not found
        toast.error('Recurso no encontrado.')
        break

      case 409:
        // Conflict (e.g., duplicate email)
        toast.error(data.message || 'El recurso ya existe.')
        break

      case 422:
        // Unprocessable entity
        toast.error(data.message || 'Error de validación.')
        break

      case 429:
        // Rate limit exceeded
        toast.error('Demasiadas solicitudes. Por favor intenta más tarde.')
        break

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        toast.error('Error del servidor. Intenta nuevamente más tarde.')
        break

      default:
        toast.error(data?.message || 'Ocurrió un error inesperado.')
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config.method?.toUpperCase()} ${error.config.url}`, {
        status,
        data,
        error
      })
    }

    return Promise.reject(error)
  }
)

/**
 * Helper function to handle FormData requests
 * Used for file uploads (images, documents)
 */
export const createFormDataRequest = (data, files, fileKey = 'files') => {
  const formData = new FormData()

  // Append non-file data
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key])
    }
  })

  // Append files
  if (files) {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append(fileKey, file)
      })
    } else {
      formData.append(fileKey, files)
    }
  }

  return formData
}

/**
 * Helper function to build query params
 */
export const buildQueryParams = (params) => {
  const query = new URLSearchParams()

  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })

  return query.toString()
}

export default api
