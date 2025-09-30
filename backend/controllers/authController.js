import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler"
import User from "../models/User.js"

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
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
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequest: user.adminRequest,
        token: generateToken(user._id),
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

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRequest: user.adminRequest,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid credentials")
  }
})
