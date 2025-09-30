import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTheme } from "../contexts/ThemeContext"
import { getBlogs } from "../store/slices/blogSlice"
import { 
  FiUsers, 
  FiShield, 
  FiServer, 
  FiDatabase,
  FiActivity,
  FiTrendingUp,
  FiGlobe,
  FiSettings,
  FiBarChart3,
  FiCpu,
  FiHardDrive,
  FiWifi
} from "react-icons/fi"

function SuperAdminDashboard() {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { user } = useSelector((state) => state.auth)
  const { blogs, isLoading } = useSelector((state) => state.blog)

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  const systemStats = [
    {
      title: "Total Users",
      value: "2,847",
      icon: FiUsers,
      change: "+15%",
      changeType: "increase"
    },
    {
      title: "Admin Users", 
      value: "23",
      icon: FiShield,
      change: "+2",
      changeType: "increase"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      icon: FiServer,
      change: "Stable",
      changeType: "stable"
    },
    {
      title: "Database Size",
      value: "2.4 GB",
      icon: FiDatabase,
      change: "+120 MB",
      changeType: "increase"
    }
  ]

  const systemHealth = [
    { name: "CPU Usage", value: 45, color: "bg-blue-500" },
    { name: "Memory Usage", value: 72, color: "bg-green-500" },
    { name: "Disk Usage", value: 38, color: "bg-yellow-500" },
    { name: "Network I/O", value: 89, color: "bg-purple-500" }
  ]

  const adminActions = [
    { action: "User John Doe promoted to Admin", admin: "SuperAdmin", time: "5 minutes ago" },
    { action: "System backup completed", admin: "System", time: "1 hour ago" },
    { action: "Security scan initiated", admin: "SuperAdmin", time: "3 hours ago" },
    { action: "Database maintenance", admin: "System", time: "6 hours ago" },
    { action: "New admin Alice Johnson added", admin: "SuperAdmin", time: "1 day ago" }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FiUsers className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-theme-text">SuperAdmin Dashboard</h1>
            <p className="text-theme-text-secondary">System overview and management</p>
          </div>
        </div>
      </div>

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Icon className="w-6 h-6 text-purple-500" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' 
                    ? 'text-green-500' 
                    : stat.changeType === 'decrease'
                    ? 'text-red-500'
                    : 'text-blue-500'
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* System Health */}
        <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiCpu className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-theme-text">System Health</h2>
          </div>
          <div className="space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-theme-text text-sm font-medium">{item.name}</span>
                  <span className="text-theme-text-secondary text-sm">{item.value}%</span>
                </div>
                <div className="w-full bg-theme-bg rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="lg:col-span-2 bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiActivity className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-theme-text">Recent Admin Actions</h2>
          </div>
          <div className="space-y-4">
            {adminActions.map((action, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-theme-bg transition-colors duration-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-theme-text font-medium">{action.action}</p>
                  <p className="text-theme-text-secondary text-sm">by {action.admin}</p>
                  <p className="text-theme-text-secondary text-xs">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Management */}
        <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiServer className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-theme-text">System Management</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center space-y-2 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiDatabase className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text text-sm font-medium">Database</span>
            </button>
            <button className="flex flex-col items-center space-y-2 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiServer className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text text-sm font-medium">Servers</span>
            </button>
            <button className="flex flex-col items-center space-y-2 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiHardDrive className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text text-sm font-medium">Storage</span>
            </button>
            <button className="flex flex-col items-center space-y-2 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiWifi className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text text-sm font-medium">Network</span>
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-theme-bg-secondary border border-theme-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FiUsers className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-theme-text">User Management</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiUsers className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">Manage All Users</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiShield className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">Admin Permissions</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiBarChart3 className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">User Analytics</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-theme-bg border border-theme-border rounded-lg hover:border-purple-500 transition-colors duration-200 group">
              <FiSettings className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-theme-text font-medium">Global Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard