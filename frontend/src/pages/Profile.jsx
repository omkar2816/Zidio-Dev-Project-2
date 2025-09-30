"use client"

import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import { FiMail, FiCalendar, FiMapPin } from "react-icons/fi"

function Profile() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { blogs } = useSelector((state) => state.blog)

  const userBlogs = blogs.filter((blog) => blog.author?._id === id)
  const author = userBlogs[0]?.author

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

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

  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-bg via-theme-bg-secondary to-theme-bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card-modern p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${getAvatarColor(author?.name)} flex items-center justify-center text-white text-2xl md:text-4xl font-bold shadow-xl`}>
              {getUserInitials(author?.name)}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-theme-text mb-2">{author?.name}</h1>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-theme-text-secondary mb-4">
                <div className="flex items-center space-x-2">
                  <FiMail className="w-4 h-4" />
                  <span>{author?.email}</span>
                </div>
                {author?.createdAt && (
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>Joined {formatDate(author?.createdAt)}</span>
                  </div>
                )}
              </div>
              
              {author?.bio && (
                <p className="text-theme-text-secondary leading-relaxed max-w-2xl">
                  {author?.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-theme-border">
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiMail className="text-white text-xl" />
              </div>
              <p className="text-3xl font-bold text-theme-text mb-1">{userBlogs.length}</p>
              <p className="text-theme-text-secondary">Total Blogs</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiMail className="text-white text-xl" />
              </div>
              <p className="text-3xl font-bold text-theme-text mb-1">
                {userBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0)}
              </p>
              <p className="text-theme-text-secondary">Total Likes</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiMail className="text-white text-xl" />
              </div>
              <p className="text-3xl font-bold text-theme-text mb-1">
                {userBlogs.reduce((acc, blog) => acc + (blog.comments?.length || 0), 0)}
              </p>
              <p className="text-theme-text-secondary">Total Comments</p>
            </div>
          </div>
        </div>

        {/* Published Blogs Section */}
        <div>
          <h2 className="text-2xl font-bold text-theme-text mb-6">Published Blogs</h2>

          {userBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
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
    </div>
  )
}

export default Profile
