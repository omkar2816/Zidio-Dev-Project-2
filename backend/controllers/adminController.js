import asyncHandler from "express-async-handler"
import User from "../models/User.js"
import Blog from "../models/Blog.js"

// @desc    Get all manageable users based on role
// @route   GET /api/admin/users
// @access  Private/Admin/Superadmin
export const getAllUsers = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
  
  let query = {}
  if (currentUser.role === 'admin') {
    // Admin can only see regular users
    query = { role: 'user' }
  } else if (currentUser.role === 'superadmin') {
    // Superadmin can see users and admins
    query = { role: { $in: ['user', 'admin'] } }
  }
  
  const users = await User.find(query).select("-password")
  res.json(users)
})

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin/Superadmin
export const getUserById = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
  const user = await User.findById(req.params.id).select("-password")
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  // Check if current user can manage this user
  if (!currentUser.canManage(user)) {
    res.status(403)
    throw new Error("Not authorized to view this user")
  }
  
  res.json(user)
})

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Superadmin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  const targetUser = await User.findById(req.params.id)
  
  if (!targetUser) {
    res.status(404)
    throw new Error("User not found")
  }
  
  // Only superadmin can change roles, and can't change other superadmins
  if (targetUser.role === 'superadmin') {
    res.status(403)
    throw new Error("Cannot modify superadmin role")
  }
  
  if (!['user', 'admin'].includes(role)) {
    res.status(400)
    throw new Error("Invalid role specified")
  }
  
  targetUser.role = role
  await targetUser.save()
  
  res.json({ message: "User role updated successfully", user: { ...targetUser.toObject(), password: undefined } })
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin/Superadmin
export const deleteUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  // Check if current user can manage this user
  if (!currentUser.canManage(user)) {
    res.status(403)
    throw new Error("Not authorized to delete this user")
  }

  await user.deleteOne()
  res.json({ message: "User removed successfully" })
})

// @desc    Delete any blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin/Superadmin
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (blog) {
    await blog.deleteOne()
    res.json({ message: "Blog removed successfully" })
  } else {
    res.status(404)
    throw new Error("Blog not found")
  }
})

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin/Superadmin
export const getAnalytics = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
  
  // Get user statistics based on role
  let userStats
  if (currentUser.role === 'admin') {
    userStats = {
      totalUsers: await User.countDocuments({ role: 'user' }),
      activeUsers: await User.countDocuments({ role: 'user', isActive: true }),
      recentUsers: await User.countDocuments({
        role: 'user',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    }
  } else if (currentUser.role === 'superadmin') {
    userStats = {
      totalUsers: await User.countDocuments({ role: { $in: ['user', 'admin'] } }),
      totalAdmins: await User.countDocuments({ role: 'admin' }),
      totalRegularUsers: await User.countDocuments({ role: 'user' }),
      activeUsers: await User.countDocuments({ role: { $in: ['user', 'admin'] }, isActive: true }),
      recentUsers: await User.countDocuments({
        role: { $in: ['user', 'admin'] },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    }
  }
  
  // Get blog statistics
  const blogStats = {
    totalBlogs: await Blog.countDocuments(),
    publishedBlogs: await Blog.countDocuments({ status: 'published' }),
    draftBlogs: await Blog.countDocuments({ status: 'draft' }),
    recentBlogs: await Blog.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
  }
  
  // Get user growth data for charts (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  let userGrowthQuery = { role: 'user' }
  if (currentUser.role === 'superadmin') {
    userGrowthQuery = { role: { $in: ['user', 'admin'] } }
  }
  
  const userGrowth = await User.aggregate([
    {
      $match: {
        ...userGrowthQuery,
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ])
  
  // Get blog growth data (last 30 days)
  const blogGrowth = await Blog.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ])
  
  // Get top blog authors
  const topAuthors = await Blog.aggregate([
    {
      $group: {
        _id: "$author",
        blogCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "authorInfo"
      }
    },
    {
      $unwind: "$authorInfo"
    },
    {
      $project: {
        authorName: "$authorInfo.name",
        authorEmail: "$authorInfo.email",
        blogCount: 1
      }
    },
    { $sort: { blogCount: -1 } },
    { $limit: 10 }
  ])
  
  res.json({
    userStats,
    blogStats,
    userGrowth,
    blogGrowth,
    topAuthors,
    permissions: currentUser.getPermissions()
  })
})

// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin/Superadmin
export const getRecentActivity = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
  const limit = parseInt(req.query.limit) || 20
  
  // Get recent users
  let userQuery = { role: 'user' }
  if (currentUser.role === 'superadmin') {
    userQuery = { role: { $in: ['user', 'admin'] } }
  }
  
  const recentUsers = await User.find(userQuery)
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
  
  // Get recent blogs
  const recentBlogs = await Blog.find()
    .populate('author', 'name email')
    .select('title author createdAt status')
    .sort({ createdAt: -1 })
    .limit(limit)
  
  // Combine and sort by creation date
  const activities = [
    ...recentUsers.map(user => ({
      type: 'user_registration',
      data: user,
      timestamp: user.createdAt
    })),
    ...recentBlogs.map(blog => ({
      type: 'blog_created',
      data: blog,
      timestamp: blog.createdAt
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit)
  
  res.json(activities)
})
