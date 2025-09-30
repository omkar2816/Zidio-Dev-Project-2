import asyncHandler from "express-async-handler"
import Comment from "../models/Comment.js"
import Blog from "../models/Blog.js"
import Like from "../models/Like.js"

// @desc    Get comments for a blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params
  const { page = 1, limit = 10 } = req.query

  const comments = await Comment.find({ 
    blog: blogId, 
    parentComment: null // Get only top-level comments
  })
    .populate('user', 'name avatar')
    .populate({
      path: 'replyCount'
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Comment.countDocuments({ 
    blog: blogId, 
    parentComment: null 
  })

  res.json({
    comments,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// @desc    Get replies for a comment
// @route   GET /api/comments/:commentId/replies
// @access  Public
const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  const { page = 1, limit = 5 } = req.query

  const replies = await Comment.find({ 
    parentComment: commentId 
  })
    .populate('user', 'name avatar')
    .sort({ createdAt: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Comment.countDocuments({ 
    parentComment: commentId 
  })

  res.json({
    replies,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { text, blog, parentComment } = req.body

  // Validate blog exists
  const blogExists = await Blog.findById(blog)
  if (!blogExists) {
    res.status(404)
    throw new Error("Blog not found")
  }

  // If it's a reply, validate parent comment exists
  if (parentComment) {
    const parentExists = await Comment.findById(parentComment)
    if (!parentExists) {
      res.status(404)
      throw new Error("Parent comment not found")
    }
  }

  const comment = await Comment.create({
    user: req.user.id,
    blog,
    text,
    parentComment: parentComment || null
  })

  const populatedComment = await Comment.findById(comment._id)
    .populate('user', 'name avatar')

  res.status(201).json(populatedComment)
})

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  // Make sure user owns the comment
  if (comment.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error("User not authorized")
  }

  const { text } = req.body

  comment.text = text
  comment.isEdited = true
  comment.editedAt = new Date()

  const updatedComment = await comment.save()
  
  const populatedComment = await Comment.findById(updatedComment._id)
    .populate('user', 'name avatar')

  res.json(populatedComment)
})

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  // Make sure user owns the comment or is admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401)
    throw new Error("User not authorized")
  }

  // Delete all replies to this comment
  await Comment.deleteMany({ parentComment: req.params.id })
  
  // Delete the comment
  await Comment.findByIdAndDelete(req.params.id)

  res.json({ message: "Comment removed" })
})

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
// @access  Private
const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  const result = await Like.toggleLike(req.user.id, 'Comment', req.params.id)
  const likeCount = await Like.getLikeCount('Comment', req.params.id)

  res.json({
    message: `Comment ${result.action}`,
    action: result.action,
    likeCount
  })
})

// @desc    Get user's comments
// @route   GET /api/comments/user/:userId
// @access  Public
const getUserComments = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { page = 1, limit = 10 } = req.query

  const comments = await Comment.find({ user: userId })
    .populate('user', 'name avatar')
    .populate('blog', 'title slug')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Comment.countDocuments({ user: userId })

  res.json({
    comments,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

export {
  getBlogComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getUserComments
}