"use client"

import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"
import { FiLogOut, FiUser, FiEdit, FiHome, FiShield } from "react-icons/fi"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FiEdit className="text-primary text-2xl" />
            <span className="text-xl font-bold text-gray-900">BlogHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
              <FiHome />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition"
                >
                  <FiUser />
                  <span>Dashboard</span>
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
                    <FiShield />
                    <span>Admin</span>
                  </Link>
                )}

                <Link to="/create" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Create Blog
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
