import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register, reset } from "../store/slices/authSlice"
import { useTheme } from "../contexts/ThemeContext"
import toast from "react-hot-toast"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiLoader, FiUserPlus, FiShield } from "react-icons/fi"

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    requestAdminAccess: false,
    adminRequestReason: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate("/dashboard")
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.requestAdminAccess && !formData.adminRequestReason.trim()) {
      toast.error("Please provide a reason for requesting admin access")
      return
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      requestAdminAccess: formData.requestAdminAccess,
      adminRequestReason: formData.adminRequestReason,
    }

    dispatch(register(userData))
  }

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
              <FiUserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-theme-text">Join BlogHub</h1>
            <p className="text-theme-text-secondary">Create your account and start sharing your stories</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-modern w-full pl-12 pr-4"
                  placeholder="John Doe"
                />
              </div>
            </div>

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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-theme-text">Confirm Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-modern w-full pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-theme-text-secondary hover:text-theme-text transition-colors duration-200"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Admin Request Section */}
            <div className="space-y-4 p-4 bg-theme-bg-secondary rounded-xl border border-theme-border">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="requestAdminAccess"
                  name="requestAdminAccess"
                  checked={formData.requestAdminAccess}
                  onChange={(e) => setFormData({ ...formData, requestAdminAccess: e.target.checked })}
                  className="w-4 h-4 text-primary-600 bg-theme-bg border-theme-border rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="requestAdminAccess" className="text-sm font-medium text-theme-text cursor-pointer">
                  Request Admin Access
                </label>
              </div>
              
              {formData.requestAdminAccess && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-theme-text">
                    Why do you need admin access? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="adminRequestReason"
                    value={formData.adminRequestReason}
                    onChange={handleChange}
                    required={formData.requestAdminAccess}
                    className="input-modern w-full min-h-[80px] resize-none"
                    placeholder="Please explain why you need admin privileges..."
                    maxLength="500"
                  />
                  <p className="text-xs text-theme-text-secondary">
                    Your request will be reviewed by a superadmin. Please provide a clear reason.
                  </p>
                </div>
              )}
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
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
                <span className="px-2 bg-theme-bg text-theme-text-secondary">Already have an account?</span>
              </div>
            </div>
            
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              <span>Sign in to your account</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
