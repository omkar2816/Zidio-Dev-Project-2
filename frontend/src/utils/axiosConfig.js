import axios from "axios"
import { validateStoredToken, clearStoredUser } from "./tokenUtils"

const API_URL = import.meta.env.VITE_API_URL || "/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies for refresh token
})

// Track refresh attempts to prevent infinite loops
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

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

// Add response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    console.log('🚨 Axios interceptor - Error status:', error.response?.status)
    console.log('🔄 Axios interceptor - Retry flag:', originalRequest._retry)

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log('⏳ Already refreshing token, queuing request...')
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      console.log('🔄 Starting token refresh process...')
      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh token
        console.log('🔄 Calling refresh endpoint...')
        const response = await api.post('/auth/refresh')
        const { token } = response.data

        console.log('✅ Token refresh successful')

        // Update stored user data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
        const updatedUser = { ...currentUser, token }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        originalRequest.headers.Authorization = `Bearer ${token}`

        // Process queued requests
        processQueue(null, token)

        console.log('🔄 Retrying original request...')
        return api(originalRequest)
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError.message)
        // Refresh failed, logout user
        processQueue(refreshError, null)
        clearStoredUser()
        
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          console.log('🚪 Redirecting to login...')
          window.location.href = "/login"
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // For other errors, just reject
    return Promise.reject(error)
  }
)

export default api