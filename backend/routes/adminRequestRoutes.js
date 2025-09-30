import express from "express"
import {
  requestAdminAccess,
  getPendingAdminRequests,
  getAdminRequestStatus,
  approveAdminRequest,
  rejectAdminRequest,
  getAdminRequestHistory,
  cancelAdminRequest,
  revokeAdminAccess
} from "../controllers/adminRequestController.js"
import { 
  protect, 
  authorizeSuperAdmin,
  authorizeUser
} from "../middleware/authMiddleware.js"

const router = express.Router()

// User routes - for requesting admin access
router.post("/", protect, authorizeUser, requestAdminAccess)
router.get("/status", protect, getAdminRequestStatus)
router.delete("/cancel", protect, authorizeUser, cancelAdminRequest)

// Superadmin routes - for managing admin requests
router.get("/pending", protect, authorizeSuperAdmin, getPendingAdminRequests)
router.get("/history", protect, authorizeSuperAdmin, getAdminRequestHistory)
router.put("/:id/approve", protect, authorizeSuperAdmin, approveAdminRequest)
router.put("/:id/reject", protect, authorizeSuperAdmin, rejectAdminRequest)
router.put("/:id/revoke", protect, authorizeSuperAdmin, revokeAdminAccess)

export default router