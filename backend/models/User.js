import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    location: {
      type: String,
      maxlength: 100,
      default: "",
    },
    phone: {
      type: String,
      maxlength: 15,
      default: "",
    },
    website: {
      type: String,
      maxlength: 200,
      default: "",
    },
    linkedin: {
      type: String,
      maxlength: 200,
      default: "",
    },
    github: {
      type: String,
      maxlength: 200,
      default: "",
    },
    twitter: {
      type: String,
      maxlength: 200,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    adminRequest: {
      isRequested: {
        type: Boolean,
        default: false,
      },
      requestDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      adminMessage: {
        type: String,
        maxlength: 500,
        default: ""
      }
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
      }
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    settings: {
      notifications: {
        emailNotifications: {
          type: Boolean,
          default: true
        },
        pushNotifications: {
          type: Boolean,
          default: false
        },
        marketingEmails: {
          type: Boolean,
          default: false
        },
        weeklyDigest: {
          type: Boolean,
          default: true
        },
        commentNotifications: {
          type: Boolean,
          default: true
        },
        likeNotifications: {
          type: Boolean,
          default: true
        }
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "private", "friends"],
          default: "public"
        },
        showEmail: {
          type: Boolean,
          default: false
        },
        showPhone: {
          type: Boolean,
          default: false
        }
      },
      display: {
        theme: {
          type: String,
          enum: ["light", "dark", "auto"],
          default: "auto"
        },
        language: {
          type: String,
          default: "en"
        },
        timezone: {
          type: String,
          default: "UTC"
        },
        compactView: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  {
    timestamps: true,
  },
)

// Method to check if user has permission to manage another user
userSchema.methods.canManage = function(targetUser) {
  if (this.role === 'superadmin') {
    return true // Superadmin can manage everyone
  }
  
  if (this.role === 'admin') {
    return targetUser.role === 'user' // Admin can only manage regular users
  }
  
  return false // Regular users can't manage others
}

// Method to check if user can perform admin actions
userSchema.methods.canPerformAdminActions = function() {
  return this.role === 'admin' || this.role === 'superadmin'
}

// Method to check if user can perform superadmin actions
userSchema.methods.canPerformSuperAdminActions = function() {
  return this.role === 'superadmin'
}

// Method to get user's full name or display name
userSchema.methods.getDisplayName = function() {
  return this.name || this.email.split('@')[0]
}

// Method to check if user can edit another user's content
userSchema.methods.canEditContent = function(contentAuthor) {
  if (this.role === 'superadmin') {
    return true
  }
  
  if (this.role === 'admin') {
    return contentAuthor.role === 'user' || this._id.toString() === contentAuthor._id.toString()
  }
  
  return this._id.toString() === contentAuthor._id.toString()
}

// Method to check if user can delete another user's content
userSchema.methods.canDeleteContent = function(contentAuthor) {
  if (this.role === 'superadmin') {
    return true
  }
  
  if (this.role === 'admin') {
    return contentAuthor.role === 'user' || this._id.toString() === contentAuthor._id.toString()
  }
  
  return this._id.toString() === contentAuthor._id.toString()
}

// Method to check if user can view admin panel
userSchema.methods.canAccessAdminPanel = function() {
  return this.role === 'admin' || this.role === 'superadmin'
}

// Method to check if user can view superadmin panel
userSchema.methods.canAccessSuperAdminPanel = function() {
  return this.role === 'superadmin'
}

// Method to get user's role display name
userSchema.methods.getRoleDisplayName = function() {
  const roleNames = {
    user: 'User',
    admin: 'Administrator',
    superadmin: 'Super Administrator'
  }
  return roleNames[this.role] || 'Unknown'
}

// Method to toggle bookmark for a blog
userSchema.methods.toggleBookmark = function(blogId) {
  const bookmarkIndex = this.bookmarks.indexOf(blogId)
  
  if (bookmarkIndex > -1) {
    // Remove bookmark
    this.bookmarks.splice(bookmarkIndex, 1)
    return false // Unbookmarked
  } else {
    // Add bookmark
    this.bookmarks.push(blogId)
    return true // Bookmarked
  }
}

// Method to check if user has bookmarked a blog
userSchema.methods.hasBookmarked = function(blogId) {
  return this.bookmarks.includes(blogId)
}

// Method to follow another user
userSchema.methods.followUser = function(userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId)
    return true
  }
  return false
}

// Method to unfollow another user
userSchema.methods.unfollowUser = function(userId) {
  const index = this.following.indexOf(userId)
  if (index > -1) {
    this.following.splice(index, 1)
    return true
  }
  return false
}

// Method to check if user is following another user
userSchema.methods.isFollowing = function(userId) {
  return this.following.includes(userId)
}

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)