import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { 
  FiHome, 
  FiUser, 
  FiSettings, 
  FiBarChart3, 
  FiShield, 
  FiUsers, 
  FiMenu, 
  FiX,
  FiGrid,
  FiFileText,
  FiPlusCircle
} from "react-icons/fi"

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const sidebarWidth = isCollapsed && !isMobile ? "w-16" : "w-64"
  
  const navigationItems = [
    {
      label: "Home",
      icon: FiHome,
      path: "/",
      roles: ["user", "admin", "superadmin"]
    },
    {
      label: "User Dashboard", 
      icon: FiGrid,
      path: "/dashboard",
      roles: ["user", "admin", "superadmin"]
    },
    {
      label: "Create Blog",
      icon: FiPlusCircle,
      path: "/create", 
      roles: ["user", "admin", "superadmin"]
    },
    {
      label: "My Blogs",
      icon: FiFileText,
      path: "/dashboard", // We'll make this filter to user's blogs
      roles: ["user", "admin", "superadmin"]
    },
    {
      label: "Admin Dashboard",
      icon: FiBarChart3,
      path: "/admin-dashboard",
      roles: ["admin", "superadmin"]
    },
    {
      label: "Admin Panel",
      icon: FiShield,
      path: "/admin",
      roles: ["admin", "superadmin"]
    },
    {
      label: "SuperAdmin Dashboard",
      icon: FiUsers,
      path: "/superadmin-dashboard", 
      roles: ["superadmin"]
    },
    {
      label: "SuperAdmin Panel",
      icon: FiUsers,
      path: "/superadmin",
      roles: ["superadmin"]
    },
    {
      label: "Profile",
      icon: FiUser,
      path: "/profile",
      roles: ["user", "admin", "superadmin"]
    },
    {
      label: "Settings",
      icon: FiSettings,
      path: "/settings",
      roles: ["user", "admin", "superadmin"]
    }
  ]

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  )

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  if (!user) return null

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-40 p-2 bg-theme-bg-secondary text-theme-text rounded-lg shadow-lg md:hidden border border-theme-border"
        >
          {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 
          `fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` :
          `sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${sidebarWidth}`
        }
        bg-theme-bg-secondary border-r border-theme-border flex flex-col
      `}>
        {/* Desktop Toggle Button */}
        {!isMobile && (
          <div className="p-4 border-b border-theme-border">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 text-theme-text hover:bg-theme-bg transition-colors duration-200 rounded-lg"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="p-4 border-b border-theme-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-theme-text">Navigation</h2>
            <button
              onClick={closeMobileSidebar}
              className="p-1 text-theme-text hover:bg-theme-bg transition-colors duration-200 rounded"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {filteredItems.map((item) => {
              const Icon = item.icon
              const active = isActiveLink(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={`
                    flex items-center px-3 py-2 rounded-lg transition-all duration-200 group
                    ${active 
                      ? 'bg-blue-500/10 text-blue-500 border-r-2 border-blue-500' 
                      : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg'
                    }
                  `}
                  title={isCollapsed && !isMobile ? item.label : ""}
                >
                  <Icon className={`
                    w-5 h-5 flex-shrink-0 transition-colors duration-200
                    ${active ? 'text-blue-500' : 'group-hover:text-theme-text'}
                  `} />
                  
                  {(!isCollapsed || isMobile) && (
                    <span className="ml-3 font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4 border-t border-theme-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-theme-text truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-theme-text-secondary capitalize truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar