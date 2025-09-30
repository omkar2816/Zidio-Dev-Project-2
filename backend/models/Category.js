import mongoose from "mongoose"

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    color: {
      type: String,
      default: "#3B82F6", // Default blue color
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please provide a valid hex color"],
    },
    icon: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // For hierarchical categories
    },
    order: {
      type: Number,
      default: 0, // For custom ordering
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
categorySchema.index({ slug: 1 })
categorySchema.index({ parentCategory: 1 })
categorySchema.index({ isActive: 1, order: 1 })

// Virtual for blog count in this category
categorySchema.virtual('blogCount', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'category',
  count: true,
})

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
})

// Ensure virtual fields are serialized
categorySchema.set('toJSON', { virtuals: true })
categorySchema.set('toObject', { virtuals: true })

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  next()
})

// Static method to get active categories
categorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true }).sort({ order: 1, name: 1 })
}

// Static method to get categories with blog counts
categorySchema.statics.getCategoriesWithCounts = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: 'category',
        as: 'blogs'
      }
    },
    {
      $addFields: {
        blogCount: { $size: '$blogs' }
      }
    },
    {
      $project: {
        blogs: 0
      }
    },
    { $sort: { order: 1, name: 1 } }
  ])
}

export default mongoose.model("Category", categorySchema)