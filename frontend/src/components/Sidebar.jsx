import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useSidebar } from "../contexts/SidebarContext"
import { 
  FiHome, 
  FiUser, 
  FiSettings, 
  FiBarChart, 
  FiShield, 
  FiUsers, 
  FiMenu, 
  FiX,
  FiGrid,
  FiFileText,
  FiPlusCircle,
  FiBookOpen,
  FiPenTool
} from "react-icons/fi"

function Sidebar() {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  const { 
    isCollapsed, 
    isMobile, 
    isOpen, 
    toggleSidebar, 
    closeMobileSidebar, 
    sidebarWidth 
  } = useSidebar()
  
  const getRoleDashboardPath = () => {
    if (user?.role === "superadmin") return "/superadmin"
    if (user?.role === "admin") return "/admin"
    return "/dashboard"
  }

  const getNavigationItems = () => {
    const baseItems = [
      {
        label: "Home",
        icon: FiHome,
        path: "/",
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
        path: "/dashboard",
<<<<<<< HEAD
<<<<<<< HEAD
        roles: ["admin", "superadmin"]
=======
        roles: ["user", "admin", "superadmin"]
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)
      },
      {
        label: "Bookmarks",
        icon: FiBookmark,
        path: "/bookmarks",
=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
        roles: ["user", "admin", "superadmin"]
      }
    ]

    // Role-specific items
    const roleItems = {
      user: [
        {
          label: "Dashboard", 
          icon: FiGrid,
          path: "/dashboard",
          roles: ["user"]
        }
      ],
      admin: [
        {
          label: "Admin Dashboard",
          icon: FiShield,
          path: "/admin",
          roles: ["admin"]
        }
      ],
      superadmin: [
        {
          label: "Super Admin Dashboard",
          icon: FiShield,
          path: "/superadmin",
          roles: ["superadmin"]
        },
        {
          label: "User Management",
          icon: FiUsers,
          path: "/admin",
          roles: ["superadmin"]
        }
      ]
    }

    const userRoleItems = roleItems[user?.role] || []
    
    const endItems = [
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

    return [...baseItems, ...userRoleItems, ...endItems]
  }

  const navigationItems = getNavigationItems()

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
          className="fixed top-4 left-4 z-50 p-2 bg-theme-bg-secondary text-theme-text rounded-lg shadow-lg md:hidden border border-theme-border transition-colors duration-300"
        >
          {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Dock */}
      <aside 
        className={`
          ${isMobile ? 
            `fixed left-0 top-0 h-screen z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} rounded-r-2xl` :
            `fixed left-4 top-1/2 -translate-y-1/2 w-16 hover:w-64 transition-all duration-400 group rounded-2xl hover:shadow-3xl`
          }
          bg-theme-bg/95 backdrop-blur-xl border border-theme-border/60 shadow-2xl flex flex-col z-30
        `}
        style={{
          transitionProperty: 'width, transform, opacity',
          transitionDuration: '400ms',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >


        {/* Navigation Items */}
        <nav className="py-4">
          <div className={`space-y-1 ${isMobile ? 'px-2' : 'px-2'}`}>
            {filteredItems.map((item) => {
              const Icon = item.icon
              const active = isActiveLink(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={`
                    flex items-center transition-all duration-300 relative overflow-hidden group/item
                    ${isMobile ? 'px-3 py-2.5' : 'p-2.5 justify-center mx-1 group-hover:justify-start group-hover:px-3'}
                    rounded-xl
                    ${active 
                      ? 'bg-gradient-to-r from-primary-500/15 to-secondary-500/15 text-primary-600 dark:text-primary-400 shadow-md border border-primary-500/20' 
                      : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary border border-transparent'
                    }
                    ${active ? 'transform scale-105' : 'hover:scale-102'}
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r-full"></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isMobile ? 'w-5 h-6 mr-3' : 'w-6 h-6 group-hover:mr-3'
                  }`}>
                    <Icon className={`
                      w-5 h-5 transition-all duration-300
                      ${active ? 'text-primary-600 dark:text-primary-400' : 'group/item-hover:text-theme-text group/item-hover:scale-110'}
                    `} />
                  </div>
                  
                  {/* Text with dock behavior */}
                  <span className={`font-medium truncate transition-all duration-300 ${active ? 'font-semibold' : ''} ${
                    isMobile 
                      ? 'flex-1 text-left' 
                      : 'opacity-0 group-hover:opacity-100 whitespace-nowrap overflow-hidden'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>


      </aside>
    </>
  )
}

export default Sidebar