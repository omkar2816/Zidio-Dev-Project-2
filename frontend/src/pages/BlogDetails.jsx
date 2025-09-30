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
    return <div className="text-center py-20">Loading...</div>
  }

  if (!blog) {
    return <div className="text-center py-20">Blog not found</div>
  }

  const isAuthor = user?._id === blog.author?._id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {blog.image && (
          <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-96 object-cover" />
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{blog.category}</span>
              {blog.tags?.map((tag, index) => (
                <span key={index} className="text-gray-400 text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit/${blog._id}`}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <FiEdit />
                  <span>Edit</span>
                </Link>
                <button onClick={handleDelete} className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex items-center space-x-6 text-gray-600 mb-8">
            <Link to={`/profile/${blog.author?._id}`} className="flex items-center space-x-2 hover:text-primary">
              <FiUser />
              <span>{blog.author?.name}</span>
            </Link>
            <div className="flex items-center space-x-2">
              <FiCalendar />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

          <div className="border-t pt-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                liked ? "text-red-600" : "text-gray-600"
              } hover:text-red-600 transition`}
            >
              <FiHeart className={liked ? "fill-current" : ""} />
              <span>{likesCount} Likes</span>
            </button>
          </div>
        </div>
      </article>

      <div className="mt-8 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>

        {user && (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiUser className="text-gray-400" />
                <span className="font-semibold">{comment.user?.name}</span>
                <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
