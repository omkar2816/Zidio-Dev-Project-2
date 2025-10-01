import express from "express"
import { 
  getUserProfile, 
  updateUserProfile, 
  followUser, 
  unfollowUser,
  getUserSettings,
  updateUserSettings,
  exportUserData,
  deleteUserAccount
} from "../controllers/userController.js"
import { protect, optionalAuth } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/:id").get(optionalAuth, getUserProfile).put(protect, updateUserProfile)
router.route("/:id/follow").post(protect, followUser).delete(protect, unfollowUser)

// Settings routes
router.route("/settings").get(protect, getUserSettings).put(protect, updateUserSettings)
router.route("/export").get(protect, exportUserData)
router.route("/account").delete(protect, deleteUserAccount)

export default router
