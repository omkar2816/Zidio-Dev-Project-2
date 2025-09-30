import express from "express"
import {
  getCategories,
  getCategoriesWithCounts,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesAdmin,
  reorderCategories
} from "../controllers/categoryController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", getCategories)
router.get("/with-counts", getCategoriesWithCounts)
router.get("/slug/:slug", getCategoryBySlug)
router.get("/:id", getCategory)

// Admin routes
router.post("/", protect, admin, createCategory)
router.put("/reorder", protect, admin, reorderCategories)
router.get("/admin/all", protect, admin, getAllCategoriesAdmin)
router.put("/:id", protect, admin, updateCategory)
router.delete("/:id", protect, admin, deleteCategory)

export default router