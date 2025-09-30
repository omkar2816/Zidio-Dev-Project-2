import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/User.js"

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

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        res.status(401)
        throw new Error("Not authorized, user not found")
      }

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
