import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/User.js"

// Session tracking for activity-based expiration
const userSessions = new Map()

// Update user activity
const updateUserActivity = (userId) => {
  userSessions.set(userId, {
    lastActivity: Date.now(),
    isActive: true
  })
}

// Check if user session has expired due to inactivity
const isSessionExpired = (userId, inactivityTimeout = 30 * 60 * 1000) => { // 30 minutes default
  const session = userSessions.get(userId)
  
  // If no session exists, create one (don't treat as expired for existing valid tokens)
  if (!session) {
    console.log('📝 Creating new session for user:', userId)
    updateUserActivity(userId)
    return false
  }
  
  const now = Date.now()
  const timeSinceLastActivity = now - session.lastActivity
  
  console.log('⏰ Session check for user:', userId, 'Time since activity:', Math.round(timeSinceLastActivity / 1000 / 60), 'minutes')
  
  if (timeSinceLastActivity > inactivityTimeout) {
    console.log('❌ Session expired for user:', userId)
    userSessions.delete(userId)
    return true
  }
  
  return false
}

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]
      
      console.log('🔐 Auth middleware - token received:', token ? 'YES' : 'NO')

      // Check if token exists and is not empty
      if (!token || token === "null" || token === "undefined") {
        console.log('❌ Auth middleware - invalid token format')
        res.status(401)
        throw new Error("Not authorized, invalid token")
      }

      // Verify token
      console.log('🔍 Auth middleware - verifying token...')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('✅ Auth middleware - token verified for user:', decoded.id)

      // Get user from token and check if active
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        console.log('❌ Auth middleware - user not found:', decoded.id)
        res.status(401)
        throw new Error("Not authorized, user not found")
      }

      if (!req.user.isActive) {
        console.log('❌ Auth middleware - user inactive:', req.user.email)
        res.status(401)
        throw new Error("Account is inactive")
      }

      // Check for session inactivity (temporarily disabled for debugging)
      // if (isSessionExpired(req.user.id)) {
      //   console.log('❌ Auth middleware - session expired for user:', req.user.email)
      //   res.status(401)
      //   throw new Error("Session expired due to inactivity")
      // }

      // Update user activity and last login
      updateUserActivity(req.user.id)
      await User.findByIdAndUpdate(decoded.id, { lastLogin: new Date() })

      console.log('✅ Auth middleware - user authenticated:', req.user.email)
      next()
    } catch (error) {
      console.error("❌ JWT Error:", error.message)
      res.status(401)
      
      if (error.name === "JsonWebTokenError") {
        throw new Error("Not authorized, invalid token")
      } else if (error.name === "TokenExpiredError") {
        console.log('⏰ Token expired - client should refresh')
        throw new Error("Not authorized, token expired")
      } else {
        throw new Error("Not authorized")
      }
    }
  } else {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
})

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as admin")
  }
}

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401)
      throw new Error("Not authorized")
    }

    if (!roles.includes(req.user.role)) {
      res.status(403)
      throw new Error("Not authorized for this resource")
    }

    next()
  }
}

// Admin authorization (admin and superadmin with proper approval)
export const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    res.status(401)
    throw new Error('Not authorized - no user found')
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('Not authorized - user not found')
  }

  // Check if user is authorized for their role
  if (!user.isAuthorizedForRole()) {
    res.status(403)
    throw new Error('Admin access not approved - please contact a superadmin')
  }

  if (user.role === 'admin' || user.role === 'superadmin') {
    next()
  } else {
    res.status(403)
    throw new Error('Not authorized - admin access required')
  }
})

// Superadmin authorization
export const authorizeSuperAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401)
    throw new Error("Not authorized")
  }

  if (req.user.role !== 'superadmin') {
    res.status(403)
    throw new Error("Superadmin access required")
  }

  next()
})

// Check if user can manage target user
// Authorize user management (admin or superadmin with proper permissions)
export const authorizeUserManagement = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    res.status(401)
    throw new Error('Not authorized - no user found')
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('Not authorized - user not found')
  }

  if (user.role === 'admin' || user.role === 'superadmin') {
    next()
  } else {
    res.status(403)
    throw new Error('Not authorized - insufficient privileges')
  }
})

// Authorize regular user (not admin or superadmin)
export const authorizeUser = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    res.status(401)
    throw new Error('Not authorized - no user found')
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('Not authorized - user not found')
  }

  // Allow regular users and also users with pending admin requests
  if (user.role === 'user' || (user.role === 'admin' && user.adminRequest.status !== 'approved')) {
    next()
  } else {
    res.status(403)
    throw new Error('This action is only available to regular users')
  }
})

// Optional authentication middleware (doesn't throw errors if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Check if token exists and is not empty
      if (token && token !== "null" && token !== "undefined") {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Get user from token
        req.user = await User.findById(decoded.id).select("-password")
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log("Optional auth failed:", error.message)
    }
  }

  next()
})

// Session management utilities
export const sessionUtils = {
  // Clear user session
  clearUserSession: (userId) => {
    userSessions.delete(userId)
  },

  // Clear all expired sessions
  cleanupExpiredSessions: (inactivityTimeout = 30 * 60 * 1000) => {
    const now = Date.now()
    const expiredUsers = []
    
    for (const [userId, session] of userSessions.entries()) {
      if (now - session.lastActivity > inactivityTimeout) {
        expiredUsers.push(userId)
      }
    }
    
    expiredUsers.forEach(userId => userSessions.delete(userId))
    return expiredUsers.length
  },

  // Get active session count
  getActiveSessionCount: () => {
    return userSessions.size
  },

  // Force logout all sessions
  clearAllSessions: () => {
    userSessions.clear()
  }
}

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  const cleaned = sessionUtils.cleanupExpiredSessions()
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired sessions`)
  }
}, 10 * 60 * 1000)
