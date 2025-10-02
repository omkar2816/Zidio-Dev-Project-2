import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler"
import User from "../models/User.js"

// Generate Access Token (temporarily longer for debugging)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2h", // Temporarily increased from 15m to 2h for debugging
  })
}

// Generate Refresh Token (long-lived)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: "7d", // 7 days for refresh token
  })
}

// Generate both tokens
const generateTokens = (id) => {
  return {
    accessToken: generateAccessToken(id),
    refreshToken: generateRefreshToken(id)
  }
}

// Set secure cookie options
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  }
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, requestAdminAccess, adminRequestReason } = req.body

  console.log("Registration attempt:", { 
    name, 
    email, 
    passwordLength: password?.length,
    requestAdminAccess: !!requestAdminAccess 
  })

  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please add all fields")
  }

  // Check if user exists
  const userExists = await User.findOne({ email })
  console.log("User exists check:", userExists ? "User found" : "No user found")

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log("Password hashed successfully")

    // Create user
    console.log("Creating user with data:", { name, email, hashedPasswordLength: hashedPassword.length })
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    console.log("User created successfully:", { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role 
    })

    // Handle admin access request if requested during registration
    if (requestAdminAccess && adminRequestReason) {
      try {
        user.requestAdminAccess(adminRequestReason)
        await user.save()
        console.log("Admin access requested during registration")
      } catch (error) {
        console.log("Failed to request admin access during registration:", error.message)
      }
    }

    if (user) {
      const tokens = generateTokens(user._id)
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, getCookieOptions())
      
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequest: user.adminRequest,
        token: tokens.accessToken,
        message: requestAdminAccess ? 
          "Account created successfully. Your admin access request has been submitted for review." :
          "Account created successfully."
      })
    } else {
      res.status(400)
      throw new Error("Invalid user data")
    }
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500)
    throw new Error(`Failed to create user: ${error.message}`)
  }
})

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    // Check if user is authorized for their role
    if (!user.isAuthorizedForRole()) {
      let errorMessage = "Account access denied"
      
      if (user.role === 'admin') {
        if (user.adminRequest.status === 'pending') {
          errorMessage = "Your admin access request is pending approval from a superadmin"
        } else if (user.adminRequest.status === 'rejected') {
          errorMessage = `Your admin access request was rejected: ${user.adminRequest.adminMessage || 'No reason provided'}`
        } else {
          errorMessage = "Admin access not approved. Please request admin access first."
        }
      }
      
      res.status(403)
      throw new Error(errorMessage)
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    const tokens = generateTokens(user._id)
    
    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions())

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRequest: user.adminRequest,
      token: tokens.accessToken,
    })
  } else {
    res.status(400)
    throw new Error("Invalid credentials")
  }
})

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Private (requires refresh token in cookie)
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies
  
  console.log('🔄 Refresh token request received')
  console.log('🍪 Cookies:', req.cookies)
  console.log('🎫 Refresh token exists:', !!refreshToken)

  if (!refreshToken) {
    console.log('❌ No refresh token provided')
    res.status(401)
    throw new Error("No refresh token provided")
  }

  try {
    // Verify refresh token
    console.log('🔍 Verifying refresh token...')
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    console.log('✅ Refresh token verified for user:', decoded.id)
    
    // Get user from token
    const user = await User.findById(decoded.id).select("-password")
    
    if (!user) {
      console.log('❌ User not found for ID:', decoded.id)
      res.status(401)
      throw new Error("User not found")
    }

    if (!user.isActive) {
      console.log('❌ User account is inactive:', user.email)
      res.status(401)
      throw new Error("Account is inactive")
    }

    console.log('✅ Generating new tokens for user:', user.email)
    
    // Generate new tokens
    const tokens = generateTokens(user._id)
    
    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions())

    console.log('✅ New tokens generated and sent')

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRequest: user.adminRequest,
      token: tokens.accessToken,
    })
  } catch (error) {
    console.log('❌ Refresh token error:', error.message)
    // Clear invalid refresh token
    res.clearCookie('refreshToken')
    res.status(401)
    throw new Error("Invalid refresh token")
  }
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })

  res.json({ message: "Logged out successfully" })
})

// @desc    Validate current session
// @route   GET /api/auth/validate
// @access  Private
export const validateSession = asyncHandler(async (req, res) => {
  // This endpoint is protected by the auth middleware
  // If we reach here, the token is valid
  res.json({
    valid: true,
    user: {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      adminRequest: req.user.adminRequest,
    }
  })
})
