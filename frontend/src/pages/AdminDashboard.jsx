import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "../contexts/ThemeContext"
import { getBlogs } from "../store/slices/blogSlice"
import { 
  FiUsers, 
  FiFileText, 
  FiBarChart3, 
  FiTrendingUp,
  FiShield,
  FiActivity,
  FiCalendar,
  FiGlobe
} from "react-icons/fi"

function AdminDashboard() {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { user } = useSelector((state) => state.auth)
  const { blogs, isLoading } = useSelector((state) => state.blog)

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: FiUsers,
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Total Blogs",
      value: blogs.length.toString(),
      icon: FiFileText,
      change: "+8%", 
      changeType: "increase"
    },
    {
      title: "Monthly Views",
      value: "45.2K",
      icon: FiBarChart3,
      change: "+23%",
      changeType: "increase"
    },
    {
      title: "Active Sessions",
      value: "892",
      icon: FiActivity,
      change: "-2%",
      changeType: "decrease"
    }
  ]

  const recentActivity = [
    { action: "New user registration", user: "John Doe", time: "2 minutes ago" },
    { action: "Blog published", user: "Jane Smith", time: "15 minutes ago" },
    { action: "Comment posted", user: "Mike Johnson", time: "32 minutes ago" },
    { action: "User profile updated", user: "Sarah Wilson", time: "1 hour ago" },
    { action: "Blog edited", user: "David Brown", time: "2 hours ago" }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FiShield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-theme-text">Admin Dashboard</h1>
            <p className="text-theme-text-secondary">Welcome back, {user?.name}!</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text mb-1">{stat.value}</p>
                <p className="text-theme-text-secondary text-sm">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiActivity className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-theme-text">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-theme-bg transition-colors duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-theme-text font-medium">{activity.action}</p>
                  <p className="text-theme-text-secondary text-sm">by {activity.user}</p>
                  <p className="text-theme-text-secondary text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiTrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-theme-text">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-blue-500 transition-colors duration-200 group">
              <FiUsers className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">Manage Users</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-blue-500 transition-colors duration-200 group">
              <FiFileText className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">Moderate Content</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-blue-500 transition-colors duration-200 group">
              <FiBarChart3 className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">View Analytics</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-blue-500 transition-colors duration-200 group">
              <FiGlobe className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">Site Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Blogs Table */}
      <div className="mt-8 bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiFileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-theme-text">Recent Blogs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme-border">
                <th className="text-left py-3 px-4 font-semibold text-theme-text">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-theme-text">Author</th>
                <th className="text-left py-3 px-4 font-semibold text-theme-text">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-theme-text">Date</th>
              </tr>
            </thead>
            <tbody>
              {blogs.slice(0, 5).map((blog) => (
                <tr key={blog._id} className="border-b border-theme-border hover:bg-theme-bg transition-colors duration-200">
                  <td className="py-3 px-4 text-theme-text">{blog.title}</td>
                  <td className="py-3 px-4 text-theme-text-secondary">{blog.author?.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                      Published
                    </span>
                  </td>
                  <td className="py-3 px-4 text-theme-text-secondary">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard