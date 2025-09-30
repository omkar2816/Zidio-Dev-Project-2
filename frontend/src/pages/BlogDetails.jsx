"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBlog, deleteBlog } from "../store/slices/blogSlice"
import blogService from "../services/blogService"
import toast from "react-hot-toast"
import { FiHeart, FiEdit, FiTrash2, FiUser, FiCalendar } from "react-icons/fi"

function BlogDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { blog, isLoading } = useSelector((state) => state.blog)
  const { user } = useSelector((state) => state.auth)

  const [comment, setComment] = useState("")
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState([])

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
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Blog not found</h2>
        <p className="text-gray-600 dark:text-gray-400">The blog you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  const isAuthor = user?._id === blog.author?._id

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="card overflow-hidden">
          {/* Hero Image */}
          {blog.image ? (
            <div className="relative h-96 overflow-hidden">
              <img 
                src={blog.image || "/placeholder.svg"} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <div className="text-8xl text-gray-400 dark:text-gray-600">📝</div>
            </div>
          )}

          <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              {/* Tags and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {blog.category || 'General'}
                  </span>
                  {blog.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                {isAuthor && (
                  <div className="flex space-x-3">
                    <Link
                      to={`/edit/${blog._id}`}
                      className="btn btn-secondary px-4 py-2 flex items-center space-x-2"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button 
                      onClick={handleDelete} 
                      className="btn px-4 py-2 flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                {blog.title}
              </h1>

              {/* Author and Meta Info */}
              <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                <Link 
                  to={`/profile/${blog.author?._id}`} 
                  className="flex items-center space-x-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.author?.name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400" 
                 dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Engagement Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${
                    liked 
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" 
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  }`}
                >
                  <FiHeart className={`w-5 h-5 transition-transform group-hover:scale-110 ${liked ? "fill-current" : ""}`} />
                  <span className="font-semibold">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this post..."
                    className="input-modern w-full min-h-[100px] resize-none"
                    rows="4"
                    required
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary px-6 py-2"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Join the conversation! Please log in to share your thoughts.
              </p>
              <Link to="/login" className="btn btn-primary">
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-4 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comment.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No comments yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Be the first to share your thoughts about this post!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
