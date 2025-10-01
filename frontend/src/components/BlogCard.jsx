import { Link } from "react-router-dom"
import { FiHeart, FiMessageCircle, FiUser, FiCalendar, FiClock, FiEye, FiBookmark, FiSearch } from "react-icons/fi"
import { highlightSearchTerms } from "../services/synonymService"
<<<<<<< HEAD
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { updateUserBookmarks } from "../store/slices/authSlice"
import blogService from "../services/blogService"
import toast from "react-hot-toast"
<<<<<<< HEAD
import { isValidImageUrl, convertGooglePhotosUrl } from "../utils/imageUtils"
import Avatar from "./Avatar"
=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
=======
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)

function BlogCard({ blog, searchTerms = [], showRelevanceScore = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const getReadingTime = (content) => {
    const words = stripHtml(content).split(' ').length
    const readingTime = Math.ceil(words / 200)
    return readingTime
  }

<<<<<<< HEAD
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks?.includes(blog._id) || false
  )
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  // Update bookmark state when user bookmarks change
  useEffect(() => {
    setIsBookmarked(user?.bookmarks?.includes(blog._id) || false)
  }, [user?.bookmarks, blog._id])

  const handleBookmarkToggle = async (e) => {
    e.preventDefault() // Prevent navigation when clicking bookmark
    
    if (!user) {
      toast.error("Please login to bookmark blogs")
      return
    }

    setBookmarkLoading(true)
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
      setBookmarkLoading(false)
    }
  }

<<<<<<< HEAD
  const handleLikeToggle = async (e) => {
    e.preventDefault() // Prevent navigation when clicking like
    
    if (!user) {
      toast.error("Please login to like blogs")
      return
    }

    setLikeLoading(true)
    try {
      const updatedBlog = await blogService.likeBlog(blog._id)
      
      // Update Redux store with new like data
      dispatch(updateBlogLikes({
        blogId: blog._id,
        likes: updatedBlog.likes
      }))
      
      // Check if user liked or unliked
      const isNowLiked = updatedBlog.likes.includes(user._id)
      
      // Update local state
      setIsLiked(isNowLiked)
      setLikesCount(updatedBlog.likes.length)
      
      toast.success(isNowLiked ? "Liked!" : "Unliked")
    } catch (error) {
      toast.error("Failed to like blog")
      console.error("Like error:", error)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Convert the image URL if it's a Google Photos or Drive sharing link
  const getImageUrl = (url) => {
    return convertGooglePhotosUrl(url)
  }

=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
=======
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)
  return (
    <article className="group card-modern card-hover overflow-hidden animate-fade-in">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {blog.image ? (
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
            <div className="text-4xl gradient-text font-display font-bold">
              {blog.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Featured Badge */}
        {blog.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category and Tags */}
        <div className="flex items-center flex-wrap gap-2 text-sm">
          {(blog.category?.name || blog.category) && typeof (blog.category?.name || blog.category) === 'string' && (
            <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full font-medium border border-primary-200 dark:border-primary-700">
              {blog.category?.name || blog.category}
            </span>
          )}
          {blog.tags?.slice(0, 2).map((tag, index) => {
            const tagName = tag?.name || tag;
            return typeof tagName === 'string' ? (
              <div key={index} className="inline-block">
                <span className="bg-theme-bg-secondary border border-theme-border text-theme-text-secondary hover:text-primary-500 hover:border-primary-300 cursor-pointer transition-all duration-200 px-2 py-1 rounded-md text-xs font-medium">
                  #{tagName}
                </span>
              </div>
            ) : null;
          })}
        </div>

        {/* Title with highlighting */}
        <Link to={`/blog/${blog._id}`} className="block group-hover:text-primary-600 transition-colors duration-200">
          <h3 className="text-xl font-display font-semibold text-theme-text leading-tight line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
            {searchTerms.length > 0 ? (
              <span dangerouslySetInnerHTML={{ 
                __html: highlightSearchTerms(blog.title, searchTerms) 
              }} />
            ) : (
              blog.title
            )}
          </h3>
        </Link>

        {/* Excerpt with highlighting */}
        <p className="text-theme-text-secondary leading-relaxed line-clamp-3">
          {searchTerms.length > 0 ? (
            <span dangerouslySetInnerHTML={{ 
              __html: highlightSearchTerms(
                blog.excerpt || stripHtml(blog.content).slice(0, 150) + '...', 
                searchTerms
              ) 
            }} />
          ) : (
            blog.excerpt || stripHtml(blog.content).slice(0, 150) + '...'
          )}
        </p>

        {/* Relevance Score (for debugging/admin) */}
        {showRelevanceScore && blog.relevanceScore && (
          <div className="flex items-center text-xs text-theme-text-secondary bg-theme-bg-secondary px-2 py-1 rounded">
            <FiSearch className="w-3 h-3 mr-1" />
            Relevance: {blog.relevanceScore}
          </div>
        )}

        {/* Author and Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-theme-border">
          <Link
            to={`/profile/${blog.author?._id}`}
            className="flex items-center space-x-3 hover:text-primary-500 transition-colors duration-200 group/author"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-medium group-hover/author:scale-105 transition-transform duration-200">
              {blog.author?.avatar ? (
                <img 
                  src={blog.author.avatar} 
                  alt={blog.author.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                blog.author?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-theme-text">{blog.author?.name}</span>
              <span className="text-xs text-theme-text-secondary">{formatDate(blog.createdAt)}</span>
            </div>
          </Link>

          {/* Engagement Stats */}
<<<<<<< HEAD
          <div className="flex items-center justify-between text-theme-text-secondary">
            <div className="flex items-center space-x-3">
              {/* Like Button */}
              <button
                onClick={handleLikeToggle}
                disabled={likeLoading}
                className={`flex items-center space-x-1 transition-colors duration-200 p-1 rounded ${
                  isLiked 
                    ? "text-red-500 hover:text-red-600" 
                    : "hover:text-red-500"
                } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isLiked ? "Unlike this blog" : "Like this blog"}
              >
                <FiHeart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{likesCount}</span>
              </button>
              
              <div className="flex items-center space-x-1 hover:text-primary-500 transition-colors duration-200">
                <FiMessageCircle className="w-4 h-4" />
                <span className="text-sm">{blog.commentsCount || blog.comments?.length || 0}</span>
              </div>
<<<<<<< HEAD
              
=======
          <div className="flex items-center space-x-4 text-theme-text-secondary">
            <div className="flex items-center space-x-1 hover:text-accent-500 transition-colors duration-200">
              <FiHeart className="w-4 h-4" />
              <span className="text-sm">{blog.likesCount || blog.likes?.length || 0}</span>
            </div>
            
            <div className="flex items-center space-x-1 hover:text-primary-500 transition-colors duration-200">
              <FiMessageCircle className="w-4 h-4" />
              <span className="text-sm">{blog.commentsCount || blog.comments?.length || 0}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <FiClock className="w-4 h-4" />
              <span className="text-sm">{getReadingTime(blog.content)} min</span>
            </div>

            {blog.viewsCount && (
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)
              <div className="flex items-center space-x-1">
                <FiEye className="w-4 h-4" />
                <span className="text-sm">{blog.viewsCount}</span>
              </div>
            )}

<<<<<<< HEAD
            <div className="flex items-center space-x-2">
              {blog.viewsCount && (
                <div className="flex items-center space-x-1">
                  <FiEye className="w-4 h-4" />
                  <span className="text-sm">{blog.viewsCount}</span>
                </div>
              )}

              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
                className={`flex items-center transition-colors duration-200 p-1 rounded ${
                  isBookmarked 
                    ? "text-blue-500 hover:text-blue-600" 
                    : "hover:text-blue-500"
                } ${bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark this blog"}
              >
                <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            </div>
=======
            )}
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
=======
            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              className={`flex items-center space-x-1 transition-colors duration-200 p-1 rounded ${
                isBookmarked 
                  ? "text-blue-500 hover:text-blue-600" 
                  : "hover:text-blue-500"
              } ${bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this blog"}
            >
              <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
