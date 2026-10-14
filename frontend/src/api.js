import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:8080/api' : '')

const api = axios.create({
  baseURL,
})

api.interceptors.request.use(config => {
  if (!baseURL) {
    throw new Error('Set VITE_API_URL to the deployed backend URL ending in /api.')
  }
  return config
})

export default api
