import mongoose from "mongoose"

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    image: {
      type: String,
      trim: true,
    },
    images: [{
      url: String,
      alt: String,
      caption: String,
    }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number, // in minutes
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
blogSchema.index({ author: 1, status: 1 })
blogSchema.index({ category: 1, status: 1 })
blogSchema.index({ status: 1, publishedAt: -1 })
blogSchema.index({ slug: 1 })
blogSchema.index({ tags: 1 })
blogSchema.index({ featured: 1, publishedAt: -1 })

// Virtual for like count
blogSchema.virtual('likeCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'targetId',
  count: true,
  match: { targetType: 'Blog' }
})

// Virtual for comment count
blogSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
  count: true,
})

// Virtual for comments
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
})

// Ensure virtual fields are serialized
blogSchema.set('toJSON', { virtuals: true })
blogSchema.set('toObject', { virtuals: true })

// Pre-save middleware to generate slug and calculate read time
blogSchema.pre('save', function(next) {
  // Generate slug from title
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(' ').length
    this.readTime = Math.ceil(wordCount / 200)
  }

  // Generate excerpt if not provided
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 297) + '...'
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

// Static method to get published blogs
blogSchema.statics.getPublished = function(options = {}) {
  const query = { status: 'published' }
  if (options.category) query.category = options.category
  if (options.author) query.author = options.author
  if (options.featured !== undefined) query.featured = options.featured

  return this.find(query)
    .populate('author', 'name email')
    .populate('category', 'name slug color')
    .sort({ publishedAt: -1 })
}

// Static method to increment view count
blogSchema.statics.incrementViews = function(blogId) {
  return this.findByIdAndUpdate(
    blogId,
    { $inc: { views: 1 } },
    { new: true }
  )
}

export default mongoose.model("Blog", blogSchema)
