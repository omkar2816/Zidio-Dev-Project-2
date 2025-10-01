import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/User.js"

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Check if token exists and is not empty
      if (!token || token === "null" || token === "undefined") {
        res.status(401)
        throw new Error("Not authorized, invalid token")
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token and check if active
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        res.status(401)
        throw new Error("Not authorized, user not found")
      }

      if (!req.user.isActive) {
        res.status(401)
        throw new Error("Account is inactive")
      }

      // Update last login
      await User.findByIdAndUpdate(decoded.id, { lastLogin: new Date() })

      next()
    } catch (error) {
      console.error("JWT Error:", error.message)
      res.status(401)
      
      if (error.name === "JsonWebTokenError") {
        throw new Error("Not authorized, invalid token")
      } else if (error.name === "TokenExpiredError") {
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
