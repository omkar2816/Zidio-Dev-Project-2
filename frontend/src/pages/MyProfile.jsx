import { useState } from "react"
import { useSelector } from "react-redux"
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiShield, 
  FiEdit3, 
  FiSave, 
  FiX,
  FiCamera,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiLock,
  FiBell
} from "react-icons/fi"
import toast from "react-hot-toast"

function MyProfile() {
  const { user } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "I'm a passionate blogger who loves sharing knowledge and experiences.",
    location: user?.location || "",
    phone: user?.phone || "",
    website: user?.website || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    twitter: user?.twitter || "",
  })

  // Generate user avatar initials
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
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "I'm a passionate blogger who loves sharing knowledge and experiences.",
      location: user?.location || "",
      phone: user?.phone || "",
      website: user?.website || "",
      linkedin: user?.linkedin || "",
      github: user?.github || "",
      twitter: user?.twitter || "",
    })
    setIsEditing(false)
  }

  const formatJoinDate = (date) => {
    if (!date) return "Recently"
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-bg via-theme-bg-secondary to-theme-bg-tertiary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-2">My Profile</h1>
          <p className="text-theme-text-secondary">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="card-modern p-8 mb-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${getAvatarColor(profileData.name)} flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
                {getUserInitials(profileData.name)}
              </div>
              <button className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <FiCamera className="text-white text-2xl" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-theme-text mb-1">{profileData.name}</h2>
                  <p className="text-theme-text-secondary mb-2">{profileData.email}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-theme-text-secondary">
                    <div className="flex items-center space-x-1">
                      <FiShield className="w-4 h-4" />
                      <span className="capitalize">{user?.role}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>Joined {formatJoinDate(user?.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Edit Button */}
                <div className="mt-4 md:mt-0">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary px-6 py-2 flex items-center space-x-2"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="btn-primary px-4 py-2 flex items-center space-x-2"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn-secondary px-4 py-2 flex items-center space-x-2"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-theme-text-secondary leading-relaxed">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiUser className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiMail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <p className="text-theme-text">{profileData.email}</p>
                  <p className="text-xs text-theme-text-secondary mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiMapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.location || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiPhone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.phone || "Not specified"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-4">Social Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiGlobe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.website || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiLinkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.linkedin || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiGithub className="w-4 h-4 inline mr-2" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="github"
                      value={profileData.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                      placeholder="https://github.com/username"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.github || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    <FiTwitter className="w-4 h-4 inline mr-2" />
                    Twitter
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="twitter"
                      value={profileData.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-theme-bg-secondary text-theme-text"
                      placeholder="https://twitter.com/username"
                    />
                  ) : (
                    <p className="text-theme-text">{profileData.twitter || "Not specified"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-modern p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiEdit3 className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-theme-text mb-1">12</h3>
            <p className="text-theme-text-secondary">Blog Posts</p>
          </div>

          <div className="card-modern p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-theme-text mb-1">248</h3>
            <p className="text-theme-text-secondary">Followers</p>
          </div>

          <div className="card-modern p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-theme-text mb-1">{formatJoinDate(user?.createdAt)}</h3>
            <p className="text-theme-text-secondary">Member Since</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-modern p-6 mt-6">
          <h3 className="text-lg font-semibold text-theme-text mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors text-left">
              <FiLock className="w-5 h-5 text-theme-text-secondary" />
              <div>
                <p className="font-medium text-theme-text">Change Password</p>
                <p className="text-sm text-theme-text-secondary">Update your account password</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-theme-bg-secondary transition-colors text-left">
              <FiBell className="w-5 h-5 text-theme-text-secondary" />
              <div>
                <p className="font-medium text-theme-text">Notification Settings</p>
                <p className="text-sm text-theme-text-secondary">Manage email and push notifications</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile