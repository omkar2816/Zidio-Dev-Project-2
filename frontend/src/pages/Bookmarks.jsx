"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import BlogCard from "../components/BlogCard"
import blogService from "../services/blogService"
import { FiBookmark, FiHeart } from "react-icons/fi"
import toast from "react-hot-toast"

function Bookmarks() {
  const { user } = useSelector((state) => state.auth)
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarkedBlogs()
  }, [])

  const fetchBookmarkedBlogs = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const blogs = await blogService.getBookmarkedBlogs()
      setBookmarkedBlogs(blogs)
    } catch (error) {
      toast.error("Failed to fetch bookmarked blogs")
      console.error("Fetch bookmarks error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20 card-modern">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <FiBookmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-theme-text mb-2">Please Login</h1>
          <p className="text-theme-text-secondary">You need to be logged in to view your bookmarks.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-pulse">
            <div className="text-theme-text-secondary">Loading your bookmarks...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FiBookmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-theme-text">My Bookmarks</h1>
        </div>
        <p className="text-theme-text-secondary">
          {bookmarkedBlogs.length > 0 
            ? `You have ${bookmarkedBlogs.length} bookmarked blog${bookmarkedBlogs.length !== 1 ? 's' : ''}`
            : "No bookmarked blogs yet"
          }
        </p>
      </div>

      {/* Bookmarked Blogs */}
      {bookmarkedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedBlogs.map((blog) => (
            <BlogCard 
              key={blog._id} 
              blog={blog} 
              user={user}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card-modern">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <FiBookmark className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-theme-text mb-2">No Bookmarks Yet</h2>
          <p className="text-theme-text-secondary mb-6">
            Start bookmarking blogs you want to read later. 
            <br />
            Look for the <FiBookmark className="inline w-4 h-4 mx-1" /> icon on any blog.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-theme-text-secondary">
            <div className="flex items-center space-x-2">
              <FiHeart className="w-4 h-4 text-red-500" />
              <span>Like blogs you enjoy</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiBookmark className="w-4 h-4 text-blue-500" />
              <span>Bookmark for later</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookmarks