import { useState } from 'react'

const Avatar = ({ 
  user, 
  size = 'md', 
  className = '', 
  showStatus = false 
}) => {
  const [imageError, setImageError] = useState(false)

  // Size variants
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-32 h-32 text-4xl'
  }

  // Generate user initials
  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Generate consistent avatar color based on name
  const getAvatarColor = (name) => {
    if (!name) return 'from-gray-400 to-gray-500'
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600', 
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-cyan-400 to-cyan-600',
      'from-teal-400 to-teal-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600'
    ]
    const index = name?.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Check if user has uploaded avatar (support both 'avatar' and 'profilePicture' fields)
  const avatarSource = user?.avatar || user?.profilePicture
  const hasAvatar = avatarSource && !imageError
  
  // Handle both full URLs and filenames
  const avatarUrl = hasAvatar 
    ? (avatarSource.startsWith('http') 
        ? avatarSource // Full URL from backend
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/images/${avatarSource}`) // Filename only
    : null

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {hasAvatar && avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${user?.name || 'User'}'s avatar`}
          className={`${sizeClasses[size]} rounded-full object-cover shadow-lg ring-2 ring-white/20`}
          onError={handleImageError}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getAvatarColor(user?.name)} flex items-center justify-center text-white font-medium shadow-lg ring-2 ring-white/20`}>
          {getUserInitials(user?.name)}
        </div>
      )}
      
      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  )
}

export default Avatar