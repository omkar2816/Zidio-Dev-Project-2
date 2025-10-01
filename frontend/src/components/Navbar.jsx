import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"
import { useTheme } from "../contexts/ThemeContext"
import { useSidebar } from "../contexts/SidebarContext"
import Avatar from "./Avatar"
import { 
  FiLogOut, 
  FiUser, 
  FiEdit, 
  FiHome, 
  FiShield, 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX,
  FiPlus,
  FiSettings,
  FiBookOpen,
  FiPenTool,
  FiMail,
  FiEye,
  FiBell
} from "react-icons/fi"
import SuperAdminDashboard from "../pages/SuperAdminDashboard"
import AdminDashboard from "../pages/AdminDashboard"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { theme, toggleTheme } = useTheme()
  const { sidebarWidthValue, isMobile, isCollapsed } = useSidebar()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef(null)
  const hoverTimeoutRef = useRef(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setIsMenuOpen(false)
    setIsProfileDropdownOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsProfileDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false)
    }, 300) // 300ms delay before closing
  }

  return (
    <nav 
      className="bg-theme-bg/90 backdrop-blur-xl border-b border-theme-border/60 fixed top-0 w-full z-40 transition-all duration-300 shadow-sm"
    >
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-18 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <FiBookOpen className="text-white text-lg group-hover:rotate-12 transition-transform duration-300" />
              <FiPenTool className="absolute top-1 right-1 text-white text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            </div>
            <span className="text-xl font-display font-bold gradient-text">BlogHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActiveLink('/') 
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary'
              }`}
            >
              <FiHome className="group-hover:scale-110 transition-transform duration-200" />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActiveLink(user?.role === "admin" ? "/admin" : "/dashboard")
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary'
                  }`}
                >
                  <FiUser className="group-hover:scale-110 transition-transform duration-200" />
                  <span>{user?.role === "admin" ? "Admin Panel" : "Dashboard"}</span>
                </Link>

                <Link 
                  to="/create" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group ${
                    isActiveLink('/create')
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                  }`}
                >
                  <FiPlus className="group-hover:rotate-90 transition-transform duration-200" />
                  <span>Create</span>
                </Link>

                <div className="w-px h-6 bg-theme-border/50"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-theme-bg-secondary transition-all duration-200 group"
                  >
                    <Avatar 
                      user={user} 
                      size="sm" 
                      className="group-hover:scale-105 transition-transform duration-200" 
                    />
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-theme-text">{user?.name}</div>
                      <div className="text-xs text-theme-text-secondary capitalize">{user?.role}</div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-72 bg-theme-bg/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-theme-border/60 py-2 z-50 animate-scale-in"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-theme-border/50">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            user={user} 
                            size="lg" 
                            className="shadow-lg"
                          />
                          <div>
                            <div className="font-semibold text-theme-text">{user?.name}</div>
                            <div className="text-sm text-theme-text-secondary flex items-center space-x-1">
                              <FiMail className="w-3 h-3" />
                              <span>{user?.email}</span>
                            </div>
                            <div className="text-xs text-primary-500 font-medium capitalize flex items-center space-x-1 mt-1">
                              <FiShield className="w-3 h-3" />
                              <span>{user?.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to={`/profile/${user?._id}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-theme-bg-secondary transition-all duration-200 text-theme-text-secondary hover:text-theme-text group"
                        >
                          <FiUser className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>View Profile</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-theme-bg-secondary transition-all duration-200 text-theme-text-secondary hover:text-theme-text group"
                        >
                          <FiSettings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                          <span>Settings</span>
                        </Link>

                        <button
                          onClick={toggleTheme}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-theme-bg-secondary transition-all duration-200 text-theme-text-secondary hover:text-theme-text group w-full"
                        >
                          {theme === 'dark' ? (
                            <>
                              <FiSun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                              <span>Light Mode</span>
                            </>
                          ) : (
                            <>
                              <FiMoon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-200" />
                              <span>Dark Mode</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-theme-border/50 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-theme-text-secondary hover:text-red-500 group w-full"
                        >
                          <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg font-medium"
                >
                  Register
                </Link>

                {/* Theme Toggle for non-logged in users */}
                <button
                  onClick={toggleTheme}
                  className="relative p-2 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-tertiary transition-all duration-200 group overflow-hidden"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <FiSun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  ) : (
                    <FiMoon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-theme-bg/95 backdrop-blur-xl border-b border-theme-border shadow-lg animate-slide-down z-50">
            <div className="px-4 py-6 space-y-3">
              {user && (
                <div className="bg-theme-bg-secondary rounded-xl p-4 mb-4 border border-theme-border/50">
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      user={user} 
                      size="lg" 
                      className="shadow-lg"
                    />
                    <div>
                      <div className="font-semibold text-theme-text">{user?.name}</div>
                      <div className="text-sm text-theme-text-secondary">{user?.email}</div>
                      <div className="text-xs text-primary-500 font-medium capitalize flex items-center space-x-1 mt-1">
                        <FiShield className="w-3 h-3" />
                        <span>{user?.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Link 
                to="/" 
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActiveLink('/') 
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary'
                }`}
              >
                <FiHome />
                <span>Home</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to={user?.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActiveLink(user?.role === "admin" ? "/admin" : "/dashboard")
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400' 
                        : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary'
                    }`}
                  >
                    <FiUser />
                    <span>{user?.role === "admin" ? "Admin Panel" : "Dashboard"}</span>
                  </Link>

                  <Link 
                    to="/create"
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActiveLink('/create')
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                    }`}
                  >
                    <FiPlus />
                    <span>Create Blog</span>
                  </Link>

                  <Link
                    to={`/profile/${user?._id}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      closeMenu()
                    }}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
                  >
                    <FiUser />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeMenu()
                    }}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
                  >
                    <FiSettings />
                    <span>Settings</span>
                  </Link>

                  <div className="border-t border-theme-border pt-3 mt-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full"
                    >
                      <FiLogOut />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Mobile Theme Toggle */}
              <div className="border-t border-theme-border pt-3 mt-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200 w-full"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <FiSun /> : <FiMoon />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
