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
                    className={`profile-button-hover flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-300 group relative z-50 border border-transparent hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-primary-500/20 ${
                      isProfileDropdownOpen 
                        ? 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 border-primary-200 dark:border-primary-700 shadow-lg shadow-primary-500/20' 
                        : ''
                    }`}
                  >
                    {/* Enhanced Avatar with Status Ring */}
                    <div className="relative">
                      <Avatar 
                        user={user} 
                        size="sm" 
                        className={`group-hover:scale-110 transition-all duration-300 ${isProfileDropdownOpen ? 'scale-110' : ''}`}
                      />
                      {/* Animated Ring */}
                      <div className={`absolute inset-0 rounded-full ring-2 ring-primary-500/0 group-hover:ring-primary-500/60 transition-all duration-300 ${isProfileDropdownOpen ? 'ring-primary-500/60' : ''}`}></div>
                      {/* Status Indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm animate-pulse"></div>
                    </div>
                    
                    {/* Enhanced User Info */}
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold text-theme-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {user?.name}
                      </div>
                      <div className="text-xs text-theme-text-secondary capitalize flex items-center space-x-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200">
                        <FiShield className="w-3 h-3" />
                        <span>{user?.role}</span>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-[9999] animate-dropdown-in"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{ 
                        transform: 'translateZ(0)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 20px rgba(59, 130, 246, 0.15)'
                      }}
                    >
                      {/* User Info Header */}
                      <div className="px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                          {/* Enhanced Large Avatar */}
                          <div className="relative">
                            <Avatar 
                              user={user} 
                              size="lg" 
                              className="shadow-lg ring-3 ring-primary-500/30 dark:ring-primary-400/30 hover:ring-primary-500/50 dark:hover:ring-primary-400/50 transition-all duration-300"
                            />
                            {/* Decorative Ring Animation */}
                            <div className="absolute inset-0 rounded-full ring-2 ring-primary-500/20 animate-ping"></div>
                            {/* Enhanced Status Indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg">
                              <div className="absolute inset-0.5 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 dark:text-white text-base truncate bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                              {user?.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center space-x-2 mt-0.5">
                              <FiMail className="w-3 h-3 flex-shrink-0 text-primary-500" />
                              <span className="truncate">{user?.email}</span>
                            </div>
                            <div className="text-xs font-semibold capitalize flex items-center space-x-2 mt-1">
                              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${
                                user?.role === 'superadmin' 
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                                  : user?.role === 'admin'
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                              }`}>
                                <FiShield className="w-2.5 h-2.5" />
                                <span>{user?.role}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to={`/profile/${user?._id}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="menu-item-hover flex items-center space-x-3 px-6 py-2 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent dark:hover:from-primary-900/20 dark:hover:to-transparent transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 group relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-500 to-secondary-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-all duration-300">
                            <FiUser className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm">View Profile</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Manage your account</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="menu-item-hover flex items-center space-x-3 px-6 py-2 hover:bg-gradient-to-r hover:from-secondary-50 hover:to-transparent dark:hover:from-secondary-900/20 dark:hover:to-transparent transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-secondary-600 dark:hover:text-secondary-400 group relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-secondary-500 to-primary-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary-100 dark:bg-secondary-900/30 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800/50 transition-all duration-300">
                            <FiSettings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm">Settings</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Preferences & privacy</div>
                          </div>
                        </Link>

                        <button
                          onClick={toggleTheme}
                          className="flex items-center space-x-3 px-6 py-2 hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent dark:hover:from-amber-900/20 dark:hover:to-transparent transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 group w-full relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500 to-orange-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-all duration-300">
                            {theme === 'dark' ? (
                              <FiSun className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
                            ) : (
                              <FiMoon className="w-3.5 h-3.5 group-hover:-rotate-12 transition-transform duration-300" />
                            )}
                          </div>
                          <div>
                            {theme === 'dark' ? (
                              <>
                                <span className="font-semibold text-sm">Light Mode</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Switch to light theme</div>
                              </>
                            ) : (
                              <>
                                <span className="font-semibold text-sm">Dark Mode</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Switch to dark theme</div>
                              </>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="menu-item-hover flex items-center space-x-3 px-6 py-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent dark:hover:from-red-900/20 dark:hover:to-transparent transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 group w-full relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-500 to-pink-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-all duration-300">
                            <FiLogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm">Sign Out</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">End your session</div>
                          </div>
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
                  <div className="flex items-center space-x-4">
                    <Avatar 
                      user={user} 
                      size="xl" 
                      className="shadow-lg ring-2 ring-primary-500/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-theme-text truncate">{user?.name}</div>
                      <div className="text-sm text-theme-text-secondary truncate">{user?.email}</div>
                      <div className="text-xs text-primary-500 font-medium capitalize flex items-center space-x-1 mt-1">
                        <FiShield className="w-3 h-3 flex-shrink-0" />
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
