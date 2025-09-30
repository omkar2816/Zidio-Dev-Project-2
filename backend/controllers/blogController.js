import asyncHandler from "express-async-handler"
import Blog from "../models/Blog.js"
import Category from "../models/Category.js"
import Comment from "../models/Comment.js"
import Like from "../models/Like.js"

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { 
    search, 
    category, 
    author, 
    status = 'published',
    featured,
    page = 1, 
    limit = 10,
    sort = '-publishedAt'
  } = req.query

  const query = { status }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } }
    ]
  }

  if (category) {
    // Handle both category ID and slug
    const categoryDoc = await Category.findOne({
      $or: [{ _id: category }, { slug: category }]
    })
    if (categoryDoc) {
      query.category = categoryDoc._id
    }
  }

  if (author) {
    query.author = author
  }

  if (featured !== undefined) {
    query.featured = featured === 'true'
  }

  const blogs = await Blog.find(query)
    .populate("author", "name email avatar")
    .populate("category", "name slug color")
    .populate("likeCount")
    .populate("commentCount")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Blog.countDocuments(query)

  res.json({
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  let blog

  // Check if it's an ID or slug
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findById(req.params.id)
  } else {
    blog = await Blog.findOne({ slug: req.params.id })
  }

  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  // Increment view count
  await Blog.incrementViews(blog._id)

  const populatedBlog = await Blog.findById(blog._id)
    .populate("author", "name email avatar bio")
    .populate("category", "name slug color")
    .populate("likeCount")
    .populate("commentCount")

  res.json(populatedBlog)
})

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { 
    title, 
    content, 
    excerpt,
    category, 
    tags, 
    image,
    images,
    status = 'draft',
    featured = false,
    metaDescription
  } = req.body

  if (!title || !content) {
    res.status(400)
    throw new Error("Please add title and content")
  }

  // Validate category exists
  if (category) {
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      res.status(404)
      throw new Error("Category not found")
    }
  }

  const blog = await Blog.create({
    title,
    content,
    excerpt,
    category,
    tags: tags || [],
    image,
    images: images || [],
    status,
    featured,
    metaDescription,
    author: req.user._id,
  })

  const populatedBlog = await Blog.findById(blog._id)
    .populate("author", "name email avatar")
    .populate("category", "name slug color")

  res.status(201).json(populatedBlog)
})

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  // Check for user authorization
  if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401)
    throw new Error("User not authorized")
  }

  // Validate category if provided
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category)
    if (!categoryExists) {
      res.status(404)
      throw new Error("Category not found")
    }
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate("author", "name email avatar")
    .populate("category", "name slug color")

  res.json(updatedBlog)
})

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  // Check for user authorization
  if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401)
    throw new Error("User not authorized")
  }

  // Delete associated comments and likes
  await Comment.deleteMany({ blog: req.params.id })
  await Like.deleteMany({ targetType: 'Blog', targetId: req.params.id })

  await Blog.findByIdAndDelete(req.params.id)

  res.json({ message: "Blog removed", id: req.params.id })
})

// @desc    Get user's blogs
// @route   GET /api/blogs/user/:userId
// @access  Public
export const getUserBlogs = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { status, page = 1, limit = 10 } = req.query

  const query = { author: userId }
  if (status) {
    query.status = status
  } else {
    query.status = 'published' // Only show published blogs for public access
  }

  const blogs = await Blog.find(query)
    .populate("author", "name email avatar")
    .populate("category", "name slug color")
    .populate("likeCount")
    .populate("commentCount")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Blog.countDocuments(query)

  res.json({
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  })
})

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query

  const blogs = await Blog.find({ 
    status: 'published', 
    featured: true 
  })
    .populate("author", "name email avatar")
    .populate("category", "name slug color")
    .populate("likeCount")
    .populate("commentCount")
    .sort({ publishedAt: -1 })
    .limit(limit * 1)

  res.json(blogs)
})

// @desc    Search blogs
// @route   GET /api/blogs/search
// @access  Public
export const searchBlogs = asyncHandler(async (req, res) => {
  const { q, category, author, page = 1, limit = 10 } = req.query

  if (!q) {
    res.status(400)
    throw new Error("Search query is required")
  }

  const query = {
    status: 'published',
    $or: [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { tags: { $in: [new RegExp(q, "i")] } }
    ]
  }

  if (category) {
    const categoryDoc = await Category.findOne({
      $or: [{ _id: category }, { slug: category }]
    })
    if (categoryDoc) {
      query.category = categoryDoc._id
    }
  }

  if (author) {
    query.author = author
  }

  const blogs = await Blog.find(query)
    .populate("author", "name email avatar")
    .populate("category", "name slug color")
    .populate("likeCount")
    .populate("commentCount")
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Blog.countDocuments(query)

  res.json({
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total,
    query: q
  })
})
