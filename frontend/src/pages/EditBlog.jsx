"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBlog, updateBlog } from "../store/slices/blogSlice"
import CustomReactQuill from "../components/CustomReactQuill"
import toast from "react-hot-toast"
import { isValidImageUrl, validateImageFile, uploadImageFile, convertGooglePhotosUrl, isGooglePhotosShareLink } from "../utils/imageUtils"

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

  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [uploadType, setUploadType] = useState("url") // "url" or "file"

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file using utility function
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast.error(validation.error)
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Clear URL field when file is selected
      setFormData({ ...formData, image: "" })
    }
  }

  const handleUploadTypeChange = (type) => {
    setUploadType(type)
    if (type === "url") {
      setSelectedFile(null)
      setFilePreview(null)
    } else {
      setFormData({ ...formData, image: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (uploadType === "url" && formData.image && !isValidImageUrl(formData.image)) {
      toast.error("Please provide a valid image URL")
      return
    }

    let imageUrl = formData.image

    // Convert Google Photos/Drive URLs
    if (imageUrl) {
      imageUrl = convertGooglePhotosUrl(imageUrl)
    }

    // If file is selected, upload it first
    if (uploadType === "file" && selectedFile) {
      try {
        imageUrl = await uploadImageFile(selectedFile)
      } catch (error) {
        if (error.message.includes('Authentication failed')) {
          toast.error("Your session has expired. Please login again.")
          // You might want to redirect to login page here
        } else {
          toast.error(`Failed to upload image: ${error.message}`)
        }
        console.error("Upload error:", error)
        return
      }
    }

    const blogData = {
      ...formData,
      image: imageUrl,
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
          <label className="block text-sm font-medium text-theme-text-secondary mb-2">Blog Image</label>
          
          {/* Upload Type Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => handleUploadTypeChange("url")}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                uploadType === "url" 
                  ? "bg-primary-500 text-white" 
                  : "bg-theme-bg-secondary text-theme-text-secondary hover:bg-primary-100"
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => handleUploadTypeChange("file")}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                uploadType === "file" 
                  ? "bg-primary-500 text-white" 
                  : "bg-theme-bg-secondary text-theme-text-secondary hover:bg-primary-100"
              }`}
            >
              Upload File
            </button>
          </div>

          {/* URL Input */}
          {uploadType === "url" && (
            <div>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-theme-bg-secondary text-theme-text ${
                  formData.image && !isValidImageUrl(formData.image) 
                    ? 'border-red-500' 
                    : 'border-theme-border'
                }`}
                placeholder="https://example.com/image.jpg or Google Drive share link"
              />
              {formData.image && !isValidImageUrl(formData.image) && (
                <div className="mt-1 text-sm text-red-500">
                  Please provide a valid image URL
                </div>
              )}
              {formData.image && isGooglePhotosShareLink(formData.image) && (
                <div className="mt-1 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ Google Photos sharing links may not work directly. Consider uploading the image file instead or use a direct image URL.
                </div>
              )}
              {formData.image && isValidImageUrl(formData.image) && (
                <div className="mt-2">
                  <img 
                    src={convertGooglePhotosUrl(formData.image)} 
                    alt="Preview" 
                    className="w-full max-w-xs h-32 object-cover rounded-lg"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <div className="text-sm text-red-500 hidden">
                    Image failed to load. Please check the URL.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* File Upload */}
          {uploadType === "file" && (
            <div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-theme-bg-secondary text-theme-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-500 file:text-white hover:file:bg-primary-600"
              />
              <div className="mt-1 text-sm text-theme-text-secondary">
                Supported formats: JPG, JPEG, PNG, GIF, WebP, SVG (max 5MB)
              </div>
              {filePreview && (
                <div className="mt-2">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-full max-w-xs h-32 object-cover rounded-lg"
                  />
                  <div className="mt-1 text-sm text-theme-text-secondary">
                    Selected: {selectedFile?.name}
                  </div>
                </div>
              )}
            </div>
          )}
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
