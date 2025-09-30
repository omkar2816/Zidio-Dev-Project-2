import { Link } from "react-router-dom"
import { FiHeart, FiMessageCircle, FiUser, FiCalendar, FiClock, FiEye, FiBookmark } from "react-icons/fi"

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

  const getReadingTime = (content) => {
    const words = stripHtml(content).split(' ').length
    const readingTime = Math.ceil(words / 200)
    return readingTime
  }

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

        {/* Title */}
        <Link to={`/blog/${blog._id}`} className="block group-hover:text-primary-600 transition-colors duration-200">
          <h3 className="text-xl font-display font-semibold text-theme-text leading-tight line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-theme-text-secondary leading-relaxed line-clamp-3">
          {blog.excerpt || stripHtml(blog.content).slice(0, 150) + '...'}
        </p>

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
              <div className="flex items-center space-x-1">
                <FiEye className="w-4 h-4" />
                <span className="text-sm">{blog.viewsCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
