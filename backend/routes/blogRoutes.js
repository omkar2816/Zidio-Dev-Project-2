import express from "express"
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  getFeaturedBlogs,
  searchBlogs
} from "../controllers/blogController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", getBlogs)
router.get("/featured", getFeaturedBlogs)
router.get("/search", searchBlogs)
router.get("/user/:userId", getUserBlogs)
router.get("/:id", getBlog)

// Protected routes
router.post("/", protect, createBlog)
router.put("/:id", protect, updateBlog)
router.delete("/:id", protect, deleteBlog)

export default router
