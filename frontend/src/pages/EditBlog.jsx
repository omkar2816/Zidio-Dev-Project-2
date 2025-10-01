"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBlog, updateBlog } from "../store/slices/blogSlice"
import CustomReactQuill from "../components/CustomReactQuill"
import toast from "react-hot-toast"

function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { blog } = useSelector((state) => state.blog)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    tags: "",
    image: "",
  })

  const categories = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business"]

  useEffect(() => {
    dispatch(getBlog(id))
  }, [dispatch, id])

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        category: blog.category || "Technology",
        tags: blog.tags?.join(", ") || "",
        image: blog.image || "",
      })
    }
  }, [blog])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContentChange = (content) => {
    setFormData({ ...formData, content })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const blogData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    try {
      await dispatch(updateBlog({ id, blogData })).unwrap()
      toast.success("Blog updated successfully!")
      navigate("/dashboard")
    } catch (error) {
      toast.error(error || "Failed to update blog")
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-theme-text mb-8">Edit Blog</h1>

      <form onSubmit={handleSubmit} className="card-modern p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-theme-bg-secondary text-theme-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-theme-bg-secondary text-theme-text"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-theme-bg-secondary text-theme-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-2">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-theme-bg-secondary text-theme-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-2">Content *</label>
          <CustomReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            className="bg-theme-bg [&_.ql-editor]:bg-theme-bg-secondary [&_.ql-editor]:text-theme-text [&_.ql-toolbar]:bg-theme-bg-secondary [&_.ql-toolbar]:border-theme-border"
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" className="flex-1 btn-primary py-2">
            Update Blog
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 btn-secondary py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditBlog
