"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import { FiPlus } from "react-icons/fi"

function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { blogs, isLoading } = useSelector((state) => state.blog)

  const userBlogs = blogs.filter((blog) => blog.author?._id === user?._id)

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>
        <Link
          to="/create"
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <FiPlus />
          <span>Create New Blog</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Blogs</p>
            <p className="text-3xl font-bold text-primary">{userBlogs.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Likes</p>
            <p className="text-3xl font-bold text-green-600">
              {userBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Comments</p>
            <p className="text-3xl font-bold text-purple-600">
              {userBlogs.reduce((acc, blog) => acc + (blog.comments?.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Blogs</h2>

      {isLoading ? (
        <div className="text-center py-20">Loading...</div>
      ) : userBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-500 mb-4">You haven't created any blogs yet</p>
          <Link
            to="/create"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Create Your First Blog
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
