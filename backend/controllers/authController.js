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
  const { name, email, password } = req.body

  console.log("Registration attempt:", { name, email, passwordLength: password?.length })

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

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
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
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid credentials")
  }
})
