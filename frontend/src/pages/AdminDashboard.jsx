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
  FiBarChart
} from "react-icons/fi"
import AnalyticsChart from "../components/AnalyticsChart"

function AdminDashboard() {
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
    <div className="card-modern p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-theme-border bg-gradient-to-br from-theme-bg to-theme-bg-secondary">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-theme-text-secondary text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-theme-text">{value}</p>
          {subtitle && <p className="text-theme-text-secondary text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-4 p-4 bg-theme-bg-secondary rounded-lg hover:bg-theme-bg-tertiary transition-colors border border-theme-border">
      <div className={`p-2 rounded-full ${activity.type === 'user_registration' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
        {activity.type === 'user_registration' ? <FiUser /> : <FiFileText />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-theme-text">
          {activity.type === 'user_registration' 
            ? `New user registered: ${activity.data.name}`
            : `New blog created: ${activity.data.title}`
          }
        </p>
        <p className="text-xs text-theme-text-secondary">{formatDate(activity.timestamp)}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-theme-text">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-theme-text mb-2">
            {user.role === 'superadmin' ? 'Super Admin' : 'Admin'} Dashboard
          </h1>
          <p className="text-theme-text-secondary">
            Welcome back, {user.name}! Here's your system overview.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-theme-border">
            <nav className="-mb-px flex space-x-8">
              {['dashboard', 'users', 'blogs', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-theme-text-secondary hover:text-theme-text hover:border-theme-border'
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
                color="from-primary-500 to-primary-600"
                subtitle={analytics.userStats.recentUsers ? `+${analytics.userStats.recentUsers} this week` : ''}
              />
              {user.role === 'superadmin' && analytics.userStats.totalAdmins && (
                <StatCard
                  icon={FiShield}
                  title="Total Admins"
                  value={analytics.userStats.totalAdmins}
                  color="from-secondary-500 to-secondary-600"
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
                color="from-accent-500 to-accent-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.userGrowth && analytics.userGrowth.length > 0 && (
                <AnalyticsChart
                  data={analytics.userGrowth}
                  type="line"
                  title="User Growth (Last 30 Days)"
                  color="primary"
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
                  <FiBarChart className="mr-2" />
                  Content Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                    <span className="text-theme-text-secondary">Published Blogs</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{analytics.blogStats.publishedBlogs}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                    <span className="text-theme-text-secondary">Draft Blogs</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">{analytics.blogStats.draftBlogs}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30">
                    <span className="text-theme-text-secondary">Recent Blogs (7 days)</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{analytics.blogStats.recentBlogs}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border border-secondary-100 dark:border-secondary-800/30">
                    <span className="text-theme-text-secondary">Active Users</span>
                    <span className="font-semibold text-secondary-600 dark:text-secondary-400">{analytics.userStats.activeUsers}</span>
                  </div>
                </div>
              </div>

              <AnalyticsChart
                data={(() => {
                  // Count real categories from blogs data
                  const categoryCount = {};
                  
                  // Count each category from the blogs array
                  blogs.forEach(blog => {
                    const category = blog.category || 'Uncategorized';
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                  });
                  
                  // Convert to array format and sort by count
                  return Object.entries(categoryCount)
                    .map(([category, count]) => ({
                      label: category,
                      count: count
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10); // Show top 10 categories in chart
                })()}
                type="bar"
                title="Blog Categories Distribution"
                color="secondary"
              />
            </div>

            {/* Category-wise Blogs */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-theme-text mb-4">Category-wise Blogs Published</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(() => {
                  // All predefined categories
                  const allCategories = [
                    'Web Development', 'Mobile App Development', 'Artificial Intelligence (AI) & Machine Learning',
                    'Data Science & Analytics', 'Cybersecurity', 'Blockchain & Web3', 'Cloud Computing & DevOps',
                    'Study Tips & Productivity', 'Online Courses & E-Learning', 'Career Guidance',
                    'Research & Innovations', 'Programming Tutorials', 'Startups & Entrepreneurship',
                    'Marketing & Branding', 'Personal Finance & Investing', 'Business Strategy & Growth',
                    'E-Commerce Trends', 'Health & Fitness', 'Travel & Adventure', 'Food & Recipes',
                    'Fashion & Style', 'Photography', 'Art & Design', 'Movies & TV Shows', 'Gaming',
                    'Music & Podcasts', 'Books & Reviews', 'Celebrity News', 'History & Heritage',
                    'Current Affairs & Politics', 'Social Issues', 'Environment & Sustainability',
                    'Personal Stories & Experiences', 'Mental Health', 'Meditation & Mindfulness',
                    'Motivation & Self-Improvement', 'Relationships & Lifestyle Balance'
                  ];
                  
                  // Count real categories from blogs data
                  const categoryCount = {};
                  
                  // Count each category from the blogs array
                  blogs.forEach(blog => {
                    const category = blog.category || 'Uncategorized';
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                  });
                  
                  // Create combined list: actual categories + predefined categories with 0 count
                  const combinedCategories = [];
                  
                  // Add actual categories with real counts
                  Object.entries(categoryCount).forEach(([category, count]) => {
                    combinedCategories.push({ name: category, count: count });
                  });
                  
                  // Add predefined categories that don't have blogs yet (with 0 count)
                  allCategories.forEach(category => {
                    if (!categoryCount[category]) {
                      combinedCategories.push({ name: category, count: 0 });
                    }
                  });
                  
                  // Sort by count (descending) then by name (ascending)
                  return combinedCategories.sort((a, b) => {
                    if (b.count !== a.count) {
                      return b.count - a.count;
                    }
                    return a.name.localeCompare(b.name);
                  });
                })().map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-theme-bg-secondary rounded-lg hover:bg-theme-bg-tertiary transition-colors border border-theme-border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                        index < 3 ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
                        index < 8 ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' :
                        'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-theme-text">{category.name}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{category.count} blogs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card-modern p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-theme-text">Manage Users</h2>
              <div className="text-sm text-theme-text-secondary">
                Total: {users.length} users
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-theme-bg-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-theme-bg divide-y divide-theme-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-theme-bg-secondary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-theme-text">{u.name}</p>
                            <p className="text-sm text-theme-text-secondary">ID: {u._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === u._id ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            className="px-2 py-1 border border-theme-border rounded text-sm bg-theme-bg text-theme-text focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          >
                            <option value="user">User</option>
                            {user.role === 'superadmin' && <option value="admin">Admin</option>}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              u.role === "admin" 
                                ? "bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400" 
                                : u.role === "superadmin"
                                ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                                : "bg-theme-bg-secondary text-theme-text-secondary"
                            }`}
                          >
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text-secondary">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {u._id !== user._id && user.role === 'superadmin' && u.role !== 'superadmin' && (
                            <button
                              onClick={() => setEditingUser(editingUser === u._id ? null : u._id)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors p-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20"
                              title="Edit Role"
                            >
                              <FiEdit />
                            </button>
                          )}
                          {u._id !== user._id && u.role !== 'superadmin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
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
          <div className="card-modern p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-theme-text">Manage Blogs</h2>
              <div className="text-sm text-theme-text-secondary">
                Total: {blogs.length} blogs
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-theme-bg-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-theme-bg divide-y divide-theme-border">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-theme-bg-secondary transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-theme-text line-clamp-2">
                          {blog.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-theme-text">{blog.author?.name || 'Unknown'}</div>
                        <div className="text-sm text-theme-text-secondary">{blog.author?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text-secondary">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-theme-text-secondary">
                            ❤️ {blog.likes?.length || 0}
                          </span>
                          <span className="flex items-center text-theme-text-secondary">
                            💬 {blog.comments?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
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
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="card-modern p-6 w-full lg:w-2/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-theme-text flex items-center">
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
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </div>

            <div className="card-modern p-6 w-full lg:w-3/5">
              <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-center">
                <FiActivity className="mr-2" />
                System Statistics
              </h3>
              {analytics && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30">
                    <span className="text-theme-text-secondary">System Uptime</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                    <span className="text-theme-text-secondary">Active Sessions</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{analytics.userStats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg border border-secondary-100 dark:border-secondary-800/30">
                    <span className="text-theme-text-secondary">Database Status</span>
                    <span className="font-semibold text-secondary-600 dark:text-secondary-400">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30">
                    <span className="text-theme-text-secondary">Server Load</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">Normal</span>
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

export default AdminDashboard
