import { Link } from "react-router-dom"
import { FiHeart, FiMessageCircle, FiUser, FiCalendar, FiClock, FiEye } from "react-icons/fi"

function BlogCard({ blog }) {
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

  const getReadTime = (content) => {
    const words = stripHtml(content).split(' ').length
    const readTime = Math.ceil(words / 200) // Average reading speed
    return readTime
  }

  return (
    <article className="card card-hover group cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        {blog.image ? (
          <img 
            src={blog.image || "/placeholder.svg"} 
            alt={blog.title} 
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
            <div className="text-6xl text-gray-400 dark:text-gray-600">📝</div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800 border border-white/20">
            {blog.category || 'General'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <Link to={`/blog/${blog._id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-tight">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {stripHtml(blog.content)}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Author */}
          <Link
            to={`/profile/${blog.author?._id}`}
            className="flex items-center space-x-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/author"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors">
                {blog.author?.name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(blog.createdAt)}
              </span>
            </div>
          </Link>

          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1 group/stat">
              <FiClock className="w-4 h-4 group-hover/stat:text-blue-500 transition-colors" />
              <span>{getReadTime(blog.content)} min read</span>
            </div>
            <div className="flex items-center space-x-1 group/stat">
              <FiHeart className="w-4 h-4 group-hover/stat:text-red-500 transition-colors" />
              <span>{blog.likes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1 group/stat">
              <FiMessageCircle className="w-4 h-4 group-hover/stat:text-blue-500 transition-colors" />
              <span>{blog.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
