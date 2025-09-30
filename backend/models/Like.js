import mongoose from "mongoose"

const likeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    targetType: {
      type: String,
      enum: ["Blog", "Comment"],
      required: [true, "Target type is required"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
    },
    // Virtual reference to the actual blog or comment
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one like per user per target
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true })

// Index for efficient querying
likeSchema.index({ targetType: 1, targetId: 1 })
likeSchema.index({ user: 1 })

// Pre-save middleware to set the correct reference field
likeSchema.pre('save', function(next) {
  if (this.targetType === 'Blog') {
    this.blog = this.targetId
    this.comment = undefined
  } else if (this.targetType === 'Comment') {
    this.comment = this.targetId
    this.blog = undefined
  }
  next()
})

// Static method to toggle like
likeSchema.statics.toggleLike = async function(userId, targetType, targetId) {
  try {
    const existingLike = await this.findOne({
      user: userId,
      targetType: targetType,
      targetId: targetId
    })

    if (existingLike) {
      // Unlike - remove the like
      await this.deleteOne({ _id: existingLike._id })
      return { action: 'unliked', like: null }
    } else {
      // Like - create new like
      const newLike = await this.create({
        user: userId,
        targetType: targetType,
        targetId: targetId
      })
      return { action: 'liked', like: newLike }
    }
  } catch (error) {
    throw new Error(`Error toggling like: ${error.message}`)
  }
}

// Static method to get like count for a target
likeSchema.statics.getLikeCount = async function(targetType, targetId) {
  return await this.countDocuments({ targetType, targetId })
}

// Static method to check if user liked a target
likeSchema.statics.isLikedByUser = async function(userId, targetType, targetId) {
  const like = await this.findOne({ user: userId, targetType, targetId })
  return !!like
}

export default mongoose.model("Like", likeSchema)