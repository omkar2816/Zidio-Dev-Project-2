import express from "express"
import {
  toggleBlogLike,
  toggleCommentLike,
  getUserLikes,
  checkUserLike,
  getTargetLikes,
  getLikeStats
} from "../controllers/likeController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/user/:userId", getUserLikes)
router.get("/:targetType/:targetId", getTargetLikes)

// Protected routes
router.post("/blog/:blogId", protect, toggleBlogLike)
router.post("/comment/:commentId", protect, toggleCommentLike)
router.get("/check/:targetType/:targetId", protect, checkUserLike)

// Admin routes
router.get("/admin/stats", protect, admin, getLikeStats)

export default router