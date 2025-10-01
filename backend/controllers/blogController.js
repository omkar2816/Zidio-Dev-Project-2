import asyncHandler from "express-async-handler"
import Blog from "../models/Blog.js"

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { search, expandedTerms, category, author, sortBy = 'createdAt' } = req.query

  const query = {}

  if (search) {
    // Parse expanded terms if provided (from frontend synonym service)
    let searchTerms = [search]
    if (expandedTerms) {
      try {
        searchTerms = Array.isArray(expandedTerms) ? expandedTerms : JSON.parse(expandedTerms)
      } catch (e) {
        searchTerms = [search]
      }
    }

    // Create regex patterns for all search terms
    const searchRegexes = searchTerms.map(term => new RegExp(term, "i"))
    
    // Enhanced search across multiple fields with synonym support
    query.$or = [
      // Title search (highest priority)
      { title: { $in: searchRegexes } },
      // Content search
      { content: { $in: searchRegexes } },
      // Tags search
      { tags: { $in: searchRegexes } },
      // Category search
      { category: { $in: searchRegexes } },
      // Author name search (populated field)
      { "author.name": { $in: searchRegexes } }
    ]
  }

  if (category && category !== 'all') {
    query.category = category
  }

  if (author) {
    query.author = author
  }

  // Determine sort criteria
  let sortCriteria = { createdAt: -1 } // default
  
  switch (sortBy) {
    case 'likesCount':
      sortCriteria = { likesCount: -1, createdAt: -1 }
      break
    case 'viewsCount':
      sortCriteria = { viewsCount: -1, createdAt: -1 }
      break
    case 'title':
      sortCriteria = { title: 1 }
      break
    case 'createdAt':
    default:
      sortCriteria = { createdAt: -1 }
      break
  }

  try {
    let blogs = await Blog.find(query)
      .populate("author", "name email avatar")
      .sort(sortCriteria)
      .lean()

    // If we have search terms, calculate relevance scores and re-sort
    if (search && blogs.length > 0) {
      blogs = blogs.map(blog => {
        let relevanceScore = 0
        const searchLower = search.toLowerCase()
        
        // Calculate relevance based on where the term appears
        if (blog.title?.toLowerCase().includes(searchLower)) {
          relevanceScore += 10 // Title match gets highest score
        }
        
        if (blog.content?.toLowerCase().includes(searchLower)) {
          relevanceScore += 5 // Content match
        }
        
        if (blog.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
          relevanceScore += 7 // Tag match
        }
        
        if (blog.category?.toLowerCase().includes(searchLower)) {
          relevanceScore += 6 // Category match
        }
        
        if (blog.author?.name?.toLowerCase().includes(searchLower)) {
          relevanceScore += 4 // Author match
        }

        return {
          ...blog,
          relevanceScore
        }
      })

      // Sort by relevance first, then by original sort criteria
      blogs.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore
        }
        // Fall back to original sort criteria
        if (sortBy === 'likesCount') {
          return (b.likesCount || 0) - (a.likesCount || 0)
        }
        if (sortBy === 'viewsCount') {
          return (b.viewsCount || 0) - (a.viewsCount || 0)
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    }

    res.json(blogs)
  } catch (error) {
    res.status(500)
    throw new Error(`Error fetching blogs: ${error.message}`)
  }
})

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name email avatar").populate("comments.user", "name")

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

  const populatedBlog = await Blog.findById(blog._id).populate("author", "name email avatar")

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
  }).populate("author", "name email avatar")

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

// @desc    Toggle bookmark a blog
// @route   PUT /api/blogs/:id/bookmark
// @access  Private
export const toggleBookmark = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    res.status(404)
    throw new Error("Blog not found")
  }

  const user = req.user

  // Check if blog is already bookmarked
  const isBookmarked = user.bookmarks.includes(req.params.id)

  if (isBookmarked) {
    // Remove from bookmarks
    user.bookmarks = user.bookmarks.filter(
      (bookmarkId) => bookmarkId.toString() !== req.params.id
    )
  } else {
    // Add to bookmarks
    user.bookmarks.push(req.params.id)
  }

  await user.save()

  res.json({
    isBookmarked: !isBookmarked,
    message: isBookmarked ? "Bookmark removed" : "Blog bookmarked"
  })
})

// @desc    Get user's bookmarked blogs
// @route   GET /api/blogs/bookmarks
// @access  Private
export const getBookmarkedBlogs = asyncHandler(async (req, res) => {
  const user = await req.user.populate({
    path: 'bookmarks',
    populate: {
      path: 'author',
      select: 'name email'
    }
  })

  res.json(user.bookmarks)
})
