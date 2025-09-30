import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"
import { useTheme } from "../contexts/ThemeContext"
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
  FiPenTool
} from "react-icons/fi"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setIsMenuOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="bg-theme-bg/90 backdrop-blur-xl border-b border-theme-border/60 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200 group"
            >
              <FiHome className="group-hover:scale-110 transition-transform duration-200" />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200 group"
                >
                  <FiUser className="group-hover:scale-110 transition-transform duration-200" />
                  <span>Dashboard</span>
                </Link>

                {user.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200 group"
                  >
                    <FiShield className="group-hover:scale-110 transition-transform duration-200" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link 
                  to="/create" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                >
                  <FiPlus className="group-hover:rotate-90 transition-transform duration-200" />
                  <span>Create</span>
                </Link>

                <div className="w-px h-6 bg-theme-border"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-theme-text-secondary hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all duration-200 group"
                >
                  <FiLogOut className="group-hover:scale-110 transition-transform duration-200" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-theme-bg-secondary border border-theme-border text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-tertiary transition-all duration-200 group overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {theme === 'dark' ? (
                <FiSun className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300 relative z-10" />
              ) : (
                <FiMoon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300 relative z-10" />
              )}
            </button>
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-theme-bg/95 backdrop-blur-xl border-b border-theme-border shadow-lg animate-slide-down">
            <div className="px-4 py-6 space-y-3">
              <Link 
                to="/" 
                onClick={closeMenu}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
              >
                <FiHome />
                <span>Home</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
                  >
                    <FiUser />
                    <span>Dashboard</span>
                  </Link>

                  {user.role === "admin" && (
                    <Link 
                      to="/admin"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
                    >
                      <FiShield />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link 
                    to="/create"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                  >
                    <FiPlus />
                    <span>Create Blog</span>
                  </Link>

                  <div className="border-t border-theme-border pt-3 mt-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-theme-text-secondary hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all duration-200 w-full"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center px-3 py-3 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg-secondary transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
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
