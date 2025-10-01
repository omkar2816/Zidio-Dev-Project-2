import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBlog, deleteBlog } from "../store/slices/blogSlice"
import { useTheme } from "../contexts/ThemeContext"
import blogService from "../services/blogService"
import toast from "react-hot-toast"
import { FiHeart, FiEdit, FiTrash2, FiUser, FiCalendar, FiClock, FiEye, FiShare2, FiCheck, FiX } from "react-icons/fi"
<<<<<<< HEAD
import ShareButton from "../components/ShareButton"
import BookmarkButton from "../components/BookmarkButton"
<<<<<<< HEAD
import { isValidImageUrl, convertGooglePhotosUrl } from "../utils/imageUtils"
=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
=======
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)

function BlogDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const { blog, isLoading } = useSelector((state) => state.blog)
  const { user } = useSelector((state) => state.auth)

  const [comment, setComment] = useState("")
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState("")
<<<<<<< HEAD
  const [isBookmarked, setIsBookmarked] = useState(false)
<<<<<<< HEAD
  const [imageError, setImageError] = useState(false)
=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
=======
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)

  useEffect(() => {
    dispatch(getBlog(id))
  }, [dispatch, id])

  useEffect(() => {
    if (blog) {
      setLikesCount(blog.likes?.length || 0)
      setLiked(blog.likes?.includes(user?._id))
      setComments(blog.comments || [])
    }
  }, [blog, user])

<<<<<<< HEAD
  // Additional useEffect to sync bookmark state when user bookmarks change
  useEffect(() => {
    setIsBookmarked(user?.bookmarks?.includes(blog?._id) || false)
  }, [user?.bookmarks, blog?._id])

<<<<<<< HEAD
  // Reset image error when blog changes
  useEffect(() => {
    setImageError(false)
  }, [blog?.image])

=======
>>>>>>> parent of 11f81ed (Integrated Bookmark and Share link feature)
=======
>>>>>>> parent of 516801f (User profile update; Settings page working; Website working as per requirements)
  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like")
      return
    }

    try {
      await blogService.likeBlog(id, user.token)
      setLiked(!liked)
      setLikesCount(liked ? likesCount - 1 : likesCount + 1)
      toast.success(liked ? "Unliked" : "Liked!")
    } catch (error) {
      toast.error("Failed to like blog")
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to comment")
      return
    }

    try {
      const newComment = await blogService.addComment(id, { text: comment }, user.token)
      setComments([...comments, newComment])
      setComment("")
      toast.success("Comment added!")
    } catch (error) {
      toast.error("Failed to add comment")
    }
  }

  const handleEditComment = (commentIndex, commentText) => {
    setEditingCommentId(commentIndex)
    setEditingCommentText(commentText)
  }

  const handleUpdateComment = async (commentIndex) => {
    try {
      const updatedComments = [...comments]
      updatedComments[commentIndex].text = editingCommentText
      setComments(updatedComments)
      setEditingCommentId(null)
      setEditingCommentText("")
      toast.success("Comment updated!")
    } catch (error) {
      toast.error("Failed to update comment")
    }
  }

  const handleDeleteComment = async (commentIndex) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const updatedComments = comments.filter((_, index) => index !== commentIndex)
        setComments(updatedComments)
        toast.success("Comment deleted!")
      } catch (error) {
        toast.error("Failed to delete comment")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingCommentText("")
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await dispatch(deleteBlog(id)).unwrap()
        toast.success("Blog deleted successfully!")
        navigate("/dashboard")
      } catch (error) {
        toast.error("Failed to delete blog")
      }
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!blog) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-theme-bg-secondary rounded-full flex items-center justify-center">
            <FiEdit className="w-8 h-8 text-theme-text-secondary" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-theme-text">Blog not found</h2>
          <p className="text-theme-text-secondary">The blog you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = user?._id === blog.author?._id

  const getReadingTime = (content) => {
    const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 0
    return Math.ceil(words / 200)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-theme-bg transition-colors duration-300">
      {/* Background Pattern */}
      <div className="fixed inset-0 pattern-dots opacity-10 pointer-events-none"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="card-modern overflow-hidden">
          {/* Hero Image */}
          {blog.image && (
            <div className="relative h-96 overflow-hidden">
              <img 
                src={blog.image || "/placeholder.svg"} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              {/* Meta Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-2">
                  {blog.category && typeof blog.category === 'string' && (
                    <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-700">
                      {blog.category}
                    </span>
                  )}
                  {blog.tags?.slice(0, 3).map((tag, index) => {
                    const tagName = typeof tag === 'string' ? tag : tag?.name;
                    return tagName ? (
                      <div key={index} className="inline-block">
                        <span className="bg-theme-bg-secondary border border-theme-border text-theme-text-secondary hover:text-primary-500 hover:border-primary-300 cursor-pointer transition-all duration-200 px-2 py-1 rounded-md text-sm font-medium">
                          #{tagName}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>

                {isAuthor && (
                  <div className="flex space-x-3">
                    <Link
                      to={`/edit/${blog._id}`}
                      className="btn-secondary flex items-center space-x-2 text-sm px-4 py-2"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button 
                      onClick={handleDelete} 
                      className="btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 text-sm px-4 py-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-theme-text leading-tight">
                {blog.title}
              </h1>

              {/* Author and Meta Info */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-theme-border">
                <div className="flex items-center space-x-6">
                  <Link 
                    to={`/profile/${blog.author?._id}`} 
                    className="flex items-center space-x-3 hover:text-primary-500 transition-colors duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium group-hover:scale-105 transition-transform duration-200">
                      {blog.author?.avatar ? (
                        <img 
                          src={blog.author.avatar} 
                          alt={blog.author.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        blog.author?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-theme-text">{blog.author?.name}</span>
                      <span className="text-sm text-theme-text-secondary">Author</span>
                    </div>
                  </Link>

                  <div className="flex items-center space-x-4 text-theme-text-secondary text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4" />
                      <span>{getReadingTime(blog.content)} min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      liked 
                        ? "bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" 
                        : "bg-theme-bg-secondary text-theme-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
                  >
                    <FiHeart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                    <span className="font-medium">{likesCount}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-theme-bg-secondary text-theme-text-secondary hover:text-theme-text transition-colors duration-200">
                    <FiShare2 className="w-4 h-4" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="blog-content space-y-6" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </article>        {/* Comments Section */}
        <div className="mt-8 card-modern p-8 space-y-6">
          <h2 className="text-2xl font-display font-bold text-theme-text flex items-center space-x-2">
            <FiUser className="w-6 h-6" />
            <span>Comments ({comments.length})</span>
          </h2>

          {user ? (
            <form onSubmit={handleComment} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium text-theme-text">
                  Add your comment
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts on this blog post..."
                  className="input-modern min-h-[120px] resize-none w-full text-base leading-relaxed"
                  rows="4"
                  required
                />
              </div>
              <div className="flex justify-start">
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2 px-6 py-3 font-medium"
                >
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <p className="text-theme-text-secondary">Join the conversation! Sign in to leave a comment.</p>
              <Link to="/login" className="btn-primary inline-flex">
                Sign In to Comment
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="border-b border-theme-border pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-medium">
                        {comment.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-theme-text">{comment.user?.name}</span>
                        <span className="text-theme-text-secondary text-sm">•</span>
                        <span className="text-theme-text-secondary text-sm">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* Comment Actions - Show only if user is comment author */}
                    {user && comment.user?._id === user._id && (
                      <div className="flex items-center space-x-2">
                        {editingCommentId === index ? (
                          <>
                            <button
                              onClick={() => handleUpdateComment(index)}
                              className="text-green-500 hover:text-green-600 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                              title="Save changes"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:text-gray-600 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                              title="Cancel editing"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditComment(index, comment.text)}
                              className="text-blue-500 hover:text-blue-600 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                              title="Edit comment"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(index)}
                              className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                              title="Delete comment"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Comment Content - Editable if in edit mode */}
                  <div className="ml-11">
                    {editingCommentId === index ? (
                      <textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="input-modern w-full min-h-[80px] resize-none text-sm"
                        rows="3"
                      />
                    ) : (
                      <p className="text-theme-text-secondary leading-relaxed">{comment.text}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 space-y-2">
                <FiUser className="w-12 h-12 mx-auto text-theme-text-secondary opacity-50" />
                <p className="text-theme-text-secondary">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
