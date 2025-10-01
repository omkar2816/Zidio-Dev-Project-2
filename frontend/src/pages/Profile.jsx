import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiUsers,
  FiCamera,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiLinkedin,
  FiGithub,
  FiTwitter
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import BlogCard from '../components/BlogCard'
import Avatar from '../components/Avatar'
import userService from '../services/userService'
import { updateUserProfile } from '../store/slices/authSlice'

function Profile() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  const [profileUser, setProfileUser] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userBlogs, setUserBlogs] = useState([])
  const [blogCount, setBlogCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: ''
  })

  const [avatarFile, setAvatarFile] = useState(null)
  const fileInputRef = useRef(null)

  const isOwnProfile = user && user._id === id

  useEffect(() => {
    if (id) {
      fetchUserProfile()
    }
  }, [id])

  useEffect(() => {
    if (profileUser) {
      setEditData({
        name: profileUser.name || '',
        email: profileUser.email || '',
        bio: profileUser.bio || '',
        location: profileUser.location || '',
        phone: profileUser.phone || '',
        website: profileUser.website || '',
        linkedin: profileUser.linkedin || '',
        github: profileUser.github || '',
        twitter: profileUser.twitter || ''
      })
    }
  }, [profileUser])

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true)
      const data = await userService.getUserProfile(id, user?.token)
      setProfileUser(data.user)
      setUserBlogs(data.blogs || [])
      setBlogCount(data.blogCount || 0)
      setFollowersCount(data.followersCount || 0)
      setFollowingCount(data.followingCount || 0) 
      setTotalLikes(data.totalLikes || 0)
      setTotalComments(data.totalComments || 0)
      
      if (user && user._id !== id) {
        setIsFollowing(data.isFollowing || false)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
      // Reset state on error to prevent undefined values
      setUserBlogs([])
      setBlogCount(0)
      setFollowersCount(0)
      setFollowingCount(0)
      setTotalLikes(0)
      setTotalComments(0)
      setIsFollowing(false)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const updatedUser = await userService.updateUserProfile(user._id, editData, user.token)
      
      dispatch(updateUserProfile(updatedUser))
      setProfileUser(updatedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      setLoading(true)
      await userService.followUser(id, user.token)
      setIsFollowing(true)
      setFollowersCount(prev => prev + 1)
      toast.success(`Now following ${profileUser.name}`)
    } catch (error) {
      console.error('Error following user:', error)
      toast.error(error.message || 'Failed to follow user')
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async () => {
    try {
      setLoading(true)
      await userService.unfollowUser(id, user.token)
      setIsFollowing(false)
      setFollowersCount(prev => prev - 1)
      toast.success(`Unfollowed ${profileUser.name}`)
    } catch (error) {
      console.error('Error unfollowing user:', error)
      toast.error(error.message || 'Failed to unfollow user')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)')
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      setAvatarFile(file)
      handleAvatarUpload(file)
    }
  }

  const handleAvatarUpload = async (file) => {
    try {
      setLoading(true)
      const uploadResult = await userService.uploadAvatar(file, user.token)
      
      // Update profile user with new avatar URL
      const updatedProfileUser = { ...profileUser, avatar: uploadResult.avatarUrl }
      setProfileUser(updatedProfileUser)
      
      // Update auth state if this is own profile - use complete user data from backend if available
      if (isOwnProfile) {
        const updatedUser = uploadResult.user || { ...user, avatar: uploadResult.avatarUrl }
        dispatch(updateUserProfile(updatedUser))
      }
      
      toast.success('Avatar updated successfully!')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setLoading(false)
      setAvatarFile(null)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {profileLoading ? (
          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-theme-text">Loading profile...</p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-theme-text mb-2">
                {isOwnProfile ? 'My Profile' : `${profileUser?.name}'s Profile`}
              </h1>
              <p className="text-theme-text-secondary">
                {isOwnProfile 
                  ? 'Manage your personal information and preferences' 
                  : `View ${profileUser?.name}'s profile and blog posts`
                }
              </p>
            </div>

            {/* Profile Card */}
            <div className="card-modern p-8 mb-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                {/* Avatar */}
                <div className="relative group">
                  <Avatar 
                    user={profileUser} 
                    size="2xl" 
                    className="shadow-xl"
                  />
                  {isOwnProfile && isEditing && (
                    <>
                      <button 
                        onClick={handleAvatarClick}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiCamera className="text-white text-2xl" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleInputChange}
                          className="text-theme-text mb-4 bg-transparent border border-theme-border rounded-lg px-3 py-1 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-theme-text mb-1">{profileUser?.name}</p>
                      )}
                      
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          className="text-theme-text mb-2 bg-transparent border border-theme-border rounded-lg px-3 py-1 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        />
                      ) : (
                        <p className="text-theme-text-secondary mb-2">{profileUser?.email}</p>
                      )}
                      <p className="text-sm text-theme-text-secondary mb-4">
                        <FiCalendar className="inline mr-2" />
                        Member since {new Date(profileUser?.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {isOwnProfile ? (
                        isEditing ? (
                          <>
                            <button
                              onClick={handleSaveProfile}
                              className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 flex items-center gap-2 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={loading}
                            >
                              {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FiSave className="text-lg" />
                              )}
                              Save
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/30 hover:scale-105 flex items-center gap-2"
                            >
                              <FiX className="text-lg" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 flex items-center gap-2 ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiEdit3 className="text-lg" />
                            )}
                            Edit Profile
                          </button>
                        )
                      ) : (
                        <button
                          onClick={isFollowing ? handleUnfollow : handleFollow}
                          className={`px-6 py-2 ${
                            isFollowing 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/30' 
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-blue-500/30'
                          } text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiUser className="text-lg" />
                          )}
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-theme-text mb-3 flex items-center gap-2">
                  <FiUser className="text-blue-500" />
                  About
                </h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-transparent border border-theme-border rounded-lg px-4 py-3 text-theme-text placeholder-theme-text-secondary focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                    rows="4"
                  />
                ) : (
                  <p className="text-theme-text-secondary leading-relaxed">
                    {profileUser?.bio || 'No bio available.'}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
                  <FiMail className="text-green-500" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                      <FiMapPin className="text-red-500 text-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-theme-text-secondary">Location</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={editData.location}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                            className="w-full bg-transparent text-theme-text border-none outline-none placeholder-theme-text-secondary focus:ring-0"
                          />
                        ) : (
                          <p className="text-theme-text">{profileUser?.location || 'Not specified'}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                      <FiPhone className="text-blue-500 text-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-theme-text-secondary">Phone</p>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full bg-transparent text-theme-text border-none outline-none placeholder-theme-text-secondary focus:ring-0"
                          />
                        ) : (
                          <p className="text-theme-text">{profileUser?.phone || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                      <FiGlobe className="text-purple-500 text-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-theme-text-secondary">Website</p>
                        {isEditing ? (
                          <input
                            type="url"
                            name="website"
                            value={editData.website}
                            onChange={handleInputChange}
                            placeholder="https://yourwebsite.com"
                            className="w-full bg-transparent text-theme-text border-none outline-none placeholder-theme-text-secondary focus:ring-0"
                          />
                        ) : (
                          <p className="text-theme-text">
                            {profileUser?.website ? (
                              <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {profileUser.website}
                              </a>
                            ) : (
                              'Not specified'
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                      <FiMail className="text-green-500 text-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-theme-text-secondary">Email</p>
                        <p className="text-theme-text">{profileUser?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
                  <FiGlobe className="text-indigo-500" />
                  Social Links
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                    <FiLinkedin className="text-blue-600 text-lg" />
                    <div className="flex-1">
                      <p className="text-sm text-theme-text-secondary">LinkedIn</p>
                      {isEditing ? (
                        <input
                          type="url"
                          name="linkedin"
                          value={editData.linkedin}
                          onChange={handleInputChange}
                          placeholder="LinkedIn profile URL"
                          className="w-full bg-transparent text-theme-text border-none outline-none placeholder-theme-text-secondary focus:ring-0"
                        />
                      ) : (
                        <p className="text-theme-text">
                          {profileUser?.linkedin ? (
                            <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              View Profile
                            </a>
                          ) : (
                            'Not linked'
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                    <FiGithub className="text-gray-700 dark:text-gray-300 text-lg" />
                    <div className="flex-1">
                      <p className="text-sm text-theme-text-secondary">GitHub</p>
                      {isEditing ? (
                        <input
                          type="url"
                          name="github"
                          value={editData.github}
                          onChange={handleInputChange}
                          placeholder="GitHub profile URL"
                          className="w-full bg-transparent text-theme-text border-none outline-none placeholder-theme-text-secondary focus:ring-0"
                        />
                      ) : (
                        <p className="text-theme-text">
                          {profileUser?.github ? (
                            <a href={profileUser.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              View Profile
                            </a>
                          ) : (
                            'Not linked'
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-theme-bg-secondary rounded-lg border border-theme-border">
                    <FiTwitter className="text-blue-400 text-lg" />
                    <div className="flex-1">
                      <p className="text-sm text-theme-text-secondary">Twitter</p>
                      {isEditing ? (
                        <input
                          type="url"
                          name="twitter"
                          value={editData.twitter}
                          onChange={handleInputChange}
                          placeholder="Twitter profile URL"
                          className="w-full bg-transparent text-theme-text border-none outline-none placeholder-theme-text-secondary focus:ring-0"
                        />
                      ) : (
                        <p className="text-theme-text">
                          {profileUser?.twitter ? (
                            <a href={profileUser.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              View Profile
                            </a>
                          ) : (
                            'Not linked'
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiEdit3 className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-theme-text mb-1">{blogCount}</h3>
                <p className="text-theme-text-secondary">Blog Posts</p>
              </div>

              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-theme-text mb-1">{followersCount}</h3>
                <p className="text-theme-text-secondary">Followers</p>
              </div>

              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-theme-text mb-1">{followingCount}</h3>
                <p className="text-theme-text-secondary">Following</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiMail className="text-white text-xl" />
                </div>
                <p className="text-3xl font-bold text-theme-text mb-1">{totalLikes}</p>
                <p className="text-theme-text-secondary">Total Likes</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-r from-teal-500/10 to-teal-600/10 rounded-xl border border-teal-500/20">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiMail className="text-white text-xl" />
                </div>
                <p className="text-3xl font-bold text-theme-text mb-1">{totalComments}</p>
                <p className="text-theme-text-secondary">Total Comments</p>
              </div>
            </div>

            {/* Published Blogs Section */}
            <div>
              <h2 className="text-2xl font-bold text-theme-text mb-6">Published Blogs</h2>

              {userBlogs && userBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-2">
                  {userBlogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} user={user} />
                  ))}
                </div>
              ) : (
                <div className="card-modern p-20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiMail className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-theme-text mb-2">No Blogs Yet</h3>
                  <p className="text-theme-text-secondary">This user hasn't published any blogs yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile