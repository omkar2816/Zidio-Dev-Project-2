import mongoose from "mongoose"

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog is required"],
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // For threaded comments (replies)
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
commentSchema.index({ blog: 1, createdAt: -1 })
commentSchema.index({ user: 1 })
commentSchema.index({ parentComment: 1 })

// Virtual for reply count
commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true,
})

// Ensure virtual fields are serialized
commentSchema.set('toJSON', { virtuals: true })
commentSchema.set('toObject', { virtuals: true })

export default mongoose.model("Comment", commentSchema)