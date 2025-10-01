import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { FiBookmark } from "react-icons/fi"
import { updateUserBookmarks } from "../store/slices/authSlice"
import blogService from "../services/blogService"
import toast from "react-hot-toast"

function BookmarkButton({ blog, user, isBookmarked: initialBookmarked = false, className = "" }) {
  const dispatch = useDispatch()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  // Update bookmark state when user bookmarks change
  useEffect(() => {
    setIsBookmarked(user?.bookmarks?.includes(blog._id) || false)
  }, [user?.bookmarks, blog._id])

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark blogs")
      return
    }

    setLoading(true)
    try {
      const response = await blogService.toggleBookmark(blog._id)
      setIsBookmarked(response.isBookmarked)
      
      // Update the user's bookmarks in Redux store
      const updatedBookmarks = response.isBookmarked 
        ? [...(user.bookmarks || []), blog._id]
        : (user.bookmarks || []).filter(id => id !== blog._id)
      
      dispatch(updateUserBookmarks(updatedBookmarks))
      toast.success(response.message)
    } catch (error) {
      toast.error("Failed to bookmark blog")
      console.error("Bookmark error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors duration-200 ${
        isBookmarked 
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30" 
          : "bg-theme-bg-secondary text-theme-text-secondary hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
      <span className="font-medium">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  )
}

export default BookmarkButton