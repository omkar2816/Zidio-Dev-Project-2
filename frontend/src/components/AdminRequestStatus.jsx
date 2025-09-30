import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import toast from "react-hot-toast"
import { FiShield, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi"

function AdminRequestStatus() {
  const { user } = useSelector((state) => state.auth)
  const [requestStatus, setRequestStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [reason, setReason] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "/api"

  useEffect(() => {
    if (user) {
      fetchRequestStatus()
    }
  }, [user])

  const fetchRequestStatus = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get(`${API_URL}/admin-request/status`, config)
      setRequestStatus(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch admin request status")
      setLoading(false)
    }
  }

  const handleRequestAdminAccess = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for requesting admin access")
      return
    }

    setRequesting(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.post(`${API_URL}/admin-request`, { reason }, config)
      toast.success("Admin access request submitted successfully!")
      fetchRequestStatus()
      setReason("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit admin request")
    } finally {
      setRequesting(false)
    }
  }

  const handleCancelRequest = async () => {
    if (window.confirm("Are you sure you want to cancel your admin access request?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.delete(`${API_URL}/admin-request/cancel`, config)
        toast.success("Admin request cancelled successfully")
        fetchRequestStatus()
      } catch (error) {
        toast.error("Failed to cancel admin request")
      }
    }
  }

  if (loading) {
    return (
      <div className="card-modern p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-theme-bg-secondary h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-theme-bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-theme-bg-secondary rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  // Don't show for admin/superadmin users
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return null
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500 text-2xl" />
      case 'approved':
        return <FiCheckCircle className="text-green-500 text-2xl" />
      case 'rejected':
        return <FiXCircle className="text-red-500 text-2xl" />
      default:
        return <FiShield className="text-blue-500 text-2xl" />
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return "Your admin access request is under review by a superadmin."
      case 'approved':
        return "Your admin access has been approved! Please log out and log back in to access admin features."
      case 'rejected':
        return "Your admin access request was rejected."
      default:
        return "You can request admin access to manage users and content."
    }
  }

  return (
    <div className="card-modern p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(requestStatus?.adminRequest?.status)}
          <div>
            <h3 className="text-lg font-semibold text-theme-text">Admin Access</h3>
            <p className="text-sm text-theme-text-secondary">
              {getStatusMessage(requestStatus?.adminRequest?.status)}
            </p>
          </div>
        </div>
        
        {requestStatus?.adminRequest?.status === 'pending' && (
          <button
            onClick={handleCancelRequest}
            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Cancel Request
          </button>
        )}
      </div>

      {/* Request Details */}
      {requestStatus?.adminRequest?.status && requestStatus.adminRequest.status !== 'none' && (
        <div className="mb-4 p-4 bg-theme-bg-secondary rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-theme-text">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                requestStatus.adminRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                requestStatus.adminRequest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {requestStatus.adminRequest.status}
              </span>
            </div>
            {requestStatus.adminRequest.requestedAt && (
              <div>
                <span className="font-medium text-theme-text">Requested:</span>
                <span className="ml-2 text-theme-text-secondary">
                  {new Date(requestStatus.adminRequest.requestedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {requestStatus.adminRequest.reviewedAt && (
              <div>
                <span className="font-medium text-theme-text">Reviewed:</span>
                <span className="ml-2 text-theme-text-secondary">
                  {new Date(requestStatus.adminRequest.reviewedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {requestStatus.adminRequest.adminMessage && (
              <div className="md:col-span-2">
                <span className="font-medium text-theme-text">Admin Message:</span>
                <p className="mt-1 text-theme-text-secondary">{requestStatus.adminRequest.adminMessage}</p>
              </div>
            )}
          </div>
          
          {requestStatus.adminRequest.reason && (
            <div className="mt-3">
              <span className="font-medium text-theme-text">Your Request Reason:</span>
              <p className="mt-1 text-theme-text-secondary bg-theme-bg p-3 rounded border border-theme-border">
                {requestStatus.adminRequest.reason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Request Form */}
      {(!requestStatus?.adminRequest?.status || requestStatus.adminRequest.status === 'none' || requestStatus.adminRequest.status === 'rejected') && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Why do you need admin access?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-modern w-full min-h-[80px] resize-none"
              rows="3"
              placeholder="Please explain why you need admin privileges..."
              maxLength="500"
            />
            <p className="text-xs text-theme-text-secondary mt-1">
              {reason.length}/500 characters
            </p>
          </div>
          
          <button
            onClick={handleRequestAdminAccess}
            disabled={requesting || !reason.trim()}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting Request...</span>
              </>
            ) : (
              <>
                <FiShield />
                <span>
                  {requestStatus?.adminRequest?.status === 'rejected' ? 'Request Again' : 'Request Admin Access'}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Pending Status */}
      {requestStatus?.adminRequest?.status === 'pending' && (
        <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <FiAlertCircle />
          <span className="text-sm font-medium">
            Request submitted and waiting for superadmin approval
          </span>
        </div>
      )}

      {/* Approved Status */}
      {requestStatus?.adminRequest?.status === 'approved' && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <FiCheckCircle />
          <span className="text-sm font-medium">
            Admin access approved! Please refresh or log back in to use admin features.
          </span>
        </div>
      )}
    </div>
  )
}

export default AdminRequestStatus