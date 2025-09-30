"use client"

import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBlogs } from "../store/slices/blogSlice"
import BlogCard from "../components/BlogCard"
import { FiMail } from "react-icons/fi"

function Profile() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { blogs } = useSelector((state) => state.blog)

  const userBlogs = blogs.filter((blog) => blog.author?._id === id)
  const author = userBlogs[0]?.author

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl">
            {author?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{author?.name}</h1>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <FiMail />
              <span>{author?.email}</span>
            </div>
          </div>
        </div>

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

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Published Blogs</h2>

      {userBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-500">No blogs published yet</p>
        </div>
      )}
    </div>
  )
}

export default Profile
