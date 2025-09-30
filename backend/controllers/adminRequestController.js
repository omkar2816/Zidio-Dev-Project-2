import asyncHandler from "express-async-handler"
import User from "../models/User.js"

// @desc    Request admin access
// @route   POST /api/admin-request
// @access  Private/User
export const requestAdminAccess = asyncHandler(async (req, res) => {
  const { reason } = req.body
  const user = await User.findById(req.user.id)
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  try {
    user.requestAdminAccess(reason)
    await user.save()
    
    res.status(200).json({
      message: "Admin access request submitted successfully",
      status: user.adminRequest.status,
      requestedAt: user.adminRequest.requestedAt
    })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Get all pending admin requests
// @route   GET /api/admin-request/pending
// @access  Private/Superadmin
export const getPendingAdminRequests = asyncHandler(async (req, res) => {
  const pendingRequests = await User.find({
    'adminRequest.status': 'pending'
  }).select('-password')
  
  res.json(pendingRequests)
})

// @desc    Get user's admin request status
// @route   GET /api/admin-request/status
// @access  Private
export const getAdminRequestStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  res.json({
    adminRequest: user.adminRequest,
    role: user.role
  })
})

// @desc    Approve admin request
// @route   PUT /api/admin-request/:id/approve
// @access  Private/Superadmin
export const approveAdminRequest = asyncHandler(async (req, res) => {
  const { message } = req.body
  const user = await User.findById(req.params.id)
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  try {
    user.approveAdminRequest(req.user.id, message)
    await user.save()
    
    res.json({
      message: "Admin request approved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequest: user.adminRequest
      }
    })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Reject admin request
// @route   PUT /api/admin-request/:id/reject
// @access  Private/Superadmin
export const rejectAdminRequest = asyncHandler(async (req, res) => {
  const { message } = req.body
  const user = await User.findById(req.params.id)
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  try {
    user.rejectAdminRequest(req.user.id, message)
    await user.save()
    
    res.json({
      message: "Admin request rejected",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequest: user.adminRequest
      }
    })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Get all admin request history
// @route   GET /api/admin-request/history
// @access  Private/Superadmin
export const getAdminRequestHistory = asyncHandler(async (req, res) => {
  const allRequests = await User.find({
    'adminRequest.status': { $in: ['pending', 'approved', 'rejected'] }
  })
  .populate('adminRequest.reviewedBy', 'name email')
  .select('-password')
  .sort({ 'adminRequest.requestedAt': -1 })
  
  res.json(allRequests)
})

// @desc    Cancel admin request
// @route   DELETE /api/admin-request/cancel
// @access  Private/User
export const cancelAdminRequest = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  if (user.adminRequest.status !== 'pending') {
    res.status(400)
    throw new Error("No pending admin request to cancel")
  }
  
  user.adminRequest.status = 'none'
  user.adminRequest.requestedAt = null
  user.adminRequest.reason = ""
  
  await user.save()
  
  res.json({
    message: "Admin request cancelled successfully",
    adminRequest: user.adminRequest
  })
})

// @desc    Revoke admin access
// @route   PUT /api/admin-request/:id/revoke
// @access  Private/Superadmin
export const revokeAdminAccess = asyncHandler(async (req, res) => {
  const { message } = req.body
  const user = await User.findById(req.params.id)
  
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  
  if (user.role !== 'admin') {
    res.status(400)
    throw new Error("User is not an admin")
  }
  
  if (user.role === 'superadmin') {
    res.status(403)
    throw new Error("Cannot revoke superadmin access")
  }
  
  user.role = 'user'
  user.adminRequest.status = 'rejected'
  user.adminRequest.reviewedAt = new Date()
  user.adminRequest.reviewedBy = req.user.id
  user.adminRequest.adminMessage = message || "Admin access revoked"
  
  await user.save()
  
  res.json({
    message: "Admin access revoked successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRequest: user.adminRequest
    }
  })
})