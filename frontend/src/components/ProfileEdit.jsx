import React, { useState } from 'react'
import { FiCamera, FiSave, FiX, FiUpload } from 'react-icons/fi'
import userService from '../services/userService'

function ProfileEdit({ profileUser, user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: profileUser?.name || '',
    email: profileUser?.email || '',
    bio: profileUser?.bio || ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(profileUser?.avatar || null)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let avatarUrl = profileUser?.avatar

      // Upload avatar if a new one was selected
      if (avatarFile) {
        setUploadingAvatar(true)
        const avatarResponse = await userService.uploadAvatar(avatarFile, user.token)
        avatarUrl = avatarResponse.avatarUrl
        setUploadingAvatar(false)
      }

      // Update profile
      const updatedProfile = await userService.updateUserProfile(
        profileUser._id,
        {
          ...formData,
          avatar: avatarUrl
        },
        user.token
      )

      onSave(updatedProfile)
    } catch (error) {
      alert(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
      setUploadingAvatar(false)
    }
  }

  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

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

  return (
    <div className="card-modern p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-theme-text">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="p-2 text-theme-text-secondary hover:text-theme-text transition-colors"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-xl"
              />
            ) : (
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${getAvatarColor(formData.name)} flex items-center justify-center text-white text-2xl md:text-4xl font-bold shadow-xl`}>
                {getUserInitials(formData.name)}
              </div>
            )}
            
            <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
              <FiCamera className="text-lg" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          
          {uploadingAvatar && (
            <div className="flex items-center gap-2 text-blue-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Uploading avatar...</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme-background text-theme-text placeholder-theme-text-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme-background text-theme-text placeholder-theme-text-secondary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            maxLength={500}
            placeholder="Tell people a little about yourself..."
            className="w-full px-4 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme-background text-theme-text resize-none placeholder-theme-text-secondary"
          />
          <div className="text-right text-xs text-theme-text-secondary mt-1">
            {formData.bio.length}/500 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploadingAvatar}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors ${
              (loading || uploadingAvatar) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-theme-border hover:bg-theme-text/10 text-theme-text rounded-lg font-semibold transition-colors border border-theme-border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEdit