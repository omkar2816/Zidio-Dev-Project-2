import asyncHandler from "express-async-handler"
import User from "../models/User.js"

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  if (user._id.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("User not authorized")
  }

  user.name = req.body.name || user.name
  user.email = req.body.email || user.email

  const updatedUser = await user.save()

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  })
})
