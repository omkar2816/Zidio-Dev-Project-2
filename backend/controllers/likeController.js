import asyncHandler from "express-async-handler"
import Like from "../models/Like.js"
import Blog from "../models/Blog.js"
import Comment from "../models/Comment.js"

// @desc    Toggle like on a blog
// @route   POST /api/likes/blog/:blogId
// @access  Private
const toggleBlogLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params

  // Validate blog exists
  const blog = await Blog.findById(blogId)
  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  const result = await Like.toggleLike(req.user.id, 'Blog', blogId)
  const likeCount = await Like.getLikeCount('Blog', blogId)
  const isLiked = result.action === 'liked'

  res.json({
    message: `Blog ${result.action}`,
    action: result.action,
    isLiked,
    likeCount
  })
})

// @desc    Toggle like on a comment
// @route   POST /api/likes/comment/:commentId
// @access  Private
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params

  // Validate comment exists
  const comment = await Comment.findById(commentId)
  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  const result = await Like.toggleLike(req.user.id, 'Comment', commentId)
  const likeCount = await Like.getLikeCount('Comment', commentId)
  const isLiked = result.action === 'liked'

  res.json({
    message: `Comment ${result.action}`,
    action: result.action,
    isLiked,
    likeCount
  })
})

// @desc    Get user's likes
// @route   GET /api/likes/user/:userId
// @access  Public
const getUserLikes = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { page = 1, limit = 10, type } = req.query

  let query = { user: userId }
  if (type && ['Blog', 'Comment'].includes(type)) {
    query.targetType = type
  }

  const likes = await Like.find(query)
    .populate({
      path: 'blog',
      select: 'title slug author createdAt',
      populate: {
        path: 'author',
        select: 'name'
      }
    })
    .populate({
      path: 'comment',
      select: 'text blog createdAt',
      populate: {
        path: 'blog',
        select: 'title slug'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Like.countDocuments(query)

  res.json({
    likes,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// @desc    Check if user liked a target
// @route   GET /api/likes/check/:targetType/:targetId
// @access  Private
const checkUserLike = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.params

  if (!['Blog', 'Comment'].includes(targetType)) {
    res.status(400)
    throw new Error("Invalid target type")
  }

  const isLiked = await Like.isLikedByUser(req.user.id, targetType, targetId)
  const likeCount = await Like.getLikeCount(targetType, targetId)

  res.json({
    isLiked,
    likeCount
  })
})

// @desc    Get likes for a target
// @route   GET /api/likes/:targetType/:targetId
// @access  Public
const getTargetLikes = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.params
  const { page = 1, limit = 20 } = req.query

  if (!['Blog', 'Comment'].includes(targetType)) {
    res.status(400)
    throw new Error("Invalid target type")
  }

  const likes = await Like.find({ targetType, targetId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Like.countDocuments({ targetType, targetId })

  res.json({
    likes,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// @desc    Get like statistics
// @route   GET /api/likes/stats
// @access  Private/Admin
const getLikeStats = asyncHandler(async (req, res) => {
  const stats = await Like.aggregate([
    {
      $group: {
        _id: '$targetType',
        count: { $sum: 1 }
      }
    }
  ])

  const totalLikes = await Like.countDocuments()
  
  const topLikedBlogs = await Like.aggregate([
    { $match: { targetType: 'Blog' } },
    {
      $group: {
        _id: '$targetId',
        likeCount: { $sum: 1 }
      }
    },
    { $sort: { likeCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blog'
      }
    },
    {
      $unwind: '$blog'
    },
    {
      $project: {
        _id: 1,
        likeCount: 1,
        title: '$blog.title',
        slug: '$blog.slug'
      }
    }
  ])

  const mostActiveUsers = await Like.aggregate([
    {
      $group: {
        _id: '$user',
        likeCount: { $sum: 1 }
      }
    },
    { $sort: { likeCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        likeCount: 1,
        name: '$user.name',
        email: '$user.email'
      }
    }
  ])

  res.json({
    totalLikes,
    likesByType: stats,
    topLikedBlogs,
    mostActiveUsers
  })
})

export {
  toggleBlogLike,
  toggleCommentLike,
  getUserLikes,
  checkUserLike,
  getTargetLikes,
  getLikeStats
}