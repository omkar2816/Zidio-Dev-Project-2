import express from "express"
import { getUserProfile, updateUserProfile } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/:id").get(getUserProfile).put(protect, updateUserProfile)

export default router
