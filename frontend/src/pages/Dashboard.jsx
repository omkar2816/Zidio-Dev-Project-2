"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import AdminRequestStatus from "../components/AdminRequestStatus"
import { FiPlus } from "react-icons/fi"

function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { blogs, isLoading } = useSelector((state) => state.blog)

  const userBlogs = blogs.filter((blog) => blog.author?._id === user?._id)

  useEffect(() => {
    console.log("Dashboard: Fetching all blogs")
    dispatch(getBlogs())
  }, [dispatch])

  useEffect(() => {
    console.log("Dashboard: All blogs:", blogs?.length, blogs)
    console.log("Dashboard: User blogs:", userBlogs?.length, userBlogs)
    console.log("Dashboard: Current user ID:", user?._id)
  }, [blogs, userBlogs, user])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-theme-text">My Dashboard</h1>
          <p className="text-theme-text-secondary mt-2">Welcome back, {user?.name}!</p>
        </div>
        <Link
          to="/create"
          className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <FiPlus />
          <span>Create New Blog</span>
        </Link>
      </div>

      <div className="card-modern p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-theme-text">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 dark:border-blue-800 p-4 rounded-lg hover:shadow-md transition-all duration-200">
            <p className="text-theme-text-secondary">Total Blogs</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userBlogs.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-200 dark:border-green-800 p-4 rounded-lg hover:shadow-md transition-all duration-200">
            <p className="text-theme-text-secondary">Total Likes</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {userBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-200 dark:border-purple-800 p-4 rounded-lg hover:shadow-md transition-all duration-200">
            <p className="text-theme-text-secondary">Total Comments</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {userBlogs.reduce((acc, blog) => acc + (blog.comments?.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Request Status - Only show for regular users */}
      {user?.role === 'user' && (
        <div className="mb-8">
          <AdminRequestStatus />
        </div>
      )}

      <h2 className="text-2xl font-bold text-theme-text mb-6">Your Blogs</h2>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-pulse">
            <div className="text-theme-text-secondary">Loading your blogs...</div>
          </div>
        </div>
      ) : userBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {userBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card-modern">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
            <FiPlus className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-theme-text-secondary mb-4">You haven't created any blogs yet</p>
          <p className="text-theme-text-secondary mb-6">Start sharing your thoughts and stories with the world!</p>
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <FiPlus />
            <span>Create Your First Blog</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
