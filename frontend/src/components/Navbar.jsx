"use client"

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
  FiPenTool,
  FiSettings,
  FiPlusCircle
} from "react-icons/fi"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <FiPenTool className="text-white text-xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold text-gradient">BlogHub</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Modern Blogging</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
            >
              <FiHome className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <FiPlusCircle className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Create</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                >
                  <FiUser className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                {user.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 group"
                  >
                    <FiShield className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
                >
                  <FiLogOut className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : (
                <FiMoon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl mx-4 mb-4 border border-white/20">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <FiHome />
                <span className="font-medium">Home</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/create"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    <FiPlusCircle />
                    <span className="font-medium">Create Blog</span>
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <FiUser />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300"
                    >
                      <FiShield />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 w-full text-left"
                  >
                    <FiLogOut />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    <span className="font-medium">Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
