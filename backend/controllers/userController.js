import asyncHandler from "express-async-handler"
import User from "../models/User.js"
import Blog from "../models/Blog.js"

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "name email")
    .populate("following", "name email")

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Get the actual blog count for this user
  const blogCount = await Blog.countDocuments({ author: req.params.id })
  
  // Get user's blogs with full details for display
  const blogs = await Blog.find({ author: req.params.id })
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 })
  
  // Calculate total likes and comments
  const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0)
  const totalComments = blogs.reduce((acc, blog) => acc + (blog.comments?.length || 0), 0)

  // Check if the requesting user is following this profile user
  let isFollowing = false
  if (req.user && req.user._id.toString() !== req.params.id) {
    isFollowing = user.followers.some(follower => 
      follower._id.toString() === req.user._id.toString()
    )
  }

  // Return structured response
  res.json({
    user: {
      ...user.toObject(),
      blogCount,
      totalLikes,
      totalComments,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0
    },
    blogs,
    blogCount,
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
    totalLikes,
    totalComments,
    isFollowing
  })
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
  user.bio = req.body.bio || user.bio
  user.avatar = req.body.avatar || user.avatar
  user.location = req.body.location || user.location
  user.phone = req.body.phone || user.phone
  user.website = req.body.website || user.website
  user.linkedin = req.body.linkedin || user.linkedin
  user.github = req.body.github || user.github
  user.twitter = req.body.twitter || user.twitter

  const updatedUser = await user.save()

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    avatar: updatedUser.avatar,
    location: updatedUser.location,
    phone: updatedUser.phone,
    website: updatedUser.website,
    linkedin: updatedUser.linkedin,
    github: updatedUser.github,
    twitter: updatedUser.twitter,
    role: updatedUser.role,
  })
})

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id)
  const currentUser = await User.findById(req.user._id)

  if (!userToFollow) {
    res.status(404)
    throw new Error("User not found")
  }

  if (req.params.id === req.user._id.toString()) {
    res.status(400)
    throw new Error("Cannot follow yourself")
  }

  // Check if already following
  if (currentUser.following.includes(req.params.id)) {
    res.status(400)
    throw new Error("Already following this user")
  }

  // Add to following list of current user
  currentUser.following.push(req.params.id)
  await currentUser.save()

  // Add to followers list of target user
  userToFollow.followers.push(req.user._id)
  await userToFollow.save()

  res.json({ message: "User followed successfully" })
})

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
export const unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id)
  const currentUser = await User.findById(req.user._id)

  if (!userToUnfollow) {
    res.status(404)
    throw new Error("User not found")
  }

  // Check if currently following
  if (!currentUser.following.includes(req.params.id)) {
    res.status(400)
    throw new Error("Not following this user")
  }

  // Remove from following list of current user
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== req.params.id
  )
  await currentUser.save()

  // Remove from followers list of target user
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== req.user._id.toString()
  )
  await userToUnfollow.save()

  res.json({ message: "User unfollowed successfully" })
})

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
export const getUserSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('settings')

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Return default settings if none exist
  const defaultSettings = {
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      weeklyDigest: true,
      commentNotifications: true,
      likeNotifications: false
    },
    privacy: {
      publicProfile: true,
      showEmail: false,
      showOnlineStatus: true,
      twoFactorAuth: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      autoSave: true,
      compactView: false
    }
  }

  res.json({
    settings: user.settings || defaultSettings
  })
})

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
export const updateUserSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Update settings
  user.settings = {
    ...user.settings,
    ...req.body
  }

  await user.save()

  res.json({
    message: "Settings updated successfully",
    settings: user.settings
  })
})

// @desc    Export user data
// @route   GET /api/users/export
// @access  Private
export const exportUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  const blogs = await Blog.find({ author: req.user._id })

  const exportData = {
    user: user.toObject(),
    blogs: blogs.map(blog => blog.toObject()),
    exportedAt: new Date().toISOString()
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename="user-data-${user.name.replace(/\s+/g, '-')}-${Date.now()}.json"`)
  
  res.json(exportData)
})

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const { password } = req.body

  if (!password) {
    res.status(400)
    throw new Error("Password is required to delete account")
  }

  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  const isPasswordValid = await user.matchPassword(password)

  if (!isPasswordValid) {
    res.status(400)
    throw new Error("Invalid password")
  }

  // Delete user's blogs
  await Blog.deleteMany({ author: req.user._id })

  // Remove user from other users' followers/following lists
  await User.updateMany(
    { followers: req.user._id },
    { $pull: { followers: req.user._id } }
  )
  await User.updateMany(
    { following: req.user._id },
    { $pull: { following: req.user._id } }
  )

  // Delete the user
  await User.findByIdAndDelete(req.user._id)

  res.json({ message: "Account deleted successfully" })
})
