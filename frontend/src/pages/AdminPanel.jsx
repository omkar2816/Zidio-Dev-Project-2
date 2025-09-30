"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { FiTrash2, FiUser } from "react-icons/fi"

function AdminPanel() {
  const { user } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || "/api"

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const [usersRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, config),
        axios.get(`${API_URL}/blogs`, config),
      ])

      setUsers(usersRes.data)
      setBlogs(blogsRes.data)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to fetch data")
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.delete(`${API_URL}/admin/users/${userId}`, config)
        setUsers(users.filter((u) => u._id !== userId))
        toast.success("User deleted successfully")
      } catch (error) {
        toast.error("Failed to delete user")
      }
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        await axios.delete(`${API_URL}/admin/blogs/${blogId}`, config)
        setBlogs(blogs.filter((b) => b._id !== blogId))
        toast.success("Blog deleted successfully")
      } catch (error) {
        toast.error("Failed to delete blog")
      }
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Users</p>
          <p className="text-4xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Blogs</p>
          <p className="text-4xl font-bold text-green-600">{blogs.length}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Likes</p>
          <p className="text-4xl font-bold text-purple-600">
            {blogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <FiUser />
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded ${
                        u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u._id !== user._id && (
                      <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-800">
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Blogs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4">{blog.title}</td>
                  <td className="px-6 py-4">{blog.author?.name}</td>
                  <td className="px-6 py-4">{blog.category}</td>
                  <td className="px-6 py-4">{blog.likes?.length || 0}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-600 hover:text-red-800">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
