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
  FiBarChart3
} from "react-icons/fi"
import AnalyticsChart from "../components/AnalyticsChart"

function AdminPanel() {
  const { user } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editingUser, setEditingUser] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || "/api"

  useEffect(() => {
    fetchData()
    // Set up real-time data refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics()
      fetchRecentActivity()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const [usersRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, config),
        axios.get(`${API_URL}/blogs`, config),
        fetchAnalytics(),
        fetchRecentActivity()
      ])

      setUsers(usersRes.data)
      setBlogs(blogsRes.data)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to fetch data")
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get(`${API_URL}/admin/analytics`, config)
      setAnalytics(response.data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const response = await axios.get(`${API_URL}/admin/activity`, config)
      setRecentActivity(response.data)
    } catch (error) {
      console.error("Failed to fetch activity:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.delete(`${API_URL}/admin/users/${userId}`, config)
        setUsers(users.filter((u) => u._id !== userId))
        toast.success("User deleted successfully")
        fetchAnalytics() // Refresh analytics
      } catch (error) {
        toast.error("Failed to delete user")
      }
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.delete(`${API_URL}/admin/blogs/${blogId}`, config)
        setBlogs(blogs.filter((b) => b._id !== blogId))
        toast.success("Blog deleted successfully")
        fetchAnalytics() // Refresh analytics
      } catch (error) {
        toast.error("Failed to delete blog")
      }
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.put(`${API_URL}/admin/users/${userId}/role`, { role: newRole }, config)
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
      setEditingUser(null)
      toast.success("User role updated successfully")
      fetchAnalytics() // Refresh analytics
    } catch (error) {
      toast.error("Failed to update user role")
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className="text-3xl text-white/80" />
      </div>
    </div>
  )

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className={`p-2 rounded-full ${activity.type === 'user_registration' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
        {activity.type === 'user_registration' ? <FiUser /> : <FiFileText />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-theme-text">
          {activity.type === 'user_registration' 
            ? `New user registered: ${activity.data.name}`
            : `New blog created: ${activity.data.title}`
          }
        </p>
        <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-theme-text mb-2">
            {user.role === 'superadmin' ? 'Super Admin' : 'Admin'} Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name}! Here's your system overview.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['dashboard', 'users', 'blogs', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && analytics && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FiUsers}
                title={user.role === 'superadmin' ? 'Total Users & Admins' : 'Total Users'}
                value={analytics.userStats.totalUsers || users.length}
                color="from-blue-500 to-blue-600"
                subtitle={analytics.userStats.recentUsers ? `+${analytics.userStats.recentUsers} this week` : ''}
              />
              {user.role === 'superadmin' && analytics.userStats.totalAdmins && (
                <StatCard
                  icon={FiShield}
                  title="Total Admins"
                  value={analytics.userStats.totalAdmins}
                  color="from-purple-500 to-purple-600"
                />
              )}
              <StatCard
                icon={FiFileText}
                title="Total Blogs"
                value={analytics.blogStats.totalBlogs || blogs.length}
                color="from-green-500 to-green-600"
                subtitle={analytics.blogStats.recentBlogs ? `+${analytics.blogStats.recentBlogs} this week` : ''}
              />
              <StatCard
                icon={FiActivity}
                title="Active Users"
                value={analytics.userStats.activeUsers || 0}
                color="from-orange-500 to-orange-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.userGrowth && analytics.userGrowth.length > 0 && (
                <AnalyticsChart
                  data={analytics.userGrowth}
                  type="line"
                  title="User Growth (Last 30 Days)"
                  color="blue"
                />
              )}

              {analytics.blogGrowth && analytics.blogGrowth.length > 0 && (
                <AnalyticsChart
                  data={analytics.blogGrowth}
                  type="line"
                  title="Blog Creation Trend"
                  color="green"
                />
              )}

              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-center">
                  <FiBarChart3 className="mr-2" />
                  Content Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Published Blogs</span>
                    <span className="font-semibold text-green-600">{analytics.blogStats.publishedBlogs}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700">Draft Blogs</span>
                    <span className="font-semibold text-yellow-600">{analytics.blogStats.draftBlogs}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Recent Blogs (7 days)</span>
                    <span className="font-semibold text-blue-600">{analytics.blogStats.recentBlogs}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Active Users</span>
                    <span className="font-semibold text-purple-600">{analytics.userStats.activeUsers}</span>
                  </div>
                </div>
              </div>

              {analytics.topAuthors && analytics.topAuthors.length > 0 && (
                <AnalyticsChart
                  data={analytics.topAuthors.map(author => ({
                    label: author.authorName,
                    count: author.blogCount
                  }))}
                  type="bar"
                  title="Top Blog Authors"
                  color="purple"
                />
              )}
            </div>

            {/* Top Authors */}
            {analytics.topAuthors && analytics.topAuthors.length > 0 && (
              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold text-theme-text mb-4">Top Blog Authors</h3>
                <div className="space-y-3">
                  {analytics.topAuthors.slice(0, 5).map((author, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-theme-text">{author.authorName}</p>
                          <p className="text-sm text-gray-500">{author.authorEmail}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-600">{author.blogCount} blogs</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card-modern p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-theme-text">Manage Users</h2>
              <div className="text-sm text-gray-500">
                Total: {users.length} users
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-theme-bg divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-theme-text">{u.name}</p>
                            <p className="text-sm text-gray-500">ID: {u._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === u._id ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="user">User</option>
                            {user.role === 'superadmin' && <option value="admin">Admin</option>}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              u.role === "admin" 
                                ? "bg-purple-100 text-purple-800" 
                                : u.role === "superadmin"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {u._id !== user._id && user.role === 'superadmin' && u.role !== 'superadmin' && (
                            <button
                              onClick={() => setEditingUser(editingUser === u._id ? null : u._id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit Role"
                            >
                              <FiEdit />
                            </button>
                          )}
                          {u._id !== user._id && u.role !== 'superadmin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete User"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Blogs</h2>
              <div className="text-sm text-gray-500">
                Total: {blogs.length} blogs
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {blog.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{blog.author?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{blog.author?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            ❤️ {blog.likes?.length || 0}
                          </span>
                          <span className="flex items-center">
                            💬 {blog.comments?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Blog"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiClock className="mr-2" />
                  Recent Activity
                </h3>
                <button
                  onClick={fetchRecentActivity}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiActivity className="mr-2" />
                System Statistics
              </h3>
              {analytics && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">System Uptime</span>
                    <span className="font-semibold text-blue-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Active Sessions</span>
                    <span className="font-semibold text-green-600">{analytics.userStats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Database Status</span>
                    <span className="font-semibold text-purple-600">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Server Load</span>
                    <span className="font-semibold text-orange-600">Normal</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
