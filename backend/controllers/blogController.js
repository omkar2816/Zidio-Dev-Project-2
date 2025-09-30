import asyncHandler from "express-async-handler"
import Blog from "../models/Blog.js"

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { search, category, author } = req.query

  const query = {}

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { tags: { $in: [new RegExp(search, "i")] } }]
  }

  if (category) {
    query.category = category
  }

  if (author) {
    query.author = author
  }

  const blogs = await Blog.find(query).populate("author", "name email").sort({ createdAt: -1 })

  res.json(blogs)
})

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name email").populate("comments.user", "name")

  if (blog) {
    res.json(blog)
  } else {
    res.status(404)
    throw new Error("Blog not found")
  }
})

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category, tags, image } = req.body

  if (!title || !content) {
    res.status(400)
    throw new Error("Please add title and content")
  }

  const blog = await Blog.create({
    title,
    content,
    category,
    tags,
    image,
    author: req.user._id,
  })

  const populatedBlog = await Blog.findById(blog._id).populate("author", "name email")

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

  // Check for user
  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("User not authorized")
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("author", "name email")

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

  // Check for user
  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("User not authorized")
  }

  await blog.deleteOne()

  res.json({ id: req.params.id })
})

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  const alreadyLiked = blog.likes.includes(req.user._id)

  if (alreadyLiked) {
    blog.likes = blog.likes.filter((like) => like.toString() !== req.user._id.toString())
  } else {
    blog.likes.push(req.user._id)
  }

  await blog.save()

  res.json(blog)
})

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  const comment = {
    user: req.user._id,
    text,
  }

  blog.comments.push(comment)
  await blog.save()

  const populatedBlog = await Blog.findById(blog._id).populate("comments.user", "name")

  res.status(201).json(populatedBlog.comments[populatedBlog.comments.length - 1])
})

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ "comments._id": req.params.id })

  if (!blog) {
    res.status(404)
    throw new Error("Comment not found")
  }

  const comment = blog.comments.id(req.params.id)

  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("User not authorized")
  }

  comment.deleteOne()
  await blog.save()

  res.json({ id: req.params.id })
})
