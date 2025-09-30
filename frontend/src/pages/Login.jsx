import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, reset } from "../store/slices/authSlice"
import { useTheme } from "../contexts/ThemeContext"
import toast from "react-hot-toast"
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLoader, FiUserCheck, FiZap } from "react-icons/fi"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // Default role
  })
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      // Redirect based on user role
      if (user?.role === "superadmin") {
        navigate("/superadmin")
      } else if (user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(formData))
  }

  const handleAutofillSuperadmin = () => {
    setFormData({
      email: "superadmin@bloghub.com",
      password: "SuperAdmin123!",
      role: "superadmin"
    })
    toast.success("Superadmin credentials autofilled!")
  }

  const roleOptions = [
    { value: "user", label: "User", description: "Regular user account" },
    { value: "admin", label: "Admin", description: "Administrator account" },
    { value: "superadmin", label: "SuperAdmin", description: "Super administrator account" }
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-20 pointer-events-none"></div>
      
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="card-modern p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiLock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-theme-text">Welcome Back</h1>
            <p className="text-theme-text-secondary">Sign in to continue your journey with BlogHub</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-modern w-full pl-12 pr-4"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-modern w-full pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary hover:text-theme-text transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text">Login as</label>
              <div className="relative group">
                <FiUserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary group-focus-within:text-primary-500 transition-colors duration-200" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-modern w-full pl-12 pr-4 appearance-none cursor-pointer"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-theme-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* SuperAdmin Autofill */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAutofillSuperadmin}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg transition-all duration-200 text-sm font-medium border border-purple-500/30 hover:border-purple-500/50"
              >
                <FiZap className="w-4 h-4" />
                <span>Autofill SuperAdmin</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-theme-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-theme-bg text-theme-text-secondary">New to BlogHub?</span>
              </div>
            </div>
            
            <Link 
              to="/register" 
              className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              <span>Create your account</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
