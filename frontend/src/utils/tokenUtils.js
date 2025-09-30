// Token utility functions
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user")
    if (user && user !== "undefined" && user !== "null") {
      const parsedUser = JSON.parse(user)
      if (parsedUser && parsedUser.token) {
        return parsedUser
      }
    }
  } catch (error) {
    console.error("Error parsing stored user:", error)
  }
  return null
}

export const clearStoredUser = () => {
  localStorage.removeItem("user")
}

export const isTokenValid = (token) => {
  if (!token || token === "null" || token === "undefined") {
    return false
  }
  
  try {
    // Basic token format validation (JWT has 3 parts separated by dots)
    const parts = token.split(".")
    return parts.length === 3
  } catch (error) {
    return false
  }
}

export const validateStoredToken = () => {
  const user = getStoredUser()
  if (user && !isTokenValid(user.token)) {
    clearStoredUser()
    return null
  }
  return user
}