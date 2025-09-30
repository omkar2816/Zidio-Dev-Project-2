import express from "express"
import { getAllUsers, deleteUser, deleteBlog } from "../controllers/adminController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/users", protect, admin, getAllUsers)
router.delete("/users/:id", protect, admin, deleteUser)
router.delete("/blogs/:id", protect, admin, deleteBlog)

export default router
