import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authService"

// Function to check if this is a page refresh vs normal navigation
const isPageRefresh = () => {
  const navigationEntries = performance.getEntriesByType('navigation')
  if (navigationEntries.length > 0) {
    const navigationEntry = navigationEntries[0]
    const isRefresh = navigationEntry.type === 'reload'
    console.log('🔄 Navigation type:', navigationEntry.type, '| Is refresh:', isRefresh)
    return isRefresh
  }
  // Fallback: check if session flag exists
  const sessionExists = sessionStorage.getItem('app_session_active')
  const isRefreshFallback = !sessionExists
  console.log('🔄 Fallback check: Session exists:', !!sessionExists, '| Is refresh:', isRefreshFallback)
  return isRefreshFallback
}

// Get user from localStorage only if it's not a page refresh
const getUserFromStorage = () => {
  if (isPageRefresh()) {
    // Clear user data on page refresh
    console.log('🚫 Page refresh detected - clearing user session')
    localStorage.removeItem("user")
    sessionStorage.removeItem('app_session_active')
    return null
  }
  
  // Set session flag for subsequent navigation
  sessionStorage.setItem('app_session_active', 'true')
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
        // Maintain session flag
        sessionStorage.setItem('app_session_active', 'true')
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
        // Maintain session flag
        sessionStorage.setItem('app_session_active', 'true')
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        // Clear session flag
        sessionStorage.removeItem('app_session_active')
      })
  },
})

export const { reset, maintainSession, updateUserBookmarks, updateUserProfile } = authSlice.actions
export default authSlice.reducer
