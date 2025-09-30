import axios from "axios"
import { validateStoredToken, clearStoredUser } from "./tokenUtils"

const API_URL = import.meta.env.VITE_API_URL || "/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = validateStoredToken()
    
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear localStorage
      clearStoredUser()
      
      // Redirect to login if needed
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    
    return Promise.reject(error)
  }
)

export default api