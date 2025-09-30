import express from "express"
import {
  getBlogComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getUserComments
} from "../controllers/commentController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/blog/:blogId", getBlogComments)
router.get("/:commentId/replies", getCommentReplies)
router.get("/user/:userId", getUserComments)

// Protected routes
router.post("/", protect, createComment)
router.put("/:id", protect, updateComment)
router.delete("/:id", protect, deleteComment)
router.post("/:id/like", protect, toggleCommentLike)

export default router