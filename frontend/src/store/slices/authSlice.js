import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authService"

// Enhanced function to check if this is a page refresh vs normal navigation
const isPageRefresh = () => {
  // Check if navigation API is available
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigationEntries = performance.getEntriesByType('navigation')
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0]
      const isRefresh = navigationEntry.type === 'reload'
      console.log('🔄 Navigation type:', navigationEntry.type, '| Is refresh:', isRefresh)
      return isRefresh
    }
  }
  
  // Fallback: check if session flag exists and if page was loaded with performance.navigation
  const sessionExists = sessionStorage.getItem('app_session_active')
  
  // Additional check: if performance.navigation exists (older browsers)
  if (typeof window !== 'undefined' && 'performance' in window && 'navigation' in performance) {
    const isRefreshFallback = performance.navigation.type === 1 // TYPE_RELOAD
    console.log('🔄 Legacy navigation check: Reload type:', performance.navigation.type, '| Is refresh:', isRefreshFallback)
    if (isRefreshFallback) return true
  }
  
  // Final fallback: no session exists means likely a refresh
  const isRefreshFallback = !sessionExists
  console.log('🔄 Fallback check: Session exists:', !!sessionExists, '| Is refresh:', isRefreshFallback)
  return isRefreshFallback
}

// Enhanced session expiry configuration
const SESSION_CONFIG = {
  EXPIRE_ON_REFRESH: true, // Set to false to persist through page refresh
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  CHECK_INTERVAL: 60 * 1000, // 1 minute
}

// Get user from localStorage only if session should persist
const getUserFromStorage = () => {
  // Always check for page refresh first
  if (SESSION_CONFIG.EXPIRE_ON_REFRESH && isPageRefresh()) {
    // Clear user data on page refresh for enhanced security
    console.log('🚫 Page refresh detected - clearing user session for security')
    localStorage.removeItem("user")
    sessionStorage.removeItem('app_session_active')
    return null
  }
  
  // Check for session inactivity
  const lastActivity = localStorage.getItem('lastUserActivity')
  if (lastActivity) {
    const timeSinceActivity = Date.now() - parseInt(lastActivity)
    if (timeSinceActivity > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
      console.log('🚫 Session expired due to inactivity')
      localStorage.removeItem("user")
      localStorage.removeItem('lastUserActivity')
      sessionStorage.removeItem('app_session_active')
      return null
    }
  }
  
  // Set session flag for subsequent navigation
  sessionStorage.setItem('app_session_active', 'true')
  localStorage.setItem('lastUserActivity', Date.now().toString())
  
  const userData = JSON.parse(localStorage.getItem("user"))
  console.log('✅ Normal navigation - maintaining user session:', !!userData)
  return userData
}

const user = getUserFromStorage()

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    return await authService.register(userData)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    return await authService.login(userData)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout()
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    // Action to maintain session during navigation
    maintainSession: (state) => {
      sessionStorage.setItem('app_session_active', 'true')
      localStorage.setItem('lastUserActivity', Date.now().toString())
    },
    // Action to manually expire session
    expireSession: (state) => {
      state.user = null
      localStorage.removeItem("user")
      localStorage.removeItem('lastUserActivity')
      sessionStorage.removeItem('app_session_active')
    },
    // Action to validate and refresh session
    refreshSession: (state, action) => {
      if (state.user && action.payload) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem("user", JSON.stringify(state.user))
        sessionStorage.setItem('app_session_active', 'true')
        localStorage.setItem('lastUserActivity', Date.now().toString())
      }
    },
    updateUserBookmarks: (state, action) => {
      if (state.user) {
        state.user.bookmarks = action.payload
        // Update localStorage and maintain session
        localStorage.setItem("user", JSON.stringify(state.user))
        sessionStorage.setItem('app_session_active', 'true')
      }
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        // Update localStorage and maintain session
        localStorage.setItem("user", JSON.stringify(state.user))
        sessionStorage.setItem('app_session_active', 'true')
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        // Maintain session flag and activity tracking
        sessionStorage.setItem('app_session_active', 'true')
        localStorage.setItem('lastUserActivity', Date.now().toString())
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        // Maintain session flag and activity tracking
        sessionStorage.setItem('app_session_active', 'true')
        localStorage.setItem('lastUserActivity', Date.now().toString())
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        // Clear all session data
        sessionStorage.removeItem('app_session_active')
        localStorage.removeItem('lastUserActivity')
      })
  },
})

export const { reset, maintainSession, expireSession, refreshSession, updateUserBookmarks, updateUserProfile } = authSlice.actions
export default authSlice.reducer
