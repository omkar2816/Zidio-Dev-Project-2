import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    avatar: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    website: {
      type: String,
      trim: true,
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      instagram: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
userSchema.index({ email: 1 })
userSchema.index({ role: 1, isActive: 1 })
userSchema.index({ isActive: 1, createdAt: -1 })

// Virtual for full name (if you want to split first/last name later)
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0]
})

// Virtual for blog count
userSchema.virtual('blogCount', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
  count: true,
})

// Virtual for published blog count
userSchema.virtual('publishedBlogCount', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
  count: true,
  match: { status: 'published' }
})

// Virtual for comment count
userSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
  count: true,
})

// Ensure virtual fields are serialized
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password
    delete ret.verificationToken
    delete ret.resetPasswordToken
    delete ret.resetPasswordExpire
    return ret
  }
})
userSchema.set('toObject', { virtuals: true })

// Pre-save middleware to update login info
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.loginCount += 1
  }
  next()
})

// Static method to get active users
userSchema.statics.getActiveUsers = function() {
  return this.find({ isActive: true }).select('-password')
}

// Static method to get user stats
userSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'blogs',
        let: { userId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$author', '$$userId'] } } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        as: 'blogStats'
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'user',
        as: 'comments'
      }
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'user',
        as: 'likes'
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        createdAt: 1,
        blogStats: 1,
        commentCount: { $size: '$comments' },
        likeCount: { $size: '$likes' }
      }
    }
  ])
}

export default mongoose.model("User", userSchema)
