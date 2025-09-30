import { Link } from "react-router-dom"
import { FiHeart, FiMessageCircle, FiUser, FiCalendar } from "react-icons/fi"

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {blog.image && (
        <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded">{blog.category}</span>
          {blog.tags?.map((tag, index) => (
            <span key={index} className="text-gray-400">
              #{tag}
            </span>
          ))}
        </div>

        <Link to={`/blog/${blog._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition">{blog.title}</h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">{stripHtml(blog.content)}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <Link
            to={`/profile/${blog.author?._id}`}
            className="flex items-center space-x-2 hover:text-primary transition"
          >
            <FiUser />
            <span>{blog.author?.name}</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FiHeart />
              <span>{blog.likes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMessageCircle />
              <span>{blog.comments?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiCalendar />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
