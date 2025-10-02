import express from "express"
import { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser, 
  validateSession 
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/refresh", refreshToken)
router.post("/logout", protect, logoutUser)
router.get("/validate", protect, validateSession)

export default router
