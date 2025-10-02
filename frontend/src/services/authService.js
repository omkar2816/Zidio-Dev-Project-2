import api from "../utils/axiosConfig"

const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  if (response.data && response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data))
    // Set session flag to indicate active session
    sessionStorage.setItem('app_session_active', 'true')
  }
  return response.data
}

const login = async (userData) => {
  const response = await api.post("/auth/login", userData)
  if (response.data && response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data))
    // Set session flag to indicate active session
    sessionStorage.setItem('app_session_active', 'true')
  }
  return response.data
}

const logout = async () => {
  try {
    // Call backend logout to clear httpOnly cookies
    await api.post("/auth/logout")
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always clear local storage regardless of backend response
    localStorage.removeItem("user")
    sessionStorage.removeItem('app_session_active')
  }
}

const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh")
    if (response.data && response.data.token) {
      // Update stored user data with new token
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      const updatedUser = { ...currentUser, ...response.data }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      sessionStorage.setItem('app_session_active', 'true')
      return response.data
    }
  } catch (error) {
    // If refresh fails, clear stored data
    localStorage.removeItem("user")
    sessionStorage.removeItem('app_session_active')
    throw error
  }
}

const validateSession = async () => {
  try {
    const response = await api.get("/auth/validate")
    return response.data
  } catch (error) {
    throw error
  }
}

// Get current user from localStorage
const getCurrentUser = () => {
  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

// Check if user is authenticated
const isAuthenticated = () => {
  const user = getCurrentUser()
  return !!(user && user.token)
}

const authService = {
  register,
  login,
  logout,
  refreshToken,
  validateSession,
  getCurrentUser,
  isAuthenticated,
}

export default authService
