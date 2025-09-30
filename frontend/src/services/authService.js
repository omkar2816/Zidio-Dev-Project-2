import api from "../utils/axiosConfig"

const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  if (response.data && response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data))
  }
  return response.data
}

const login = async (userData) => {
  const response = await api.post("/auth/login", userData)
  if (response.data && response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data))
  }
  return response.data
}

const logout = () => {
  localStorage.removeItem("user")
}

const authService = {
  register,
  login,
  logout,
}

export default authService
