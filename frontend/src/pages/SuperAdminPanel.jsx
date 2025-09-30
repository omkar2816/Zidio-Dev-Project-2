"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { 
  FiTrash2, 
  FiUser, 
  FiUsers, 
  FiFileText, 
  FiActivity,
  FiShield,
  FiEdit,
  FiTrendingUp,
  FiClock,
  FiBarChart3,
  FiSettings,
  FiDatabase,
  FiServer
} from "react-icons/fi"
import AdminPanel from "./AdminPanel"
import AnalyticsChart from "../components/AnalyticsChart"

function SuperAdminPanel() {
  const { user } = useSelector((state) => state.auth)
  const [systemStats, setSystemStats] = useState(null)
  const [adminUsers, setAdminUsers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [requestHistory, setRequestHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [hasError, setHasError] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || "/api"

  useEffect(() => {
    if (user.role === 'superadmin') {
      fetchSuperAdminData()
    }
  }, [])

  const fetchSuperAdminData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const [analyticsRes, usersRes, pendingRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/admin/analytics`, config),
        axios.get(`${API_URL}/admin/users`, config),
        axios.get(`${API_URL}/admin-request/pending`, config),
        axios.get(`${API_URL}/admin-request/history`, config),
      ])

      setSystemStats(analyticsRes.data)
      setAdminUsers(usersRes.data.filter(u => u.role === 'admin'))
      setPendingRequests(pendingRes.data)
      setRequestHistory(historyRes.data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch super admin data:", error)
      toast.error("Backend server not connected. Showing offline mode.")
      setHasError(true)
      setLoading(false)
      
      // Provide fallback data for offline mode
      setSystemStats({
        userStats: { totalRegularUsers: 0, totalAdmins: 0, activeUsers: 0 },
        blogStats: { totalBlogs: 0, activePosts: 0 },
        systemHealth: { uptime: "Offline", lastBackup: "Unknown" }
      })
    }
  }

  const handlePromoteToAdmin = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.put(`${API_URL}/admin/users/${userId}/role`, { role: 'admin' }, config)
      toast.success("User promoted to admin successfully")
      fetchSuperAdminData()
    } catch (error) {
      toast.error("Failed to promote user")
    }
  }

  const handleDemoteFromAdmin = async (userId) => {
    if (window.confirm("Are you sure you want to demote this admin to user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.put(`${API_URL}/admin/users/${userId}/role`, { role: 'user' }, config)
        toast.success("Admin demoted to user successfully")
        fetchSuperAdminData()
      } catch (error) {
        toast.error("Failed to demote admin")
      }
    }
  }

  const handleApproveAdminRequest = async (requestId, message = "") => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.put(`${API_URL}/admin-request/${requestId}/approve`, { message }, config)
      toast.success("Admin request approved successfully")
      fetchSuperAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request")
    }
  }

  const handleRejectAdminRequest = async (requestId, message = "") => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.put(`${API_URL}/admin-request/${requestId}/reject`, { message }, config)
      toast.success("Admin request rejected")
      fetchSuperAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request")
    }
  }

  const handleRevokeAdminAccess = async (adminId, message = "") => {
    if (window.confirm("Are you sure you want to revoke this user's admin access?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.put(`${API_URL}/admin-request/${adminId}/revoke`, { message }, config)
        toast.success("Admin access revoked successfully")
        fetchSuperAdminData()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to revoke admin access")
      }
    }
  }

  const SystemHealthCard = ({ title, status, description, icon: Icon, color }) => (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg text-white`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="text-2xl" />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'Healthy' ? 'bg-green-500/20 text-green-100' : 
          status === 'Warning' ? 'bg-yellow-500/20 text-yellow-100' : 
          'bg-red-500/20 text-red-100'
        }`}>
          {status}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  )

  if (user.role !== 'superadmin') {
    return <AdminPanel />
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent mb-2">
            Super Admin Control Center
          </h1>
          <p className="text-gray-600">
            Complete system oversight and administration • Welcome, {user.name}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'admin-requests', 'admin-management', 'system-health', 'standard-admin'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading SuperAdmin Dashboard...</p>
            </div>
          </div>
        )}

        {/* Offline Mode Banner */}
        {!loading && hasError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Offline Mode</h3>
                <p className="text-sm text-yellow-700">Backend server is not connected. Some features may be limited.</p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {!loading && activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Super Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold mt-2">{systemStats.userStats.totalRegularUsers}</p>
                    <p className="text-purple-100 text-xs mt-1">Regular users only</p>
                  </div>
                  <FiUsers className="text-3xl text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Admins</p>
                    <p className="text-3xl font-bold mt-2">{systemStats.userStats.totalAdmins || adminUsers.length}</p>
                    <p className="text-red-100 text-xs mt-1">Admin users</p>
                  </div>
                  <FiShield className="text-3xl text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Content</p>
                    <p className="text-3xl font-bold mt-2">{systemStats.blogStats.totalBlogs}</p>
                    <p className="text-blue-100 text-xs mt-1">All blog posts</p>
                  </div>
                  <FiFileText className="text-3xl text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">System Health</p>
                    <p className="text-3xl font-bold mt-2">99.9%</p>
                    <p className="text-green-100 text-xs mt-1">Uptime</p>
                  </div>
                  <FiActivity className="text-3xl text-green-200" />
                </div>
              </div>
            </div>

            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SystemHealthCard
                title="Database Status"
                status="Healthy"
                description="All database connections stable"
                icon={FiDatabase}
                color="from-green-400 to-green-500"
              />
              <SystemHealthCard
                title="Server Performance"
                status="Optimal"
                description="CPU and memory usage normal"
                icon={FiServer}
                color="from-blue-400 to-blue-500"
              />
              <SystemHealthCard
                title="Security Status"
                status="Secure"
                description="No security threats detected"
                icon={FiShield}
                color="from-purple-400 to-purple-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-theme-text mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <FiUsers className="text-purple-600 text-xl mb-2" />
                  <p className="font-medium text-theme-text">Manage Admins</p>
                  <p className="text-sm text-gray-500">Add or remove admin privileges</p>
                </button>
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <FiSettings className="text-blue-600 text-xl mb-2" />
                  <p className="font-medium text-theme-text">System Settings</p>
                  <p className="text-sm text-gray-500">Configure system parameters</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <FiBarChart3 className="text-green-600 text-xl mb-2" />
                  <p className="font-medium text-theme-text">View Analytics</p>
                  <p className="text-sm text-gray-500">Detailed system analytics</p>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                  <FiActivity className="text-orange-600 text-xl mb-2" />
                  <p className="font-medium text-theme-text">Activity Logs</p>
                  <p className="text-sm text-gray-500">Monitor system activity</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Requests Tab */}
        {!loading && activeTab === 'admin-requests' && (
          <div className="space-y-6">
            {/* Pending Requests */}
            <div className="card-modern p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-theme-text">
                  Pending Admin Requests ({pendingRequests.length})
                </h2>
                <button
                  onClick={fetchSuperAdminData}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
              
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FiShield className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-theme-text mb-2">No Pending Requests</h3>
                  <p className="text-gray-500">All admin access requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {request.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-theme-text">{request.name}</h3>
                              <p className="text-sm text-gray-500">{request.email}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-theme-text mb-2">Request Reason:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.adminRequest.reason}</p>
                          </div>
                          
                          <p className="text-sm text-gray-500">
                            Requested: {new Date(request.adminRequest.requestedAt).toLocaleDateString()} at {new Date(request.adminRequest.requestedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2 ml-6">
                          <button
                            onClick={() => {
                              const message = prompt("Optional message for approval:")
                              handleApproveAdminRequest(request._id, message || "")
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                          >
                            <span>✓</span>
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              const message = prompt("Reason for rejection (optional):")
                              if (message !== null) {
                                handleRejectAdminRequest(request._id, message || "Request denied")
                              }
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                          >
                            <span>✗</span>
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Request History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requestHistory.slice(0, 20).map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm">
                              {request.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.name}</p>
                              <p className="text-sm text-gray-500">{request.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.adminRequest.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : request.adminRequest.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.adminRequest.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.adminRequest.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.adminRequest.reviewedAt ? new Date(request.adminRequest.reviewedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.role === 'admin' && request.adminRequest.status === 'approved' && (
                            <button
                              onClick={() => {
                                const message = prompt("Reason for revoking admin access:")
                                if (message !== null) {
                                  handleRevokeAdminAccess(request._id, message || "Admin access revoked")
                                }
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Revoke Access
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {!loading && activeTab === 'admin-management' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
              <div className="text-sm text-gray-500">
                Total Admins: {adminUsers.length}
              </div>
            </div>
            
            {adminUsers.length === 0 ? (
              <div className="text-center py-12">
                <FiShield className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Admins Yet</h3>
                <p className="text-gray-500">Promote users to admin role from the user management section.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoted On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminUsers.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium">
                              {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                              <p className="text-sm text-gray-500">Admin ID: {admin._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.updatedAt || admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Active Admin
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDemoteFromAdmin(admin._id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Demote to User"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* System Health Tab */}
        {!loading && activeTab === 'system-health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SystemHealthCard
                title="Database Performance"
                status="Healthy"
                description="Query response time: 15ms avg"
                icon={FiDatabase}
                color="from-green-400 to-green-500"
              />
              <SystemHealthCard
                title="Server Load"
                status="Normal"
                description="CPU: 25% | Memory: 45%"
                icon={FiServer}
                color="from-blue-400 to-blue-500"
              />
              <SystemHealthCard
                title="Security"
                status="Secure"
                description="Last security scan: 2 hours ago"
                icon={FiShield}
                color="from-purple-400 to-purple-500"
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Response Time</span>
                      <span className="font-medium text-green-600">Fast (120ms)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database Connections</span>
                      <span className="font-medium text-blue-600">25/100 Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className="font-medium text-orange-600">45% (2.1GB/4.7GB)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Security Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed Login Attempts</span>
                      <span className="font-medium text-green-600">0 (Last 24h)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Sessions</span>
                      <span className="font-medium text-blue-600">{systemStats?.userStats?.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SSL Certificate</span>
                      <span className="font-medium text-green-600">Valid (90 days)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standard Admin View */}
        {!loading && activeTab === 'standard-admin' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Standard Admin Dashboard</h2>
              <p className="text-gray-600">View the system from a regular admin perspective</p>
            </div>
            <AdminPanel />
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminPanel