import mongoose from "mongoose"

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
      maxlength: 20,
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
    lastLogin: {
      type: Date,
      default: null,
    },
    blogsCount: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    adminRequest: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none"
      },
      requestedAt: {
        type: Date,
        default: null
      },
      reviewedAt: {
        type: Date,
        default: null
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      reason: {
        type: String,
        maxlength: 500,
        default: ""
      },
      adminMessage: {
        type: String,
        maxlength: 500,
        default: ""
      }
    },
<<<<<<< HEAD
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
          default: false
        }
      },
      privacy: {
        publicProfile: {
          type: Boolean,
          default: true
        },
        showEmail: {
          type: Boolean,
          default: false
        },
        showOnlineStatus: {
          type: Boolean,
          default: true
        },
        twoFactorAuth: {
          type: Boolean,
          default: false
        }
      },
      preferences: {
        language: {
          type: String,
          default: 'en',
          enum: ['en', 'es', 'fr', 'de', 'it', 'pt']
        },
        timezone: {
          type: String,
          default: 'UTC',
          enum: ['UTC', 'EST', 'PST', 'GMT', 'CET', 'JST']
        },
        autoSave: {
          type: Boolean,
          default: true
        },
        compactView: {
          type: Boolean,
          default: false
        }
      }
    },
=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
  },
  {
    timestamps: true,
  },
)

// Method to check if user has permission to manage another user
userSchema.methods.canManage = function(targetUser) {
  if (this.role === 'superadmin') {
    return targetUser.role !== 'superadmin' || targetUser._id.toString() === this._id.toString()
  }
  if (this.role === 'admin') {
    return targetUser.role === 'user'
  }
  return false
}

// Method to request admin access
userSchema.methods.requestAdminAccess = function(reason = "") {
  if (this.role !== 'user') {
    throw new Error('Only regular users can request admin access')
  }
  if (this.adminRequest.status === 'pending') {
    throw new Error('Admin request is already pending')
  }
  if (this.adminRequest.status === 'approved') {
    throw new Error('User already has approved admin access')
  }
  
  this.adminRequest.status = 'pending'
  this.adminRequest.requestedAt = new Date()
  this.adminRequest.reason = reason
  this.adminRequest.reviewedAt = null
  this.adminRequest.reviewedBy = null
  this.adminRequest.adminMessage = ""
}

// Method to approve admin request
userSchema.methods.approveAdminRequest = function(superadminId, message = "") {
  if (this.adminRequest.status !== 'pending') {
    throw new Error('No pending admin request to approve')
  }
  
  this.role = 'admin'
  this.adminRequest.status = 'approved'
  this.adminRequest.reviewedAt = new Date()
  this.adminRequest.reviewedBy = superadminId
  this.adminRequest.adminMessage = message
}

// Method to reject admin request
userSchema.methods.rejectAdminRequest = function(superadminId, message = "") {
  if (this.adminRequest.status !== 'pending') {
    throw new Error('No pending admin request to reject')
  }
  
  this.adminRequest.status = 'rejected'
  this.adminRequest.reviewedAt = new Date()
  this.adminRequest.reviewedBy = superadminId
  this.adminRequest.adminMessage = message
}

// Method to check if user can login with admin privileges
userSchema.methods.canLoginAsAdmin = function() {
  return this.role === 'admin' && this.adminRequest.status === 'approved'
}

// Method to check if user is authorized for role
userSchema.methods.isAuthorizedForRole = function() {
  if (this.role === 'user') return true
  if (this.role === 'superadmin') return true
  if (this.role === 'admin') return this.adminRequest.status === 'approved'
  return false
}

// Method to get user permissions
userSchema.methods.getPermissions = function() {
  const permissions = {
    canCreateBlog: true,
    canManageOwnBlogs: true,
    canComment: this.isActive,
    canLike: this.isActive,
  }

  if (this.role === 'admin') {
    permissions.canManageUsers = true
    permissions.canViewAnalytics = true
    permissions.canManageBlogs = true
    permissions.canViewReports = true
  }

  if (this.role === 'superadmin') {
    permissions.canManageUsers = true
    permissions.canManageAdmins = true
    permissions.canViewAnalytics = true
    permissions.canManageBlogs = true
    permissions.canViewReports = true
    permissions.canManageSystem = true
  }

  return permissions
}

export default mongoose.model("User", userSchema)
