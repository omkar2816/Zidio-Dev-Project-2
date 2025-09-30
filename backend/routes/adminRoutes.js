import express from "express"
import { 
  getAllUsers, 
  getUserById,
  updateUserRole,
  deleteUser, 
  deleteBlog,
  getAnalytics,
  getRecentActivity
} from "../controllers/adminController.js"
import { 
  protect, 
  admin, 
  authorizeAdmin, 
  authorizeSuperAdmin,
  authorizeUserManagement 
} from "../middleware/authMiddleware.js"

const router = express.Router()

// User management routes
router.get("/users", protect, authorizeUserManagement, getAllUsers)
router.get("/users/:id", protect, authorizeUserManagement, getUserById)
router.put("/users/:id/role", protect, authorizeSuperAdmin, updateUserRole)
router.delete("/users/:id", protect, authorizeUserManagement, deleteUser)

// Blog management routes
router.delete("/blogs/:id", protect, authorizeAdmin, deleteBlog)

// Analytics and dashboard routes
router.get("/analytics", protect, authorizeAdmin, getAnalytics)
router.get("/activity", protect, authorizeAdmin, getRecentActivity)

export default router
